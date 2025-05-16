import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addPlugin,
} from '@nuxt/kit'

export interface FeatureFlagsOptions {
  environment: string
  environments: Record<string, string[]>
}

export default defineNuxtModule<FeatureFlagsOptions>({
  meta: {
    name: 'nuxt-feature-flags',
    configKey: 'featureFlags',
  },

  defaults: {
    environment: 'production',
    environments: {},
  },

  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Inject into public runtime config for client-side access
    nuxt.options.runtimeConfig.public.featureFlags = options

    // Inject into server runtime config for API/server usage
    nuxt.options.runtimeConfig.featureFlags = options

    // Register runtime composables (like useFeatureFlag)
    addImportsDir(resolver.resolve('runtime/composables'))

    // Register optional plugin (for hydration or SSR support if needed)
    addPlugin(resolver.resolve('runtime/plugin'))
  },
})
