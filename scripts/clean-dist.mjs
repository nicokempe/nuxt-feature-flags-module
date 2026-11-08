import { rmSync } from 'node:fs'

// Remove development stub symlinks before the builder writes production files.
rmSync(new URL('../dist', import.meta.url), { recursive: true, force: true })
