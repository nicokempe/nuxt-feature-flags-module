import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isFeatureEnabled } from '../../src/runtime/server/isFeatureEnabled'
import type { FeatureFlagsConfig } from '../../types/feature-flags'

interface RuntimeConfig {
  featureFlags: FeatureFlagsConfig
}

let runtimeConfig: RuntimeConfig

vi.mock('#imports', () => ({
  useRuntimeConfig: () => runtimeConfig,
}))

beforeEach((): void => {
  runtimeConfig = {
    featureFlags: {
      environment: 'prod',
      flagSets: {
        prod: [],
      },
    },
  }
})

describe('isFeatureEnabled', (): void => {
  it('checks simple string flags', (): void => {
    runtimeConfig.featureFlags.flagSets.prod = ['flagA']
    expect(isFeatureEnabled('flagA')).toBe(true)
    expect(isFeatureEnabled('unknown')).toBe(false)
  })

  it('evaluates scheduled flags', (): void => {
    const now: Date = new Date('2024-06-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.featureFlags.flagSets.prod = [
      { name: 'scheduled', activeUntil: '2024-07-01T00:00:00Z' },
    ]

    expect(isFeatureEnabled('scheduled')).toBe(true)
    vi.useRealTimers()
  })

  it('returns false when flag is inactive', (): void => {
    const now: Date = new Date('2024-08-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.featureFlags.flagSets.prod = [
      { name: 'scheduled', activeUntil: '2024-07-01T00:00:00Z' },
    ]

    expect(isFeatureEnabled('scheduled')).toBe(false)
    vi.useRealTimers()
  })

  it('supports hierarchical wildcard patterns', (): void => {
    runtimeConfig.featureFlags.flagSets.prod = ['solutions/*']
    expect(isFeatureEnabled('solutions/company-portal/addons/sales')).toBe(true)

    runtimeConfig.featureFlags.flagSets.prod = ['solutions/company-portal/addons/sales']
    expect(isFeatureEnabled('solutions/*')).toBe(true)

    runtimeConfig.featureFlags.flagSets.prod = ['*']
    expect(isFeatureEnabled('any/flag')).toBe(true)
  })
})
