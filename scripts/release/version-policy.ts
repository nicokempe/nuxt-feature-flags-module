/** Time zone used to determine the calendar month of a release. */
export const RELEASE_TIME_ZONE = 'Europe/Berlin'

const releaseVersionPattern = /^(?<year>\d{4})\.(?<month>[1-9]|1[0-2])\.(?<releaseNumber>0|[1-9]\d*)$/

/** Numeric parts of a calendar release version. */
export interface CalendarVersionParts {
  readonly year: number
  readonly month: number
  readonly releaseNumber: number
}

/** The canonical representation of one release version. */
export interface ReleaseVersion extends CalendarVersionParts {
  readonly version: string
}

/** Parses the canonical `YYYY.M.N` representation used by every release artifact. */
export function parseReleaseVersion(version: string): CalendarVersionParts | null {
  return parseVersion(version, releaseVersionPattern)
}

/** Converts numeric calendar parts to the canonical release form. */
export function formatReleaseVersion(parts: CalendarVersionParts): ReleaseVersion {
  validateVersionParts(parts)

  return {
    ...parts,
    version: `${parts.year}.${parts.month}.${parts.releaseNumber}`,
  }
}

/** Calculates the next monthly release while treating the current package version as allocated. */
export function calculateNextReleaseVersion(
  tags: readonly string[],
  currentVersion: string,
  releaseDate: Date = new Date(),
  timeZone: string = RELEASE_TIME_ZONE,
): ReleaseVersion {
  const releaseMonth = getReleaseMonth(releaseDate, timeZone)
  const currentVersionParts = parseReleaseVersion(currentVersion)

  if (currentVersionParts === null) {
    throw new Error(`Current version "${currentVersion}" does not use YYYY.M.N.`)
  }

  const allocatedReleaseNumbers = tags
    .map(tag => parseReleaseVersion(tag))
    .filter((parts): parts is CalendarVersionParts => parts !== null)
    .filter(parts => parts.year === releaseMonth.year && parts.month === releaseMonth.month)
    .map(parts => parts.releaseNumber)

  if (currentVersionParts.year === releaseMonth.year && currentVersionParts.month === releaseMonth.month) {
    allocatedReleaseNumbers.push(currentVersionParts.releaseNumber)
  }

  const highestAllocatedRelease = allocatedReleaseNumbers.length === 0
    ? -1
    : Math.max(...allocatedReleaseNumbers)

  return formatReleaseVersion({
    ...releaseMonth,
    releaseNumber: highestAllocatedRelease + 1,
  })
}

/** Parses version parts with a named-group expression. */
function parseVersion(value: string, pattern: RegExp): CalendarVersionParts | null {
  const match = pattern.exec(value)
  const groups = match?.groups
  if (groups === undefined) {
    return null
  }

  const year = Number.parseInt(groups.year ?? '', 10)
  const month = Number.parseInt(groups.month ?? '', 10)
  const releaseNumber = Number.parseInt(groups.releaseNumber ?? '', 10)
  const parts = { year, month, releaseNumber }

  try {
    validateVersionParts(parts)
    return parts
  } catch {
    return null
  }
}

/** Resolves a release date to a year and month in the configured time zone. */
function getReleaseMonth(releaseDate: Date, timeZone: string): Pick<CalendarVersionParts, 'year' | 'month'> {
  if (Number.isNaN(releaseDate.getTime())) {
    throw new Error('Release date must be valid.')
  }

  const dateParts = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    timeZone,
  }).formatToParts(releaseDate)
  const year = Number.parseInt(dateParts.find(part => part.type === 'year')?.value ?? '', 10)
  const month = Number.parseInt(dateParts.find(part => part.type === 'month')?.value ?? '', 10)
  const parts = { year, month, releaseNumber: 0 }
  validateVersionParts(parts)

  return { year, month }
}

/** Validates numeric calendar-version parts before formatting them. */
function validateVersionParts(parts: CalendarVersionParts): void {
  if (!Number.isInteger(parts.year) || parts.year < 1000 || parts.year > 9999) {
    throw new Error('Release year must contain four digits.')
  }
  if (!Number.isInteger(parts.month) || parts.month < 1 || parts.month > 12) {
    throw new Error('Release month must be between 1 and 12.')
  }
  if (!Number.isInteger(parts.releaseNumber) || parts.releaseNumber < 0) {
    throw new Error('Release number must be a non-negative integer.')
  }
}
