export interface FeatureFlagsConfig {
  environment: string
  environments: Record<string, string[]>
}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }

  interface PublicRuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }
}
