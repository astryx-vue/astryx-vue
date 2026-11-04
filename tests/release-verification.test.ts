import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { verificationPackages } from '../scripts/release-verification.mjs'

const root = process.cwd()

function currentVersion(name: string): string {
  return JSON.parse(readFileSync(join(root, 'packages', name, 'package.json'), 'utf8')).version
}

describe('verificationPackages', () => {
  it('keeps a current public package in the checks even when Changesets omits it', () => {
    const coreVersion = currentVersion('core')
    const packages = verificationPackages(root, [{ name: '@astryx-vue/core', version: coreVersion }])
    const richtext = packages.find(pkg => pkg.name === '@astryx-vue/richtext')

    expect(richtext).toMatchObject({ version: currentVersion('richtext'), reported: false })
    expect(packages.find(pkg => pkg.name === '@astryx-vue/core')).toMatchObject({ version: coreVersion, reported: true })
  })

  it('also retains a reported version that is no longer in the current manifest', () => {
    const packages = verificationPackages(root, [{ name: '@astryx-vue/core', version: '0.0.0-test' }])

    expect(packages.find(pkg => pkg.name === '@astryx-vue/core' && pkg.version === '0.0.0-test')?.reported).toBe(true)
    expect(packages.some(pkg => pkg.name === '@astryx-vue/core' && pkg.version === currentVersion('core'))).toBe(true)
  })
})
