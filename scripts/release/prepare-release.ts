import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import {
  calculateNextReleaseVersion,
  parseReleaseVersion,
  type ReleaseVersion,
} from './version-policy.ts'

const changelogenVersion = '0.6.2'
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const packagePath = resolve(repositoryRoot, 'package.json')
const changelogPath = resolve(repositoryRoot, 'CHANGELOG.md')
const baselinePath = resolve(repositoryRoot, 'scripts/release/baseline.json')

/** Supported command-line options for release preparation. */
interface CliOptions {
  readonly githubOutputPath: string
  readonly notesFilePath: string
}

/** Pre-automation reference that excludes historical tags from the new release stream. */
interface ReleaseBaseline {
  readonly commit: string
  readonly version: string
}

/** A command and its arguments. */
interface CommandInvocation {
  readonly argumentsList: readonly string[]
  readonly command: string
}

/** Character offsets for one second-level Markdown section. */
interface MarkdownSection {
  readonly bodyStart: number
  readonly end: number
  readonly start: number
}

/** Prepared values consumed by the release workflow. */
interface PreparedRelease {
  readonly previousReference: string
  readonly shouldCommit: boolean
  readonly version: string
}

/** Runs release preparation and emits workflow outputs. */
function main(): void {
  const options = parseCliOptions(process.argv.slice(2))
  const packageObject = readJsonObject(packagePath)
  const currentVersion = getRequiredString(packageObject, 'version', packagePath)
  const baseline = getValidatedBaseline()
  const versionsAtHead = splitLines(runGit(['tag', '--points-at', 'HEAD', '--list']))
    .filter(tag => parseReleaseVersion(tag) !== null)

  if (versionsAtHead.length > 1) {
    throw new Error(`HEAD has multiple calendar release versions: ${versionsAtHead.join(', ')}`)
  }

  const preparedRelease = versionsAtHead.length === 1
    ? resumeRelease(versionsAtHead[0] ?? '', currentVersion, baseline)
    : prepareNewRelease(packageObject, currentVersion, baseline)
  const releaseNotes = extractReleaseNotes(
    readFileSync(changelogPath, 'utf8'),
    preparedRelease.version,
  )

  mkdirSync(dirname(options.notesFilePath), { recursive: true })
  writeFileSync(options.notesFilePath, `${releaseNotes}\n`, 'utf8')
  writeWorkflowOutputs(options.githubOutputPath, preparedRelease, options.notesFilePath)

  console.log(`Prepared ${preparedRelease.version}.`)
}

/** Validates and resumes a release whose tag already points at HEAD. */
function resumeRelease(
  version: string,
  currentVersion: string,
  baseline: ReleaseBaseline,
): PreparedRelease {
  if (parseReleaseVersion(version) === null) {
    throw new Error(`Release version ${version} does not use YYYY.M.N.`)
  }
  if (currentVersion !== version) {
    throw new Error(
      `Release tag ${version} requires package version ${version}, but found ${currentVersion}.`,
    )
  }

  extractReleaseNotes(readFileSync(changelogPath, 'utf8'), version)

  return {
    previousReference: getPreviousReleaseVersion(version, baseline.commit) ?? baseline.commit,
    shouldCommit: false,
    version,
  }
}

/** Generates the next version, changelog entry, and package metadata. */
function prepareNewRelease(
  packageObject: Record<string, unknown>,
  currentVersion: string,
  baseline: ReleaseBaseline,
): PreparedRelease {
  const allTags = splitLines(runGit(['tag', '--list']))
  const releaseVersion = calculateNextReleaseVersion(allTags, currentVersion)
  const latestReleaseVersion = getLatestReachableReleaseVersion(baseline.commit)
  const previousReference = latestReleaseVersion ?? baseline.commit
  const expectedCurrentVersion = latestReleaseVersion ?? baseline.version

  if (currentVersion !== expectedCurrentVersion) {
    throw new Error(
      `Package version ${currentVersion} does not match the latest release allocation ${expectedCurrentVersion}.`,
    )
  }

  ensureVersionDoesNotExist(allTags, releaseVersion)
  runChangelogen(packageObject, releaseVersion, previousReference)
  updatePackageVersion(packageObject, releaseVersion.version)

  return {
    previousReference,
    shouldCommit: true,
    version: releaseVersion.version,
  }
}

