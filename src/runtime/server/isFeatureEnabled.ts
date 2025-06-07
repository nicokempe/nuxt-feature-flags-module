import type { H3Event } from 'h3'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'
import { useRuntimeConfig } from '#imports'
import type { FeatureFlagInput, FeatureFlagsConfig } from '~/types/feature-flags'

/**
 * Server-side utility to check if a feature flag is currently enabled.
 * Supports both string and scheduled flags.
 *
 * Intended for use in server routes (`server/api/**`) or middleware.
 *
 * @param feature - The name of the feature flag to check.
 * @param event - Optional H3 event context (used to access runtime config).
 * @returns `true` if the feature is currently enabled in the active environment.
 *
 * @example
 * ```ts
 * if (!isFeatureEnabled('myServerFlag', event)) {
 *   return sendError(event, createError({ statusCode: 403 }))
 * }
 * ```
 */
export const isFeatureEnabled = (feature: string, event?: H3Event): boolean => {
  const config: FeatureFlagsConfig = useRuntimeConfig(event).featureFlags
  const env: string = config.environment
  const flags: FeatureFlagInput[] = config.flagSets?.[env] || []

  for (const flag of flags) {
    if (typeof flag === 'string' && flag === feature) return true
    if (typeof flag === 'object' && flag.name === feature && isFlagActiveNow(flag)) return true
  }

  return false
}
