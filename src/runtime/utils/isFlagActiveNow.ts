import type { FeatureFlag } from '../../../types/feature-flags'

export const isFlagActiveNow = (flag: FeatureFlag): boolean => {
  const now: number = Date.now()
  const startTime: number = flag.activeFrom ? Date.parse(flag.activeFrom) : -Infinity
  const endTime: number = flag.activeUntil ? Date.parse(flag.activeUntil) : Infinity
  return now >= startTime && now <= endTime
}
