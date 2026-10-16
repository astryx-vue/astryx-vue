import type { AgentName } from './agents.ts'
import type { AnyEnvelope } from './envelope.ts'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import packageJson from '../package.json' with { type: 'json' }
import { agentFile, applyManagedBlock, renderAgentBlock } from './agents.ts'
import { catalog, localeOf, text } from './catalog.ts'
import { errorEnvelope, successEnvelope } from './envelope.ts'
import { CliError } from './error.ts'
import { formatComponentDetail, formatComponentList, formatRootHelp, formatSearch } from './format.ts'
import { buildManifest } from './manifest.ts'
import { listComponents, resolveComponent, searchCatalog } from './query.ts'
import { BINARY, commandByName, COMMANDS, GLOBAL_OPTIONS, PACKAGE_NAME } from './spec.ts'

export interface CliIO {
  cwd?: string
}

export interface CliResult {
  exitCode: number
  stdout: string
  stderr: string
}

interface ParsedArgs {
  command: string | null
  positionals: string[]
  options: Record<string, string | boolean>
}

const OPTION_INDEX = new Map<string, { type: 'boolean' | 'string', choices?: readonly string[] }>()
for (const option of [...GLOBAL_OPTIONS, ...COMMANDS.flatMap(command => command.options)])
  OPTION_INDEX.set(option.flag, { type: option.type, choices: option.choices })

export async function runCli(argv: readonly string[], io: CliIO = {}): Promise<CliResult> {
  try {
    const parsed = parseArgv(argv)
    const cwd = typeof parsed.options.cwd === 'string' ? parsed.options.cwd : (io.cwd ?? process.cwd())
    if (parsed.options.version === true && parsed.options.help !== true)
      return ok(printVersion(parsed.options.json === true))
    if (parsed.options.help === true || (parsed.command === null && parsed.options.json !== true))
      return ok(printHelp(parsed.command, parsed.options.json === true))
    if (parsed.command === null && parsed.options.json === true)
      return ok(printJson(helpEnvelope()))
    return ok(await dispatch(parsed, cwd))
  }
  catch (error) {
    const cliError = error instanceof CliError
      ? error
      : new CliError(error instanceof Error ? error.message : 'Unknown error', 'ERR_UNKNOWN', 1)
    const json = wantsJson(argv)
    return {
      exitCode: cliError.exitCode,
      stdout: json ? printJson(errorEnvelope(cliError)) : '',
      stderr: json ? '' : `${cliError.message}\n`,
    }
  }
}

async function dispatch(parsed: ParsedArgs, cwd: string): Promise<string> {
  const command = parsed.command
  if (!command || !commandByName(command)) {
    const known = COMMANDS.map(item => item.name)
    const suggestion = known.find(name => name.startsWith(command ?? ''))
    throw new CliError(
      `Unknown command "${command}".`,
      'ERR_UNKNOWN_COMMAND',
      2,
      suggestion ? [{ name: suggestion, reason: 'similar name' }] : known.map(name => ({ name, reason: 'similar name' })),
    )
  }
  const json = parsed.options.json === true
  const dense = parsed.options.dense === true && !json
  const locale = localeOf(parsed.options.zh === true)
  if (command === 'component')
    return componentCommand(parsed, json, dense, locale)
  if (command === 'search')
    return searchCommand(parsed, json, dense, locale)
  if (command === 'manifest')
    return manifestCommand(parsed, json)
  return initCommand(parsed, json, dense, locale, cwd)
}

function componentCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh'): string {
  const name = parsed.positionals.join(' ').trim()
  if (parsed.options.list === true) {
    if (name)
      throw new CliError('Do not pass a component name together with --list.', 'ERR_INVALID_ARGUMENT', 2)
    const components = listComponents()
    if (json) {
      const grouped: Record<string, { name: string, slug: string, title: string, description: string, import: string | null }[]> = {}
      for (const component of components) {
        const group = text(component.groupTitle, locale)
        grouped[group] ??= []
        grouped[group].push({
          name: component.name,
          slug: component.slug,
          title: text(component.title, locale),
          description: text(component.summary, locale),
          import: component.importPath,
        })
      }
      return printJson(successEnvelope('component.list', { locale, detail: 'compact', components: grouped }, catalog.packageName))
    }
    return formatComponentList(components, locale, dense)
  }
  if (!name)
    throw new CliError('Pass a component name, or use --list.', 'ERR_MISSING_ARGUMENT', 2)
  const component = resolveComponent(name)
  if (json) {
    return printJson(successEnvelope('component.detail', {
      name: component.name,
      slug: component.slug,
      title: text(component.title, locale),
      group: component.group,
      groupTitle: text(component.groupTitle, locale),
      import: component.importPath,
      exportName: component.exportName,
      summary: text(component.summary, locale),
      usage: text(component.usage, locale),
      practices: component.practices[locale],
      props: component.props[locale],
      slots: component.slots[locale],
      events: component.events[locale],
      notes: component.notes[locale],
      anatomy: component.anatomy[locale],
      accessibility: component.accessibility[locale],
      docsUrl: text(component.docsUrl, locale),
      locale,
    }, catalog.packageName))
  }
  return formatComponentDetail(component, locale, dense)
}

function searchCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh'): string {
  const query = parsed.positionals.join(' ').trim()
  const limit = parsed.options.limit === undefined ? 20 : Number(parsed.options.limit)
  if (!Number.isInteger(limit) || limit < 1)
    throw new CliError('--limit must be a positive integer.', 'ERR_INVALID_ARGUMENT', 2)
  const type = parsed.options.type
  if (type !== undefined && type !== 'component' && type !== 'doc')
    throw new CliError('--type must be component or doc.', 'ERR_INVALID_ARGUMENT', 2)
  const { matchCount, results } = searchCatalog(query, locale, { limit, type })
  if (json) {
    return printJson(successEnvelope('search', {
      query,
      locale,
      matchCount,
      results: results.map(result => ({
        domain: result.domain,
        name: result.name,
        package: result.package,
        score: result.score,
        reason: result.reason,
        description: result.description,
        command: result.command,
        ...(result.import ? { import: result.import } : {}),
        title: result.title,
        docsUrl: result.docsUrl,
      })),
    }))
  }
  return formatSearch(query, matchCount, results, locale, dense)
}

function manifestCommand(parsed: ParsedArgs, json: boolean): string {
  if (parsed.positionals.length > 0)
    throw new CliError('manifest does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const manifest = buildManifest(cliVersion())
  if (json)
    return printJson(successEnvelope('manifest', manifest, PACKAGE_NAME))
  const lines = [
    `${BINARY} ${manifest.version}`,
    manifest.description,
    '',
    ...manifest.commands.map(command => `${command.name.padEnd(12)} ${command.description}`),
    '',
    `Run \`${BINARY} manifest --json\` for the machine-readable manifest.`,
    '',
  ]
  return lines.join('\n')
}

async function initCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh', cwd: string): Promise<string> {
  if (parsed.positionals.length > 0)
    throw new CliError('init does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const features = String(parsed.options.features ?? '').split(',').map(feature => feature.trim()).filter(Boolean)
  if (features.length === 0)
    throw new CliError('Pass --features agents.', 'ERR_MISSING_ARGUMENT', 2)
  const unknown = features.find(feature => feature !== 'agents')
  if (unknown)
    throw new CliError(`Unknown feature "${unknown}". MVP supports agents.`, 'ERR_UNKNOWN_FEATURE', 2)
  const agent = (parsed.options.agent ?? 'agents') as string
  if (agent !== 'agents' && agent !== 'cursor' && agent !== 'claude' && agent !== 'codex')
    throw new CliError('--agent must be cursor, claude, or codex.', 'ERR_UNKNOWN_AGENT', 2)
  const filename = agentFile(agent as AgentName)
  const target = join(cwd, filename)
  let existing: string | null = null
  try {
    existing = await readFile(target, 'utf8')
  }
  catch (error) {
    if (!isMissing(error))
      throw new CliError(`Could not read ${filename}.`, 'ERR_WRITE_FAILED', 1)
  }
  const next = applyManagedBlock(existing, renderAgentBlock(catalog, locale, dense))
  try {
    await writeFile(target, next.content)
  }
  catch {
    throw new CliError(`Could not write ${filename}.`, 'ERR_WRITE_FAILED', 1)
  }
  const data = {
    mode: 'features' as const,
    features,
    agent,
    files: [{ path: filename, action: next.action }],
  }
  if (json)
    return printJson(successEnvelope('init.run', data))
  const verb = next.action === 'created'
    ? 'Created'
    : next.action === 'appended'
      ? 'Appended the managed block to'
      : 'Updated the managed block in'
  return `${verb} ${filename}\n`
}

function parseArgv(argv: readonly string[]): ParsedArgs {
  const positionals: string[] = []
  const options: Record<string, string | boolean> = {}
  let command: string | null = null
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index] ?? ''
    if (arg === '--') {
      positionals.push(...argv.slice(index + 1))
      break
    }
    if (!arg.startsWith('--')) {
      if (command === null)
        command = arg
      else
        positionals.push(arg)
      continue
    }
    const [flag, inline] = arg.split('=', 2) as [string, string?]
    const spec = OPTION_INDEX.get(flag)
    if (!spec)
      throw new CliError(`Unknown option ${flag}.`, 'ERR_INVALID_OPTION', 2)
    if (spec.type === 'boolean') {
      if (inline !== undefined)
        throw new CliError(`${flag} does not take a value.`, 'ERR_INVALID_ARGUMENT', 2)
      options[flag.slice(2)] = true
      continue
    }
    const value = inline ?? argv[index + 1]
    if (value === undefined || (inline === undefined && value.startsWith('--')))
      throw new CliError(`${flag} needs a value.`, 'ERR_MISSING_ARGUMENT', 2)
    if (inline === undefined)
      index++
    if (spec.choices && !spec.choices.includes(value)) {
      const code = flag === '--agent' ? 'ERR_UNKNOWN_AGENT' : 'ERR_INVALID_ARGUMENT'
      throw new CliError(`${flag} must be one of ${spec.choices.join(', ')}.`, code, 2)
    }
    options[flag.slice(2)] = value
  }
  return { command, positionals, options }
}

