import type { AgentName } from './agents.ts'
import type { ComponentRecord, TemplateRecord, TopicRecord } from './catalog-types.ts'
import type { AnyEnvelope } from './envelope.ts'
import type { SearchType } from './spec.ts'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import process from 'node:process'
import packageJson from '../package.json' with { type: 'json' }
import { applyManagedBlock, existingAgentDocs, renderAgentBlock, resolveAgentTargets } from './agents.ts'
import { buildKit } from './build.ts'
import { catalog, localeOf, text } from './catalog.ts'
import { errorEnvelope, successEnvelope } from './envelope.ts'
import { CliError } from './error.ts'
import { formatBuildHelp, formatBuildKit, formatComponentDetail, formatComponentList, formatComposableDetail, formatComposableList, formatRootHelp, formatSearch, formatTemplateCopy, formatTemplateDetail, formatTemplateList, formatTemplateSkeleton, formatTopicDetail, formatTopicList } from './format.ts'
import { buildManifest } from './manifest.ts'
import { assertWithinProject, toPosix } from './paths.ts'
import { displayName, listComponents, listComposables, listTopics, resolveComponent, resolveComposable, resolveTopic, searchCatalog } from './query.ts'
import { BINARY, commandByName, COMMANDS, GLOBAL_OPTIONS, PACKAGE_NAME } from './spec.ts'
import { copyTemplate, guardPathArguments, listTemplates, renderSkeleton, resolveTemplate, templateKinds, templateSource } from './templates.ts'

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

/**
 * Flags are read before the command decides what they mean: `--type` filters
 * search domains and template kinds, so the arity lives here and the accepted
 * values are checked once the command is known.
 */
const FLAG_SPECS = new Map<string, { type: 'boolean' | 'string', name: string }>()
for (const option of [...GLOBAL_OPTIONS, ...COMMANDS.flatMap(command => command.options)]) {
  for (const flag of [option.flag, ...(option.aliases ?? [])])
    FLAG_SPECS.set(flag, { type: option.type, name: option.name })
}

const AGENT_NAMES: readonly AgentName[] = ['cursor', 'claude', 'codex', 'hermes', 'all']

export async function runCli(argv: readonly string[], io: CliIO = {}): Promise<CliResult> {
  try {
    const parsed = parseArgv(argv)
    validateOptions(parsed)
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
  if (command === 'template')
    return templateCommand(parsed, json, dense, locale, cwd)
  if (command === 'build')
    return buildCommand(parsed, json, dense, locale)
  return initCommand(parsed, json, dense, locale, cwd)
}

/**
 * `template` is three commands behind one name: list, show, and copy. The modes
 * are exclusive, and `--skeleton` only narrows a show, so mixing them is a usage
 * error rather than a guess about what the caller meant.
 */
function templateCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh', cwd: string): string {
  const list = parsed.options.list === true
  const skeleton = parsed.options.skeleton === true
  const overwrite = parsed.options.overwrite === true
  const type = parsed.options.type === undefined ? undefined : templateKinds(String(parsed.options.type))
  if (list && skeleton)
    throw new CliError('--list and --skeleton cannot be combined.', 'ERR_INVALID_ARGUMENT', 2)
  if (parsed.positionals.length > 2)
    throw new CliError('template takes a name and, at most, one path.', 'ERR_INVALID_ARGUMENT', 2)
  guardPathArguments(parsed.positionals, cwd)

  const [name, target] = parsed.positionals
  if (list || name === undefined) {
    if (name !== undefined || target !== undefined)
      throw new CliError('--list takes no name or path.', 'ERR_INVALID_ARGUMENT', 2)
    if (skeleton)
      throw new CliError('Pass a template name with --skeleton.', 'ERR_MISSING_ARGUMENT', 2)
    if (overwrite)
      throw new CliError('--overwrite only applies when copying a template to a path.', 'ERR_INVALID_ARGUMENT', 2)
    return templateList(listTemplates(type), locale, json, dense)
  }

  const template = resolveTemplate(name, type)
  if (skeleton) {
    if (target !== undefined)
      throw new CliError('--skeleton prints the skeleton and writes nothing, so it takes no path.', 'ERR_INVALID_ARGUMENT', 2)
    if (overwrite)
      throw new CliError('--overwrite only applies when copying a template to a path.', 'ERR_INVALID_ARGUMENT', 2)
    const skeletonText = renderSkeleton(template.source)
    if (json) {
      return printJson(successEnvelope('template.skeleton', {
        template: template.slug,
        title: text(template.title, locale),
        description: text(template.description, locale),
        kind: template.kind,
        isReady: template.isReady,
        components: template.componentsUsed,
        skeleton: skeletonText,
        docsUrl: text(template.docsUrl, locale),
        locale,
      }, PACKAGE_NAME))
    }
    return formatTemplateSkeleton(template, locale, skeletonText)
  }

  if (target === undefined) {
    const { source, demoMediaReplaced } = templateSource(template)
    if (json) {
      return printJson(successEnvelope('template.show', {
        ...templateBrief(template, locale),
        components: template.componentsUsed,
        demoMediaReplaced,
        source,
        locale,
      }, PACKAGE_NAME))
    }
    return formatTemplateDetail(template, locale, dense, source)
  }

  const receipt = copyTemplate(template, { cwd, targetPath: target, overwrite, locale })
  if (json)
    return printJson(successEnvelope('template.copy', { ...receipt, locale }, PACKAGE_NAME))
  return formatTemplateCopy(receipt, locale)
}

