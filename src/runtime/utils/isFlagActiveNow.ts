import type { FeatureFlag } from '../../../types/feature-flags'

export const isFlagActiveNow = (flag: FeatureFlag): boolean => {
  const now: number = Date.now()
  const from: number = flag.activeFrom ? Date.parse(flag.activeFrom) : -Infinity
  const until: number = flag.activeUntil ? Date.parse(flag.activeUntil) : Infinity
  return now >= from && now <= until
}