function printHelp(commandName: string | null, json: boolean): string {
  if (json)
    return printJson(commandName ? commandHelpEnvelope(commandName) : helpEnvelope())
  if (!commandName)
    return formatRootHelp()
  const command = commandByName(commandName)
  if (!command)
    throw new CliError(`Unknown command "${commandName}".`, 'ERR_UNKNOWN_COMMAND', 2)
  const usage = [`${BINARY} ${command.name}`, ...command.arguments.map(argument => argument.required ? `<${argument.name}>` : `[${argument.name}]`)].join(' ')
  const optionLines = [...GLOBAL_OPTIONS, ...command.options].map(option => `  ${option.flag.padEnd(18)} ${option.description}`)
  return [`${usage}`, '', command.summary, '', 'Options:', ...optionLines, '', 'Examples:', ...command.examples.map(example => `  ${example}`), ''].join('\n')
}

function printVersion(json: boolean): string {
  const version = cliVersion()
  if (json)
    return printJson(successEnvelope('version', { version }))
  return `${version}\n`
}

function helpEnvelope(): AnyEnvelope {
  const manifest = buildManifest(cliVersion())
  return successEnvelope('help', {
    name: BINARY,
    version: manifest.version,
    commands: COMMANDS.map(command => command.name),
    jsonSupported: manifest.jsonSupported,
    manifest,
  })
}

function commandHelpEnvelope(commandName: string): AnyEnvelope {
  const command = commandByName(commandName)
  if (!command)
    throw new CliError(`Unknown command "${commandName}".`, 'ERR_UNKNOWN_COMMAND', 2)
  return successEnvelope('help', {
    command: command.name,
    description: command.summary,
    usage: `${BINARY} ${command.name}`,
    options: [...GLOBAL_OPTIONS, ...command.options].map(option => ({
      flag: option.flag,
      description: option.description,
      ...(option.default !== undefined ? { defaultValue: option.default } : {}),
      ...(option.choices ? { choices: [...option.choices] } : {}),
    })),
  })
}

function printJson(value: AnyEnvelope): string {
  return `${JSON.stringify(value)}\n`
}

function ok(stdout: string): CliResult {
  return { exitCode: 0, stdout, stderr: '' }
}

function wantsJson(argv: readonly string[]): boolean {
  return argv.includes('--json')
}

export function cliVersion(): string {
  return packageJson.version
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
