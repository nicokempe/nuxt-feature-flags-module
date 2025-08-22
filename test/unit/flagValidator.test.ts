import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { validateFeatureFlags } from '../../src/runtime/utils/flagValidator'

let dir: string

beforeEach(async (): Promise<void> => {
  dir = await mkdtemp(join(tmpdir(), 'ff-'))
})

afterEach(async (): Promise<void> => {
  // cleanup automatically by tmpdir removal on container end
})

describe('flagValidator', (): void => {
  it('warns on missing flags in warn mode', async (): Promise<void> => {
    const file: string = join(dir, 'test.ts')
    await writeFile(file, 'isEnabled(\'missing\')')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await validateFeatureFlags({
      environment: 'prod',
      flagSets: { prod: [] },
      validation: { mode: 'warn', includeGlobs: ['**/*.ts'], excludeGlobs: [] },
    }, dir)
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('throws on missing flags in error mode', async (): Promise<void> => {
    const file: string = join(dir, 'test2.ts')
    await writeFile(file, 'isEnabled(\'missing\')')
    await expect(validateFeatureFlags({
      environment: 'prod',
      flagSets: { prod: [] },
      validation: { mode: 'error', includeGlobs: ['**/*.ts'], excludeGlobs: [] },
    }, dir)).rejects.toThrow()
  })

  it('supports wildcard declarations', async (): Promise<void> => {
    const file: string = join(dir, 'wild.ts')
    await writeFile(file, 'isEnabled(\'solutions/company-portal/addons/sales\')')
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation((): void => {})
    await validateFeatureFlags({
      environment: 'prod',
      flagSets: { prod: ['solutions/*'] },
      validation: { mode: 'warn', includeGlobs: ['**/*.ts'], excludeGlobs: [] },
    }, dir)
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('warns when root wildcard is used', async (): Promise<void> => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation((): void => {})
    await validateFeatureFlags({
      environment: 'prod',
      flagSets: { prod: ['*'] },
      validation: { mode: 'warn', includeGlobs: ['**/*.ts'], excludeGlobs: [] },
    }, dir)
    expect(warnSpy).toHaveBeenCalled()
    warnSpy.mockRestore()
  })
})
