import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
  addRouteMiddleware,

} from '@nuxt/kit'
import type { Resolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { FeatureFlagsConfig } from '../types/feature-flags'
import { validateFeatureFlags } from './runtime/utils/flagValidator'

export default defineNuxtModule<FeatureFlagsConfig>({
  meta: {
    name: 'nuxt-feature-flags-module',
    configKey: 'featureFlags',
  },
  defaults: {
    // Default environment if none is provided
    environment: 'production',

    // No flags declared by default
    flagSets: {},

    validation: {
      mode: 'warn', // can be 'disabled' | 'warn' | 'error'
      includeGlobs: [], // default to ['**/*.{vue,ts,js}'] if left empty
      excludeGlobs: [], // default to ['node_modules','.nuxt','dist'] if left empty
    },
  },
  setup(options: FeatureFlagsConfig, nuxt: Nuxt): void {
    const resolver: Resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.featureFlags = options
    nuxt.options.runtimeConfig.featureFlags = options

    addImportsDir(resolver.resolve('runtime/composables'))
    addPlugin(resolver.resolve('runtime/plugin'))
    addImportsDir(resolver.resolve('runtime/middleware'))
    addRouteMiddleware({
      name: 'feature-flag',
      path: resolver.resolve('runtime/middleware/featureFlag'),
      global: true,
    })

    // Run validation at `ready` (after Nuxt merges config)
    nuxt.hook('ready', async (): Promise<void> => {
      if ('environments' in (options as FeatureFlagsConfig)) {
        throw new Error(
          '`featureFlags.environments` has been renamed to `featureFlags.flagSets`. '
          + 'See release notes for v2025.6.2 for migration details.',
        )
      }
      await validateFeatureFlags(options, nuxt.options.rootDir)
    })
  },
})
