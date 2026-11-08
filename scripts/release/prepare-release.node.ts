import { deepEqual, equal, match, ok } from 'node:assert/strict'
import { spawnSync, type SpawnSyncReturns } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { delimiter, dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { test } from 'node:test'
import { parseReleaseVersion } from './version-policy.ts'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const baselineVersion = '2000.1.0'

/** Disposable repository history and paths used by release preparation tests. */
interface ReleaseFixture {
  readonly temporaryDirectory: string
  readonly repositoryDirectory: string
  readonly gitBinDirectory: string
  readonly baselineCommit: string
}

/**
 * Creates local Git history with the installed CLI and a Git-only executable path.
 * @returns An isolated repository and its release-history boundary.
 */
function createFixture(): ReleaseFixture {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'nuxt-feature-flags-release-'))
  const repositoryDirectory = join(temporaryDirectory, 'repository')
  const gitBinDirectory = join(temporaryDirectory, 'bin')
  mkdirSync(join(repositoryDirectory, 'scripts/release'), { recursive: true })
  mkdirSync(gitBinDirectory)
  const gitExecutable = (process.env.PATH ?? '').split(delimiter)
    .map(directory => join(directory, 'git')).find(existsSync)
  ok(gitExecutable, 'Git is required for release integration tests')
  symlinkSync(gitExecutable, join(gitBinDirectory, 'git'))
  symlinkSync(join(repositoryRoot, 'node_modules'), join(repositoryDirectory, 'node_modules'))
  for (const scriptName of ['prepare-release.ts', 'version-policy.ts']) {
    copyFileSync(join(repositoryRoot, 'scripts/release', scriptName), join(repositoryDirectory, 'scripts/release', scriptName))
  }
  copyFileSync(join(repositoryRoot, 'changelog.config.json'), join(repositoryDirectory, 'changelog.config.json'))
  writeFileSync(join(repositoryDirectory, '.gitignore'), 'node_modules\n')
  writeFileSync(join(temporaryDirectory, 'block-network.mjs'), `globalThis.fetch = () => {
    throw new Error('UNEXPECTED_RELEASE_NETWORK_REQUEST')
  }\n`)
  writeFileSync(join(repositoryDirectory, 'package.json'), JSON.stringify({
    name: 'nuxt-feature-flags-release-fixture',
    version: baselineVersion,
    type: 'module',
    packageManager: 'pnpm@12.5.1',
  }))
  writeFileSync(join(repositoryDirectory, 'CHANGELOG.md'), `# Changelog\n\n## ${baselineVersion}\n\nHistorical release.\n`)
  const gitFixture = { repositoryDirectory, gitBinDirectory }
  runFixtureGit(gitFixture, ['init', '-q', '-b', 'main'])
  runFixtureGit(gitFixture, ['config', 'user.name', 'Release test'])
  runFixtureGit(gitFixture, ['config', 'user.email', 'release-test@example.com'])
  runFixtureGit(gitFixture, ['config', 'commit.gpgsign', 'false'])
  runFixtureGit(gitFixture, ['config', 'tag.gpgsign', 'false'])
  runFixtureGit(gitFixture, ['remote', 'add', 'origin', 'https://github.com/nicokempe/nuxt-feature-flags-module.git'])
  runFixtureGit(gitFixture, ['add', '.'])
  runFixtureGit(gitFixture, ['commit', '-qm', 'chore: seed baseline'])
  const baselineCommit = runFixtureGit(gitFixture, ['rev-parse', 'HEAD'])
  writeFileSync(join(repositoryDirectory, 'scripts/release/baseline.json'), JSON.stringify({ commit: baselineCommit, version: baselineVersion }))
  runFixtureGit(gitFixture, ['add', '.'])
  runFixtureGit(gitFixture, ['commit', '-qm', 'feat(flags): support isolated release checks'])
  runFixtureGit(gitFixture, ['commit', '--allow-empty', '-qm', 'chore(deps): refresh dependency versions'])
  return { temporaryDirectory, repositoryDirectory, gitBinDirectory, baselineCommit }
}

/**
 * Runs a local Git operation without exposing package manager executables.
 * @param fixture - Repository and restricted executable paths.
 * @param argumentsList - Arguments passed directly to Git.
 * @returns Trimmed standard output from the successful operation.
 */
