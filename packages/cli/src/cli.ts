import type { AgentName } from './agents.ts'
import type { ComponentRecord, TopicRecord } from './catalog-types.ts'
import type { AnyEnvelope } from './envelope.ts'
import type { SearchType } from './spec.ts'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import packageJson from '../package.json' with { type: 'json' }
import { agentFile, applyManagedBlock, renderAgentBlock } from './agents.ts'
import { catalog, localeOf, text } from './catalog.ts'
import { errorEnvelope, successEnvelope } from './envelope.ts'
import { CliError } from './error.ts'
import { formatComponentDetail, formatComponentList, formatComposableDetail, formatComposableList, formatRootHelp, formatSearch, formatTopicDetail, formatTopicList } from './format.ts'
import { buildManifest } from './manifest.ts'
import { displayName, listComponents, listComposables, listTopics, resolveComponent, resolveComposable, resolveTopic, searchCatalog } from './query.ts'
import { BINARY, commandByName, COMMANDS, GLOBAL_OPTIONS, PACKAGE_NAME } from './spec.ts'

const DOCS_PACKAGE = '@astryx-vue/docs'

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
    return recordCommand(parsed, json, dense, locale, 'component')
  if (command === 'composable')
    return recordCommand(parsed, json, dense, locale, 'composable')
  if (command === 'docs')
    return docsCommand(parsed, json, dense, locale)
  if (command === 'search')
    return searchCommand(parsed, json, dense, locale)
  if (command === 'manifest')
    return manifestCommand(parsed, json)
  return initCommand(parsed, json, dense, locale, cwd)
}

/** `component` and `composable` share the list/detail shape. Only the records and the labels differ. */
function recordCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh', kind: 'component' | 'composable'): string {
  const name = parsed.positionals.join(' ').trim()
  if (parsed.options.list === true) {
    if (name)
      throw new CliError(`Do not pass a ${kind} name together with --list.`, 'ERR_INVALID_ARGUMENT', 2)
    const records = kind === 'component' ? listComponents() : listComposables()
    if (json)
      return printJson(successEnvelope(`${kind}.list`, { locale, detail: 'compact', [kind === 'component' ? 'components' : 'composables']: groupForList(records, locale) }, catalog.packageName))
    return kind === 'component'
      ? formatComponentList(records, locale, dense)
      : formatComposableList(records, locale, dense)
  }
  if (!name)
    throw new CliError(`Pass a ${kind} name, or use --list.`, 'ERR_MISSING_ARGUMENT', 2)
  const record = kind === 'component' ? resolveComponent(name) : resolveComposable(name)
  if (json) {
    const data = recordDetail(record, locale)
    return printJson(successEnvelope(`${kind}.detail`, record.kind === 'composable' && kind === 'component' ? { ...data, hint: composableHint(record, locale) } : data, catalog.packageName))
  }
  const detail = kind === 'component'
    ? formatComponentDetail(record, locale, dense)
    : formatComposableDetail(record, locale, dense)
  if (record.kind === 'composable' && kind === 'component')
    return `${detail}${composableHint(record, locale)}\n`
  return detail
}

function docsCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh'): string {
  const query = parsed.positionals.join(' ').trim()
  if (!query) {
    const topics = listTopics()
    if (json) {
      const grouped: Record<string, { id: string, kind: string, title: string, description: string, docsUrl: string }[]> = {}
      for (const topic of topics) {
        const group = topic.kind === 'guide' ? 'guide' : 'theme'
        grouped[group] ??= []
        grouped[group].push(topicBrief(topic, locale))
      }
      return printJson(successEnvelope('docs.list', { locale, detail: 'compact', topics: grouped }, DOCS_PACKAGE))
    }
    return formatTopicList(topics, locale, dense)
  }
  const topic = resolveTopic(query)
  if (json) {
    return printJson(successEnvelope('docs.detail', {
      ...topicBrief(topic, locale),
      summary: text(topic.summary, locale),
      headings: topic.headings[locale],
      keywords: topic.keywords[locale],
      body: text(topic.body, locale),
      locale,
    }, DOCS_PACKAGE))
  }
  return formatTopicDetail(topic, locale, dense)
}

function composableHint(record: ComponentRecord, locale: 'en' | 'zh'): string {
  const command = `${BINARY} composable ${displayName(record)}`
  return locale === 'zh'
    ? `这是组合式函数（composable）。用 \`${command}\` 查看。`
    : `This is a composable. Run \`${command}\`.`
}

function groupForList(records: readonly ComponentRecord[], locale: 'en' | 'zh'): Record<string, { name: string, slug: string, title: string, description: string, import: string | null }[]> {
  const grouped: Record<string, { name: string, slug: string, title: string, description: string, import: string | null }[]> = {}
  for (const record of records) {
    const group = text(record.groupTitle, locale)
    grouped[group] ??= []
    grouped[group].push({
      name: displayName(record),
      slug: record.slug,
      title: text(record.title, locale),
      description: text(record.summary, locale),
      import: record.importPath,
    })
  }
  return grouped
}

function recordDetail(record: ComponentRecord, locale: 'en' | 'zh'): Record<string, unknown> {
  return {
    name: displayName(record),
    slug: record.slug,
    kind: record.kind,
    title: text(record.title, locale),
    group: record.group,
    groupTitle: text(record.groupTitle, locale),
    import: record.importPath,
    exportName: record.exportName,
    summary: text(record.summary, locale),
    usage: text(record.usage, locale),
    practices: record.practices[locale],
    props: record.props[locale],
    slots: record.slots[locale],
    events: record.events[locale],
    notes: record.notes[locale],
    examples: record.examples[locale],
    anatomy: record.anatomy[locale],
    accessibility: record.accessibility[locale],
    docsUrl: text(record.docsUrl, locale),
    locale,
  }
}

function topicBrief(topic: TopicRecord, locale: 'en' | 'zh'): { id: string, kind: string, title: string, description: string, docsUrl: string } {
  return {
    id: topic.id,
    kind: topic.kind,
    title: text(topic.title, locale),
    description: text(topic.summary, locale),
    docsUrl: text(topic.docsUrl, locale),
  }
}

function searchCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh'): string {
  const query = parsed.positionals.join(' ').trim()
  const limit = parsed.options.limit === undefined ? 20 : Number(parsed.options.limit)
  if (!Number.isInteger(limit) || limit < 1)
    throw new CliError('--limit must be a positive integer.', 'ERR_INVALID_ARGUMENT', 2)
  const type = parsed.options.type
  const { matchCount, results } = searchCatalog(query, locale, { limit, type: type as SearchType | undefined })
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
