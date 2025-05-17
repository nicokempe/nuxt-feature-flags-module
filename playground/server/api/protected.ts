import { isFeatureEnabled } from '../../../src/runtime/server/isFeatureEnabled'

export default defineEventHandler((event) => {
  if (!isFeatureEnabled('betaButton', event)) {
    return sendError(event, createError({ statusCode: 403, message: 'Beta feature disabled' }))
  }

  return { message: 'Feature unlocked 🎉' }
})
