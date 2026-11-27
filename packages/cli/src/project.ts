import type { Dirent } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'

/**
 * What the CLI is allowed to know about the reader's project: its package.json,
 * the package manager it uses, and which files are worth reading. Every command
 * that looks at a project goes through here, so the detection rules live once.
 */

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export interface ProjectPackageJson {
  name?: string
  packageManager?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

export interface Project {
  /** The parsed package.json, or null when the directory has none. */
  packageJson: ProjectPackageJson | null
  /** Null when neither `packageManager` nor a lockfile names one. */
  packageManager: PackageManager | null
  /** What told us the package manager: the field, a lockfile, or nothing. */
  packageManagerSource: 'packageManager' | 'lockfile' | null
  /** The lockfile that decided it, relative to the project root. */
  lockfile: string | null
  /** Every dependency, whichever section it sits in. */
  dependencies: Record<string, string>
}

/** Lockfiles in the order they win: the first one found names the manager. */
const LOCKFILES: readonly { file: string, manager: PackageManager }[] = [
  { file: 'pnpm-lock.yaml', manager: 'pnpm' },
  { file: 'yarn.lock', manager: 'yarn' },
  { file: 'bun.lockb', manager: 'bun' },
  { file: 'bun.lock', manager: 'bun' },
  { file: 'package-lock.json', manager: 'npm' },
]

const MANAGERS = new Set<PackageManager>(['pnpm', 'npm', 'yarn', 'bun'])

/**
 * The folder a project command should work in: the nearest folder at or above
 * `cwd` that has a package.json. Run from `src/components`, the command still
 * finds the project's dependencies and writes next to its package.json. The
 * search stops before the home folder, and falls back to `cwd` when no
 * package.json is found.
 */
export async function findProjectRoot(cwd: string): Promise<string> {
  const start = resolve(cwd)
  const home = resolve(homedir())
  let dir = start
  while (dir !== home) {
    if (await exists(join(dir, 'package.json')))
      return dir
    const parent = dirname(dir)
    if (parent === dir)
      break
    dir = parent
  }
  return start
}

export async function readProject(cwd: string): Promise<Project> {
  const packageJson = await readPackageJson(cwd)
  const fromField = managerOfField(packageJson?.packageManager)
  if (fromField)
    return { packageJson, packageManager: fromField, packageManagerSource: 'packageManager', lockfile: null, dependencies: dependenciesOf(packageJson) }
  for (const candidate of LOCKFILES) {
    if (await exists(join(cwd, candidate.file)))
      return { packageJson, packageManager: candidate.manager, packageManagerSource: 'lockfile', lockfile: candidate.file, dependencies: dependenciesOf(packageJson) }
  }
  return { packageJson, packageManager: null, packageManagerSource: null, lockfile: null, dependencies: dependenciesOf(packageJson) }
}

/** `pnpm@9.12.0` names pnpm; anything else is not a manager this CLI knows. */
function managerOfField(value: string | undefined): PackageManager | null {
  const name = value?.split('@')[0]?.trim()
  return name && MANAGERS.has(name as PackageManager) ? name as PackageManager : null
}

export function dependenciesOf(packageJson: ProjectPackageJson | null): Record<string, string> {
  return {
    ...packageJson?.peerDependencies,
    ...packageJson?.devDependencies,
    ...packageJson?.dependencies,
  }
}

/** The flag that saves the version as written instead of as a `^` range. */
const EXACT_FLAG: Record<PackageManager, string> = { pnpm: '-E', npm: '-E', yarn: '-E', bun: '--exact' }

/**
 * The command that adds packages with the manager the project already uses. When
 * no manager could be detected the caller gets every form, because guessing one
 * would hand a reader a command their project cannot run.
 */
export function installCommands(manager: PackageManager | null, packages: readonly string[], options: { dev?: boolean, exact?: boolean } = {}): string[] {
  return managersFor(manager).map((candidate) => {
    const verb = candidate === 'npm' ? 'install' : 'add'
    const flags = [...(options.dev ? ['-D'] : []), ...(options.exact ? [EXACT_FLAG[candidate]] : [])]
    return [candidate, verb, ...flags, ...packages].join(' ')
  })
}

/** The command that installs what package.json already lists, as a fresh clone needs. */
export function installAllCommands(manager: PackageManager | null): string[] {
  return managersFor(manager).map(candidate => `${candidate} install`)
}

function managersFor(manager: PackageManager | null): PackageManager[] {
  return manager ? [manager] : ['pnpm', 'npm', 'yarn', 'bun']
}

/**
 * True when the range names one version and nothing else (`0.9.1`, `=0.9.1`),
 * as a project does when it pins its packages. A command that adds a package
 * next to it then saves that one exactly too.
 */
export function isExactPin(range: string | undefined): boolean {
  return range !== undefined && /^=?v?\d+\.\d+\.\d+(?:-[\w.]+)?$/.test(range.trim())
}

/**
 * Whether a package is on disk where Node would look for it from the project:
 * a `node_modules/<name>` folder in the project or a folder above it. Null under
 * Yarn Plug'n'Play, which keeps no such folder, so the answer is unknown.
 */
export async function isInstalledOnDisk(cwd: string, name: string): Promise<boolean | null> {
  let dir = resolve(cwd)
  while (true) {
    if (await exists(join(dir, 'node_modules', name, 'package.json')))
      return true
    if (await exists(join(dir, '.pnp.cjs')) || await exists(join(dir, '.pnp.js')))
      return null
    const parent = dirname(dir)
    if (parent === dir)
      return false
    dir = parent
  }
}

/** `^0.4.0`, `~1.2`, `0.4.0` and `v0.4.0` all answer with `0.4.0`. */
export function versionOf(range: string | undefined): string | null {
  const match = range ? /(\d+)\.(\d+)(?:\.(\d+))?/.exec(range) : null
  return match ? `${match[1]}.${match[2]}.${match[3] ?? '0'}` : null
}

export function compareVersions(a: string, b: string): number {
  const left = a.split('.').map(Number)
  const right = b.split('.').map(Number)
  for (let index = 0; index < 3; index++) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0)
    if (difference !== 0)
      return difference
  }
  return 0
}

