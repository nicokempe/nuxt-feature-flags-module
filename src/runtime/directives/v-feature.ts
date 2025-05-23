import type { Directive } from 'vue'
import type { FeatureFlagsConfig, FeatureFlag, FeatureFlagInput } from '../../../types/feature-flags'
import { useRuntimeConfig } from '#imports'

const isFlagActiveNow = (flag: FeatureFlag): boolean => {
  const now = Date.now()
  const from = flag.activeFrom ? Date.parse(flag.activeFrom) : -Infinity
  const until = flag.activeUntil ? Date.parse(flag.activeUntil) : Infinity
  return now >= from && now <= until
}

export const vFeature: Directive = {
  mounted(el: HTMLElement, binding: { value: string }) {
    const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
    const env: string = config.environment
    const flags: FeatureFlagInput[] = config.environments?.[env] || []

    const featureName = binding.value
    let enabled = false

    for (const flag of flags) {
      if (typeof flag === 'string' && flag === featureName) enabled = true
      if (typeof flag === 'object' && flag.name === featureName && isFlagActiveNow(flag)) enabled = true
    }

    if (!enabled) el.style.display = 'none'
  },
}
