import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { assembleCatalog, parseDemoMetaFields } from '../apps/docs/components/demo-infra/demoMeta'
import { buildSidebar } from '../apps/docs/components/demo-infra/sidebarTree'

const demosDir = join(process.cwd(), 'apps/docs/components/demos')
const COMPONENT_CATALOG = assembleCatalog(
  readdirSync(demosDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => parseDemoMetaFields(readFileSync(join(demosDir, entry.name, 'meta.ts'), 'utf8'))),
)
const sidebarItems = (locale: 'en' | 'zh') => buildSidebar(COMPONENT_CATALOG, locale)

describe('sidebar families', () => {
  const items = sidebarItems('en')
  const families = items.filter(item => item.kind === 'family')

  it('lists every page exactly once', () => {
    const slugs = items.flatMap(item => (item.kind === 'family' ? item.entries.map(entry => entry.slug) : [item.entry.slug]))
    expect(slugs.toSorted()).toEqual(COMPONENT_CATALOG.map(entry => entry.slug).toSorted())
  })

  it('keeps a page hidden from the overview in the sidebar', () => {
    // 同上游 NavMenu.doc.mjs 的 isHiddenFromOverview：总览里没有卡片，侧栏照常列出。
    const entry = COMPONENT_CATALOG.find(item => item.slug === 'nav-heading-menu')
    expect(entry?.isHiddenFromOverview).toBe(true)
    expect(COMPONENT_CATALOG.find(item => item.slug === 'nav-menu')?.isHiddenFromOverview).toBeUndefined()
    const navigation = families.find(item => item.id === 'Navigation')
    expect(navigation?.entries.map(item => item.slug)).toContain('nav-heading-menu')
  })

  it('nests sub-components and hooks under their parent, components before hooks', () => {
    const dialog = families.find(item => item.id === 'Dialog')
    expect(dialog?.entries.map(entry => entry.slug)).toEqual([
      'alert-dialog',
      'dialog',
      'dialog-header',
      'use-imperative-alert-dialog',
      'use-imperative-dialog',
    ])
  })

  it('sorts by display name with spaces ignored, and keeps utilities last', () => {
    const indicator = families.find(item => item.id === 'Indicator')
    expect(indicator?.entries.map(entry => entry.en)).toEqual(['Checkbox Indicator', 'Check Indicator', 'Radio Indicator'])
    expect(items.at(-1)).toMatchObject({ kind: 'family', id: 'Utilities' })
    expect(items.slice(0, 4).map(item => (item.kind === 'family' ? item.id : item.entry.en))).toEqual(['App Shell', 'Aspect Ratio', 'Avatar', 'Badge'])
  })

  it('translates family titles but keeps the English order', () => {
    expect(sidebarItems('zh').map(item => (item.kind === 'family' ? item.id : item.entry.slug)))
      .toEqual(items.map(item => (item.kind === 'family' ? item.id : item.entry.slug)))
  })
})
