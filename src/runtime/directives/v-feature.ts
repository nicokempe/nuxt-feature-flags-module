import type { Directive } from 'vue'
import { useFeatureFlag } from '../composables/useFeatureFlag'
import { useFeatureVariant } from '../composables/useFeatureVariant'

const updateElementVisibility = (el: HTMLElement, featureFlagValue: string) => {
  const { isEnabled } = useFeatureFlag()
  const [flagName, variant] = featureFlagValue.split(':')
  const hasVariant = !!variant
  let shouldDisplay = false

  if (hasVariant) {
    const currentVariant = useFeatureVariant(flagName)
    shouldDisplay = isEnabled(flagName) && !!currentVariant && currentVariant === variant
  }
  else {
    shouldDisplay = isEnabled(flagName)
  }

  el.style.display = shouldDisplay ? '' : 'none'
}

export const vFeature: Directive = {
  mounted(el: HTMLElement, binding: { value: string }) {
    updateElementVisibility(el, binding.value)
  },
  updated(el: HTMLElement, binding: { value: string }) {
    updateElementVisibility(el, binding.value)
  },
}
