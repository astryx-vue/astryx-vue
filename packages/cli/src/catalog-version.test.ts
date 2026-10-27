import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { catalog } from './catalog.ts'

const repoRoot = process.cwd()

interface Manifest {
  name: string
  version: string
}

/**
 * The catalog stores each package's version so the CLI can print it. That copy
 * silently goes stale when changesets bumps a package: `generate:check` in CI is
 * the only other guard, and it fires after the release commit is already on main.
 * Version Packages runs `pnpm version-packages`, which regenerates the catalog;
 * this test catches a catalog that was not regenerated before the PR is merged.
 */
describe('catalog package versions', () => {
  it('matches every workspace package manifest', async () => {
    expect(catalog.packages.length).toBeGreaterThan(0)
    const mismatched: string[] = []
    for (const entry of catalog.packages) {
      const manifest = JSON.parse(await readFile(join(repoRoot, entry.directory, 'package.json'), 'utf8')) as Manifest
      if (manifest.version !== entry.version)
        mismatched.push(`${entry.name}: catalog ${entry.version}, package.json ${manifest.version}`)
    }
    expect(mismatched, 'catalog.json 里的版本和 package.json 不一致，跑 pnpm --filter @astryx-vue/cli generate').toEqual([])
  })
})
