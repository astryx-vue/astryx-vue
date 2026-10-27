import type { LocaleText } from '../catalog-types.ts'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cleanMarkdown } from './markdown.ts'
import { DOCS_ORIGIN } from './site.ts'

/**
 * The upgrade guide is one docs page: what changed, how it was written before,
 * how it is written now, and what to do. `upgrade` prints its sections and uses
 * the old names it names to look through the reader's own files, so the command
 * never grows a second copy of the migration notes.
 */
export interface UpgradeSection {
  title: string
  body: string
}

/** An old name the guide replaces: what to search for, and what to write instead. */
export interface UpgradeRename {
  from: string
  to: string
}

export interface UpgradeRecord {
  sections: { en: UpgradeSection[], zh: UpgradeSection[] }
  /** Read from the English page: identifiers are the same in both languages. */
  renames: UpgradeRename[]
  guideUrl: LocaleText
  changelogUrl: LocaleText
}

export async function buildUpgrade(repoRoot: string): Promise<UpgradeRecord> {
  const en = await readFile(join(repoRoot, 'apps/docs/docs/en/guide/migration.md'), 'utf8')
  const zh = await readFile(join(repoRoot, 'apps/docs/docs/zh/guide/migration.md'), 'utf8')
  return {
    sections: { en: readSections(en), zh: readSections(zh) },
    renames: readRenames(en),
    guideUrl: { en: `${DOCS_ORIGIN}/en/guide/migration`, zh: `${DOCS_ORIGIN}/guide/migration` },
    changelogUrl: { en: `${DOCS_ORIGIN}/en/guide/changelog`, zh: `${DOCS_ORIGIN}/guide/changelog` },
  }
}

/** A table row's cells, trimmed, or null when the line is not a row. */
function parseRow(line: string): string[] | null {
  const trimmed = line.trim()
  if (trimmed.length < 2 || !trimmed.startsWith('|') || !trimmed.endsWith('|'))
    return null
  return trimmed.slice(1, -1).split('|').map(cell => cell.trim())
}

/** Every `###` section of the guide, without the parts that need no change. */
function readSections(markdown: string): UpgradeSection[] {
  const body = cleanMarkdown(markdown)
  const sections: { title: string, lines: string[] }[] = []
  for (const line of body.split('\n')) {
    const heading = /^### (.*)$/.exec(line)
    if (heading) {
      sections.push({ title: heading[1]!.trim(), lines: [] })
      continue
    }
    if (line.startsWith('## '))
      sections.push({ title: '', lines: [] })
    if (sections.length > 0)
      sections.at(-1)!.lines.push(line)
  }
  return sections
    .filter(section => section.title !== '')
    .map(section => ({ title: section.title, body: section.lines.join('\n').trim() }))
}

/**
 * The renames the guide states outright: a section title saying an old name "is
 * now" the new one, an option that "takes `new` instead of `old`", and the rows
 * of a `Removed | Use instead` table. Anything else the guide says in prose
 * stays prose.
 */
function readRenames(markdown: string): UpgradeRename[] {
  const renames = new Map<string, string>()
  const add = (from: string, to: string): void => {
    const key = from.trim()
    const value = to.trim()
    if (key && value && key !== value && !renames.has(key))
      renames.set(key, value)
  }
  for (const section of readSections(markdown)) {
    // `` `old` is now `new` ``, also when the title names the component first:
    // "Selector `variant=\"default\"` is now `variant=\"input\"`".
    const names = [...section.title.matchAll(/`([^`]+)`/g)].map(match => match[1]!.trim())
    if (names.length >= 2 && section.title.includes(' is now '))
      add(names[0]!, names[1]!)
    const insteadOf = /takes `([^`]+)` instead of `([^`]+)`/.exec(section.title)
    if (insteadOf)
      add(insteadOf[2]!, insteadOf[1]!)
    for (const [from, to] of readRenameTable(section.body))
      add(from, to)
  }
  return [...renames].map(([from, to]) => ({ from, to }))
}

/**
 * The rows of the one table shape that states a rename: a header of
 * `Removed | Use instead`. Other tables in the guide compare wording, not names,
 * so they are not search terms.
 */
function readRenameTable(body: string): [string, string][] {
  const rows: [string, string][] = []
  let inTable = false
  for (const line of body.split('\n')) {
    const row = parseRow(line)
    if (row === null) {
      inTable = false
      continue
    }
    if (row[0] === 'Removed' && row[1] === 'Use instead') {
      inTable = true
      continue
    }
    if (!inTable || row.every((cell: string) => /^-+$/.test(cell)))
      continue
    const to = splitNames(row[1] ?? '')
    for (const [index, from] of splitNames(row[0] ?? '').entries())
      rows.push([from, to[index] ?? to[0] ?? ''])
  }
  return rows
}

/** `a`, `b`, `c` in backticks, or the plain cell text when it names one thing. */
function splitNames(cell: string): string[] {
  const names = [...cell.matchAll(/`([^`]+)`/g)].map(match => match[1]!.trim()).filter(Boolean)
  return names.length > 0 ? names : [cell.replace(/`/g, '').trim()]
}
