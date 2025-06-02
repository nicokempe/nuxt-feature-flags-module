import {
  defineNuxtModule,
  createResolver,
  addPlugin,
  addImportsDir,
  type Resolver,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { FeatureFlagsConfig } from '../types/feature-flags'
import { validateUndeclaredFeatureFlags } from './runtime/utils/undeclaredValidator'
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
    environments: {},

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

    // Run validation at `ready` (after Nuxt merges config)
    nuxt.hook('ready', async (): Promise<void> => {
      await validateUndeclaredFeatureFlags(options, nuxt.options.rootDir)
      await validateFeatureFlags(options)
    })
  },
})
