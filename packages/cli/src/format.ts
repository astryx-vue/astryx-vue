import type { ComponentRecord, TableGroup, TableRow } from './catalog-types.ts'
import type { SearchHit } from './query.ts'
import { text } from './catalog.ts'
import { firstSentence } from './generate/markdown.ts'
import { BINARY } from './spec.ts'

export function formatComponentList(components: readonly ComponentRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, ComponentRecord[]>()
  for (const component of components) {
    const title = text(component.groupTitle, locale)
    const list = groups.get(title) ?? []
    list.push(component)
    groups.set(title, list)
  }
  const blocks: string[] = []
  for (const [title, list] of groups) {
    const lines = list.map((component) => {
      const label = locale === 'zh' && component.title.zh !== component.name
        ? `${component.name} (${component.title.zh})`
        : component.name
      if (dense)
        return `  ${label}`
      return `  ${label}  ${firstSentence(text(component.summary, locale))}`
    })
    blocks.push([title, ...lines].join('\n'))
  }
  return `${blocks.join('\n\n')}\n`
}

export function formatComponentDetail(component: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  const summary = text(component.summary, locale)
  const docsUrl = text(component.docsUrl, locale)
  if (dense) {
    const props = component.props[locale].flatMap(group => group.rows.map(row => propBrief(row)))
    const slots = component.slots[locale].flatMap(group => group.rows.map(row => row.name))
    const events = component.events[locale].flatMap(group => group.rows.map(row => row.name))
    const examples = component.examples[locale].map(example => example.title).filter(Boolean)
    const lines = [
      [component.name, component.importPath ?? '', text(component.groupTitle, locale)].filter(Boolean).join('  '),
      firstSentence(summary),
      props.length > 0 ? `props: ${props.join(' | ')}` : '',
      slots.length > 0 ? `slots: ${slots.join(', ')}` : '',
      events.length > 0 ? `events: ${events.join(', ')}` : '',
      examples.length > 0 ? `examples: ${examples.join(', ')}` : '',
      docsUrl,
    ].filter(Boolean)
    return `${lines.join('\n')}\n`
  }

  const lines = [
    `# ${component.name}`,
    '',
    summary,
    '',
    component.importPath ? `Import: \`${importStatement(component)}\`` : '',
    `Group: ${text(component.groupTitle, locale)}`,
    `Docs: ${docsUrl}`,
    '',
    '## Usage',
    '',
    text(component.usage, locale),
  ]
  const practices = component.practices[locale]
  if (practices.length > 0) {
    lines.push('', '## Best practices', '')
    for (const practice of practices)
      lines.push(`- ${practice.guidance}: ${practice.text}`)
  }
  const examples = component.examples[locale]
  if (examples.length > 0) {
    lines.push('', '## Examples', '')
    for (const example of examples) {
      const title = example.title || 'Example'
      lines.push(`### ${title}`)
      if (example.description)
        lines.push('', example.description)
      if (example.code)
        lines.push('', '```vue', example.code, '```')
      lines.push('')
    }
  }
  for (const group of component.props[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'type', 'default', 'description']))
  for (const group of component.slots[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'description']))
  for (const group of component.events[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'payload', 'description']))
  for (const note of component.notes[locale])
    lines.push('', `## ${note.heading}`, '', note.text)
  if (component.anatomy[locale].length > 0) {
    lines.push('', '## Anatomy', '')
    for (const part of component.anatomy[locale])
      lines.push(`- ${part.name}: ${part.description}`)
  }
  if (component.accessibility[locale].length > 0) {
    lines.push('', '## Accessibility', '')
    for (const item of component.accessibility[locale])
      lines.push(`- ${item.name} (${item.requirement}): ${item.description}`)
  }
  return `${lines.filter(line => line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

export function formatSearch(query: string, matchCount: number, results: readonly SearchHit[], locale: 'en' | 'zh', dense: boolean): string {
  if (results.length === 0)
    return locale === 'zh' ? `没有匹配「${query}」的结果。\n` : `No matches for "${query}".\n`
  const lines = results.map((hit) => {
    const follow = hit.domain === 'component' ? `→ ${hit.command}` : `→ ${hit.docsUrl}`
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
  if (row.default)
    return `${row.name}=${row.default}`
  return row.name
}

function formatTable(group: TableGroup, columns: (keyof TableRow)[]): string {
  const header = columns.map(column => column === 'name' ? 'Name' : column === 'type' ? 'Type' : column === 'default' ? 'Default' : column === 'payload' ? 'Payload' : 'Description')
  const rows = group.rows.map(row => columns.map(column => row[column] ?? ''))
  const widths = header.map((label, index) => Math.max(label.length, ...rows.map(row => row[index]?.length ?? 0)))
  const render = (cells: string[]): string => `| ${cells.map((cell, index) => cell.padEnd(widths[index] ?? cell.length)).join(' | ')} |`
  return [render(header), `| ${widths.map(width => '-'.repeat(width)).join(' | ')} |`, ...rows.map(render)].join('\n')
}
