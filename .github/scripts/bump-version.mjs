import fs from 'node:fs'

const packageJsonPath = new URL('../package.json', import.meta.url)
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1 // 0-based → 1–12

const [yearStr, monthStr, versionStr] = pkg.version.split('.')
const year = Number(yearStr)
const month = Number(monthStr)
let version = Number(versionStr)

if (year === currentYear && month === currentMonth) {
  // Same year & month → bump patch
  version++
}
else {
  // Year or month changed → reset patch
  version = 0
}

const newVersion = `${currentYear}.${currentMonth}.${version}`
pkg.version = newVersion

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n')

console.log(`Version bumped to ${newVersion}`)
