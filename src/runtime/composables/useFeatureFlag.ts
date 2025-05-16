import type { FeatureFlagsConfig } from '~/types/feature-flags'

export const useFeatureFlag = () => {
  const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags

  /**
   * Check whether a feature flag is enabled for the current environment
   */
  const isEnabled = (flag: string): boolean => {
    const env: string = config.environment
    const activeFlags: string[] = config.environments?.[env] || []
    return activeFlags.includes(flag)
  }

  /**
   * Get all flags for the current environment
   */
  const listFlags = (): string[] => {
    const env: string = config.environment
    return config.environments?.[env] || []
  }

  return {
    isEnabled,
    listFlags,
  }
}
