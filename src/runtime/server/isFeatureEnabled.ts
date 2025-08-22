import type { H3Event } from 'h3'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'
import { matchFlag } from '../utils/matchFlag'
import { useRuntimeConfig } from '#imports'
import type { FeatureFlagInput, FeatureFlagsConfig } from '~/types/feature-flags'

/**
 * Server-side utility to check if a feature flag is currently enabled.
 * Supports string flags, scheduled flags, and hierarchical wildcard syntax.
 *
 * Intended for use in server routes (`server/api/**`) or middleware.
 *
 * @param feature - The name or wildcard pattern of the feature flag to check.
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
    const name: string = typeof flag === 'string' ? flag : flag.name
    if (!matchFlag(name, feature)) continue

    if (typeof flag === 'object') {
      if (isFlagActiveNow(flag)) return true
    }
    else {
      return true
    }
  }

  return false
}
