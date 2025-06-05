import type { Directive } from 'vue'
import { useFeatureFlag } from '../composables/useFeatureFlag'

const updateElementVisibility = (el: HTMLElement, featureFlagValue: string) => {
  const { isEnabled } = useFeatureFlag()
  el.style.display = isEnabled(featureFlagValue) ? '' : 'none'
}

export const vFeature: Directive = {
  mounted(el: HTMLElement, binding: { value: string }) {
    updateElementVisibility(el, binding.value)
  },
  updated(el: HTMLElement, binding: { value: string }) {
    updateElementVisibility(el, binding.value)
  },
}
