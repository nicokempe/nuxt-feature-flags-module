import type { FeatureFlagsConfig } from '../../../types/feature-flags'

/**
 * Validates declared feature flags based on provided configuration.
 *
 * This function checks for invalid flag names (e.g., names containing colons)
 * across different flagSets and either logs a warning or throws an error
 * depending on the selected validation mode.
 *
 * @param options - Configuration object that includes flagSets and validation settings.
 *
 * The `options` parameter should have the following structure:
 *
 * ```ts
 * interface FeatureFlagsConfig {
 *   flagSets?: Record<string, (string | { name: string })[]>;
 *   validation?: {
 *     mode?: 'disabled' | 'warn' | 'error';
 *   };
 * }
 * ```
 */
export async function validateFeatureFlags(
  options: FeatureFlagsConfig,
): Promise<void> {
  // 0. Determine “mode”
  type Mode = 'disabled' | 'warn' | 'error'
  const mode: Mode = options.validation?.mode ?? 'warn'
  if (mode === 'disabled') {
    return // Skip validation entirely
  }

  // 1. If no flagSets defined → skip
  if (!options.flagSets || Object.keys(options.flagSets).length === 0) {
    return
  }

  // 2. Load all declared flags from flagSets
  const declaredFlags: Set<string> = new Set<string>()
  for (const envFlags of Object.values(options.flagSets)) {
    for (const item of envFlags || []) {
      const name: string = typeof item === 'string' ? item : item.name
      declaredFlags.add(name)
    }
  }

  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/

  // 3. Check for invalid characters in flag names
  for (const flag of declaredFlags) {
    // 3a. Check for colons
    if (flag.includes(':')) {
      const location: string = `Declared flag "${flag}" contains invalid characters.`
      const message: string = `[nuxt-feature-flags] ${location} → Flag names should not contain colons (:)`
      if (mode === 'error') {
        throw new Error(message)
      }
      else {
        console.warn(message)
      }
      return
    }

    // 3b. Check for reserved names
    const reservedNames = new Set(['default', 'true', 'false'])
    if (reservedNames.has(flag)) {
      const message = `[nuxt-feature-flags] Flag name "${flag}" is reserved and cannot be used.`
      if (mode === 'error') throw new Error(message)
      else console.warn(message)
    }

    // 3c. Check for camelCase
    if (!camelCaseRegex.test(flag)) {
      const message = `[nuxt-feature-flags] Declared flag "${flag}" does not follow camelCase format (e.g., "myFeatureFlag").`
      if (mode === 'error') throw new Error(message)
      else console.warn(message)
    }
  }
}
