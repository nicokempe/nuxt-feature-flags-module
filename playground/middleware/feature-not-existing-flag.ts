export default defineNuxtRouteMiddleware(() => {
  const { isEnabled } = useFeatureFlag()
  if (!isEnabled('notExistingFlagMiddleware')) {
    return showError({ statusCode: 404, statusMessage: 'Not available' })
  }
})
