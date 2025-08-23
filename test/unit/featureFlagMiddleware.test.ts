// test/unit/featureFlagMiddleware.test.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import middleware from '../../src/runtime/middleware/featureFlag'
import type { RouteLocationNormalized } from 'vue-router'

const { navigateTo, showError } = vi.hoisted(() => ({
  navigateTo: vi.fn(),
  showError: vi.fn(),
}))

vi.mock('#app', () => ({
  defineNuxtRouteMiddleware: (fn: (to: RouteLocationNormalized, from: RouteLocationNormalized) => unknown) => fn,
  navigateTo,
  showError,
}))

type IsEnabledFn = (flagName: string) => boolean
const isEnabled = vi.fn<IsEnabledFn>()
vi.mock('../../src/runtime/composables/useFeatureFlag', () => ({
  useFeatureFlag: () => ({ isEnabled }),
}))

/**
 * Helper to create a minimal, strictly typed RouteLocationNormalized for tests.
 */
const makeRoute = (meta: Partial<RouteLocationNormalized['meta']>): RouteLocationNormalized =>
  ({ meta } as unknown as RouteLocationNormalized)

describe('featureFlag middleware', (): void => {
  beforeEach((): void => {
    isEnabled.mockReset()
    navigateTo.mockReset()
    showError.mockReset()
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('redirects to fallback when flag disabled', (): void => {
    isEnabled.mockReturnValue(false)
    const toRoute: RouteLocationNormalized = makeRoute({ featureFlag: 'test', featureFallback: '/404' } as Record<string, unknown>)
    const fromRoute: RouteLocationNormalized = makeRoute({})
    middleware(toRoute, fromRoute)
    expect(navigateTo).toHaveBeenCalledWith('/404')
  })

  it('shows error when flag disabled and no fallback', (): void => {
    isEnabled.mockReturnValue(false)
    const toRoute: RouteLocationNormalized = makeRoute({ featureFlag: 'test' } as Record<string, unknown>)
    const fromRoute: RouteLocationNormalized = makeRoute({})
    middleware(toRoute, fromRoute)
    expect(showError).toHaveBeenCalledWith({ statusCode: 404, statusMessage: 'Feature not available' })
  })

  it('does nothing when flag enabled', (): void => {
    isEnabled.mockReturnValue(true)
    const to: RouteLocationNormalized = makeRoute({ featureFlag: 'test' } as Record<string, unknown>)
    const from: RouteLocationNormalized = makeRoute({})
    middleware(to, from)
    expect(navigateTo).not.toHaveBeenCalled()
    expect(showError).not.toHaveBeenCalled()
  })
})
