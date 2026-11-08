import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('ssr', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/basic', import.meta.url)),
  })

  it('renders the index page', async () => {
    // Get response to a server-rendered page with `$fetch`.
    const html = await $fetch('/')
    expect(html).toContain('<div>basic</div>')
  })

  it('evaluates configured feature flags during SSR', async () => {
    const html = await $fetch<string>('/')
    expect(html).toMatch(/<p>\s*Enabled feature\s*<\/p>/)
    expect(html).toMatch(/<p>\s*Wildcard feature\s*<\/p>/)
    expect(html).not.toMatch(/<p>\s*Disabled feature\s*<\/p>/)
  })

  it('evaluates feature flags in a server handler', async () => {
    const flags = await $fetch('/api/flags')
    expect(flags).toEqual({ enabled: true, wildcard: true, disabled: false })
  })
})
