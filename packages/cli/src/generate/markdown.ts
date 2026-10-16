import type { Practice, TableGroup, TableRow } from '../catalog-types.ts'

export interface PageExtract {
  summary: string
  usage: string
  practices: Practice[]
  props: TableGroup[]
  slots: TableGroup[]
  events: TableGroup[]
  notes: { heading: string, text: string }[]
  importPath: string | null
  exportName: string | null
}

type SectionKind = 'usage' | 'practices' | 'examples' | 'props' | 'slots' | 'events' | 'note'

interface Section {
  heading: string
  kind: SectionKind
  body: string
}

const IMPORT_PATTERN = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"](@astryx-vue\/core(?:\/[^'"]+)?)['"]/g

export function pascalCase(slug: string): string {
  return slug.split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
}

export function extractPage(markdown: string, exportName: string): PageExtract {
  const cleaned = cleanMarkdown(markdown)
  const sections = splitSections(cleaned)
  const usage = sections.find(section => section.kind === 'usage')
  const usageText = usage ? tidy(stripTables(usage.body)) : ''
  const practices: Practice[] = []
  const props: TableGroup[] = []
  const slots: TableGroup[] = []
  const events: TableGroup[] = []
  const notes: { heading: string, text: string }[] = []

  for (const section of sections) {
    if (section.kind === 'examples' || section.heading === '')
      continue
    const tables = parseTables(section.body)
    const prose = tidy(stripTables(section.body))
    if (section.kind === 'usage')
      continue
    if (section.kind === 'practices') {
      const items = practicesFrom(tables)
      practices.push(...items)
      if (prose)
        notes.push({ heading: section.heading, text: prose })
      continue
    }
    const groups = tables.map(table => ({ heading: section.heading, rows: table })).filter(group => group.rows.length > 0)
    if (section.kind === 'props')
      props.push(...groups)
    else if (section.kind === 'slots')
      slots.push(...groups)
    else if (section.kind === 'events')
      events.push(...groups)
    if (section.kind === 'props' || section.kind === 'slots' || section.kind === 'events') {
      if (prose)
        notes.push({ heading: section.heading, text: prose })
      continue
    }
    if (groups.length > 0 || prose) {
      const rendered = groups.map(group => renderRows(group.rows)).filter(Boolean)
      notes.push({
        heading: section.heading,
        text: [prose, ...rendered].filter(Boolean).join('\n\n'),
      })
    }
  }

  const imported = findImport(`${usage?.body ?? ''}\n${cleaned}`, exportName)
  return {
    summary: pickSummary(usageText, practices, markdown),
    usage: usageText,
    practices,
    props: props.filter(group => group.rows.length > 0),
    slots: slots.filter(group => group.rows.length > 0),
    events: events.filter(group => group.rows.length > 0),
    notes: notes.filter(note => note.text.trim()),
    importPath: imported?.importPath ?? null,
    exportName: imported?.exportName ?? null,
  }
}

export function extractTopic(markdown: string): { title: string, summary: string, headings: string[], keywords: string[] } {
  const titleFromMatter = frontmatterTitle(markdown)
  const cleaned = cleanMarkdown(markdown)
  const headings: string[] = []
  const keywords: string[] = []
  let h1 = ''
  let fence = false
  for (const line of cleaned.split('\n')) {
    if (line.startsWith('```')) {
      fence = !fence
      continue
    }
    if (fence)
      continue
    const heading = headingLevel(line)
    if (heading && heading.level <= 3) {
      if (heading.level === 1)
        h1 = heading.text
      else
        headings.push(heading.text)
      continue
    }
    if (line.trimStart().startsWith('|') && !isSeparator(line)) {
      const value = (splitMarkdownRow(line)[0] ?? '').replace(/`/g, '').trim()
      if (value && !/^(?:name|function|需要的东西|you need)$/i.test(value))
        keywords.push(value)
    }
  }
  const withoutTitle = h1 && cleaned.startsWith(`# ${h1}`)
    ? cleaned.slice(cleaned.indexOf('\n') + 1)
    : cleaned
  return {
    title: titleFromMatter || h1,
    summary: firstParagraph(tidy(withoutTitle)),
    headings,
    keywords: [...new Set(keywords)],
  }
}

export function paragraphContaining(markdown: string, needle: string): string {
  const cleaned = tidy(stripFenced(cleanMarkdown(markdown)))
  const paragraph = cleaned.split(/\n\s*\n/).map(part => part.replace(/\n/g, ' ').trim()).find(part => part.includes(needle))
  if (!paragraph)
    throw new Error(`docs page is missing a paragraph containing ${JSON.stringify(needle)}`)
  return paragraph
}

export function firstParagraph(prose: string): string {
  for (const part of prose.split(/\n\s*\n/)) {
    const text = part.trim()
    if (!text || text.startsWith('```') || text.startsWith('|') || text.startsWith('- ') || text.startsWith('* ') || text.startsWith('#'))
      continue
    return text.replace(/\n/g, ' ').trim()
  }
  return ''
}

function pickSummary(usageText: string, practices: Practice[], markdown: string): string {
  const prose = stripFenced(usageText)
  for (const part of prose.split(/\n\s*\n/)) {
    const text = part.trim()
    if (!text || text.startsWith('```') || text.startsWith('|') || text.startsWith('- ') || text.startsWith('* ') || text.startsWith('#') || text.startsWith('<'))
      continue
    const kept = splitSentences(text.replace(/\n/g, ' ').trim()).filter(sentence => !isImportBoilerplate(sentence))
    if (kept.length > 0)
      return kept.join(' ')
  }
  const practice = practices.find(item => item.text.trim() && !isImportBoilerplate(item.text))
  if (practice)
    return practice.text.trim()
  const described = demoDescription(markdown)
  if (described)
    return described
  return firstParagraph(usageText)
}

function splitSentences(text: string): string[] {
  const sentences: string[] = []
  let start = 0
  for (let index = 0; index < text.length; index++) {
    const char = text[index]
    if (char !== '.' && char !== '。')
      continue
    const next = text[index + 1]
    if (next !== undefined && !/\s/u.test(next))
      continue
    const sentence = text.slice(start, index + 1).trim()
    if (sentence)
      sentences.push(sentence)
    start = index + 1
  }
  const tail = text.slice(start).trim()
  if (tail)
    sentences.push(tail)
  return sentences
}

function isImportBoilerplate(sentence: string): boolean {
  const normalized = sentence.trim().replace(/[.。:：]+$/u, '').replace(/\s+/g, ' ')
  return [
    /^import the components? from (?:its|their) dedicated entry$/i,
    /^import `[^`]+`(?: and `[^`]+`)? from (?:its|their) dedicated entry$/i,
    /^structural styles are loaded automatically$/i,
    /^the component loads its structural styles$/i,
    /^structural styles load with the component$/i,
    /^import it from its own entry$/i,
    /^import the theme once at your app entry$/i,
    /^import the theme in your application entry$/i,
    /^import the theme once in the application entry$/i,
    /^component usage$/i,
    /^基本用法$/,
    /^从独立入口导入即可[，,]?\s*结构样式会随组件自动加载$/,
    /^组件从独立入口导入[，,]?\s*结构样式会随组件自动加载$/,
    /^结构样式会随组件自动加载$/,
  ].some(pattern => pattern.test(normalized))
}

function demoDescription(markdown: string): string {
  const key = 'description="'
  let cursor = 0
  while (cursor < markdown.length) {
    const start = markdown.indexOf('<DemoExample', cursor)
    if (start === -1)
      return ''
    const end = markdown.indexOf('>', start)
    if (end === -1)
      return ''
    const tag = markdown.slice(start, end)
    const valueStart = tag.indexOf(key)
    if (valueStart !== -1) {
      const from = valueStart + key.length
      const valueEnd = tag.indexOf('"', from)
      if (valueEnd !== -1)
        return tag.slice(from, valueEnd).trim()
    }
    cursor = end + 1
  }
  return ''
}

export function firstSentence(text: string): string {
  const match = text.match(/^[\s\S]*?[.。](?=\s|$)/)
  return (match ? match[0] : text).trim()
}

function frontmatterTitle(markdown: string): string {
  const matter = /^---\n([\s\S]*?)\n---/.exec(markdown)
  const titleLine = matter?.[1]?.split('\n').find(line => line.startsWith('title:'))
  const title = titleLine?.slice('title:'.length).trim() ?? ''
  return title.replace(/^['"]|['"]$/g, '')
}

export function cleanMarkdown(markdown: string): string {
  const withoutMatter = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '')
  return tidy(mapOutsideFences(withoutMatter, (text) => {
    return text
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<(?:DemoExample|ComponentAnatomy|ComponentAccessibility|ComponentsOverview)\b[\s\S]*?\/>/g, '')
  }))
}

function splitSections(markdown: string): Section[] {
  const sections: Section[] = []
  let heading = ''
  let body: string[] = []
  let fence = false
  const push = (): void => {
    sections.push({ heading, kind: heading ? classify(heading) : 'note', body: body.join('\n') })
  }
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```'))
      fence = !fence
    const match = !fence ? headingLevel(line) : null
    if (match && match.level >= 2 && match.level <= 3) {
      push()
      heading = match.text
      body = []
    }
    else {
      body.push(line)
    }
  }
  push()
  return sections
}

function classify(heading: string): SectionKind {
  const title = heading.trim().toLowerCase()
  if (title === 'usage' || title === '使用方法' || title === '使用')
    return 'usage'
  if (title === 'examples' || title === 'example' || title === '示例')
    return 'examples'
  if (title === 'best practices' || title === '最佳实践' || title === '使用建议')
    return 'practices'
  if (/slots?|插槽/.test(title))
    return 'slots'
  if (/\bevents?\b|\bemits?\b|事件/.test(title))
    return 'events'
  if (/\bprops?\b|\bproperties\b|属性/.test(title))
    return 'props'
  return 'note'
}

function parseTables(source: string): TableRow[][] {
  return [...parseHtmlTables(source), ...parseMarkdownTables(source)]
}

function parseHtmlTables(source: string): TableRow[][] {
  const tables: TableRow[][] = []
  for (const table of source.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
    const rows = [...table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => {
      return [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(cell => cellText(cell[1]))
    })
    const mapped = mapRows(rows)
    if (mapped.length > 0)
      tables.push(mapped)
  }
  return tables
}

function parseMarkdownTables(source: string): TableRow[][] {
  const tables: TableRow[][] = []
  let current: string[] = []
  let fence = false
  const flush = (): void => {
    if (current.length === 0)
      return
    const rows = current.filter(line => !isSeparator(line)).map(splitMarkdownRow)
    const mapped = mapRows(rows)
    if (mapped.length > 0)
      tables.push(mapped)
    current = []
  }
  for (const line of source.split('\n')) {
    if (line.startsWith('```')) {
      fence = !fence
      flush()
      continue
    }
    if (!fence && /^\s*\|/.test(line))
      current.push(line)
    else
      flush()
  }
  flush()
  return tables
}

function mapRows(rows: string[][]): TableRow[] {
  if (rows.length < 2)
    return []
  const headers = rows[0].map(header => header.toLowerCase())
  const columns = headers.map(header => columnKind(header))
  return rows.slice(1).filter(row => row.some(Boolean)).map((row) => {
    const record: TableRow = { name: '' }
    row.forEach((value, index) => {
      const kind = columns[index] ?? 'description'
      if (!value)
        return
      if (kind === 'name')
        record.name = value
      else if (kind === 'type')
        record.type = value
      else if (kind === 'default')
        record.default = value
      else if (kind === 'payload')
        record.payload = value
      else if (kind === 'guidance')
        record.name = value
      else if (!record.description)
        record.description = value
    })
    if (!record.name)
      record.name = row[0] ?? ''
    return record
  }).filter(row => row.name)
}

function columnKind(header: string): 'name' | 'type' | 'default' | 'payload' | 'guidance' | 'description' {
  const normalized = header.replace(/[`*]/g, '').trim()
  if (['name', 'property', '名称', '属性', 'function', 'element'].includes(normalized))
    return 'name'
  if (['type', '类型'].includes(normalized))
    return 'type'
  if (['default', '默认', '默认值'].includes(normalized))
    return 'default'
  if (['payload', '载荷', '参数'].includes(normalized))
    return 'payload'
  if (['guidance', '指引'].includes(normalized))
    return 'guidance'
  return 'description'
}

function practicesFrom(tables: TableRow[][]): Practice[] {
  return tables.flatMap(rows => rows.map(row => ({
    guidance: row.name,
    text: row.description ?? '',
  })).filter(item => item.guidance && item.text))
}

function findImport(source: string, exportName: string): { importPath: string, exportName: string } | null {
  for (const match of source.matchAll(IMPORT_PATTERN)) {
    const names = match[1].split(',').map(part => part.replace(/^type\s+/, '').split(/\s+as\s+/)[0]?.trim() ?? '').filter(Boolean)
    if (names.includes(exportName))
      return { importPath: match[2], exportName }
  }
  return null
}

function stripTables(source: string): string {
  return mapOutsideFences(source, text => text
    .replace(/<div[^>]*class="component-api-table"[\s\S]*?<\/div>/g, '')
    .replace(/<table\b[\s\S]*?<\/table>/gi, '')
    .replace(/^\s*\|.*$/gm, '')
    .replace(/^\s*[|:-]+\s*$/gm, ''))
}

function stripFenced(source: string): string {
  return source.replace(/```[\s\S]*?```/g, '')
}

function renderRows(rows: TableRow[]): string {
  return rows.map((row) => {
    const detail = [row.type, row.default, row.payload, row.description].filter(Boolean).join(' — ')
    return detail ? `- ${row.name}: ${detail}` : `- ${row.name}`
  }).join('\n')
}

function splitMarkdownRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cellText(cell))
}

function isSeparator(line: string): boolean {
  const cells = splitMarkdownRow(line)
  return cells.length > 1 && cells.every(cell => /^:?-{3,}:?$/.test(cell))
}

function headingLevel(line: string): { level: number, text: string } | null {
  let level = 0
  while (line[level] === '#')
    level++
  if (level === 0 || line[level] !== ' ')
    return null
  return { level, text: line.slice(level + 1).trim() }
}

function cellText(value: string): string {
  const withCode = value.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
  const withoutTags = withCode.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')
  return decodeHtml(withoutTags).replace(/\s+/g, ' ').trim()
}

function decodeHtml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function mapOutsideFences(source: string, transform: (text: string) => string): string {
  return source.split(/(```[\s\S]*?```)/g).map((part, index) => index % 2 === 1 ? part : transform(part)).join('')
}

function tidy(value: string): string {
  return value.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}
