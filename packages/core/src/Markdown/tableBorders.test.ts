import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Markdown from './Markdown.vue'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/markdown.css'), 'utf8')

const table = '| Name | Kind |\n| --- | --- |\n| Alpha | row |\n| Beta | row |'

describe('markdown 表格的格线和外沿', () => {
  it('每个格子都带 cell 类，行尾是 td/th，列线规则能落到最后一列之外', () => {
    const wrapper = mount(Markdown, { props: { content: table } })
    expect(wrapper.find('table.astryx-markdown__table').exists()).toBe(true)
    const rows = wrapper.findAll('tr')
    expect(rows).toHaveLength(3)
    rows.forEach((row) => {
      expect(row.findAll('.astryx-markdown__cell')).toHaveLength(2)
      // 最后一列的格子是行尾，`:not(:last-child)` 因此不给它画列线。
      expect(row.element.lastElementChild?.classList.contains('astryx-markdown__cell')).toBe(true)
    })
  })

  it('表格元素画外沿，collapse 后和格线合成一条线而不是双线', () => {
    expect(css).toMatch(/\.astryx-markdown__table \{[^}]*border: var\(--astryx-border-width, 1px\) solid var\(--astryx-color-border, #ebebeb\);[^}]*border-collapse: collapse;/)
  })

  it('行线是格子的底边，最后一行不画，底边由表格外沿收口', () => {
    expect(css).toMatch(/\.astryx-markdown__cell \{[^}]*border-block-end: var\(--astryx-border-width, 1px\) solid var\(--astryx-color-border, #ebebeb\);/)
    expect(css).toContain('.astryx-markdown__table tbody tr:last-child > .astryx-markdown__cell {\n    border-block-end: 0;')
  })

  it('列线是格子的行尾边，最后一列不画，外沿交给表格边框', () => {
    expect(css).toMatch(/\.astryx-markdown__cell:not\(:last-child\) \{\n\s{4}border-inline-end: var\(--astryx-border-width, 1px\) solid var\(--astryx-color-border, #ebebeb\);\n\s{2}\}/)
  })
})
