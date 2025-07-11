import type { FeatureFlag, FeatureFlagInput, FeatureFlagsConfig } from '../../../types/feature-flags'
import { useFeatureFlag } from '../composables/useFeatureFlag'
import { useCookie, useRuntimeConfig, useState } from '#imports' // Added useCookie

/**
 * Provides runtime access to feature flag variants within the client app.
 * Supports both static and scheduled flags with variants.
 *
 * Returns the variant for a given feature flag, or `null` if the flag is not enabled
 * or if no valid variant can be determined.
 * If the flag is enabled but no variant is set in persistence, it randomly selects a
 * variant based on the defined distribution and stores it.
 *
 * @param flagName - The name of the feature flag to get the variant for.
 * @return The selected variant string for the feature flag, or `null`.
 */
export const useFeatureVariant = (flagName: string): string | null => {
  const { isEnabled } = useFeatureFlag()

  // 1. Check if the feature flag itself is enabled
  if (!isEnabled(flagName)) {
    return null
  }

  // 2. Retrieve flag configuration
  const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
  const env = config.environment
  const flags: FeatureFlagInput[] = config.environments?.[env] || []

  // Find the specific flag configuration
  const flag = flags.find(
    f => typeof f === 'object' && f.name === flagName,
  ) as FeatureFlag | undefined

  // 3. Validate flag and its variants
  if (!flag || !flag.variants || flag.variants.length === 0) {
    console.warn(`Feature flag "${flagName}" is not found or does not have any variants defined.`)
    return null
  }

  // Helper function to get stored variant index
  const getStoredVariantIndex = (): number | null => {
    if (flag.persistence === 'state')
      return useState<number | null>(`${flagName}_variant_index`, () => null).value

    // SSR Guard: window-dependent operations only on client or via isomorphic composables
    if (typeof window === 'undefined' && flag.persistence !== 'cookie') {
      // For 'local', server cannot access. For 'cookie', useCookie handles SSR.
      // For default (also state), useState handles SSR.
      if (flag.persistence === 'local') return null
    }

    switch (flag.persistence) {
      case 'cookie': {
        // useCookie is isomorphic (works on server and client)
        const cookieValue = useCookie<number | null>(flagName).value
        return cookieValue ?? null // Ensure null if undefined
      }
      case 'local': {
        if (typeof window !== 'undefined') { // Explicit client-side check for localStorage
          const storedValueStr = localStorage.getItem(flagName)
          if (storedValueStr === null || storedValueStr === 'null') return null
          const parsed = Number.parseInt(storedValueStr, 10)
          return Number.isNaN(parsed) ? null : parsed
        }
        return null // localStorage not available on server
      }
      default: { // Defaults to 'state' like persistence
        console.warn(`Unsupported persistence type "${flag.persistence}" for feature flag "${flagName}". Defaulting to 'state' behavior.`)
        return useState<number | null>(`${flagName}_variant_index_default`, () => null).value
      }
    }
  }

  // Helper function to set stored variant index
  const setStoredVariantIndex = (index: number): void => {
    switch (flag.persistence) {
      case 'state':
        useState<number | null>(`${flagName}_variant_index`, () => index).value = index
        break
      case 'cookie': {
        const cookie = useCookie<number | null>(flagName, { maxAge: 31536000, path: '/' }) // 1 year
        cookie.value = index
        break
      }
      case 'local':
        if (typeof window !== 'undefined') { // Explicit client-side check for localStorage
          localStorage.setItem(flagName, String(index))
        }
        break
      default: // Defaults to 'state' like persistence
        useState<number | null>(`${flagName}_variant_index_default`, () => index).value = index
        break
    }
  }

  // Helper function to clear stored variant index
  const clearStoredVariantIndex = (): void => {
    switch (flag.persistence) {
      case 'state':
        useState<number | null>(`${flagName}_variant_index`, () => null).value = null
        break
      case 'cookie': {
        const cookie = useCookie<number | null>(flagName)
        cookie.value = null // Setting to null effectively deletes it (or use maxAge: -1)
        break
      }
      case 'local':
        if (typeof window !== 'undefined') { // Explicit client-side check for localStorage
          localStorage.removeItem(flagName)
        }
        break
      default: // Defaults to 'state' like persistence
        useState<number | null>(`${flagName}_variant_index_default`, () => null).value = null
        break
    }
  }

  let selectedVariantIndex: number | null = getStoredVariantIndex()

  // 4. Validate stored variant index
  if (selectedVariantIndex !== null) {
    if (selectedVariantIndex < 0 || selectedVariantIndex >= flag.variants.length) {
      console.warn(`Invalid stored variant index for feature flag "${flagName}": ${selectedVariantIndex}. Resetting.`)
      clearStoredVariantIndex()
      selectedVariantIndex = null // Reset to trigger random selection
    }
  }

  // 5. If no valid stored index, select randomly and store
  if (selectedVariantIndex === null) {
    const { variants, distribution } = flag
    const effectiveDistribution = distribution && distribution.length === variants.length ? distribution : Array(variants.length).fill(1 / variants.length)

    const randomValue = Math.random()
    let cumulativeProbability = 0

    for (let i = 0; i < variants.length; i++) {
      cumulativeProbability += effectiveDistribution[i]
      if (randomValue < cumulativeProbability) {
        selectedVariantIndex = i
        break
      }
    }

    if (selectedVariantIndex === null && variants.length > 0) {
      console.warn(`Failed to select a variant for "${flagName}" based on distribution. Defaulting to the first variant.`)
      selectedVariantIndex = 0
    }

    if (selectedVariantIndex !== null) {
      setStoredVariantIndex(selectedVariantIndex)
    }
    else {
      console.error(`Could not determine a variant index for flag "${flagName}".`)
      return null
    }
  }

  // 6. Return the selected variant string
  return flag.variants[selectedVariantIndex]
}
