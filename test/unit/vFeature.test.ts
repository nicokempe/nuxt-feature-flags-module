import { describe, it, expect, vi } from 'vitest'

const mockIsEnabled = vi.fn()

vi.mock('../../src/runtime/composables/useFeatureFlag', () => ({
  useFeatureFlag: () => ({ isEnabled: mockIsEnabled })
}))

import { vFeature } from '../../src/runtime/directives/v-feature'

describe('vFeature directive', () => {
  it('hides element when feature is disabled', () => {
    mockIsEnabled.mockReturnValue(false)
    const el = { style: {} } as HTMLElement
    vFeature.mounted!(el, { value: 'myFlag' } as any)
    expect((el as any).style.display).toBe('none')
  })

  it('does nothing when feature is enabled', () => {
    mockIsEnabled.mockReturnValue(true)
    const el = { style: {} } as HTMLElement
    vFeature.mounted!(el, { value: 'myFlag' } as any)
    expect((el as any).style.display).not.toBe('none')
  })
})
