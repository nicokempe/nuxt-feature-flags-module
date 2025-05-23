import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
} from '@nuxt/kit'

import type { FeatureFlagsConfig } from '../types/feature-flags'

export default defineNuxtModule<FeatureFlagsConfig>({
  meta: {
    name: 'nuxt-feature-flags-module',
    configKey: 'featureFlags',
  },
  defaults: {
    environment: 'production',
    environments: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.featureFlags = options
    nuxt.options.runtimeConfig.featureFlags = options

    addImportsDir(resolver.resolve('runtime/composables'))
    addPlugin(resolver.resolve('runtime/plugin'))
    addImportsDir(resolver.resolve('runtime/middleware'))
  },
})
