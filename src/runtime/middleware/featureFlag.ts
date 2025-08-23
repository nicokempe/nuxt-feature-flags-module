import { useFeatureFlag } from '../composables/useFeatureFlag'
import { defineNuxtRouteMiddleware, navigateTo, showError } from '#app'

// Defines optional route metadata for feature-flag-based access control.
interface FeatureMeta {
  // Name of the feature flag required to access the route.
  featureFlag?: string

  // Path to navigate to when the feature flag is disabled.
  featureFallback?: string

  // Whether to log a console warning when the route is blocked.
  featureNotifyOnBlock?: boolean
}

/**
 * Nuxt route middleware that restricts access to routes based on feature flags.
 *
 * @param to - The target route object.
 * @returns
 * - `undefined` if access is allowed.
 * - A `navigateTo()` redirect if a fallback route is defined.
 * - A `showError()` result with a 404 status if blocked without fallback.
 *
 * @example
 * ```ts
 * definePageMeta({
 *   featureFlag: 'beta-dashboard',
 *   featureFallback: '/dashboard',
 *   featureNotifyOnBlock: true
 * })
 * ```
 */
export default defineNuxtRouteMiddleware((to) => {
  const routeMeta: FeatureMeta = to.meta as FeatureMeta
  const requiredFlag: string | undefined = routeMeta.featureFlag
  if (!requiredFlag) return

  const { isEnabled } = useFeatureFlag()
  if (isEnabled(requiredFlag)) return

  if (routeMeta.featureNotifyOnBlock) {
    console.warn(`[nuxt-feature-flags] Feature "${requiredFlag}" is disabled`)
  }

  if (routeMeta.featureFallback) {
    return navigateTo(routeMeta.featureFallback)
  }

  return showError({ statusCode: 404, statusMessage: 'Feature not available' })
})
