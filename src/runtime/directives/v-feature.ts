import type { Directive } from 'vue'
import type { FeatureFlagsConfig, FeatureFlagInput } from '../../../types/feature-flags'
import { isFlagActiveNow } from '../utils/isFlagActiveNow'
import { useRuntimeConfig } from '#imports'

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
