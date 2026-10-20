import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, describe, expect, it } from 'vitest'
import { listPublicPackages } from '../scripts/list-public-packages.mjs'

const tempRoots: string[] = []

function makeRepo(packages: Record<string, object | null>) {
  const root = mkdtempSync(join(tmpdir(), 'list-public-packages-'))
  tempRoots.push(root)
  for (const [dir, manifest] of Object.entries(packages)) {
    mkdirSync(join(root, 'packages', dir), { recursive: true })
    if (manifest)
      writeFileSync(join(root, 'packages', dir, 'package.json'), JSON.stringify(manifest))
  }
  return root
}

afterEach(() => {
  for (const root of tempRoots.splice(0))
    rmSync(root, { recursive: true, force: true })
})

describe('listPublicPackages', () => {
  it('lists every non-private package in packages/, sorted', () => {
    const root = makeRepo({
      'themes': { name: '@x/themes' },
      'cli': { name: '@x/cli' },
      'internal': { name: '@x/internal', private: true },
      'no-manifest': null,
    })
    expect(listPublicPackages(root)).toEqual(['cli', 'themes'])
  })

  it('covers every package this repo publishes', () => {
    expect(listPublicPackages()).toEqual(['cli', 'core', 'themes'])
  })
})

describe('release workflow', () => {
  const workflow = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../.github/workflows/release.yml'), 'utf8')

  it('publishes to GitHub Packages from the shared package list, not a hard-coded one', () => {
    expect(workflow).toContain('node ./scripts/list-public-packages.mjs')
    expect(workflow).not.toMatch(/for \w+ in core themes/)
  })
})
