import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFeatureFlag } from '../../src/runtime/composables/useFeatureFlag'
import type { FeatureFlagsConfig } from '../../types/feature-flags'

interface RuntimeConfig {
  public: {
    featureFlags: FeatureFlagsConfig
  }
}

let runtimeConfig: RuntimeConfig

vi.mock('#imports', () => ({
  useRuntimeConfig: () => runtimeConfig,
}))

beforeEach((): void => {
  runtimeConfig = {
    public: {
      featureFlags: {
        environment: 'prod',
        flagSets: {
          prod: [],
        },
      },
    },
  }
})

describe('useFeatureFlag', (): void => {
  it('detects static flags', (): void => {
    runtimeConfig.public.featureFlags.flagSets.prod = ['flagA']
    const { isEnabled } = useFeatureFlag()
    expect(isEnabled('flagA')).toBe(true)
    expect(isEnabled('unknown')).toBe(false)
  })

  it('handles scheduled flags', (): void => {
    const now: Date = new Date('2024-06-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.public.featureFlags.flagSets.prod = [
      { name: 'scheduled', activeFrom: '2024-05-01T00:00:00Z', activeUntil: '2024-07-01T00:00:00Z' },
    ]

    const { isEnabled, listFlags } = useFeatureFlag()
    expect(isEnabled('scheduled')).toBe(true)
    expect(listFlags()).toEqual(['scheduled'])

    vi.useRealTimers()
  })

  it('filters out inactive scheduled flags', (): void => {
    const now: Date = new Date('2024-04-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.public.featureFlags.flagSets.prod = [
      { name: 'scheduled', activeFrom: '2024-05-01T00:00:00Z' },
    ]

    const { isEnabled, listFlags } = useFeatureFlag()
    expect(isEnabled('scheduled')).toBe(false)
    expect(listFlags()).toEqual([])

    vi.useRealTimers()
  })

  it('supports hierarchical wildcard patterns', (): void => {
    runtimeConfig.public.featureFlags.flagSets.prod = ['solutions/*']
    let flagUtils = useFeatureFlag()
    expect(flagUtils.isEnabled('solutions/company-portal/addons/sales')).toBe(true)
    expect(flagUtils.isEnabled('solutions/*')).toBe(true)

    runtimeConfig.public.featureFlags.flagSets.prod = ['solutions/company-portal/addons/sales']
    flagUtils = useFeatureFlag()
    expect(flagUtils.isEnabled('solutions/*')).toBe(false)

    runtimeConfig.public.featureFlags.flagSets.prod = ['*']
    flagUtils = useFeatureFlag()
    expect(flagUtils.isEnabled('whatever')).toBe(true)
  })
})
