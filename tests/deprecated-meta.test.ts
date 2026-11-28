import { describe, expect, it } from 'vitest'
import { parseDemoMetaFields } from '../apps/docs/components/demo-infra/demoMeta'
import { deprecatedSearchRowCss } from '../apps/docs/components/demo-infra/deprecatedSearchRows'

const DEPRECATED_META = `export const meta = {
  slug: 'old-thing',
  group: 'Overlay',
  order: 2,
  en: 'Old Thing',
  zh: '旧组件',
  deprecated: {
    replacement: 'new-thing',
    description: {
      en: 'Use NewThing { with braces } and it\\'s fine.',
      zh: '改用 NewThing。',
    },
  },
}`

describe('meta.ts 里的 deprecated', () => {
  it('读出替代组件和两种语言的说明，块里的 en / zh 不当成标题', () => {
    expect(parseDemoMetaFields(DEPRECATED_META)).toEqual({
      slug: 'old-thing',
      group: 'Overlay',
      order: 2,
      en: 'Old Thing',
      zh: '旧组件',
      deprecated: {
        replacement: 'new-thing',
        description: { en: 'Use NewThing { with braces } and it\'s fine.', zh: '改用 NewThing。' },
      },
    })
  })

  it('块写在标题前面也不影响标题', () => {
    const reordered = `export const meta = {
  deprecated: { replacement: 'new-thing', description: { en: 'Move.', zh: '迁移。' } },
  slug: 'old-thing', group: 'Overlay', order: 2, en: 'Old Thing', zh: '旧组件',
}`
    expect(parseDemoMetaFields(reordered)).toMatchObject({ en: 'Old Thing', zh: '旧组件', deprecated: { replacement: 'new-thing' } })
  })

  it('没有 deprecated 时不带这个字段', () => {
    expect(parseDemoMetaFields(`slug: 'a', group: 'Overlay', order: 1, en: 'A', zh: '甲'`)).not.toHaveProperty('deprecated')
  })
})

describe('站内搜索的废弃标记', () => {
  const entries = [
    { slug: 'old-thing', group: 'Overlay', en: 'Old Thing', zh: '旧组件', deprecated: { replacement: 'new-thing', description: { en: 'x', zh: 'x' } } },
    { slug: 'new-thing', group: 'Overlay', en: 'New Thing', zh: '新组件' },
  ] as const

  it('只给废弃组件的页面、小节和子页的结果行加标记，中英文各一份文案', () => {
    const css = deprecatedSearchRowCss(entries)
    expect(css).toContain('[href$="/components/old-thing"]')
    expect(css).toContain('[href*="/components/old-thing#"]')
    expect(css).toContain('[href*="/components/old-thing/"]')
    expect(css).not.toContain('new-thing')
    expect(css).toContain('\'已废弃\'')
    expect(css).toContain('\'Deprecated\'')
  })

  it('没有废弃组件时不生成样式', () => {
    expect(deprecatedSearchRowCss([entries[1]])).toBe('')
  })
})
