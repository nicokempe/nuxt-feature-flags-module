import type { H3Event } from 'h3'
import type { FeatureFlag } from '../../../types/feature-flags'

const isFlagActiveNow = (flag: FeatureFlag): boolean => {
  const now = Date.now()
  const from = flag.activeFrom ? Date.parse(flag.activeFrom) : -Infinity
  const until = flag.activeUntil ? Date.parse(flag.activeUntil) : Infinity
  return now >= from && now <= until
}

export const isFeatureEnabled = (feature: string, event?: H3Event): boolean => {
  const config = useRuntimeConfig(event).featureFlags
  const env = config.environment
  const flags = config.environments?.[env] || []

  for (const flag of flags) {
    if (typeof flag === 'string' && flag === feature) return true
    if (typeof flag === 'object' && flag.name === feature && isFlagActiveNow(flag)) return true
  }

  return false
}
