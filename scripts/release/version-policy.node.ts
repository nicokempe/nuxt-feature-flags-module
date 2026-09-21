import { deepEqual, equal, throws } from 'node:assert/strict'
import { test } from 'node:test'
import {
  calculateNextReleaseVersion,
  formatReleaseVersion,
  parseReleaseVersion,
} from './version-policy.ts'

test('starts a new month at release zero', () => {
  const version = calculateNextReleaseVersion(
    ['2026.8.4'],
    '2026.8.4',
    new Date('2026-09-15T10:00:00Z'),
  )

  deepEqual(version, {
    year: 2026,
    month: 9,
    releaseNumber: 0,
    version: '2026.9.0',
  })
})

test('increments the current package version when it seeds the month', () => {
  const version = calculateNextReleaseVersion(
    [],
    '2026.9.0',
    new Date('2026-09-15T10:00:00Z'),
  )

  equal(version.version, '2026.9.1')
})

test('increments the greatest matching tag or package allocation', () => {
  const version = calculateNextReleaseVersion(
    ['2026.9.0', '2026.9.3', '2026.8.99', 'v2026.9.20', '2026.09.20', 'not-a-version'],
    '2026.9.2',
    new Date('2026-09-15T10:00:00Z'),
  )

  equal(version.version, '2026.9.4')
})

test('uses Europe/Berlin at a UTC month boundary', () => {
  const version = calculateNextReleaseVersion(
    ['2026.9.8'],
    '2026.9.8',
    new Date('2026-09-30T22:30:00Z'),
  )

  equal(version.version, '2026.10.0')
})

test('parses only the canonical release form', () => {
  deepEqual(parseReleaseVersion('2026.9.2'), { year: 2026, month: 9, releaseNumber: 2 })
  equal(parseReleaseVersion('2026.09.2'), null)
  equal(parseReleaseVersion('v2026.9.2'), null)
  equal(parseReleaseVersion('2026.9.02'), null)
})

test('formats one version for packages, tags, changelogs, and releases', () => {
  equal(formatReleaseVersion({ year: 2026, month: 11, releaseNumber: 0 }).version, '2026.11.0')
  throws(
    () => formatReleaseVersion({ year: 2026, month: 13, releaseNumber: 0 }),
    /between 1 and 12/,
  )
})
