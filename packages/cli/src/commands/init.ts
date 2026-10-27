import type { AgentName } from '../agents.ts'
import type { CommandArgs } from '../cli/context.ts'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { applyManagedBlock, existingAgentDocs, renderAgentBlock, resolveAgentTargets } from '../agents.ts'
import { catalog } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { assertWithinProject, toPosix } from '../paths.ts'

const AGENT_NAMES: readonly AgentName[] = ['cursor', 'claude', 'codex', 'hermes', 'all']

/**
 * `init --features agents` keeps one managed block in the project's agent file:
 * the text between the start and end markers is ours, everything around it is
 * the reader's and is left untouched.
 */
export async function initCommand(args: CommandArgs): Promise<string> {
  if (args.positionals.length > 0)
    throw new CliError('init does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const features = String(args.options.features ?? '').split(',').map(feature => feature.trim()).filter(Boolean)
  if (features.length === 0)
    throw new CliError('Pass --features agents.', 'ERR_MISSING_ARGUMENT', 2)
  const unknown = features.find(feature => feature !== 'agents')
  if (unknown)
    throw new CliError(`Unknown feature "${unknown}". MVP supports agents.`, 'ERR_UNKNOWN_FEATURE', 2)

  const requestedAgent = args.options.agent === undefined ? null : String(args.options.agent)
  const agent = requestedAgent === null ? null : AGENT_NAMES.find(name => name === requestedAgent) ?? null
  if (requestedAgent !== null && agent === null)
    throw new CliError('--agent must be cursor, claude, codex, hermes, or all.', 'ERR_UNKNOWN_AGENT', 2)

  const explicitPath = args.options['agent-docs-path']
  const targets: string[] = []
  if (explicitPath !== undefined) {
    const value = String(explicitPath).trim()
    if (!value)
      throw new CliError('--agent-docs-path needs a file path.', 'ERR_MISSING_ARGUMENT', 2)
    assertWithinProject(resolve(args.cwd, value), args.cwd)
    targets.push(value)
  }
  else {
    const existing = existingAgentDocs(file => existsSync(join(args.cwd, file)))
    targets.push(...resolveAgentTargets(agent, existing))
  }

  const inner = renderAgentBlock(catalog, args.locale, args.dense)
  const files: { path: string, action: string }[] = []
  for (const target of targets) {
    const absolute = resolve(args.cwd, target)
    assertWithinProject(absolute, args.cwd)
    const shown = toPosix(relative(args.cwd, absolute))
    let existing: string | null = null
    try {
      existing = await readFile(absolute, 'utf8')
    }
    catch (error) {
      if (!isMissing(error))
        throw new CliError(`Could not read ${shown}.`, 'ERR_WRITE_FAILED', 1)
    }
    const next = applyManagedBlock(existing, inner)
    try {
      mkdirSync(dirname(absolute), { recursive: true })
      await writeFile(absolute, next.content)
    }
    catch {
      throw new CliError(`Could not write ${shown}.`, 'ERR_WRITE_FAILED', 1)
    }
    files.push({ path: shown, action: next.action })
  }

  const data = {
    mode: 'features' as const,
    features,
    /** `auto` means the target came from what the project already has. */
    agent: agent ?? 'auto',
    files,
  }
  if (args.json)
    return printJson(successEnvelope('init.run', data))
  const lines = files.map((file) => {
    const verb = file.action === 'created'
      ? (args.locale === 'zh' ? '已创建' : 'Created')
      : file.action === 'appended'
        ? (args.locale === 'zh' ? '已追加受管理区块到' : 'Appended the managed block to')
        : (args.locale === 'zh' ? '已更新受管理区块于' : 'Updated the managed block in')
    return `${verb} ${file.path}`
  })
  return `${lines.join('\n')}\n`
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
