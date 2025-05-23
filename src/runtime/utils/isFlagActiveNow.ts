import type { FeatureFlag } from '../../../types/feature-flags'

export const isFlagActiveNow = (flag: FeatureFlag): boolean => {
  const now = Date.now()
  const from = flag.activeFrom ? Date.parse(flag.activeFrom) : -Infinity
  const until = flag.activeUntil ? Date.parse(flag.activeUntil) : Infinity
  return now >= from && now <= until
}
