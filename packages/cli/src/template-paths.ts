import type { Suggestion } from './error.ts'
import { existsSync, realpathSync, statSync } from 'node:fs'
import { homedir, tmpdir } from 'node:os'
import { basename, dirname, isAbsolute, join, parse, relative, resolve } from 'node:path'
import process from 'node:process'
import { CliError } from './error.ts'
import { pascalCase } from './generate/markdown.ts'
import { assertWithinProject, toPosix } from './paths.ts'
import { BINARY } from './spec.ts'

/**
 * `~` and `~/…` name the home folder, the way a shell reads them, never a
 * folder called `~` inside the project. Every other path comes back unchanged.
 */
export function homeRelativePath(value: string, home: string = homedir()): string {
  if (value === '~')
    return home
  if (value.startsWith('~/') || value.startsWith('~\\'))
    return join(home, value.slice(2))
  return value
}

function realOrSelf(path: string): string {
  try {
    return realpathSync(path)
  }
  catch {
    return path
  }
}

function isInside(target: string, root: string): boolean {
  const rel = relative(root, target)
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

/**
 * The system temp folders a scratch copy may go to: `os.tmpdir()`, and `/tmp`
 * on a POSIX system. A folder that is a disk's root or holds the home folder is
 * left out, so a misset `TMPDIR` cannot open the whole disk to scratch copies.
 * Each is compared as written and by its real location, because a write
 * follows links.
 */
export function tempFolders(): string[] {
  const home = resolve(homedir())
  const homes = [home, realOrSelf(home)]
  const kept = new Map<string, string>()
  for (const folder of [tmpdir(), ...(process.platform === 'win32' ? [] : ['/tmp'])]) {
    const written = resolve(folder)
    if (!existsSync(written))
      continue
    const forms = [written, realOrSelf(written)]
    if (forms.some(form => form === parse(form).root || homes.some(owner => isInside(owner, form) || owner === form)))
      continue
    if (!kept.has(forms[1]!))
      kept.set(forms[1]!, written)
  }
  return [...kept.values()]
}

/** The temp folder that holds the absolute path `target`, or null. */
export function tempFolderOf(target: string): string | null {
  const absolute = resolve(target)
  return tempFolders().find(folder => isInside(absolute, folder) || isInside(absolute, realOrSelf(folder))) ?? null
}

/** The nearest folder at or above `dir` that exists. */
function nearestFolder(dir: string): string {
  let at = dir
  while (!isFolder(at) && dirname(at) !== at)
    at = dirname(at)
  return at
}

function isFolder(dir: string): boolean {
  try {
    return statSync(dir).isDirectory()
  }
  catch {
    return false
  }
}

/** A command argument, quoted only when the shell would read it differently. */
function quoteArgument(value: string): string {
  return /^[\w./@:+=%-]+$/.test(value) ? value : `'${value.replace(/'/g, `'\\''`)}'`
}

/**
 * Where a copy goes when the caller names no place: `src/pages/<Name>.vue`, or
 * the first `<Name>2.vue`, `<Name>3.vue` that does not exist yet, so the command
 * that names it runs as printed.
 */
export function templateDestination(cwd: string, slug: string): string {
  const name = pascalCase(slug)
  let rel = `src/pages/${name}.vue`
  for (let n = 2; existsSync(join(cwd, rel)); n++)
    rel = `src/pages/${name}${n}.vue`
  return rel
}

/**
 * Where a copy lands. A path that ends in a file extension, or that already
 * names a file, is the file itself; anything else is a directory that receives
 * `<PascalCaseSlug>.vue`.
 */
export function targetFileFor(input: string, cwd: string, slug: string): string {
  if (!input.trim())
    throw new CliError('Pass a file or directory to write the template into.', 'ERR_MISSING_ARGUMENT', 2)
  const typed = homeRelativePath(input)
  const resolved = resolve(cwd, typed)
  const directoryLike = typed.endsWith('/') || typed.endsWith('\\') || (existsSync(resolved) && statSync(resolved).isDirectory())
  if (directoryLike)
    return join(resolved, `${pascalCase(slug)}.vue`)
  const fileName = basename(resolved)
  if (existsSync(resolved) && statSync(resolved).isFile())
    return resolved
  if (/\.[A-Z0-9]+$/i.test(fileName))
    return resolved
  return join(resolved, `${pascalCase(slug)}.vue`)
}

/**
 * The folder a scratch copy goes under when `outputFile` is an absolute path in
 * a system temp folder, or null for every other path. A link that carries the
 * copy out of the temp folder is refused, as a link out of the project is.
 */
export function scratchFolderFor(outputFile: string, input: string): string | null {
  if (!isAbsolute(homeRelativePath(input)))
    return null
  const folder = tempFolderOf(outputFile)
  if (!folder)
    return null
  assertWithinProject(outputFile, folder)
  return folder
}

interface Refusal {
  /** The path as the caller typed it. */
  given: string
  /** The file the copy would write, or null when only the guard ran. */
  file: string | null
  cwd: string
  /** The command that selects this template, without a path. */
  command: string
  overwrite: boolean
}

/**
 * A path outside the project and the temp folder has nothing to write. The
 * refusal names a place inside the project, the same path run from its own
 * folder, and the print that writes nothing.
 */
export function outsideProjectRefusal({ given, file, cwd, command, overwrite }: Refusal, slug: string): CliError {
  const [scratch] = tempFolders()
  const target = file ?? resolve(cwd, homeRelativePath(given))
  const where = scratch
    ? `The template is written only inside the project, or as a scratch copy in the system temp folder (${scratch}). Give a path inside one, or print the source.`
    : 'The template is written only inside the project. Give a path inside it, or print the source.'
  const suggestions: Suggestion[] = [
    { name: `${command} ${destinationArgument(cwd, slug)}`, reason: 'write the page inside the project' },
  ]
  const dir = nearestFolder(dirname(target))
  if (dirname(dir) !== dir) {
    const path = `./${toPosix(relative(dir, target))}`
    const sameWrite = `${command} ${quoteArgument(path)}${overwrite ? ' --overwrite' : ''}`
    suggestions.push({ name: `cd ${quoteArgument(dir)} && ${sameWrite}`, reason: 'write the page where you named it, from its folder' })
  }
  suggestions.push({ name: command, reason: 'print the source and write nothing' })
  return new CliError(
    `Invalid template target path "${given}": it is outside the project root (${resolve(cwd)}). ${where}`,
    'ERR_PATH_TRAVERSAL',
    2,
    suggestions,
  )
}

function destinationArgument(cwd: string, slug: string): string {
  return quoteArgument(templateDestination(cwd, slug))
}

/**
 * Guards every argument that looks like a path before a template lookup runs, so
 * `template ../../etc` reports the traversal instead of an unknown slug. An
 * absolute path in the system temp folder is a scratch copy and passes. When a
 * template name came first, the refusal names the commands that do work.
 */
export function guardPathArguments(positionals: readonly string[], cwd: string, overwrite = false): void {
  const [name, target] = positionals
  for (const value of positionals) {
    if (!looksLikePath(value))
      continue
    const typed = homeRelativePath(value)
    const absolute = resolve(cwd, typed)
    try {
      assertWithinProject(absolute, cwd)
    }
    catch (error) {
      if (!(error instanceof CliError))
        throw error
      if (isAbsolute(typed) && tempFolderOf(absolute)) {
        scratchFolderFor(absolute, value)
        continue
      }
      if (name !== undefined && value === target && !looksLikePath(name) && !isThroughLink(absolute, cwd))
        throw outsideProjectRefusal({ given: value, file: null, cwd, command: `${BINARY} template ${name}`, overwrite }, name)
      throw error
    }
  }
}

/** Whether the path is lexically inside the project but a link carries it out. */
function isThroughLink(target: string, cwd: string): boolean {
  const rel = relative(resolve(cwd), resolve(target))
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

function looksLikePath(value: string): boolean {
  return value.includes('/') || value.includes('\\') || value === '.' || value === '..' || value.startsWith('..') || value === '~'
}