/** Directories a project's own sources are never inside. */
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'dist', 'build', 'coverage', '.git', '.nuxt', '.output', '.next', '.turbo', 'vendor'])

/** Files the CLI reads when it looks for a stylesheet import or an old API name. */
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.css', '.scss', '.sass', '.pcss', '.html']

export interface SourceFile {
  /** Path relative to the project root, with `/` separators. */
  path: string
  text: string
}

/**
 * Reads the project's own source files once, skipping installed packages and
 * build output. Files larger than `MAX_FILE_BYTES` and lockfiles are left out,
 * so a generated bundle cannot dominate the report.
 */
export async function readSourceFiles(cwd: string, options: { limit?: number } = {}): Promise<SourceFile[]> {
  const limit = options.limit ?? 4000
  const files: SourceFile[] = []
  const pending: string[] = ['']
  while (pending.length > 0 && files.length < limit) {
    const relative = pending.shift()!
    const absolute = join(cwd, relative)
    let entries: Dirent[]
    try {
      entries = await readdir(absolute, { withFileTypes: true })
    }
    catch {
      continue
    }
    for (const entry of entries.sort(compareNames)) {
      if (entry.name.startsWith('.') && entry.name !== '.env')
        continue
      // A link can lead into a dependency or VCS tree the walk skips by name.
      if (entry.isSymbolicLink())
        continue
      const child = relative ? `${relative}/${entry.name}` : entry.name
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRECTORIES.has(entry.name))
          pending.push(child)
        continue
      }
      if (!SOURCE_EXTENSIONS.some(extension => entry.name.endsWith(extension)))
        continue
      const text = await readSmallText(join(cwd, child))
      if (text !== null)
        files.push({ path: child, text })
      if (files.length >= limit)
        break
    }
  }
  return files
}

/** Orders names by code point, so every machine and locale lists files the same way. */
export function compareNames(a: string | { name: string }, b: string | { name: string }): number {
  const left = typeof a === 'string' ? a : a.name
  const right = typeof b === 'string' ? b : b.name
  return left < right ? -1 : left > right ? 1 : 0
}

/** Lines of a file that match, one-based, for a report a reader can act on. */
export function findLines(file: SourceFile, matches: (line: string) => boolean): { path: string, line: number, text: string }[] {
  const hits: { path: string, line: number, text: string }[] = []
  for (const [index, text] of file.text.split('\n').entries()) {
    if (matches(text))
      hits.push({ path: file.path, line: index + 1, text: text.trim() })
  }
  return hits
}

const MAX_FILE_BYTES = 256 * 1024

async function readSmallText(path: string): Promise<string | null> {
  try {
    const info = await stat(path)
    if (info.size > MAX_FILE_BYTES)
      return null
    return await readFile(path, 'utf8')
  }
  catch {
    return null
  }
}

async function readPackageJson(cwd: string): Promise<ProjectPackageJson | null> {
  try {
    return JSON.parse(await readFile(join(cwd, 'package.json'), 'utf8')) as ProjectPackageJson
  }
  catch {
    return null
  }
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  }
  catch {
    return false
  }
}
