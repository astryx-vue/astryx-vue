import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PACKAGE_NAME } from '../spec.ts'
import { discoverPackages, importPathFor, installablePackageNames, ownerOf, packageOfSpecifier } from './packages.ts'

interface FakePackage {
  /** Directory under `packages/`. */
  dir: string
  name: string
  exports?: Record<string, string>
  /** Component directories or `.vue` files to create under `src/`. */
  sources?: string[]
  /** Leave `src/` out entirely, which is what the themes package looks like. */
  noSrc?: boolean
  canaryOnly?: boolean
  /** `private: true` means npm has no version of it, so nothing may install it. */
  private?: boolean
}

async function scaffold(packages: readonly FakePackage[]): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), 'astryx-vue-packages-'))
  for (const pkg of packages) {
    const dir = join(root, 'packages', pkg.dir)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'package.json'), `${JSON.stringify({
      name: pkg.name,
      exports: pkg.exports ?? { '.': './dist/index.js' },
      ...(pkg.private ? { private: true } : {}),
      ...(pkg.canaryOnly ? { astryxVue: { canaryOnly: true } } : {}),
    }, null, 2)}\n`)
    if (pkg.noSrc)
      continue
    await mkdir(join(dir, 'src'), { recursive: true })
    for (const source of pkg.sources ?? []) {
      if (source.endsWith('.vue')) {
        await writeFile(join(dir, 'src', source), '<template><div /></template>\n')
        continue
      }
      await mkdir(join(dir, 'src', source), { recursive: true })
      await writeFile(join(dir, 'src', source, 'index.ts'), 'export {}\n')
    }
    await writeFile(join(dir, 'src', 'index.ts'), 'export {}\n')
  }
  return root
}

const REPO: readonly FakePackage[] = [
  {
    dir: 'core',
    name: '@acme/core',
    exports: { '.': './src/index.ts', './Button': './src/Button/index.ts', './icons': './src/icons/index.ts' },
    sources: ['Button', 'ChatLayout.vue', 'color.ts'],
  },
  {
    dir: 'lab',
    name: '@acme/lab',
    exports: { '.': './src/index.ts' },
    sources: ['InfoTip'],
    canaryOnly: true,
    private: true,
  },
  { dir: 'themes', name: '@acme/themes', exports: { './*.css': './*.css' }, noSrc: true },
  { dir: 'cli', name: PACKAGE_NAME, exports: { '.': './dist/index.js' }, sources: ['CommandPalette'] },
]

describe('workspace packages', () => {
  it('reads every package except the CLI, in core-first order', async () => {
    const root = await scaffold(REPO)
    try {
      const packages = await discoverPackages(root)
      expect(packages.map(pkg => pkg.name)).toEqual(['@acme/core', '@acme/lab', '@acme/themes'])
      const core = packages[0]!
      // Only PascalCase subpaths are components; `./icons` is a helper sheet.
      expect(core.componentExports).toEqual(['./Button'])
      expect(core.componentSources).toEqual(['Button', 'ChatLayout'])
      expect(core.directory).toBe('packages/core')
      expect(core.canary).toBe(false)
      expect(packages[1]?.canary).toBe(true)
      // A private package is not on npm, so it is not installable either.
      expect(packages.map(pkg => pkg.published)).toEqual([true, false, true])
      // Themes ship CSS only, so they offer no components and no src directory.
      expect(packages[2]?.componentSources).toEqual([])
    }
    finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('names the package that owns a component and where it is imported from', async () => {
    const root = await scaffold(REPO)
    try {
      const packages = await discoverPackages(root)
      const button = ownerOf('Button', packages)
      expect(button?.name).toBe('@acme/core')
      expect(importPathFor('Button', button!)).toBe('@acme/core/Button')
      // Lab exports everything from its root, so the page imports the package itself.
      const infoTip = ownerOf('InfoTip', packages)
      expect(infoTip?.name).toBe('@acme/lab')
      expect(importPathFor('InfoTip', infoTip!)).toBe('@acme/lab')
      expect(ownerOf('UseClipboard', packages)).toBeNull()
    }
    finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('reads which package an import specifier points into', async () => {
    const root = await scaffold(REPO)
    try {
      const packages = await discoverPackages(root)
      expect(packageOfSpecifier('@acme/core/Button', packages)?.name).toBe('@acme/core')
      expect(packageOfSpecifier('@acme/lab', packages)?.name).toBe('@acme/lab')
      expect(packageOfSpecifier('@acme/core-extras/Button', packages)).toBeNull()
      expect(packageOfSpecifier('vue', packages)).toBeNull()
    }
    finally {
      await rm(root, { recursive: true, force: true })
    }
  })

  it('calls only vue and the published packages installable', async () => {
    const root = await scaffold(REPO)
    try {
      const packages = await discoverPackages(root)
      expect([...installablePackageNames(packages)].sort()).toEqual(['@acme/core', '@acme/themes', 'vue'])
    }
    finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
