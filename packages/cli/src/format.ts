import type { ComponentRecord, TableGroup, TableRow, TopicRecord } from './catalog-types.ts'
import type { SearchHit } from './query.ts'
import { text } from './catalog.ts'
import { firstSentence } from './generate/markdown.ts'
import { displayName } from './query.ts'
import { BINARY } from './spec.ts'

interface Listing {
  name: string
  description: string
}

const KIND_LABELS: Record<'en' | 'zh', Record<TopicRecord['kind'], string>> = {
  en: { guide: 'Guides', theme: 'Themes' },
  zh: { guide: '指南', theme: '主题' },
}

export function formatComponentList(components: readonly ComponentRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, Listing[]>()
  for (const component of components) {
    const title = text(component.groupTitle, locale)
    const list = groups.get(title) ?? []
    list.push({ name: label(component, locale), description: text(component.summary, locale) })
    groups.set(title, list)
  }
  return formatGroupedList(groups, dense)
}

export function formatComposableList(composables: readonly ComponentRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, Listing[]>()
  for (const composable of composables) {
    const title = text(composable.groupTitle, locale)
    const list = groups.get(title) ?? []
    list.push({ name: displayName(composable), description: text(composable.summary, locale) })
    groups.set(title, list)
  }
  return formatGroupedList(groups, dense)
}

export function formatTopicList(topics: readonly TopicRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, Listing[]>()
  for (const topic of topics) {
    const title = KIND_LABELS[locale][topic.kind]
    const list = groups.get(title) ?? []
    list.push({ name: topic.id, description: text(topic.summary, locale) })
    groups.set(title, list)
  }
  return formatGroupedList(groups, dense)
}

export function formatComposableDetail(composable: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  return formatDetail(composable, locale, dense)
}

export function formatComponentDetail(component: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  return formatDetail(component, locale, dense)
}

export function formatTopicDetail(topic: TopicRecord, locale: 'en' | 'zh', dense: boolean): string {
  const title = text(topic.title, locale)
  const docsUrl = text(topic.docsUrl, locale)
  const body = text(topic.body, locale).replace(/^# .*\n+/, '')
  if (dense)
    return `${title}  ${topic.id}\n${docsUrl}\n${denseBody(body)}\n`
  return `${[`# ${title}`, '', `Topic: ${topic.id}`, `Docs: ${docsUrl}`, '', body].join('\n').trim()}\n`
}

function formatDetail(record: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  const name = displayName(record)
  const summary = text(record.summary, locale)
  const docsUrl = text(record.docsUrl, locale)
  if (dense) {
    const api = record.kind === 'composable'
      ? record.props[locale].map(group => `${group.heading}: ${group.rows.map(row => propBrief(row)).join(' | ')}`)
      : record.props[locale].length > 0
        ? [`props: ${record.props[locale].flatMap(group => group.rows.map(row => propBrief(row))).join(' | ')}`]
        : []
    const slots = record.slots[locale].flatMap(group => group.rows.map(row => row.name))
    const events = record.events[locale].flatMap(group => group.rows.map(row => row.name))
    const examples = record.examples[locale].map(example => example.title).filter(Boolean)
    const lines = [
      [name, record.importPath ?? '', text(record.groupTitle, locale)].filter(Boolean).join('  '),
      firstSentence(summary),
      ...api,
      slots.length > 0 ? `slots: ${slots.join(', ')}` : '',
      events.length > 0 ? `events: ${events.join(', ')}` : '',
      examples.length > 0 ? `examples: ${examples.join(', ')}` : '',
      docsUrl,
    ].filter(Boolean)
    return `${lines.join('\n')}\n`
  }

  const lines = [
    `# ${name}`,
    '',
    summary,
    '',
    record.importPath ? `Import: \`${importStatement(record)}\`` : '',
    `Group: ${text(record.groupTitle, locale)}`,
    `Docs: ${docsUrl}`,
    '',
    '## Usage',
    '',
    text(record.usage, locale),
  ]
  const practices = record.practices[locale]
  if (practices.length > 0) {
    lines.push('', '## Best practices', '')
    for (const practice of practices)
      lines.push(`- ${practice.guidance}: ${practice.text}`)
  }
  const examples = record.examples[locale]
  if (examples.length > 0) {
    lines.push('', '## Examples', '')
    for (const example of examples) {
      const exampleTitle = example.title || 'Example'
      lines.push(`### ${exampleTitle}`)
      if (example.description)
        lines.push('', example.description)
      if (example.code)
        lines.push('', '```vue', example.code, '```')
      lines.push('')
    }
  }
  for (const group of record.props[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, propColumns(group)))
  for (const group of record.slots[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'description']))
  for (const group of record.events[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'payload', 'description']))
  for (const note of record.notes[locale])
    lines.push('', `## ${note.heading}`, '', note.text)
  if (record.anatomy[locale].length > 0) {
    lines.push('', '## Anatomy', '')
    for (const part of record.anatomy[locale])
      lines.push(`- ${part.name}: ${part.description}`)
  }
  if (record.accessibility[locale].length > 0) {
    lines.push('', '## Accessibility', '')
    for (const item of record.accessibility[locale])
      lines.push(`- ${item.name} (${item.requirement}): ${item.description}`)
  }
  return `${lines.filter(line => line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

function formatGroupedList(groups: Map<string, Listing[]>, dense: boolean): string {
  const blocks: string[] = []
  for (const [title, list] of groups) {
    const lines = list.map(item => dense
      ? `  ${item.name}`
      : `  ${item.name}  ${firstSentence(item.description)}`)
    blocks.push([title, ...lines].join('\n'))
  }
  return `${blocks.join('\n\n')}\n`
}

function label(component: ComponentRecord, locale: 'en' | 'zh'): string {
  return locale === 'zh' && component.title.zh !== component.name
    ? `${component.name} (${component.title.zh})`
    : component.name
}

/** Drops blank lines outside fenced code blocks, keeping headings, lists, and code intact. */
function denseBody(body: string): string {
  let fence = false
  const lines: string[] = []
  for (const line of body.split('\n')) {
    if (line.startsWith('```'))
      fence = !fence
    if (!fence && line.trim() === '')
      continue
    lines.push(line)
  }
  return lines.join('\n').trim()
}

