import { defineEventHandler } from 'h3'
import { isFeatureEnabled } from '../../../../../src/runtime/server/isFeatureEnabled'

export default defineEventHandler(event => ({
  enabled: isFeatureEnabled('enabled', event),
  wildcard: isFeatureEnabled('group/nested', event),
  disabled: isFeatureEnabled('disabled', event),
}))
