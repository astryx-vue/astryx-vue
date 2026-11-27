import type { ComponentFamily } from './families'
import type { ComponentGroup } from './groups'
import type { DemoModule } from './types'
import { COMPONENT_FAMILIES } from './families'
import { COMPONENT_GROUPS } from './groups'

/** 文档里声明的废弃：改用哪个组件、怎么迁移。侧栏、总览卡片和文档页标题据此标出「已废弃」。 */
export interface ComponentDeprecation {
  /** 替代组件的 slug，必须是目录里已有的组件。 */
  replacement: string
  /** 迁移说明，显示在文档页顶部的提示里。 */
  description: { en: string, zh: string }
}

export interface DemoMeta {
  slug: string
  group: ComponentGroup
  /** Sidebar family this page nests under. Leave it out for a plain sidebar link. */
  family?: ComponentFamily
  /** Position inside the group on the catalog page. Lower numbers come first. */
  order: number
  en: string
  zh: string
  /** 详情页顶部演示用的 demo。没有可视形态的页面（组合式函数）不写。 */
  demo?: DemoModule
  /** 总览卡片的专用静态构图；不写时复用 `demo`。 */
  cardDemo?: DemoModule
  deprecated?: ComponentDeprecation
}

export interface CatalogEntry {
  slug: string
  group: ComponentGroup
  family?: ComponentFamily
  en: string
  zh: string
  deprecated?: ComponentDeprecation
}

export interface CatalogMetaInput {
  slug: string
  group: string
  family?: string
  order: number
  en: string
  zh: string
  deprecated?: ComponentDeprecation
}

const GROUP_INDEX = new Map(COMPONENT_GROUPS.map((group, index) => [group, index]))

export function assembleCatalog(metas: readonly CatalogMetaInput[]): CatalogEntry[] {
  const slugs = new Set<string>()
  const seenOrder = new Map<string, string>()
  for (const meta of metas) {
    if (slugs.has(meta.slug))
      throw new Error(`duplicate component slug: ${meta.slug}`)
    slugs.add(meta.slug)
    if (!GROUP_INDEX.has(meta.group as ComponentGroup))
      throw new Error(`unknown component group "${meta.group}" on ${meta.slug}`)
    if (meta.family !== undefined && !(meta.family in COMPONENT_FAMILIES))
      throw new Error(`unknown sidebar family "${meta.family}" on ${meta.slug}`)
    const orderKey = `${meta.group}\0${meta.order}`
    const previous = seenOrder.get(orderKey)
    if (previous)
      throw new Error(`duplicate sidebar order ${meta.order} in group "${meta.group}": ${previous} and ${meta.slug}`)
    seenOrder.set(orderKey, meta.slug)
  }
  for (const meta of metas) {
    const replacement = meta.deprecated?.replacement
    if (replacement !== undefined && (replacement === meta.slug || !slugs.has(replacement)))
      throw new Error(`deprecated ${meta.slug} names an unknown replacement "${replacement}"`)
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
    ...(meta.family === undefined ? {} : { family: meta.family as ComponentFamily }),
    en: meta.en,
    zh: meta.zh,
    ...(meta.deprecated === undefined ? {} : { deprecated: meta.deprecated }),
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

  const family = source.match(/\bfamily:\s*'((?:\\'|[^'])*)'/)

  return {
    slug: readString('slug'),
    group: readString('group'),
    ...(family === null ? {} : { family: family[1].replace(/\\'/g, '\'') }),
    order: Number(order[1]),
    en: readString('en'),
    zh: readString('zh'),
  }
}
