import type { FeatureFlagsConfig, FeatureFlag, FeatureFlagInput } from '../../../types/feature-flags'
import { useRuntimeConfig } from '#imports'

const isFlagActiveNow = (flag: FeatureFlag): boolean => {
  const now = Date.now()
  const from = flag.activeFrom ? Date.parse(flag.activeFrom) : -Infinity
  const until = flag.activeUntil ? Date.parse(flag.activeUntil) : Infinity
  return now >= from && now <= until
}

export const useFeatureFlag = () => {
  const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
  const env = config.environment
  const flags: FeatureFlagInput[] = config.environments?.[env] || []

  const isEnabled = (flagName: string): boolean => {
    for (const flag of flags) {
      if (typeof flag === 'string' && flag === flagName) return true
      if (typeof flag === 'object' && flag.name === flagName && isFlagActiveNow(flag)) return true
    }
    return false
  }

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
