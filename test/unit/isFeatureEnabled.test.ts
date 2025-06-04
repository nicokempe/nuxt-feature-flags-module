import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isFeatureEnabled } from '../../src/runtime/server/isFeatureEnabled'

let runtimeConfig: any

vi.mock('#imports', () => ({
  useRuntimeConfig: () => runtimeConfig,
}))

beforeEach(() => {
  runtimeConfig = {
    featureFlags: {
      environment: 'prod',
      environments: {
        prod: [],
      },
    },
  }
})

describe('isFeatureEnabled', () => {
  it('checks simple string flags', () => {
    runtimeConfig.featureFlags.environments.prod = ['flagA']
    expect(isFeatureEnabled('flagA')).toBe(true)
    expect(isFeatureEnabled('unknown')).toBe(false)
  })

  it('evaluates scheduled flags', () => {
    const now = new Date('2024-06-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.featureFlags.environments.prod = [
      { name: 'scheduled', activeUntil: '2024-07-01T00:00:00Z' },
    ]

    expect(isFeatureEnabled('scheduled')).toBe(true)
    vi.useRealTimers()
  })

  it('returns false when flag is inactive', () => {
    const now = new Date('2024-08-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.featureFlags.environments.prod = [
      { name: 'scheduled', activeUntil: '2024-07-01T00:00:00Z' },
    ]

    expect(isFeatureEnabled('scheduled')).toBe(false)
    vi.useRealTimers()
  })
})
