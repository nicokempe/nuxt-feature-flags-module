import type { H3Event } from 'h3'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'
import { matchFlag } from '../utils/matchFlag'
import { useRuntimeConfig } from '#imports'
import type { FeatureFlagInput, FeatureFlagsConfig } from '~/types/feature-flags'

/**
 * Server-side utility to check if a feature flag is currently enabled.
 * Supports string flags, scheduled flags, and wildcard groups declared in the
 * flag set (e.g. `solutions/*`).
 *
 * Intended for use in server routes (`server/api/**`) or middleware.
 *
 * Wildcard queries only return `true` if the wildcard itself is enabled in the
 * active flag set.
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
  const currentEnvironment: string = config.environment
  const environmentFlags: FeatureFlagInput[] = config.flagSets?.[currentEnvironment] || []

  for (const flagEntry of environmentFlags) {
    const entryName: string = typeof flagEntry === 'string' ? flagEntry : flagEntry.name
    if (!matchFlag(entryName, feature)) continue

    if (typeof flagEntry === 'object') {
      if (isFlagActiveNow(flagEntry)) return true
    }
    else {
      return true
    }
  }

  return false
}
