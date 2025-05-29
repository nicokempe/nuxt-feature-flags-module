import type { Directive } from 'vue'
import { useFeatureFlag } from '../composables/useFeatureFlag'

export const vFeature: Directive = {
  mounted(el: HTMLElement, binding: { value: string }) {
    const { isEnabled } = useFeatureFlag()
    if (!isEnabled(binding.value)) el.style.display = 'none'
  },
}
