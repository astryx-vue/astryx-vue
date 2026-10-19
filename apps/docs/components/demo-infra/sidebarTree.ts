import type { CatalogEntry } from './demoMeta'
import type { DocsLocale } from './docs-i18n'
import type { ComponentFamily } from './families'
import { COMPONENT_FAMILIES, LAST_FAMILY } from './families'

const LAST_SORT_KEY = '\u0000last'

export interface SidebarFamily {
  kind: 'family'
  id: ComponentFamily
  title: string
  entries: readonly CatalogEntry[]
}

export interface SidebarLink {
  kind: 'link'
  entry: CatalogEntry
}

export type SidebarItem = SidebarFamily | SidebarLink

/** The original sidebar sorts by display name with spaces removed, ignoring case. */
function nameKey(en: string): string {
  return en.replace(/\s+/g, '')
}

function compareNames(a: string, b: string): number {
  return nameKey(a).localeCompare(nameKey(b), 'en', { sensitivity: 'base' })
}

/** Components first, then hooks (`use-*`); each part by name. */
function compareInFamily(a: CatalogEntry, b: CatalogEntry): number {
  const hookOrder = Number(a.slug.startsWith('use-')) - Number(b.slug.startsWith('use-'))
  return hookOrder !== 0 ? hookOrder : compareNames(a.en, b.en)
}

/**
 * The sidebar tree: a family nests its components and hooks, any other page is
 * a plain link. Entries sort by English name in both languages so the two
 * sidebars keep the same order; the utilities family always comes last.
 */
export function buildSidebar(catalog: readonly CatalogEntry[], locale: DocsLocale): SidebarItem[] {
  const families = new Map<ComponentFamily, CatalogEntry[]>()
  const items: Array<SidebarItem & { sortKey: string }> = []
  for (const entry of catalog) {
    if (entry.family === undefined) {
      items.push({ kind: 'link', entry, sortKey: entry.en })
      continue
    }
    const members = families.get(entry.family) ?? []
    members.push(entry)
    families.set(entry.family, members)
  }
  for (const [id, entries] of families) {
    items.push({
      kind: 'family',
      id,
      title: COMPONENT_FAMILIES[id][locale],
      entries: entries.sort(compareInFamily),
      sortKey: id === LAST_FAMILY ? LAST_SORT_KEY : COMPONENT_FAMILIES[id].en,
    })
  }
  return items
    .sort((a, b) => a.sortKey === b.sortKey ? 0 : a.sortKey === LAST_SORT_KEY ? 1 : b.sortKey === LAST_SORT_KEY ? -1 : compareNames(a.sortKey, b.sortKey))
    .map(({ sortKey: _sortKey, ...item }) => item as SidebarItem)
}
