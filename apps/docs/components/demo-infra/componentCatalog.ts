import type { CatalogEntry, DemoMeta } from './demoMeta'
import type { DocsLocale } from './docs-i18n'
import type { ComponentGroup } from './groups'
import { assembleCatalog } from './demoMeta'
import { COMPONENT_GROUPS, GROUP_TITLES } from './groups'

export type { ComponentGroup }
export { COMPONENT_GROUPS, GROUP_TITLES }

const metaModules = import.meta.glob<DemoMeta>(
  '../demos/*/meta.ts',
  { eager: true, import: 'meta' },
)

/**
 * Every documented component. Sidebar, catalog page, and route parser all read
 * this list. Add `demos/<slug>/meta.ts` instead of editing the list by hand.
 */
export const COMPONENT_CATALOG: readonly CatalogEntry[] = assembleCatalog(Object.values(metaModules))

export type ComponentSlug = (typeof COMPONENT_CATALOG)[number]['slug']

export type ComponentCatalogEntry = CatalogEntry

export const COMPONENT_SLUGS: readonly ComponentSlug[] = COMPONENT_CATALOG.map(entry => entry.slug)

export function isComponentSlug(value: string): value is ComponentSlug {
  return (COMPONENT_SLUGS as readonly string[]).includes(value)
}

export function componentName(locale: DocsLocale, slug: ComponentSlug): string {
  const entry = COMPONENT_CATALOG.find(item => item.slug === slug)
  return entry === undefined ? slug : entry[locale]
}

export interface CatalogGroup {
  id: ComponentGroup
  title: string
  entries: readonly ComponentCatalogEntry[]
}

/**
 * The catalog split into the groups it displays, in display order. Empty groups
 * are dropped.
 */
export function catalogGroups(locale: DocsLocale): CatalogGroup[] {
  return COMPONENT_GROUPS
    .map(group => ({
      id: group,
      title: GROUP_TITLES[locale][group],
      entries: COMPONENT_CATALOG.filter(entry => entry.group === group),
    }))
    .filter(group => group.entries.length > 0)
}
