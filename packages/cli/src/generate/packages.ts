import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { CORE_PACKAGE, PACKAGE_NAME } from '../spec.ts'

/**
 * One workspace package the docs site can document. The CLI reads every package
 * on disk once per build, so a new package needs no change here.
 */
export interface WorkspacePackage {
  name: string
  /** Repo-relative directory, e.g. `packages/core`. */
  directory: string
  version: string
  description: string
  /** PascalCase subpath exports, such as `./Button`. A package without them exports its components from its root. */
  componentExports: string[]
  /** Component names that have their own directory or `.vue` file under `src/`. */
  componentSources: string[]
  /** True when the package is published only under the `canary` dist-tag. */
  canary: boolean
}

/** The CLI ships the tool, not components, so no docs page can belong to it. */
const NOT_A_COMPONENT_PACKAGE = new Set([PACKAGE_NAME])

/** A subpath export that names a component, not a helper: `./Button` yes, `./icons` no. */
const COMPONENT_EXPORT = /^\.\/[A-Z][A-Za-z0-9]*$/

/**
 * Reads every package under `packages/` and what it offers, which is what tells
 * a docs page whether it documents a core component, a lab one, or a chart.
 */
export async function discoverPackages(repoRoot: string): Promise<WorkspacePackage[]> {
  const packagesDir = join(repoRoot, 'packages')
  const directories = (await readdir(packagesDir, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
  const packages: WorkspacePackage[] = []
  for (const directory of directories) {
    const manifest = await readManifest(join(packagesDir, directory, 'package.json'))
    if (!manifest || NOT_A_COMPONENT_PACKAGE.has(manifest.name))
      continue
    packages.push({
      name: manifest.name,
      directory: `packages/${directory}`,
      version: manifest.version,
      description: manifest.description,
      componentExports: manifest.exports.filter(key => COMPONENT_EXPORT.test(key)),
      componentSources: await readComponentSources(join(packagesDir, directory, 'src')),
      canary: manifest.canaryOnly,
    })
  }
  // Core defines the design system, so it heads every list a reader scans.
  return packages.sort((a, b) => Number(b.name === CORE_PACKAGE) - Number(a.name === CORE_PACKAGE) || a.name.localeCompare(b.name))
}

/** The package an import specifier points into, or null when it is not ours. */
export function packageOfSpecifier(specifier: string, packages: readonly WorkspacePackage[]): WorkspacePackage | null {
  return packages.find(pkg => specifier === pkg.name || specifier.startsWith(`${pkg.name}/`)) ?? null
}

/**
 * The package that owns a component: the one that exports it by name, else the
 * one that has a source entry for it. Null when no package claims it, which is
 * how composables are documented today.
 */
export function ownerOf(componentName: string, packages: readonly WorkspacePackage[]): WorkspacePackage | null {
  return packages.find(pkg => pkg.componentExports.includes(`./${componentName}`))
    ?? packages.find(pkg => pkg.componentSources.includes(componentName))
    ?? null
}

/** The specifier a reader imports the component from: its own subpath when the package has one. */
export function importPathFor(componentName: string, pkg: WorkspacePackage): string {
  return pkg.componentExports.includes(`./${componentName}`) ? `${pkg.name}/${componentName}` : pkg.name
}

/**
 * Every package name a project can install from npm. A template that imports
 * anything else asks for a package the reader does not have.
 */
export function installablePackageNames(packages: readonly WorkspacePackage[]): Set<string> {
  return new Set(['vue', ...packages.map(pkg => pkg.name)])
}

interface Manifest {
  name: string
  version: string
  description: string
  exports: string[]
  canaryOnly: boolean
}

async function readManifest(path: string): Promise<Manifest | null> {
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  }
  catch {
    return null
  }
  const parsed = JSON.parse(raw) as { name?: string, version?: string, description?: string, exports?: Record<string, unknown>, astryxVue?: { canaryOnly?: boolean } }
  if (!parsed.name)
    return null
  return {
    name: parsed.name,
    version: parsed.version ?? '0.0.0',
    description: parsed.description ?? '',
    exports: Object.keys(parsed.exports ?? {}),
    canaryOnly: parsed.astryxVue?.canaryOnly === true,
  }
}

/**
 * Component entry points under `src/`: a PascalCase directory (`src/InfoTip/`) or
 * a PascalCase `.vue` file. Lowercase files are helpers such as `color.ts`.
 * A package with no `src/` (themes are CSS only) offers no components.
 */
async function readComponentSources(srcDir: string): Promise<string[]> {
  let entries
  try {
    entries = await readdir(srcDir, { withFileTypes: true })
  }
  catch (error) {
    if (isMissing(error))
      return []
    throw error
  }
  return entries
    .map(entry => entry.name.replace(/\.vue$/, ''))
    .filter(name => /^[A-Z][A-Za-z0-9]*$/.test(name))
    .sort()
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
