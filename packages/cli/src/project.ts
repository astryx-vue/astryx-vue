import type { Dirent } from 'node:fs'
import { readdir, readFile, stat } from 'node:fs/promises'
import { join } from 'node:path'

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

/**
 * The command that adds packages with the manager the project already uses. When
 * no manager could be detected the caller gets every form, because guessing one
 * would hand a reader a command their project cannot run.
 */
export function installCommands(manager: PackageManager | null, packages: readonly string[], options: { dev?: boolean } = {}): string[] {
  const managers: PackageManager[] = manager ? [manager] : ['pnpm', 'npm', 'yarn', 'bun']
  return managers.map((candidate) => {
    const verb = candidate === 'npm' ? 'install' : 'add'
    return [candidate, verb, ...(options.dev ? ['-D'] : []), ...packages].join(' ')
  })
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
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '.vue', '.css', '.scss', '.sass', '.pcss']

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
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (entry.name.startsWith('.') && entry.name !== '.env')
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
