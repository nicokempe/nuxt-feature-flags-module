/**
 * Checks whether a feature flag name matches a given pattern.
 *
 * Both `pattern` and `value` support hierarchical segments separated by `/`.
 * Only the `pattern` may end in a trailing `*` to match any descendant nodes
 * (e.g. `solutions/*`). The `value` is always treated as a concrete flag name.
 *
 * @param pattern - The flag or wildcard pattern to test against.
 * @param value - The concrete flag name being evaluated.
 * @returns `true` if the pattern matches the value, otherwise `false`.
 */
export const matchFlag = (pattern: string, value: string): boolean => {
  if (pattern === '*' || value === '*') return true

  const patternIsWildcard: boolean = pattern.endsWith('/*')

  const patternBase: string = patternIsWildcard ? pattern.slice(0, -1) : pattern

  if (patternIsWildcard) {
    return value.startsWith(patternBase)
  }

  return pattern === value
}
