import type { FeatureFlagsConfig, FeatureFlag, FeatureFlagInput } from '../../../types/feature-flags'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'
import { useRuntimeConfig } from '#imports'

/**
 * Provides runtime access to feature flag utilities within the client app.
 * Supports both static and scheduled flags.
 *
 * @returns An object with utilities:
 * - `isEnabled(flagName)` — checks if a feature is currently active
 * - `listFlags()` — returns all currently active flag names (scheduled + static)
 */
export const useFeatureFlag = () => {
  const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
  const env = config.environment
  const flags: FeatureFlagInput[] = config.flagSets?.[env] || []

  /**
   * Checks whether a feature flag is currently enabled.
   * Supports:
   * - Static string flags
   * - Scheduled flags (with `activeFrom` and/or `activeUntil`)
   *
   * @param flagName - The name of the feature flag to check.
   * @returns `true` if the feature is currently enabled, otherwise `false`.
   */
  const isEnabled = (flagName: string): boolean => {
    for (const flag of flags) {
      if (typeof flag === 'string' && flag === flagName) return true
      if (typeof flag === 'object' && flag.name === flagName && isFlagActiveNow(flag)) return true
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
    return flags
      .filter((flag): flag is FeatureFlag =>
        typeof flag === 'object'
        && typeof flag.name === 'string'
        && isFlagActiveNow(flag),
      )
      .map(flag => flag.name)
      .concat(
        flags.filter((flag): flag is string => typeof flag === 'string'),
      )
  }

  return { isEnabled, listFlags }
}
