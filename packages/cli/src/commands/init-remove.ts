import type { CommandArgs } from '../cli/context.ts'
import { existsSync } from 'node:fs'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { AGENT_DOC_CANDIDATES, removeManagedBlock } from '../agents.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { assertWithinProject, toPosix } from '../paths.ts'
import { BINARY } from '../spec.ts'

/** What `init --remove-agents` did to one agent file: `removed` took the block out, `deleted` also deleted the file the block left empty. */
export type RemoveAction = 'removed' | 'deleted'

export interface RemovedFile {
  path: string
  action: RemoveAction
}

/**
 * `init --remove-agents`: takes the managed block out of the agent files at the
 * project root (or out of the one file `--agent-docs-path` names). A file with
 * nothing else in it is deleted; any other text in a file stays as it is.
 */
export async function removeAgentBlocks(args: CommandArgs): Promise<string> {
  if (args.options.features !== undefined || args.options.agent !== undefined)
    throw new CliError('--remove-agents does not combine with --features or --agent.', 'ERR_INVALID_ARGUMENT', 2)
  const targets = agentDocTargets(args)
  const files: RemovedFile[] = []
  for (const target of targets) {
    const absolute = resolve(args.cwd, target)
    assertWithinProject(absolute, args.cwd)
    if (!existsSync(absolute))
      continue
    const remainder = removeManagedBlock(await readFile(absolute, 'utf8'))
    if (remainder === null)
      continue
    const path = toPosix(relative(args.cwd, absolute))
    if (remainder === '') {
      await unlink(absolute)
      files.push({ path, action: 'deleted' })
    }
    else {
      await writeFile(absolute, remainder)
      files.push({ path, action: 'removed' })
    }
  }
  if (args.json)
    return printJson(successEnvelope('init.remove', { files }))
  return formatRemoved(files)
}

function agentDocTargets(args: CommandArgs): string[] {
  const explicit = args.options['agent-docs-path']
  if (explicit === undefined)
    return AGENT_DOC_CANDIDATES.filter(file => existsSync(join(args.cwd, file)))
  const value = String(explicit).trim()
  if (!value)
    throw new CliError('--agent-docs-path needs a file path.', 'ERR_MISSING_ARGUMENT', 2)
  return [value]
}

function formatRemoved(files: readonly RemovedFile[]): string {
  if (files.length === 0)
    return 'No agent file holds the managed block, so nothing was removed.\n'
  const lines = files.map(file => file.action === 'deleted'
    ? `Deleted ${file.path}: the block was all it held.`
    : `Removed the block from ${file.path}.`)
  return `${lines.join('\n')}\nA copy of the block anywhere else is yours to delete: it sits between the two marker comments. \`${BINARY} init\` writes it again.\n`
}
