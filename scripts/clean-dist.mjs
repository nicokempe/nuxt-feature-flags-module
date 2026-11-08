import { existsSync, lstatSync, rmSync, unlinkSync } from 'node:fs'

// Remove development stub symlinks before the builder writes production files.
const distDirectory = new URL('../dist', import.meta.url)
const runtimeDirectory = new URL('../dist/runtime', import.meta.url)

if (existsSync(distDirectory) && lstatSync(distDirectory).isSymbolicLink()) {
  unlinkSync(distDirectory)
}
else {
  if (existsSync(runtimeDirectory) && lstatSync(runtimeDirectory).isSymbolicLink()) {
    unlinkSync(runtimeDirectory)
  }
  rmSync(distDirectory, { recursive: true, force: true })
}

if (existsSync(distDirectory)) {
  throw new Error('Cannot clean dist safely before building the package.')
}
