import { useFeatureFlag } from '../composables/useFeatureFlag'

export const defineFeatureFlagMiddleware = (flag: string) => {
  return defineNuxtRouteMiddleware(() => {
    const { isEnabled } = useFeatureFlag()
    if (!isEnabled(flag)) {
      return showError({ statusCode: 404, statusMessage: 'Feature not available' })
    }
  })
}
