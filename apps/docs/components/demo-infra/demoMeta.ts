import type { ComponentGroup } from './groups'
import type { DemoModule } from './types'
import { COMPONENT_GROUPS } from './groups'

export interface DemoMeta {
  slug: string
  group: ComponentGroup
  /** Position inside the group. Lower numbers stay higher in the sidebar. */
  order: number
  en: string
  zh: string
  demo: DemoModule
}

export interface CatalogEntry {
  slug: string
  group: ComponentGroup
  en: string
  zh: string
}

export interface CatalogMetaInput {
  slug: string
  group: string
  order: number
  en: string
  zh: string
}

const GROUP_INDEX = new Map(COMPONENT_GROUPS.map((group, index) => [group, index]))

export function assembleCatalog(metas: readonly CatalogMetaInput[]): CatalogEntry[] {
  const slugs = new Set<string>()
  for (const meta of metas) {
    if (slugs.has(meta.slug))
      throw new Error(`duplicate component slug: ${meta.slug}`)
    slugs.add(meta.slug)
    if (!GROUP_INDEX.has(meta.group as ComponentGroup))
      throw new Error(`unknown component group "${meta.group}" on ${meta.slug}`)
  }

  return [...metas].sort((a, b) => {
    const groupOrder = (GROUP_INDEX.get(a.group as ComponentGroup) ?? 0) - (GROUP_INDEX.get(b.group as ComponentGroup) ?? 0)
    if (groupOrder !== 0)
      return groupOrder
    if (a.order !== b.order)
      return a.order - b.order
    return a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0
  }).map(meta => ({
    slug: meta.slug,
    group: meta.group as ComponentGroup,
    en: meta.en,
    zh: meta.zh,
  }))
}

/** Read the catalog fields out of a meta.ts source without executing it. */
export function parseDemoMetaFields(source: string): CatalogMetaInput {
  function readString(name: string): string {
    const match = source.match(new RegExp(`\\b${name}:\\s*'((?:\\\\'|[^'])*)'`))
    if (!match)
      throw new Error(`meta.ts is missing ${name}`)
    return match[1].replace(/\\'/g, '\'')
  }

  const order = source.match(/\border:\s*(\d+)/)
  if (!order)
    throw new Error('meta.ts is missing order')

  return {
    slug: readString('slug'),
    group: readString('group'),
    order: Number(order[1]),
    en: readString('en'),
    zh: readString('zh'),
  }
}
