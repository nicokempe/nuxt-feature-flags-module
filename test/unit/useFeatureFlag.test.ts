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

beforeEach(() => {
  runtimeConfig = {
    public: {
      featureFlags: {
        environment: 'prod',
        flags: {
          prod: [],
        },
      },
    },
  }
})

describe('useFeatureFlag', () => {
  it('detects static flags', () => {
    runtimeConfig.public.featureFlags.flags.prod = ['flagA']
    const { isEnabled } = useFeatureFlag()
    expect(isEnabled('flagA')).toBe(true)
    expect(isEnabled('unknown')).toBe(false)
  })

  it('handles scheduled flags', () => {
    const now = new Date('2024-06-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.public.featureFlags.flags.prod = [
      { name: 'scheduled', activeFrom: '2024-05-01T00:00:00Z', activeUntil: '2024-07-01T00:00:00Z' },
    ]

    const { isEnabled, listFlags } = useFeatureFlag()
    expect(isEnabled('scheduled')).toBe(true)
    expect(listFlags()).toEqual(['scheduled'])

    vi.useRealTimers()
  })

  it('filters out inactive scheduled flags', () => {
    const now = new Date('2024-04-01T12:00:00Z')
    vi.useFakeTimers()
    vi.setSystemTime(now)

    runtimeConfig.public.featureFlags.flags.prod = [
      { name: 'scheduled', activeFrom: '2024-05-01T00:00:00Z' },
    ]

    const { isEnabled, listFlags } = useFeatureFlag()
    expect(isEnabled('scheduled')).toBe(false)
    expect(listFlags()).toEqual([])

    vi.useRealTimers()
  })
})
