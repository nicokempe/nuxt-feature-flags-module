import { describe, it, expect, vi } from 'vitest'
import { vFeature } from '../../src/runtime/directives/v-feature'

const mockIsEnabled = vi.fn()

vi.mock('../../src/runtime/composables/useFeatureFlag', () => ({
  useFeatureFlag: () => ({ isEnabled: mockIsEnabled }),
}))

describe('vFeature directive', () => {
  it('hides element when feature is disabled', () => {
    mockIsEnabled.mockReturnValue(false)
    const el = { style: {} } as unknown as HTMLElement
    vFeature.mounted!(el, { value: 'myFlag' })
    expect((el as { style: Record<string, string> }).style.display).toBe('none')
  })

  it('does nothing when feature is enabled', () => {
    mockIsEnabled.mockReturnValue(true)
    const el = { style: {} } as unknown as HTMLElement
    vFeature.mounted!(el, { value: 'myFlag' })
    expect((el as { style: Record<string, string> }).style.display).not.toBe('none')
  })
})
