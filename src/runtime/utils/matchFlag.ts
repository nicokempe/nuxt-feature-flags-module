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