/** Invokes the pinned Changelogen CLI for Conventional Commit release notes. */
function runChangelogen(
  packageObject: Record<string, unknown>,
  releaseVersion: ReleaseVersion,
  previousReference: string,
): void {
  const invocation = getChangelogenInvocation(packageObject)
  const commandArguments = [
    ...invocation.argumentsList,
    '--dir',
    repositoryRoot,
    '--r',
    releaseVersion.version,
    '--output',
    'CHANGELOG.md',
    '--from',
    previousReference,
    '--to',
    'HEAD',
    '--noAuthors',
  ]
  const commandResult = spawnSync(invocation.command, commandArguments, {
    cwd: repositoryRoot,
    env: process.env,
    stdio: 'inherit',
  })

  if (commandResult.error !== undefined) {
    throw commandResult.error
  }
  if (commandResult.status !== 0) {
    throw new Error(`Changelogen exited with status ${commandResult.status ?? 'unknown'}.`)
  }
}

/** Selects the repository package manager without adding release-only dependencies. */
function getChangelogenInvocation(packageObject: Record<string, unknown>): CommandInvocation {
  const packageManager = packageObject.packageManager
  const declaresBunPackageManager = typeof packageManager === 'string'
    && packageManager.startsWith('bun@')
  if (typeof packageManager === 'string') {
    if (packageManager.startsWith('pnpm@')) {
      return {
        command: 'pnpm',
        argumentsList: ['dlx', `changelogen@${changelogenVersion}`],
      }
    }
    if (!packageManager.startsWith('bun@')) {
      throw new Error(`Unsupported package manager "${packageManager}".`)
    }
  }

  const engines = packageObject.engines
  const declaresBun = typeof engines === 'object'
    && engines !== null
    && !Array.isArray(engines)
    && typeof (engines as Record<string, unknown>).bun === 'string'
  if (declaresBunPackageManager || declaresBun) {
    return {
      command: 'bunx',
      argumentsList: [`changelogen@${changelogenVersion}`],
    }
  }

  throw new Error('package.json must declare pnpm as packageManager or a Bun engine.')
}

/** Extracts the body of a version section for the GitHub Release. */
function extractReleaseNotes(changelog: string, version: string): string {
  const releaseSection = findMarkdownSection(changelog, version)
  const releaseNotes = changelog.slice(releaseSection.bodyStart, releaseSection.end).trim()

  if (releaseNotes.length === 0) {
    throw new Error(`Changelog section ${version} has no release notes.`)
  }

  return releaseNotes
}

/** Finds an exact `## <title>` section in Markdown. */
function findMarkdownSection(markdown: string, title: string): MarkdownSection {
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const headingMatch = new RegExp(`^## ${escapedTitle}[ \\t]*$`, 'm').exec(markdown)
  if (headingMatch === null) {
    throw new Error(`Could not find changelog section "## ${title}".`)
  }

  const start = headingMatch.index
  const bodyStart = start + headingMatch[0].length
  const remainingMarkdown = markdown.slice(bodyStart)
  const nextHeading = /^##[ \t]+\S[^\r\n]*$/m.exec(remainingMarkdown)
  const end = nextHeading === null ? markdown.length : bodyStart + nextHeading.index

  return { bodyStart, end, start }
}

/** Loads and validates the migration boundary used for the automated release stream. */
function getValidatedBaseline(): ReleaseBaseline {
  const baselineObject = readJsonObject(baselinePath)
  const baseline: ReleaseBaseline = {
    commit: getRequiredString(baselineObject, 'commit', baselinePath),
    version: getRequiredString(baselineObject, 'version', baselinePath),
  }

  if (parseReleaseVersion(baseline.version) === null) {
    throw new Error('Release baseline version must use YYYY.M.N.')
  }
  if (!/^[0-9a-f]{40}$/.test(baseline.commit)) {
    throw new Error('Release baseline commit must be a full Git SHA.')
  }
  if (!gitCommandSucceeds(['merge-base', '--is-ancestor', baseline.commit, 'HEAD'])) {
    throw new Error(`Release baseline ${baseline.commit} is not an ancestor of HEAD.`)
  }

  return baseline
}

/** Returns the newest reachable calendar-version tag created after the migration baseline. */
function getLatestReachableReleaseVersion(baselineCommit: string): string | null {
  return getReachableReleaseVersions(baselineCommit)[0] ?? null
}

/** Returns the previous reachable release tag before the supplied tag. */
function getPreviousReleaseVersion(version: string, baselineCommit: string): string | null {
  return getReachableReleaseVersions(baselineCommit).find(tag => tag !== version) ?? null
}

