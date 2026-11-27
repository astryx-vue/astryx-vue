import type { ComponentRecord, TableGroup, TableRow } from './catalog-types.ts'
import { examplesFor, text } from './catalog.ts'
import { formatPropsList } from './format-sections.ts'
import { firstSentence } from './generate/markdown.ts'
import { displayName } from './query.ts'
import { BINARY } from './spec.ts'

/** The longest doc example the short answer prints; a longer one stays in `--detail full`. */
const SHORT_EXAMPLE_MAX_LINES = 20

const REQUIRED_DEFAULTS = new Set(['required', '必需', '必填'])

/** How much of a component's doc a read prints. */
export type ComponentDetail = 'compact' | 'full'

function importStatement(record: ComponentRecord): string {
  return `import { ${record.exportName ?? record.name} } from '${record.importPath}'`
}

/** A catalog cell without the backticks the docs table wraps names, types and defaults in. */
function plain(value: string | undefined): string {
  return (value ?? '').replaceAll('`', '').trim()
}

/** The prop tables of a record: a table whose rows carry a type. Theme-variable tables carry none, and stay in `--detail full`. */
function propGroups(record: ComponentRecord, locale: 'en' | 'zh'): TableGroup[] {
  return record.props[locale].filter(group => group.rows.some(row => plain(row.type) !== ''))
}

function isRequired(row: TableRow): boolean {
  return REQUIRED_DEFAULTS.has(plain(row.default))
}

/**
 * The common-use code for the short answer: the doc's first example when it is
 * short, else one element built from the required props, or nothing when the
 * import already says it all. `...` marks each value the caller fills in.
 */
export function shortUsage(record: ComponentRecord, locale: 'en' | 'zh'): string | null {
  const example = examplesFor(record, locale).find(entry => entry.code.trim() !== '')
  if (example) {
    const code = example.code.trim()
    if (code.split('\n').length <= SHORT_EXAMPLE_MAX_LINES)
      return code
  }
  const name = displayName(record)
  const required = propGroups(record, locale).flatMap(group => group.rows).filter(isRequired)
  const hasContent = record.slots[locale].some(group => group.rows.some(row => plain(row.name) === 'default'))
  if (required.length === 0 && !hasContent)
    return null
  const attrs = required.map(row => /^'|^string$/.test(plain(row.type)) ? `${plain(row.name)}="..."` : `:${plain(row.name)}="..."`)
  const open = [name, ...attrs].join(' ')
  return hasContent ? `<${open}>...</${name}>` : `<${open} />`
}

/** A prop group with each description cut to its first sentence. */
function withFirstSentences(group: TableGroup): TableGroup {
  return {
    heading: group.heading,
    rows: group.rows.map(row => row.description ? { ...row, description: firstSentence(row.description) } : row),
  }
}

/** Whether cutting descriptions to their first sentence saves more than the line that points at `--props` costs. */
function cutsPay(groups: readonly TableGroup[], pointer: string): boolean {
  let saved = 0
  for (const row of groups.flatMap(group => group.rows)) {
    const flat = (row.description ?? '').replace(/\s+/g, ' ').trim()
    saved += flat.length - firstSentence(flat).length
  }
  return saved > pointer.length
}

function names(groups: readonly TableGroup[]): string {
  return groups.flatMap(group => group.rows.map(row => plain(row.name))).join(', ')
}

/**
 * The short answer a component read prints by default: what it is, its
 * import, the common use, its accessibility requirements, every prop on one
 * line with its description's first sentence, and the commands that print the
 * rest. Every part comes from fields the catalog already holds.
 */
export function formatComponentCompact(record: ComponentRecord, locale: 'en' | 'zh'): string {
  const name = displayName(record)
  const zh = locale === 'zh'
  const lines: string[] = [`# ${name}`, '', text(record.summary, locale), '']
  if (record.importPath)
    lines.push(`Import: \`${importStatement(record)}\``)
  lines.push(`Docs: ${text(record.docsUrl, locale)}`, '')

  const usage = shortUsage(record, locale)
  if (usage)
    lines.push('## Usage', '', '```vue', usage, '```', '')

  const accessibility = record.accessibility[locale]
  if (accessibility.length > 0) {
    lines.push('## Accessibility', '')
    for (const item of accessibility)
      lines.push(`- ${item.name} (${item.requirement}): ${item.description}`)
    lines.push('')
  }

  const propsCommand = `${BINARY} component ${name} --props`
  const pointer = zh
    ? `每个属性的完整描述：\`${propsCommand}\`\n`
    : `Each prop's whole description: \`${propsCommand}\`\n`
  const groups = propGroups(record, locale)
  const whole = !cutsPay(groups, pointer)
  for (const group of groups) {
    if (group.rows.length === 0)
      continue
    lines.push(`## ${group.heading}`, '', formatPropsList(whole ? group : withFirstSentences(group), zh), '')
  }

  const slots = names(record.slots[locale])
  const events = names(record.events[locale])
  if (slots)
    lines.push(`Slots: ${slots}`)
  if (events)
    lines.push(`Events: ${events}`)
  if (slots || events)
    lines.push('')

  if (!whole)
    lines.push(pointer)
  const fullCommand = `${BINARY} component ${name} --detail full`
  lines.push(zh
    ? `完整输出（含结构、最佳实践、全部示例和主题挂点）：\`${fullCommand}\``
    : `Full output, with anatomy, best practices, every example and notes: \`${fullCommand}\``)
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

/** Every prop with its whole description, and nothing else. */
export function formatComponentProps(record: ComponentRecord, locale: 'en' | 'zh'): string {
  const name = displayName(record)
  const groups = propGroups(record, locale)
  if (groups.length === 0)
    return locale === 'zh' ? `${name} 没有属性文档。\n` : `No props documentation found for ${name}.\n`
  const lines: string[] = []
  for (const group of groups)
    lines.push(`## ${group.heading}`, '', formatPropsList(group, locale === 'zh'), '')
  return `${lines.join('\n').trim()}\n`
}
