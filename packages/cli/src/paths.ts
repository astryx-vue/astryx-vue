import { existsSync, realpathSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { CliError } from './error.ts'

/**
 * Rejects a path that resolves outside the project root, including through a
 * symlinked directory that already exists. Every write this CLI performs lands
 * inside the project it was pointed at, and nowhere else.
 */
export function assertWithinProject(target: string, cwd: string): void {
  const root = resolve(cwd)
  const resolvedTarget = resolve(target)
  const rel = relative(root, resolvedTarget)
  if (rel !== '' && (rel.startsWith('..') || isAbsolute(rel)))
    throw outsideProject(resolvedTarget)

  let existing = dirname(resolvedTarget)
  while (!existsSync(existing) && dirname(existing) !== existing)
    existing = dirname(existing)
  try {
    const realRel = relative(realpathSync(root), realpathSync(existing))
    if (realRel !== '' && (realRel.startsWith('..') || isAbsolute(realRel)))
      throw outsideProject(realpathSync(existing))
  }
  catch (error) {
    if (error instanceof CliError)
      throw error
  }
}

export function toPosix(value: string): string {
  return value.split('\\').join('/')
}

function outsideProject(path: string): CliError {
  return new CliError(
    `${path} is outside the project directory. Pass a path inside the project.`,
    'ERR_PATH_TRAVERSAL',
    2,
  )
}