function templateList(templates: readonly TemplateRecord[], locale: 'en' | 'zh', json: boolean, dense: boolean): string {
  if (json) {
    const note = templates.length === 0
      ? (locale === 'zh' ? '目前只有 page 模板，还没有 block 模板。' : 'Every template is a page today; there are no block templates yet.')
      : undefined
    return printJson(successEnvelope('template.list', {
      locale,
      detail: 'compact',
      templates: templates.map(template => templateBrief(template, locale)),
      ...(note ? { note } : {}),
    }, PACKAGE_NAME))
  }
  return formatTemplateList(templates, locale, dense)
}

function templateBrief(template: TemplateRecord, locale: 'en' | 'zh'): Record<string, unknown> {
  return {
    slug: template.slug,
    title: text(template.title, locale),
    description: text(template.description, locale),
    category: text(template.category, locale),
    kind: template.kind,
    isReady: template.isReady,
    ...(template.notReadyReason ? { notReadyReason: text(template.notReadyReason, locale) } : {}),
    command: `${BINARY} template ${template.slug}`,
    docsUrl: text(template.docsUrl, locale),
  }
}

/** `build` without a sentence prints the workflow; with one it prints the kit. */
function buildCommand(parsed: ParsedArgs, json: boolean, dense: boolean, locale: 'en' | 'zh'): string {
  const idea = parsed.positionals.join(' ').trim()
  const help = parsed.positionals.length === 0
  if (help) {
    if (json) {
      return printJson(successEnvelope('build.help', {
        usage: `${BINARY} build "<one sentence>"`,
        locale,
        steps: locale === 'zh'
          ? [
              `运行 \`${BINARY} build "<一句话想法>"\` 找最接近的页面模板和要用的组件。`,
              `运行 \`${BINARY} template <slug> ./src/pages\` 落地模板，再按需修改。`,
              `写代码前用 \`${BINARY} component <Name>\` 或 \`${BINARY} composable <Name>\` 查用法，不要猜 props。`,
            ]
          : [
              `Run \`${BINARY} build "<one sentence>"\` to find the closest page template and the components to use.`,
              `Run \`${BINARY} template <slug> ./src/pages\` to copy the template, then change it.`,
              `Run \`${BINARY} component <Name>\` or \`${BINARY} composable <Name>\` before writing code. Do not guess props.`,
            ],
        rules: locale === 'zh'
          ? [
              '匹配完全离线：只在模板的名字、标题、描述、关键词和组件上做关键词加权，没有网络，没有模型。',
              '中文按字符二元组匹配，不需要空格分词。',
              '标为不可用的模板排在可复制模板之后，复制会被拒绝。',
              '命中太弱时宁可不给，不硬凑结果。',
            ]
          : [
              'Matching is offline: weighted keywords over a template slug, title, description, keywords, and components. No network, no model.',
              'Chinese is matched by character pairs, so no word segmentation is needed.',
              'Templates that are not ready rank below ready ones, and copying them is refused.',
              'A weak match is dropped rather than padded.',
            ],
        commands: [`${BINARY} template --list`, `${BINARY} search <query> --type template`, `${BINARY} manifest --json`],
      }, PACKAGE_NAME))
    }
    return formatBuildHelp(locale)
  }
  const kit = buildKit(idea, locale)
  if (json)
    return printJson(successEnvelope('build.kit', kit, PACKAGE_NAME))
  return formatBuildKit(kit, dense)
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

  const requestedAgent = parsed.options.agent === undefined ? null : String(parsed.options.agent)
  const agent = requestedAgent === null ? null : AGENT_NAMES.find(name => name === requestedAgent) ?? null
  if (requestedAgent !== null && agent === null)
    throw new CliError('--agent must be cursor, claude, codex, hermes, or all.', 'ERR_UNKNOWN_AGENT', 2)

  const explicitPath = parsed.options['agent-docs-path']
  const targets: string[] = []
  if (explicitPath !== undefined) {
    const value = String(explicitPath).trim()
    if (!value)
      throw new CliError('--agent-docs-path needs a file path.', 'ERR_MISSING_ARGUMENT', 2)
    assertWithinProject(resolve(cwd, value), cwd)
    targets.push(value)
  }
  else {
    const existing = existingAgentDocs(file => existsSync(join(cwd, file)))
    targets.push(...resolveAgentTargets(agent, existing))
  }

  const inner = renderAgentBlock(catalog, locale, dense)
  const files: { path: string, action: string }[] = []
  for (const target of targets) {
    const absolute = resolve(cwd, target)
    assertWithinProject(absolute, cwd)
    const shown = toPosix(relative(cwd, absolute))
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
  if (json)
    return printJson(successEnvelope('init.run', data))
  const lines = files.map((file) => {
    const verb = file.action === 'created'
      ? (locale === 'zh' ? '已创建' : 'Created')
      : file.action === 'appended'
        ? (locale === 'zh' ? '已追加受管理区块到' : 'Appended the managed block to')
        : (locale === 'zh' ? '已更新受管理区块于' : 'Updated the managed block in')
    return `${verb} ${file.path}`
  })
  return `${lines.join('\n')}\n`
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
    if (!isOptionToken(arg)) {
      if (command === null)
        command = arg
      else
        positionals.push(arg)
      continue
    }
    const [flag, inline] = arg.split('=', 2) as [string, string?]
    const spec = FLAG_SPECS.get(flag)
    if (!spec)
      throw new CliError(`Unknown option ${flag}.`, 'ERR_INVALID_OPTION', 2)
    if (spec.type === 'boolean') {
      if (inline !== undefined)
        throw new CliError(`${flag} does not take a value.`, 'ERR_INVALID_ARGUMENT', 2)
      options[spec.name] = true
      continue
    }
    const value = inline ?? argv[index + 1]
    if (value === undefined || (inline === undefined && value.startsWith('--')))
      throw new CliError(`${flag} needs a value.`, 'ERR_MISSING_ARGUMENT', 2)
    if (inline === undefined)
      index++
    options[spec.name] = value
  }
  return { command, positionals, options }
}

