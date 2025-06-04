import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockIsEnabled = vi.fn()
const mockShowError = vi.fn()
const mockDefineNuxtRouteMiddleware = vi.fn((fn: () => void) => fn)

vi.mock('#app', () => ({
  defineNuxtRouteMiddleware: (fn: () => void) => mockDefineNuxtRouteMiddleware(fn),
  showError: (...args: unknown[]) => mockShowError(...args),
}))
vi.mock('../../src/runtime/composables/useFeatureFlag', () => ({
  useFeatureFlag: () => ({ isEnabled: mockIsEnabled }),
}))

// Import dynamically after mocks are registered
const importMiddleware = () => import('../../src/runtime/middleware/defineFeatureFlagMiddleware')

beforeEach(() => {
  mockIsEnabled.mockReset()
  mockShowError.mockReset()
  mockDefineNuxtRouteMiddleware.mockReset()
})

describe('defineFeatureFlagMiddleware', () => {
  it('calls showError when feature is disabled', async () => {
    mockIsEnabled.mockReturnValue(false)
    const { defineFeatureFlagMiddleware } = await importMiddleware()
    const middleware = defineFeatureFlagMiddleware('flagA')
    middleware()
    expect(mockShowError).toHaveBeenCalled()
  })

  it('allows navigation when feature is enabled', async () => {
    mockIsEnabled.mockReturnValue(true)
    const { defineFeatureFlagMiddleware } = await importMiddleware()
    const middleware = defineFeatureFlagMiddleware('flagA')
    const result = middleware()
    expect(result).toBeUndefined()
    expect(mockShowError).not.toHaveBeenCalled()
  })
})
