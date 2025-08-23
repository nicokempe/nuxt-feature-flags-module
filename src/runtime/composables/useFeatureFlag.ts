import type { FeatureFlagsConfig, FeatureFlag, FeatureFlagInput } from '../../../types/feature-flags'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'
import { matchFlag } from '../utils/matchFlag'
import { useRuntimeConfig } from '#imports'

/**
 * Provides runtime access to feature flag utilities within the client app.
 * Supports static flags, scheduled flags, and hierarchical paths with `*` wildcards for grouped checks.
 *
 * @returns An object with utilities:
 * - `isEnabled(flagName)` — checks if a feature is currently active
 * - `listFlags()` — returns all currently active flag names (scheduled + static)
 */
export const useFeatureFlag = () => {
  const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
  const currentEnvironment: string = config.environment
  const environmentFlags: FeatureFlagInput[] = config.flagSets?.[currentEnvironment] || []

  /**
   * Checks whether a feature flag is currently enabled.
   * Supports:
   * - Static string flags
   * - Scheduled flags (with `activeFrom` and/or `activeUntil`)
   * - Hierarchical paths and `*` wildcards declared in the flag set
   *
   * Wildcard queries only return `true` if the wildcard itself is enabled
   * (e.g. checking `solutions/*` requires that `solutions/*` exists in the
   * current flag set).
   *
   * @param flagName - The name of the feature flag to check.
   * @returns `true` if the feature is currently enabled, otherwise `false`.
   */
  const isEnabled = (flagName: string): boolean => {
    for (const flagEntry of environmentFlags) {
      const entryName: string = typeof flagEntry === 'string' ? flagEntry : flagEntry.name
      if (!matchFlag(entryName, flagName)) continue
      if (typeof flagEntry === 'object') {
        if (isFlagActiveNow(flagEntry)) return true
      }
      else {
        return true
      }
    }
    return false
  }

  /**
   * Lists all currently active feature flags for the environment.
   * Preserves the order defined in `nuxt.config.ts`.
   *
   * @returns Array of enabled feature flag names.
   */
  const listFlags = (): string[] => {
    return environmentFlags
      .filter((flagEntry): flagEntry is FeatureFlag =>
        typeof flagEntry === 'object'
        && typeof flagEntry.name === 'string'
        && isFlagActiveNow(flagEntry),
      )
      .map(flagEntry => flagEntry.name)
      .concat(
        environmentFlags.filter((flagEntry): flagEntry is string => typeof flagEntry === 'string'),
      )
  }

  return { isEnabled, listFlags }
}
