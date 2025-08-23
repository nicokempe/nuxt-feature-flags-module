import { readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..', '..')

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd: repoRoot, shell: false, ...opts })
  if (res.status !== 0) throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
}

function runGet(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { cwd: repoRoot, shell: false, encoding: 'utf8', ...opts })
  if (res.status !== 0) throw new Error(`Command failed: ${cmd} ${args.join(' ')}\n${res.stderr || ''}`)
  return (res.stdout || '').trim()
}

const pkgPath = path.join(repoRoot, 'package.json')
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
const v = pkg.version

if (!/^\d{4}\.\d{1,2}\.\d+$/.test(v)) {
  console.error(`Invalid version: ${v}`)
  process.exit(1)
}

// Sanity: ensure dist exists & will be published
if (!existsSync(path.join(repoRoot, 'dist'))) {
  console.error('dist/ not found. Did you run prepack?')
  process.exit(1)
}

// Show useful context
try {
  const who = runGet('npm', ['whoami'])
  const reg = runGet('npm', ['config', 'get', 'registry'])
  console.log(`[publish] npm user: ${who}`)
  console.log(`[publish] registry: ${reg}`)
}
catch {
  console.error('[publish] Not logged into npm. Run `npm login` or configure an auth token.')
  process.exit(1)
}

// Stage + commit
run('git', ['add', 'CHANGELOG.md', 'package.json'])
run('git', ['commit', '-m', `chore(release): v${v}`])

// Tag (fail early if tag already exists)
const existingTag = runGet('git', ['tag', '-l', `v${v}`])
if (existingTag === `v${v}`) {
  console.error(`[publish] Git tag v${v} already exists. Bump version and retry.`)
  process.exit(1)
}
run('git', ['tag', `v${v}`])

// Build publish args
const publishArgs = ['publish', '--access', 'public']
if (process.env.NPM_OTP && process.env.NPM_OTP.trim()) {
  publishArgs.push('--otp', process.env.NPM_OTP.trim())
}
if (process.env.NPM_TAG && process.env.NPM_TAG.trim()) {
  publishArgs.push('--tag', process.env.NPM_TAG.trim())
}

// Publish (with one retry if OTP was missing)
try {
  run('npm', publishArgs)
}
catch (e) {
  const msg = String(e?.message || '')
  // Common EOTP / 2FA error string
  if (/otp|one[-\s]?time|EOTP/i.test(msg) && !process.env.NPM_OTP) {
    console.error('[publish] 2FA required. Set NPM_OTP=<code> and rerun release.')
    process.exit(1)
  }
  // Version already exists
  if (/cannot publish over|EPUBLISHCONFLICT|You cannot publish over/i.test(msg)) {
    console.error(`[publish] Version ${v} already exists on npm. Bump version and retry.`)
    process.exit(1)
  }
  throw e
}

// Push commit & tags
run('git', ['push', '--follow-tags'])

console.log(`[publish] Success: v${v}`)
