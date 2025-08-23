import { readFile } from 'node:fs/promises'
import { globby } from 'globby'
import { resolve as resolvePath } from 'pathe'
import type { FeatureFlagsConfig } from '../../../types/feature-flags'
import { matchFlag } from './matchFlag'

/**
 * Validates that all feature flags used in the source code are declared
 * in at least one environment of the FeatureFlagsConfig.
 * Handles hierarchical flag paths and `*` wildcards, allowing patterns such as `solutions/*` in both declarations and usage.
 *
 * Supports customizing:
 * - `validation.mode`     (disabled | warn | error)
 * - `validation.includeGlobs` (array of globs to scan)
 * - `validation.excludeGlobs` (array of globs to ignore)
 *
 * It looks for any usage of:
 * - `v-feature="flagName"`
 * - `isEnabled('flagName')`
 * - `defineFeatureFlagMiddleware('flagName')`
 *
 * For each missing flag, it includes file path, line, and column in the warning/error.
 *
 * @param options - Feature flag configuration (including `flagSets` and `validation`).
 * @param rootDir  - Absolute path to the Nuxt project root directory.
 */
export async function validateFeatureFlags(
  options: FeatureFlagsConfig,
  rootDir: string,
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

  // 2. Build include/exclude glob lists
  const includeGlobs: string[] = (options.validation?.includeGlobs?.length
    ? options.validation.includeGlobs
    : ['**/*.{vue,ts,js}'])

  const excludeGlobs: string[] = (options.validation?.excludeGlobs?.length
    ? options.validation.excludeGlobs
    : ['node_modules', '.nuxt', 'dist'])

  // 3. Find all matching files
  const allFiles: string[] = await globby(includeGlobs, {
    cwd: rootDir,
    ignore: excludeGlobs,
  })

  // 4. Prepare regex patterns (allow letters, digits, underscores, hyphens, dots)
  const regexes: RegExp[] = [
    // Matches: v-feature="flagName", v-feature='flagName', v-feature="'flagName'"
    /v-feature\s*=\s*["']\s*'?([\w./*-]+)'?\s*["']/g,

    // Matches: isEnabled('flagName') or isEnabled("flagName")
    /\bisEnabled\(\s*['"]([\w./*-]+)['"]\s*\)/g,

    // Matches: defineFeatureFlagMiddleware('flagName') or defineFeatureFlagMiddleware("flagName")
    /\bdefineFeatureFlagMiddleware\(\s*['"]([\w./*-]+)['"]\s*\)/g,
  ]

  // 5. Read & scan each file for literal flag usage
  interface FileContext { path: string, content: string }
  const contexts: FileContext[] = []

  await Promise.all(allFiles.map(async (relativePath): Promise<void> => {
    const absolutePath: string = resolvePath(rootDir, relativePath)
    try {
      const content: string = await readFile(absolutePath, 'utf-8')
      contexts.push({ path: relativePath, content })
    }
    catch (error) {
      console.warn(
        `[nuxt-feature-flags] Could not read file: ${absolutePath}. Skipping…`,
        error,
      )
    }
  }))

  // 6. Extract “used” flags along with location info
  type UsedFlagInfo = { name: string, file: string, line: number, column: number }
  const usedFlagsInfo: UsedFlagInfo[] = []

  for (const { path: relativePath, content } of contexts) {
    for (const regex of regexes) {
      let match: RegExpExecArray | null
      while ((match = regex.exec(content)) !== null) {
        const captured: string | undefined = match[1]
        if (typeof captured !== 'string' || captured.length === 0) {
          continue
        }
        const flagName: string = captured // capture group 1 is always the flag
        // Calculate line/column from match.index
        const beforeMatch: string = content.slice(0, match.index)
        const lineNumber: number = beforeMatch.split('\n').length
        const lastNewLineIndex: number = beforeMatch.lastIndexOf('\n')
        const columnNumber: number = match.index - (lastNewLineIndex + 1) + 1

        if (flagName) {
          usedFlagsInfo.push({
            name: flagName,
            file: relativePath,
            line: lineNumber,
            column: columnNumber,
          })
        }
      }
    }
  }

  // 7. Build Set of all declared flags (across all flags in all flagSets)
  const declaredFlags: string[] = []
  for (const [environment, environmentFlags] of Object.entries(options.flagSets)) {
    for (const flagEntry of environmentFlags || []) {
      const name: string = typeof flagEntry === 'string' ? flagEntry : flagEntry.name
      declaredFlags.push(name)
      if (name === '*') {
        console.warn(`[nuxt-feature-flags] Environment "${environment}" uses "*" which enables all flags and should only be used for debugging.`)
      }
    }
  }

  // 8. Compare used vs. declared, emit warnings/errors with context
  for (const info of usedFlagsInfo) {
    const declared: boolean = declaredFlags.some(pattern => matchFlag(pattern, info.name))
    if (!declared) {
      const location: string = `${info.file}:${info.line}:${info.column}`
      const message: string
        = `[nuxt-feature-flags] ${location} → Flag "${info.name}" `
          + `is used but not declared in any environment.`

      if (mode === 'error') {
        throw new Error(message)
      }
      else {
        console.warn(message)
      }
    }
  }
}
