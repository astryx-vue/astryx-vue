import type { Practice, TableGroup, TableRow } from './catalog-types.ts'

const REQUIRED_DEFAULTS = new Set(['required', '必需', '必填'])

type Column = keyof TableRow

const HEADERS: Record<Column, string> = {
  name: 'Name',
  type: 'Type',
  default: 'Default',
  payload: 'Payload',
  description: 'Description',
}

/** Drops the Default column when the rows do not use it, which is the common case for return values. */
export function propColumns(group: TableGroup): Column[] {
  return group.rows.some(row => row.default !== undefined)
    ? ['name', 'type', 'default', 'description']
    : ['name', 'type', 'description']
}

/** A markdown table with a three-dash rule under each header cell, so the rule costs the same however wide a cell grows. */
export function formatTable(group: TableGroup, columns: Column[]): string {
  const render = (cells: string[]): string => `| ${cells.join(' | ')} |`
  return [
    render(columns.map(column => HEADERS[column])),
    render(columns.map(() => '---')),
    ...group.rows.map(row => render(columns.map(column => row[column] ?? ''))),
  ].join('\n')
}

/**
 * One prop per line: name, type, default, the required marker, then the
 * description. A list item needs no cell escaping, so a union type keeps its
 * pipes as written.
 */
export function formatPropsList(group: TableGroup, zh: boolean): string {
  return group.rows.map((row) => {
    const hasDefault = Boolean(row.default) && !/^[—-]$/.test(row.default as string)
    const required = hasDefault && REQUIRED_DEFAULTS.has(row.default as string)
    const value = hasDefault && !required ? ` = ${row.default}` : ''
    const marker = required ? (zh ? ' **（必需）**' : ' **(required)**') : ''
    return `- ${row.name}: ${row.type ?? ''}${value}${marker}${row.description ? ` - ${row.description}` : ''}`
  }).join('\n')
}

/**
 * Best practices with one `Do:` or `Don't:` label line before each run of
 * items that share guidance. A blank line separates runs, so each run stays
 * its own markdown list.
 */
export function formatPractices(practices: readonly Practice[]): string[] {
  const lines: string[] = []
  let previous: string | undefined
  for (const practice of practices) {
    if (practice.guidance !== previous) {
      if (previous !== undefined)
        lines.push('')
      lines.push(`${practice.guidance}:`)
      previous = practice.guidance
    }
    lines.push(`- ${practice.text}`)
  }
  return lines
}