function runFixtureGit(
  fixture: Pick<ReleaseFixture, 'repositoryDirectory' | 'gitBinDirectory'>,
  argumentsList: readonly string[],
): string {
  const commandResult = spawnSync('git', argumentsList, {
    cwd: fixture.repositoryDirectory,
    encoding: 'utf8',
    env: { ...process.env, PATH: fixture.gitBinDirectory },
  })
  equal(commandResult.status, 0, commandResult.stderr || commandResult.error?.message || 'Git did not exit successfully')
  return commandResult.stdout.trim()
}

/**
 * Runs the real release entry point with blocked fetch calls and no pnpm in PATH.
 * @param fixture - Disposable repository containing the release script.
 * @returns Captured status and output, with a deadline for unexpected hangs.
 */
function prepareRelease(fixture: ReleaseFixture): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [
    'scripts/release/prepare-release.ts',
    '--github-output', join(fixture.temporaryDirectory, 'outputs'),
    '--notes-file', join(fixture.temporaryDirectory, 'notes.md'),
  ], {
    cwd: fixture.repositoryDirectory,
    encoding: 'utf8',
    timeout: 30_000,
    env: {
      ...process.env,
      CI: 'true',
      PATH: fixture.gitBinDirectory,
      NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --import=${pathToFileURL(join(fixture.temporaryDirectory, 'block-network.mjs')).href}`,
    },
  })
}

/** Reads the version written by release preparation without assuming JSON types. */
function readPackageVersion(fixture: ReleaseFixture): string {
  const packageContents: unknown = JSON.parse(readFileSync(join(fixture.repositoryDirectory, 'package.json'), 'utf8'))
  ok(typeof packageContents === 'object' && packageContents !== null && 'version' in packageContents)
  ok(typeof packageContents.version === 'string')
  return packageContents.version
}

/** Parses scalar workflow outputs while preserving path values containing equals signs. */
function readWorkflowOutputs(fixture: ReleaseFixture): Record<string, string> {
  const outputValues: Record<string, string> = {}
  for (const outputLine of readFileSync(join(fixture.temporaryDirectory, 'outputs'), 'utf8').trim().split('\n')) {
    const separatorIndex = outputLine.indexOf('=')
    ok(separatorIndex > 0, `Invalid workflow output: ${outputLine}`)
    outputValues[outputLine.slice(0, separatorIndex)] = outputLine.slice(separatorIndex + 1)
  }
  return outputValues
}

test('prepares version, changelog, and notes offline without pnpm and resumes the tagged release unchanged', (): void => {
  const fixture = createFixture()
  try {
    deepEqual(readdirSync(fixture.gitBinDirectory), ['git'])
    const originalHead = runFixtureGit(fixture, ['rev-parse', 'HEAD'])
    const preparationResult = prepareRelease(fixture)
    equal(preparationResult.status, 0, preparationResult.stderr || preparationResult.error?.message)
    equal(preparationResult.stderr.includes('UNEXPECTED_RELEASE_NETWORK_REQUEST'), false)
    const workflowOutputs = readWorkflowOutputs(fixture)
    const releaseVersion = workflowOutputs.version
    ok(typeof releaseVersion === 'string' && parseReleaseVersion(releaseVersion))
    equal(parseReleaseVersion(releaseVersion)?.releaseNumber, 0)
    equal(workflowOutputs.should_commit, 'true')
    equal(workflowOutputs.previous_reference, fixture.baselineCommit)
    equal(workflowOutputs.release_notes_path, join(fixture.temporaryDirectory, 'notes.md'))
    equal(readPackageVersion(fixture), releaseVersion)
    equal(runFixtureGit(fixture, ['rev-parse', 'HEAD']), originalHead)
    equal(runFixtureGit(fixture, ['tag', '--list']), '')
    const generatedChangelog = readFileSync(join(fixture.repositoryDirectory, 'CHANGELOG.md'), 'utf8')
    const generatedNotes = readFileSync(join(fixture.temporaryDirectory, 'notes.md'), 'utf8')
    ok(generatedChangelog.includes(`## ${releaseVersion}\n`))
    match(generatedNotes, /isolated release checks/i)
    match(generatedNotes, /refresh dependency versions/i)
    equal(generatedNotes.includes('Historical release'), false)
    runFixtureGit(fixture, ['add', 'package.json', 'CHANGELOG.md'])
    runFixtureGit(fixture, ['commit', '-qm', `chore(release): ${releaseVersion}`])
    runFixtureGit(fixture, ['tag', '-a', releaseVersion, '-m', releaseVersion])
    writeFileSync(join(fixture.temporaryDirectory, 'outputs'), '')
    const resumeResult = prepareRelease(fixture)
    equal(resumeResult.status, 0, resumeResult.stderr || resumeResult.error?.message)
    equal(readWorkflowOutputs(fixture).should_commit, 'false')
    equal(readWorkflowOutputs(fixture).version, releaseVersion)
    equal(readFileSync(join(fixture.repositoryDirectory, 'CHANGELOG.md'), 'utf8'), generatedChangelog)
    equal(readFileSync(join(fixture.temporaryDirectory, 'notes.md'), 'utf8'), generatedNotes)
    equal(runFixtureGit(fixture, ['status', '--porcelain']), '')
  }
  finally {
    rmSync(fixture.temporaryDirectory, { recursive: true, force: true })
  }
})

