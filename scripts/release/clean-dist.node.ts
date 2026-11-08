import { equal } from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

/** Paths for an isolated repository and its copied distribution cleaner. */
interface CleanerFixture {
  readonly temporaryDirectory: string
  readonly repositoryDirectory: string
  readonly cleanerPath: string
}

/** Creates a disposable repository with the actual cleaner entry point. */
function createFixture(): CleanerFixture {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'nuxt-feature-flags-clean-'))
  const repositoryDirectory = join(temporaryDirectory, 'repository')
  const cleanerPath = join(repositoryDirectory, 'scripts/clean-dist.mjs')
  mkdirSync(dirname(cleanerPath), { recursive: true })
  copyFileSync(join(repositoryRoot, 'scripts/clean-dist.mjs'), cleanerPath)
  return { temporaryDirectory, repositoryDirectory, cleanerPath }
}

for (const scenario of ['runtime stub', 'root distribution symlink', 'absent distribution'] as const) {
  test(`cleans ${scenario} from outside the repository without changing source files`, (): void => {
    const fixture = createFixture()
    try {
      const distDirectory = join(fixture.repositoryDirectory, 'dist')
      const preservedDirectory = scenario === 'root distribution symlink'
        ? join(fixture.temporaryDirectory, 'external')
        : join(fixture.repositoryDirectory, 'src/runtime')
      const sentinelPath = join(preservedDirectory, 'sentinel.ts')
      const sentinelContents = 'export const preserved = true\n'
      mkdirSync(preservedDirectory, { recursive: true })
      writeFileSync(sentinelPath, sentinelContents)
      if (scenario === 'runtime stub') {
        mkdirSync(distDirectory)
        symlinkSync(preservedDirectory, join(distDirectory, 'runtime'))
      }
      else if (scenario === 'root distribution symlink') {
        symlinkSync(preservedDirectory, distDirectory)
      }
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const result = spawnSync(process.execPath, [fixture.cleanerPath], {
          cwd: fixture.temporaryDirectory,
          encoding: 'utf8',
          timeout: 10_000,
        })
        equal(result.status, 0, result.stderr || result.error?.message)
        equal(existsSync(distDirectory), false)
        equal(readFileSync(sentinelPath, 'utf8'), sentinelContents)
      }
    }
    finally {
      rmSync(fixture.temporaryDirectory, { recursive: true, force: true })
    }
  })
}
