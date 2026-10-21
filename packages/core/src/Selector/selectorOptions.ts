import type { SelectorEntry, SelectorOption, SelectorSection } from '../Selector/types.js'

export interface SelectorDisplayRow {
  kind: 'section' | 'option'
  title?: string
  option?: SelectorOption
  index?: number
}

export function isSelectorSection(entry: SelectorEntry | SelectorOption | SelectorSection): entry is SelectorSection {
  return typeof entry === 'object' && entry !== null && 'type' in entry && entry.type === 'section'
}

export function asSelectorOption(entry: SelectorOption | string): SelectorOption {
  if (typeof entry === 'string')
    return { value: entry, label: entry }
  return entry
}

export function normalizeSelectorEntries(options: readonly SelectorEntry[]): Array<SelectorOption | SelectorSection> {
  return options.map((entry) => {
    if (isSelectorSection(entry))
      return { ...entry, options: entry.options.map(asSelectorOption) }
    return asSelectorOption(entry)
  })
}

export function flattenSelectorOptions(entries: readonly (SelectorOption | SelectorSection)[]): SelectorOption[] {
  return entries.flatMap(entry => isSelectorSection(entry) ? [...entry.options] : [entry])
}

export function buildSelectorRows(
  entries: readonly (SelectorOption | SelectorSection)[],
  filtered: readonly { value: string | number }[],
): SelectorDisplayRow[] {
  const indexByValue = new Map(filtered.map((option, index) => [option.value, index]))
  const rows: SelectorDisplayRow[] = []
  for (const entry of entries) {
    if (isSelectorSection(entry)) {
      const children = entry.options.filter(option => indexByValue.has(option.value))
      if (children.length === 0)
        continue
      rows.push({ kind: 'section', title: entry.title })
      for (const option of children)
        rows.push({ kind: 'option', option, index: indexByValue.get(option.value) })
      continue
    }
    if (!indexByValue.has(entry.value))
      continue
    rows.push({ kind: 'option', option: entry, index: indexByValue.get(entry.value) })
  }
  return rows
}
