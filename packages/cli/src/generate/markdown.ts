import type { Practice, TableGroup, TableRow } from '../catalog-types.ts'
import type { PageExample } from './markdown/examples.ts'
import { extractExamples } from './markdown/examples.ts'
import { firstParagraph, pickSummary } from './markdown/prose.ts'
import { isApiKind, splitSections } from './markdown/sections.ts'
import { groupHeading, isSeparator, parseTables, practicesFrom, renderRows, splitMarkdownRow, stripTables, tableApiKind } from './markdown/tables.ts'
import { cleanMarkdown, frontmatterTitle, headingLevel, tidy } from './markdown/text.ts'

/**
 * Reads a docs page written in Markdown and returns the parts the CLI catalog
 * needs: summary, usage, best practices, API tables, notes, examples, and the
 * import line. `extractTopic` does the same for guide pages that are not about
 * one component.
 */

export type { PageExample } from './markdown/examples.ts'
export { extractExamples } from './markdown/examples.ts'
export { firstParagraph, firstSentence, paragraphContaining } from './markdown/prose.ts'
export { cleanMarkdown } from './markdown/text.ts'

export interface PageExtract {
  summary: string
  usage: string
  practices: Practice[]
  props: TableGroup[]
  slots: TableGroup[]
  events: TableGroup[]
  notes: { heading: string, text: string }[]
  examples: PageExample[]
  importPath: string | null
  exportName: string | null
}

/** An import from any astryx-vue package: `@astryx-vue/core/Button`, `@astryx-vue/lab`. */
const IMPORT_PATTERN = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"](@astryx-vue\/[a-z-]+(?:\/[^'"]+)?)['"]/g

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
      const items = practicesFrom(tables.map(table => table.rows))
      practices.push(...items)
      if (prose)
        notes.push({ heading: section.heading, text: prose })
      continue
    }
    const leftover: TableRow[][] = []
    for (const table of tables) {
      const kind = tableApiKind(section, table)
      if (!kind) {
        leftover.push(table.rows)
        continue
      }
      const group = { heading: groupHeading(section.heading, table.label, kind), rows: table.rows }
      if (kind === 'props')
        props.push(group)
      else if (kind === 'slots')
        slots.push(group)
      else
        events.push(group)
    }
    const rendered = leftover.map(rows => renderRows(rows)).filter(Boolean)
    if (isApiKind(section.kind)) {
      if (prose)
        notes.push({ heading: section.heading, text: prose })
      if (rendered.length > 0)
        notes.push({ heading: section.heading, text: rendered.join('\n\n') })
      continue
    }
    if (rendered.length > 0 || prose) {
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
    examples: extractExamples(markdown),
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

function findImport(source: string, exportName: string): { importPath: string, exportName: string } | null {
  for (const match of source.matchAll(IMPORT_PATTERN)) {
    const names = match[1].split(',').map(part => part.replace(/^type\s+/, '').split(/\s+as\s+/)[0]?.trim() ?? '').filter(Boolean)
    if (names.includes(exportName))
      return { importPath: match[2], exportName }
  }
  return null
}
