import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateFeatureFlags } from '../../src/runtime/utils/flagValidator'

let dir: string

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'ff-'))
})

afterEach(async () => {
  // cleanup automatically by tmpdir removal on container end
})

describe('flagValidator', () => {
  it('warns on missing flags in warn mode', async () => {
    const file = join(dir, 'test.ts')
    await writeFile(file, 'isEnabled(\'missing\')')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await validateFeatureFlags({
      environment: 'prod',
      flags: { prod: [] },
      validation: { mode: 'warn', includeGlobs: ['**/*.ts'], excludeGlobs: [] },
    }, dir)
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('throws on missing flags in error mode', async () => {
    const file = join(dir, 'test2.ts')
    await writeFile(file, 'isEnabled(\'missing\')')
    await expect(validateFeatureFlags({
      environment: 'prod',
      flags: { prod: [] },
      validation: { mode: 'error', includeGlobs: ['**/*.ts'], excludeGlobs: [] },
    }, dir)).rejects.toThrow()
  })
})
