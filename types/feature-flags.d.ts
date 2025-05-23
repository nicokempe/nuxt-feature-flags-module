export type FeatureFlagInput = string | FeatureFlag

export interface FeatureFlag {
  name: string
  activeFrom?: string
  activeUntil?: string
}

export interface FeatureFlagsConfig {
  environment: string
  environments: Record<string, FeatureFlagInput[]>
}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }

  interface PublicRuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }
}
