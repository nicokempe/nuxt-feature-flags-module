export default defineNuxtRouteMiddleware(() => {
  const { isEnabled } = useFeatureFlag()
  if (!isEnabled('newSystem')) {
    return showError({ statusCode: 404, statusMessage: 'Not available' })
  }
})