/**
 * Checks each parsed option against the resolved command: an option another
 * command declares is a mistake here, and a value outside the declared choices
 * is reported with its own code.
 */
function validateOptions(parsed: ParsedArgs): void {
  const command = commandByName(parsed.command ?? '')
  const specs = [...GLOBAL_OPTIONS, ...(command?.options ?? [])]
  for (const [name, value] of Object.entries(parsed.options)) {
    const spec = specs.find(option => option.name === name)
    if (!spec)
      throw new CliError(`Unknown option --${name}.`, 'ERR_INVALID_OPTION', 2)
    if (spec.choices && typeof value === 'string' && !spec.choices.includes(value)) {
      const code = spec.name === 'agent' ? 'ERR_UNKNOWN_AGENT' : 'ERR_INVALID_ARGUMENT'
      throw new CliError(`--${name} must be one of ${spec.choices.join(', ')}.`, code, 2)
    }
  }
}

/** Long flags, plus the short aliases declared in the command spec. */
function isOptionToken(arg: string): boolean {
  if (arg.startsWith('--'))
    return true
  return arg.startsWith('-') && arg.length > 1 && FLAG_SPECS.has(arg.split('=', 2)[0] ?? '')
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
  const optionLines = [...GLOBAL_OPTIONS, ...command.options].map((option) => {
    const flags = [option.flag, ...(option.aliases ?? [])].join(', ')
    return `  ${flags.padEnd(18)} ${option.description}`
  })
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
      ...(option.aliases ? { aliases: [...option.aliases] } : {}),
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
