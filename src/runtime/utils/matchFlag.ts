/**
 * Checks whether a feature flag name matches a given pattern.
 *
 * Both `pattern` and `value` support hierarchical segments separated by `/`
 * and may end in a `*` wildcard to match any descendant nodes.
 * Either side may be a wildcard pattern, enabling group queries such as
 * `solutions/*` or `*` (root).
 *
 * @param pattern - The flag or wildcard pattern to test against.
 * @param value - The concrete flag name or pattern being evaluated.
 * @returns `true` if the pattern matches the value, otherwise `false`.
 */
export const matchFlag = (pattern: string, value: string): boolean => {
  if (pattern === '*' || value === '*') return true

  const patternIsWildcard: boolean = pattern.endsWith('/*')
  const valueIsWildcard: boolean = value.endsWith('/*')

  const patternBase: string = patternIsWildcard ? pattern.slice(0, -1) : pattern
  const valueBase: string = valueIsWildcard ? value.slice(0, -1) : value

  if (patternIsWildcard && value.startsWith(patternBase)) return true
  if (valueIsWildcard && pattern.startsWith(valueBase)) return true

  return pattern === value
}