export function formatSearch(query: string, matchCount: number, results: readonly SearchHit[], locale: 'en' | 'zh', dense: boolean): string {
  if (results.length === 0)
    return locale === 'zh' ? `没有匹配「${query}」的结果。\n` : `No matches for "${query}".\n`
  const lines = results.map((hit) => {
    const follow = `→ ${hit.command}`
    if (dense)
      return `[${hit.domain}] ${hit.name}  ${follow}`
    return [`[${hit.domain}] ${hit.name}`, `  ${firstSentence(hit.description)}`, `  ${follow}`].join('\n')
  })
  const extra = matchCount > results.length
    ? (locale === 'zh' ? `\n还有 ${matchCount - results.length} 条，用 --limit 查看。\n` : `\n${matchCount - results.length} more. Raise --limit to see them.\n`)
    : '\n'
  return `${lines.join('\n\n')}${extra}`
}

export function formatRootHelp(): string {
  return [
    `${BINARY} — agent-friendly CLI for astryx-vue`,
    '',
    'This is @astryx-vue/cli. It is not Meta\'s astryx binary.',
    '',
    'Commands:',
    `  ${BINARY} component --list`,
    `  ${BINARY} component <Name>`,
    `  ${BINARY} composable --list`,
    `  ${BINARY} composable <Name>`,
    `  ${BINARY} docs [topic]`,
    `  ${BINARY} search <query>`,
    `  ${BINARY} manifest --json`,
    `  ${BINARY} init --features agents`,
    '',
    'Global flags: --json  --dense  --zh  --cwd <dir>  --help  --version',
    '',
    `Run \`${BINARY} manifest --json\` for commands, options, response types, and exit codes.`,
    '',
  ].join('\n')
}

function importStatement(component: ComponentRecord): string {
  const imported = component.exportName ?? component.name
  return `import { ${imported} } from '${component.importPath}'`
}

function propBrief(row: TableRow): string {
  const value = row.default && !/^[—-]$/.test(row.default) ? `=${row.default}` : ''
  return `${row.name}${value}`
}

/** Drops the Default column when the rows do not use it, which is the common case for return values. */
function propColumns(group: TableGroup): (keyof TableRow)[] {
  return group.rows.some(row => row.default !== undefined)
    ? ['name', 'type', 'default', 'description']
    : ['name', 'type', 'description']
}

function formatTable(group: TableGroup, columns: (keyof TableRow)[]): string {
  const header = columns.map(column => column === 'name' ? 'Name' : column === 'type' ? 'Type' : column === 'default' ? 'Default' : column === 'payload' ? 'Payload' : 'Description')
  const rows = group.rows.map(row => columns.map(column => row[column] ?? ''))
  const widths = header.map((label, index) => Math.max(label.length, ...rows.map(row => row[index]?.length ?? 0)))
  const render = (cells: string[]): string => `| ${cells.map((cell, index) => cell.padEnd(widths[index] ?? cell.length)).join(' | ')} |`
  return [render(header), `| ${widths.map(width => '-'.repeat(width)).join(' | ')} |`, ...rows.map(render)].join('\n')
}