/** Lists canonical reachable tags whose commits include the migration baseline. */
function getReachableReleaseVersions(baselineCommit: string): string[] {
  const mergedTags = splitLines(runGit(['tag', '--merged', 'HEAD', '--sort=-creatordate']))
  return mergedTags
    .filter(tag => parseReleaseVersion(tag) !== null)
    .filter(tag => runGit(['rev-parse', `${tag}^{commit}`]) !== baselineCommit)
    .filter(tag => gitCommandSucceeds([
      'merge-base',
      '--is-ancestor',
      baselineCommit,
      `${tag}^{commit}`,
    ]))
}

/** Ensures the calculated version has not already been tagged. */
function ensureVersionDoesNotExist(tags: readonly string[], releaseVersion: ReleaseVersion): void {
  if (tags.includes(releaseVersion.version)) {
    throw new Error(`Release version ${releaseVersion.version} already exists away from HEAD.`)
  }
}

/** Writes the new package version without changing unrelated manifest fields. */
function updatePackageVersion(packageObject: Record<string, unknown>, version: string): void {
  packageObject.version = version
  writeFileSync(packagePath, `${JSON.stringify(packageObject, null, 2)}\n`, 'utf8')
}

/** Reads a JSON file and requires an object at its root. */
function readJsonObject(path: string): Record<string, unknown> {
  const parsedValue: unknown = JSON.parse(readFileSync(path, 'utf8'))
  if (typeof parsedValue !== 'object' || parsedValue === null || Array.isArray(parsedValue)) {
    throw new Error(`${path} must contain a JSON object.`)
  }

  return parsedValue as Record<string, unknown>
}

/** Reads a required string property from a JSON object. */
function getRequiredString(object: Record<string, unknown>, key: string, path: string): string {
  const value = object[key]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${path} must define a non-empty "${key}" string.`)
  }

  return value
}

/** Runs Git and returns trimmed standard output. */
function runGit(argumentsList: readonly string[]): string {
  const commandResult = spawnSync('git', argumentsList, {
    cwd: repositoryRoot,
    encoding: 'utf8',
  })

  if (commandResult.error !== undefined) {
    throw commandResult.error
  }
  if (commandResult.status !== 0) {
    throw new Error(commandResult.stderr.trim() || `Git exited with status ${commandResult.status ?? 'unknown'}.`)
  }

  return commandResult.stdout.trim()
}

/** Checks whether a Git command exits successfully without emitting output. */
function gitCommandSucceeds(argumentsList: readonly string[]): boolean {
  const commandResult = spawnSync('git', argumentsList, {
    cwd: repositoryRoot,
    stdio: 'ignore',
  })

  if (commandResult.error !== undefined) {
    throw commandResult.error
  }

  return commandResult.status === 0
}

/** Splits newline-delimited command output into non-empty values. */
function splitLines(value: string): string[] {
  return value.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0)
}

/** Parses the two required workflow path options. */
function parseCliOptions(argumentsList: readonly string[]): CliOptions {
  let githubOutputPath = ''
  let notesFilePath = ''

  for (let argumentIndex = 0; argumentIndex < argumentsList.length; argumentIndex += 1) {
    const argument = argumentsList[argumentIndex]
    const value = argumentsList[argumentIndex + 1]
    if ((argument === '--github-output' || argument === '--notes-file') && value === undefined) {
      throw new Error(`${argument} requires a path.`)
    }

    if (argument === '--github-output') {
      githubOutputPath = value ?? ''
      argumentIndex += 1
    }
    else if (argument === '--notes-file') {
      notesFilePath = value ?? ''
      argumentIndex += 1
    }
    else {
      throw new Error(`Unknown release option "${argument ?? ''}".`)
    }
  }

  if (githubOutputPath.length === 0 || notesFilePath.length === 0) {
    throw new Error('--github-output and --notes-file are required.')
  }

  return { githubOutputPath, notesFilePath }
}

/** Appends scalar values for later GitHub Actions steps. */
function writeWorkflowOutputs(
  githubOutputPath: string,
  preparedRelease: PreparedRelease,
  notesFilePath: string,
): void {
  const outputLines = [
    `previous_reference=${preparedRelease.previousReference}`,
    `release_notes_path=${notesFilePath}`,
    `should_commit=${String(preparedRelease.shouldCommit)}`,
    `version=${preparedRelease.version}`,
  ]
  appendFileSync(githubOutputPath, `${outputLines.join('\n')}\n`, 'utf8')
}

try {
  main()
}
catch (error: unknown) {
  console.error(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
