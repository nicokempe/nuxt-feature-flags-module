import type { Directive } from 'vue'
import type { FeatureFlagsConfig } from '~/types/feature-flags'

export const vFeature: Directive = {
  mounted(el, binding): void {
    const config: FeatureFlagsConfig = useRuntimeConfig().public.featureFlags
    const env: string = config.environment
    const flags: string[] = config.environments?.[env] || []

    const feature = binding.value
    const enabled: boolean = flags.includes(feature)

    if (!enabled) {
      el.style.display = 'none'
    }
  },
}
