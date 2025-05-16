import type { H3Event } from 'h3'

export const isFeatureEnabled = (feature: string, event?: H3Event): boolean => {
  const config = useRuntimeConfig(event).featureFlags
  const env = config.environment
  const flags = config.environments?.[env] || []
  return flags.includes(feature)
}
