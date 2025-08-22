import { isFeatureEnabled } from '../../../src/runtime/server/isFeatureEnabled'

export default defineEventHandler((event) => {
  if (!isFeatureEnabled('solutions/company-portal/addons/sales', event)) {
    return sendError(event, createError({ statusCode: 403, message: 'Sales addon disabled' }))
  }

  return { message: 'Sales addon feature unlocked 🎉' }
})
