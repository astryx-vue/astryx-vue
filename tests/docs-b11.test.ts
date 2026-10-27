import { describe, expect, it, vi } from 'vitest'
import { parseComponentDocsRoute } from '../apps/docs/components/demo-infra/componentDocsRoute'
import { playgroundSample, PROPS_PLAYGROUNDS } from '../apps/docs/components/demo-infra/propsPlayground'
import accessibilityEn from '../apps/docs/components/demo-infra/reference/accessibility.en.json'
import accessibilityZh from '../apps/docs/components/demo-infra/reference/accessibility.zh.json'
import anatomyEn from '../apps/docs/components/demo-infra/reference/anatomy.en.json'
import anatomyZh from '../apps/docs/components/demo-infra/reference/anatomy.zh.json'
import { ACCESSIBILITY_REQUIREMENTS } from '../apps/docs/components/demo-infra/reference/loadReference'
import { PLAYGROUND_LISTED_TEMPLATE_SLUGS, PLAYGROUND_TEMPLATE_META, PLAYGROUND_TEMPLATE_SLUGS } from '../apps/docs/components/playground/templateManifest'

vi.mock('../apps/docs/components/demo-infra/componentCatalog', () => ({
  COMPONENT_SLUGS: ['button', 'link'],
  isComponentSlug: (value: string) => value === 'button' || value === 'link',
  componentName: (_locale: string, slug: string) => slug,
}))

describe('component docs routes', () => {
  it('reads the accessibility tab', () => {
    expect(parseComponentDocsRoute('/components/button/accessibility')).toMatchObject({
      kind: 'detail',
      locale: 'zh',
      slug: 'button',
      tab: 'accessibility',
    })
    expect(parseComponentDocsRoute('/en/components/link/accessibility')).toMatchObject({
      locale: 'en',
      slug: 'link',
      tab: 'accessibility',
    })
    expect(parseComponentDocsRoute('/components/button/anatomy')).toBeNull()
  })
})

describe('contrast requirements', () => {
  const english = accessibilityEn as Record<string, Array<{ requirement: string, description: string }>>
  const chinese = accessibilityZh as Record<string, Array<{ name: string, description: string }>>

  it('keeps the upstream ratios and does not add checks', () => {
    const allowed = new Set<string>(ACCESSIBILITY_REQUIREMENTS)
    expect(Object.keys(english).sort()).toEqual([
      'button',
      'button-group',
      'checkbox-input',
      'collapsible',
      'icon-button',
      'link',
      'radio-list',
      'segmented-control',
      'slider',
      'switch',
      'tab-list',
      'toggle-button',
    ])
    for (const [slug, items] of Object.entries(english)) {
      expect(chinese[slug]?.length, slug).toBe(items.length)
      for (const [index, item] of items.entries()) {
        expect(allowed.has(item.requirement), `${slug} ${item.requirement}`).toBe(true)
        if (item.requirement.includes('4.5:1'))
          expect(item.description).toContain('4.5:1')
        if (item.requirement.startsWith('3:1'))
          expect(item.description).toContain('3:1')
        const translated = chinese[slug]![index]!
        expect(translated.name.length).toBeGreaterThan(0)
        expect(translated.description.length).toBeGreaterThan(0)
        if (item.description.includes('4.5:1'))
          expect(translated.description).toContain('4.5:1')
        if (item.description.includes('3:1'))
          expect(translated.description).toContain('3:1')
        if (item.description.includes('336'))
          expect(translated.description).toContain('336')
        if (item.description.includes('14 '))
          expect(translated.description).toContain('14')
      }
    }
  })
})

describe('anatomy', () => {
  it('translates every upstream part', () => {
    const english = anatomyEn as Record<string, Array<{ name: string, description: string }>>
    const chinese = anatomyZh as Record<string, Array<{ name: string, description: string }>>
    expect(Object.keys(chinese).sort()).toEqual(Object.keys(english).sort())
    for (const [slug, parts] of Object.entries(english)) {
      expect(chinese[slug]?.length, slug).toBe(parts.length)
      for (const [index, part] of parts.entries()) {
        const translated = chinese[slug]![index]!
        expect(translated.name.length, `${slug} ${part.name}`).toBeGreaterThan(0)
        expect(translated.description.length, `${slug} ${part.name}`).toBeGreaterThan(0)
      }
    }
  })
})

describe('blank playground template', () => {
  it('is a shell template with a title and no other chrome', () => {
    expect(PLAYGROUND_TEMPLATE_SLUGS).toContain('blank')
    expect(PLAYGROUND_TEMPLATE_META.blank).toMatchObject({
      groupEn: 'Shell',
      nameEn: 'Blank',
      nameZh: '空白页',
    })
    // 原版标为未完成的页面能用链接打开，但不出现在菜单和模板索引里。
    expect(PLAYGROUND_TEMPLATE_SLUGS).toContain('incident-console')
    expect(PLAYGROUND_LISTED_TEMPLATE_SLUGS).not.toContain('incident-console')
    expect(PLAYGROUND_LISTED_TEMPLATE_SLUGS).not.toContain('messaging-shell')
  })
})

describe('props playground', () => {
  it('renders a button sample from the current knobs', () => {
    const spec = PROPS_PLAYGROUNDS.button!
    const state = spec.initial('zh')
    state.variant = 'destructive'
    state.disabled = true
    expect(playgroundSample(spec, state, 'zh')).toContain('variant="destructive"')
    expect(playgroundSample(spec, state, 'zh')).toContain('is-disabled')
    expect(playgroundSample(spec, state, 'zh')).toContain('保存更改')
  })
})
