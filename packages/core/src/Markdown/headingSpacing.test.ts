import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Markdown from './Markdown.vue'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/markdown.css'), 'utf8')

describe('markdown 标题间距看源文档深度', () => {
  it('headingLevelStart=2 时，# 渲染成 h2、## 渲染成 h3，深度仍是 1、2', () => {
    const wrapper = mount(Markdown, { props: { headingLevelStart: 2, content: '# A\n\n## B\n\n#### C' } })
    const headings = wrapper.findAll('.astryx-markdown__heading')
    expect(headings.map(item => item.element.tagName)).toEqual(['H2', 'H3', 'H5'])
    expect(headings.map(item => item.attributes('data-depth'))).toEqual(['1', '2', '4'])
  })

  it('大标题（深度 1–3）取 24/12，小标题取 16/8，紧凑密度取 16/8 与 12/4', () => {
    expect(css).toMatch(/\[data-depth='1'\], \[data-depth='2'\], \[data-depth='3'\]\) \{\s*--_md-heading-top: var\(--astryx-spacing-6, 24px\);\s*--_md-heading-bottom: var\(--astryx-spacing-3, 12px\)/)
    expect(css).toMatch(/margin-block: var\(--_md-heading-top, var\(--astryx-spacing-4, 16px\)\) var\(--_md-heading-bottom, var\(--astryx-spacing-2, 8px\)\)/)
    expect(css).toMatch(/\[data-density='compact'\] \.astryx-markdown__heading \{\s*--_md-heading-top: var\(--astryx-spacing-3, 12px\);\s*--_md-heading-bottom: var\(--astryx-spacing-1, 4px\)/)
    expect(css).toMatch(/\[data-density='compact'\] \.astryx-markdown__heading:is\(\[data-depth='1'\], \[data-depth='2'\], \[data-depth='3'\]\) \{\s*--_md-heading-top: var\(--astryx-spacing-4, 16px\);\s*--_md-heading-bottom: var\(--astryx-spacing-2, 8px\)/)
  })

  it('开头和结尾的标题去掉外侧边距，规则特异性不低于标题自己的间距规则', () => {
    expect(css).toContain('.astryx-markdown > .astryx-heading.astryx-markdown__heading:first-child {\n    margin-block-start: 0;')
    expect(css).toContain('.astryx-markdown > .astryx-heading.astryx-markdown__heading:last-child {\n    margin-block-end: 0;')
  })
})
