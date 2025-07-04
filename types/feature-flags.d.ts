export type FeatureFlagInput = string | FeatureFlag

export interface FeatureFlag {
  name: string
  activeFrom?: string
  activeUntil?: string
}

export interface ValidationOptions {
  /**
   * 'disabled' → skip scanning entirely
   * 'warn'     → missing flags emit console.warn (soft‐fail)
   * 'error'    → missing flags throw Error (hard‐fail)
   */
  mode?: 'disabled' | 'warn' | 'error'

  /** Glob patterns to INCLUDE in the scan. Defaults to ['/*.{vue,ts,js}']. */
  includeGlobs?: string[]

  /** Glob patterns to EXCLUDE from the scan. Defaults to ['node_modules', '.nuxt', 'dist']. */
  excludeGlobs?: string[]
}

export interface FeatureFlagsConfig {
  /**
   * The current environment name (e.g., 'production', 'staging', 'development').
   */
  environment: string

  /**
   * A record mapping each environment to an array of flags (string or { name, activeFrom, activeUntil }).
   */
  flagSets: Record<string, FeatureFlagInput[]>

  /**
   * Advanced validation options:
   * - `mode`: 'disabled' | 'warn' | 'error'
   * - `includeGlobs`: custom globs to scan
   * - `excludeGlobs`: custom globs to ignore
   *
   * If undefined, defaults to:
   *   mode: 'warn'
   *   includeGlobs: ['/*.{vue,ts,js}']
   *   excludeGlobs: ['node_modules', '.nuxt', 'dist']
   */
  validation?: ValidationOptions
}

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }

  interface PublicRuntimeConfig {
    featureFlags: FeatureFlagsConfig
  }
}