test('fails before modifying release files when the installed Changelogen CLI is missing', (): void => {
  const fixture = createFixture()
  try {
    const originalChangelog = readFileSync(join(fixture.repositoryDirectory, 'CHANGELOG.md'), 'utf8')
    rmSync(join(fixture.repositoryDirectory, 'node_modules'))
    const preparationResult = prepareRelease(fixture)
    equal(preparationResult.status, 1)
    match(preparationResult.stderr, /[Cc]hangelogen.*missing|[Mm]issing.*[Cc]hangelogen/)
    match(preparationResult.stderr, /pnpm install --frozen-lockfile/)
    equal(readPackageVersion(fixture), baselineVersion)
    equal(readFileSync(join(fixture.repositoryDirectory, 'CHANGELOG.md'), 'utf8'), originalChangelog)
    equal(existsSync(join(fixture.temporaryDirectory, 'outputs')), false)
  }
  finally {
    rmSync(fixture.temporaryDirectory, { recursive: true, force: true })
  }
})

test('rejects a baseline commit outside the available history before changing release files', (): void => {
  const fixture = createFixture()
  try {
    writeFileSync(join(fixture.repositoryDirectory, 'scripts/release/baseline.json'), JSON.stringify({
      commit: '0'.repeat(40),
      version: baselineVersion,
    }))
    const preparationResult = prepareRelease(fixture)
    equal(preparationResult.status, 1)
    match(preparationResult.stderr, /not an ancestor of HEAD/)
    equal(readPackageVersion(fixture), baselineVersion)
    equal(existsSync(join(fixture.temporaryDirectory, 'outputs')), false)
  }
  finally {
    rmSync(fixture.temporaryDirectory, { recursive: true, force: true })
  }
})

test('rejects a release tag that disagrees with its package version', (): void => {
  const fixture = createFixture()
  try {
    runFixtureGit(fixture, ['tag', '-a', '2000.2.0', '-m', '2000.2.0'])
    const preparationResult = prepareRelease(fixture)
    equal(preparationResult.status, 1)
    match(preparationResult.stderr, /requires package version 2000\.2\.0, but found 2000\.1\.0/)
    equal(readPackageVersion(fixture), baselineVersion)
    equal(existsSync(join(fixture.temporaryDirectory, 'outputs')), false)
  }
  finally {
    rmSync(fixture.temporaryDirectory, { recursive: true, force: true })
  }
})

test('rejects multiple calendar release tags at HEAD', (): void => {
  const fixture = createFixture()
  try {
    runFixtureGit(fixture, ['tag', '-a', '2000.2.0', '-m', '2000.2.0'])
    runFixtureGit(fixture, ['tag', '-a', '2000.3.0', '-m', '2000.3.0'])
    const preparationResult = prepareRelease(fixture)
    equal(preparationResult.status, 1)
    match(preparationResult.stderr, /HEAD has multiple calendar release versions/)
    equal(readPackageVersion(fixture), baselineVersion)
    equal(existsSync(join(fixture.temporaryDirectory, 'outputs')), false)
  }
  finally {
    rmSync(fixture.temporaryDirectory, { recursive: true, force: true })
  }
})
