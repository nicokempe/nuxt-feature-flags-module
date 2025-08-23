// .github/scripts/publish.mjs
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', cwd: repoRoot, shell: false, ...opts })
  if (result.status !== 0) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
}

const pkgPath = path.join(repoRoot, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const v = pkg.version

if (!/^\d{4}\.\d{1,2}\.\d+$/.test(v)) {
  console.error(`Invalid version: ${v}`)
  process.exit(1)
}

// Stage files
run('git', ['add', 'CHANGELOG.md', 'package.json'])

// Commit (no shell quoting problems here)
run('git', ['commit', '-m', `chore(release): v${v}`])

// Tag
run('git', ['tag', `v${v}`])

// Publish to npm
run('npm', ['publish'])

// Push commit & tags
run('git', ['push', '--follow-tags'])
