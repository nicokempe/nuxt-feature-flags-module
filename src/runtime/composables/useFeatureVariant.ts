import type { FeatureFlagsConfig, FeatureFlagInput, FeatureFlag } from '../../../types/feature-flags'
import { useFeatureFlag } from '../composables/useFeatureFlag'
import { useRuntimeConfig } from '#imports'

/**
 * Provides runtime access to feature flag variants within the client app.
 * Supports both static and scheduled flags with variants.
 *
 * Returns the variant for a given feature flag, or `null` if the flag is not enabled.
 * If the flag is enabled but no variant is set in localStorage, it randomly selects a variant based on the defined distribution.
 *
 * @param flagName - The name of the feature flag to get the variant for.
 * @return The selected variant for the feature flag, or `null` if the flag is not enabled.
 */
export const useFeatureVariant = (flagName: string): string | null => {
  const { isEnabled } = useFeatureFlag()

  if (!isEnabled(flagName)) {
    return null
  }

  const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
  const env = config.environment
  const flags: FeatureFlagInput[] = config.environments?.[env] || []

  const flag: FeatureFlag | undefined = flags.find(
    f => typeof f === 'object' && f.name === flagName,
  ) as FeatureFlag

  if (!flag || !flag.variants || flag.variants.length === 0) {
    console.warn(`Feature flag "${flagName}" is not found or does not have any variants defined in the configuration.`)
    return null
  }

  let selectedVariantIndex: number | null = null
  const storedValue = localStorage.getItem(flagName)

  if (storedValue !== null) {
    const parsedValue = Number.parseInt(storedValue, 10)
    if (!Number.isNaN(parsedValue) && parsedValue >= 0 && parsedValue < flag.variants.length)
      selectedVariantIndex = parsedValue
    else {
      console.warn(
        `Invalid stored variant index for feature flag "${flagName}": ${storedValue}. Resetting to a new random variant.`,
      )
      localStorage.removeItem(flagName)
    }
  }

  if (selectedVariantIndex === null) {
    const { variants, distribution } = flag
    const effectiveDistribution = distribution || Array(variants.length).fill(1 / variants.length)

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
      selectedVariantIndex = 0
      console.warn(`Failed to select a variant for "${flagName}" based on distribution. Defaulting to the first variant.`)
    }

    if (selectedVariantIndex !== null) {
      localStorage.setItem(flagName, String(selectedVariantIndex))
    }
  }

  return selectedVariantIndex !== null ? flag.variants[selectedVariantIndex] : null
}
