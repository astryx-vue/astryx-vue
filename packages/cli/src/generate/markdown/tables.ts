import type { Practice, TableRow } from '../../catalog-types.ts'
import type { ApiKind, Section } from './sections.ts'
import { classify, isApiKind } from './sections.ts'
import { decodeHtml, mapOutsideFences } from './text.ts'

/**
 * Reads the tables on a docs page, both Markdown pipe tables and the HTML
 * `component-api-table` blocks, and works out which API group each one documents.
 */

export type ColumnKind = 'name' | 'type' | 'default' | 'payload' | 'guidance' | 'description'

export interface ParsedTable {
  label: string
  kinds: ColumnKind[]
  rows: TableRow[]
}

export function parseTables(source: string): ParsedTable[] {
  return [...parseHtmlTables(source), ...parseMarkdownTables(source)]
}

function parseHtmlTables(source: string): ParsedTable[] {
  const tables: ParsedTable[] = []
  const wrapped = /<div\b([^>]+\bclass="[^"]*component-api-table[^"]*"[^>]*)>([\s\S]*?)<\/div>/gi
  const rest = source.replace(wrapped, (_full, attrs: string, inner: string) => {
    const table = inner.match(/<table\b[^>]*>([\s\S]*?)<\/table>/i)
    const mapped = table ? mapRows(htmlRows(table[1] ?? '')) : null
    if (mapped)
      tables.push({ label: ariaLabel(attrs), ...mapped })
    return ''
  })
  for (const table of rest.matchAll(/<table\b([^>]*)>([\s\S]*?)<\/table>/gi)) {
    const mapped = mapRows(htmlRows(table[2] ?? ''))
    if (mapped)
      tables.push({ label: ariaLabel(table[1] ?? ''), ...mapped })
  }
  return tables
}

function htmlRows(source: string): string[][] {
  return [...source.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) => {
    return [...row[1].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(cell => cellText(cell[1] ?? ''))
  })
}

function ariaLabel(attrs: string): string {
  const match = attrs.match(/\baria-label="([^"]*)"/)
  return match?.[1] ? decodeHtml(match[1]) : ''
}

function parseMarkdownTables(source: string): ParsedTable[] {
  const tables: ParsedTable[] = []
  let current: string[] = []
  let fence = false
  const flush = (): void => {
    if (current.length === 0)
      return
    const rows = current.filter(line => !isSeparator(line)).map(splitMarkdownRow)
    const mapped = mapRows(rows)
    if (mapped)
      tables.push({ label: '', ...mapped })
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

function mapRows(rows: string[][]): { kinds: ColumnKind[], rows: TableRow[] } | null {
  if (rows.length < 2)
    return null
  const headers = rows[0]?.map(header => header.toLowerCase()) ?? []
  const kinds = headers.map(header => columnKind(header))
  const mapped = rows.slice(1).filter(row => row.some(Boolean)).map((row) => {
    const record: TableRow = { name: '' }
    row.forEach((value, index) => {
      const kind = kinds[index] ?? 'description'
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
  if (mapped.length === 0)
    return null
  return { kinds, rows: mapped }
}

function columnKind(header: string): ColumnKind {
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

/** Which API group a table documents: its own label first, then its columns, then the section it sits in. */
export function tableApiKind(section: Section, table: ParsedTable): ApiKind | null {
  const labelKind = classify(table.label)
  if (isApiKind(labelKind))
    return labelKind
  const has = (kind: ColumnKind): boolean => table.kinds.includes(kind)
  if (has('type') || has('default'))
    return 'props'
  if (has('payload'))
    return 'events'
  const context = section.kind === 'note' ? section.parentKind : section.kind
  if (context === 'slots' && has('name'))
    return 'slots'
  if (context === 'events')
    return 'events'
  return null
}

export function groupHeading(sectionHeading: string, label: string, kind: ApiKind): string {
  if (label && classify(label) === kind)
    return label
  return sectionHeading || label
}

export function practicesFrom(tables: TableRow[][]): Practice[] {
  return tables.flatMap(rows => rows.map(row => ({
    guidance: row.name,
    text: row.description ?? '',
  })).filter(item => item.guidance && item.text))
}

export function stripTables(source: string): string {
  return mapOutsideFences(source, text => text
    .replace(/<div[^>]*class="component-api-table"[\s\S]*?<\/div>/g, '')
    .replace(/<table\b[\s\S]*?<\/table>/gi, '')
    .replace(/^\s*\|.*$/gm, '')
    .replace(/^\s*[|:-]+\s*$/gm, ''))
}

/** Renders rows that are not an API table as a plain bullet list. */
export function renderRows(rows: TableRow[]): string {
  return rows.map((row) => {
    const detail = [row.type, row.default, row.payload, row.description].filter(Boolean).join(' — ')
    return detail ? `- ${row.name}: ${detail}` : `- ${row.name}`
  }).join('\n')
}

export function splitMarkdownRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cellText(cell))
}

export function isSeparator(line: string): boolean {
  const cells = splitMarkdownRow(line)
  return cells.length > 1 && cells.every(cell => /^:?-{3,}:?$/.test(cell))
}

function cellText(value: string): string {
  const withCode = value.replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
  const withoutTags = withCode.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')
  return decodeHtml(withoutTags).replace(/\s+/g, ' ').trim()
}
