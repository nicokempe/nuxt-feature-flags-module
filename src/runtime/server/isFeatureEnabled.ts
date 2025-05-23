import type { H3Event } from 'h3'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'

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
