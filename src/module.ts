import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir, type Resolver,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export interface FeatureFlagsOptions {
  environment: string
  environments: Record<string, string[]>
}

export default defineNuxtModule<FeatureFlagsOptions>({
  meta: {
    name: 'nuxt-feature-flags-module',
    configKey: 'featureFlags',
  },

  defaults: {
    environment: 'production',
    environments: {},
  },

  setup(options: FeatureFlagsOptions, nuxt: Nuxt): void {
    const resolver: Resolver = createResolver(import.meta.url)

    // Inject into runtime config for both client + server
    nuxt.options.runtimeConfig.public.featureFlags = options
    nuxt.options.runtimeConfig.featureFlags = options

    // Register composables (useFeatureFlag)
    addImportsDir(resolver.resolve('runtime/composables'))

    addPlugin(resolver.resolve('runtime/plugin'))

    addImportsDir(resolver.resolve('runtime/middleware'))
  },
})
