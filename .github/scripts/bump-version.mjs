import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

/**
 * A minimal slice of package.json we care about.
 * @typedef {object} PackageJson
 * @property {string} version - Semantic-like version in the format "YYYY.M.P".
 */

/**
 * Centralized error handler that logs a concise message and exits the process.
 * Avoids console.error to keep CI logs tidy and aligned with project preferences.
 *
 * @param {unknown} error - The thrown error or value.
 * @returns {never}
 */
function handleError(error) {
  const message = error instanceof Error ? error.message : String(error)
  console.log(`[bump-version] ERROR: ${message}`)
  process.exit(1)
}

/**
 * Resolve the repository root directory from the current script file path.
 * The script lives in ".github/scripts", so we walk three levels up to the repo root.
 *
 * @param {string} currentFilePath - Absolute path to the current script (from import.meta.url).
 * @returns {string} Absolute path to the repository root directory.
 */
function getRepositoryRoot(currentFilePath) {
  return path.resolve(currentFilePath, '../../..')
}

/**
 * Determine year and month as observed in the "Europe/Berlin" timezone.
 * Month is returned as a 1–12 integer (not zero-based).
 *
 * @param {Date} [referenceDate] - Optional fixed point in time for repeatable tests.
 * @returns {{ year: number; month: number }} The Berlin-local year and month.
 * @throws {Error} If the derived values are invalid or missing.
 */
function getBerlinYearMonth(referenceDate = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Berlin',
    year: 'numeric',
    month: '2-digit',
  })
  const parts = formatter.formatToParts(referenceDate)
  const year = Number(parts.find(p => p.type === 'year')?.value)
  const month = Number(parts.find(p => p.type === 'month')?.value)

  if (!Number.isInteger(year)) throw new Error(`Invalid Berlin year derived: ${year}`)
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid Berlin month derived: ${month}`)
  }

  return { year, month }
}

/**
 * Read and parse a package.json file from disk.
 *
 * @param {string} packageJsonPath - Absolute path to package.json.
 * @returns {PackageJson} Parsed package.json content.
 * @throws {Error} If the file is missing or cannot be parsed.
 */
function readPackageJson(packageJsonPath) {
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found at ${packageJsonPath}`)
  }
  const rawContent = fs.readFileSync(packageJsonPath, 'utf-8')
  /** @type {unknown} */
  const parsed = JSON.parse(rawContent)

  // Minimal structural validation
  if (
    typeof parsed !== 'object'
    || parsed === null
    || typeof /** @type {any} */ (parsed).version !== 'string'
  ) {
    throw new Error(`package.json at ${packageJsonPath} is missing a valid "version" string`)
  }

  return /** @type {PackageJson} */ (parsed)
}

/**
 * Serialize and write package.json back to disk with a trailing newline.
 *
 * @param {string} packageJsonPath - Absolute path to package.json.
 * @param {PackageJson} packageJson - The package.json object to write.
 * @returns {void}
 * @throws {Error} If writing fails.
 */
function writePackageJson(packageJsonPath, packageJson) {
  const serialized = JSON.stringify(packageJson, null, 2) + '\n'
  fs.writeFileSync(packageJsonPath, serialized, 'utf-8')
}

/**
 * Compute the next version given the previous version string and the current Berlin year/month.
 * - If year and month match the previous, increment the patch.
 * - Otherwise, reset patch to 0 and set current year/month.
 *
 * @param {string} previousVersion - Existing version in the format "YYYY.M.P".
 * @param {number} berlinYear - Current year in Europe/Berlin timezone.
 * @param {number} berlinMonth - Current month (1–12) in Europe/Berlin timezone.
 * @returns {string} The next version string "YYYY.M.P".
 * @throws {Error} If the previous version is not in the expected format.
 */
function computeNextVersion(previousVersion, berlinYear, berlinMonth) {
  const [prevYearStr, prevMonthStr, prevPatchStr] = String(previousVersion).split('.')
  const prevYear = Number(prevYearStr)
  const prevMonth = Number(prevMonthStr)
  let patch = Number(prevPatchStr)

  if (!Number.isInteger(prevYear) || !Number.isInteger(prevMonth) || !Number.isInteger(patch)) {
    throw new TypeError(
      `Invalid version "${previousVersion}". Expected format "YYYY.M.P" (e.g., 2025.8.0)`,
    )
  }

  if (prevYear === berlinYear && prevMonth === berlinMonth) {
    patch += 1
  }
  else {
    patch = 0
  }

  return `${berlinYear}.${berlinMonth}.${patch}`
}

/**
 * Main execution flow:
 * 1) Resolve repository root and package.json path robustly.
 * 2) Read and validate the current package.json.
 * 3) Derive the Berlin-local year/month.
 * 4) Compute the next version.
 * 5) Write and verify the updated package.json.
 */
(function main() {
  try {
    const thisFilePath = url.fileURLToPath(import.meta.url)
    const repositoryRootPath = getRepositoryRoot(thisFilePath)
    const packageJsonPath = path.join(repositoryRootPath, 'package.json')

    const packageJsonBefore = readPackageJson(packageJsonPath)
    const currentVersionBefore = packageJsonBefore.version

    const { year: berlinYear, month: berlinMonth } = getBerlinYearMonth()

    console.log(`[bump-version] Repository root: ${repositoryRootPath}`)
    console.log(`[bump-version] package.json:    ${packageJsonPath}`)
    console.log(`[bump-version] Detected (Berlin): ${berlinYear}.${berlinMonth}`)
    console.log(`[bump-version] Previous version: ${currentVersionBefore}`)

    const nextVersion = computeNextVersion(currentVersionBefore, berlinYear, berlinMonth)
    packageJsonBefore.version = nextVersion

    writePackageJson(packageJsonPath, packageJsonBefore)
    console.log(`[bump-version] Wrote version:   ${nextVersion}`)

    // Post-write verification to catch any unexpected interference.
    const packageJsonAfter = readPackageJson(packageJsonPath)
    if (packageJsonAfter.version !== nextVersion) {
      throw new Error(
        `Post-write mismatch: expected ${nextVersion} but found ${packageJsonAfter.version}`,
      )
    }

    // Final guard: ensure month persisted equals Berlin month
    const writtenMonth = Number(nextVersion.split('.')[1])
    if (writtenMonth !== berlinMonth) {
      throw new Error(
        `Guard failed: written month ${writtenMonth} != Berlin month ${berlinMonth}`,
      )
    }

    console.log('[bump-version] Success ✅')
  }
  catch (error) {
    handleError(error)
  }
})()
