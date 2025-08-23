import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isFlagActiveNow } from '../../src/runtime/utils/isFlagActiveNow'

// Use a fixed system time for deterministic results
const fixedTime: Date = new Date('2024-06-01T12:00:00Z')

beforeEach((): void => {
  vi.useFakeTimers()
  vi.setSystemTime(fixedTime)
})

afterEach((): void => {
  vi.useRealTimers()
})

describe('isFlagActiveNow', (): void => {
  it('returns true when no dates are provided', (): void => {
    expect(isFlagActiveNow({ name: 'test' })).toBe(true)
  })

  it('respects activeFrom and activeUntil window', (): void => {
    const flag = { name: 'test', activeFrom: '2024-05-01T00:00:00Z', activeUntil: '2024-07-01T00:00:00Z' }
    expect(isFlagActiveNow(flag)).toBe(true)
  })

  it('returns false when before activeFrom', (): void => {
    const flag = { name: 'test', activeFrom: '2024-06-02T00:00:00Z' }
    expect(isFlagActiveNow(flag)).toBe(false)
  })

  it('returns false when after activeUntil', (): void => {
    const flag = { name: 'test', activeUntil: '2024-05-01T00:00:00Z' }
    expect(isFlagActiveNow(flag)).toBe(false)
  })

  it('returns false for invalid date strings', (): void => {
    const flag = { name: 'test', activeFrom: 'not-a-date' }
    expect(isFlagActiveNow(flag)).toBe(false)
  })
})
