import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { sharedEditorTheme } from './editor/theme.js'

const css = readFileSync(resolve(process.cwd(), 'packages/richtext/styles/richtext-document.css'), 'utf8')
const theme = sharedEditorTheme()

describe('富文本表格的格线和外沿', () => {
  it('主题把表格槽位映射到下面这些类名', () => {
    expect(theme.table).toBe('astryx-richtext__table')
    expect(theme.tableRow).toBe('astryx-richtext__table-row')
    expect(theme.tableCell).toBe('astryx-richtext__table-cell')
  })

  it('表格元素画外沿，collapse 后和格线合成一条线而不是双线', () => {
    expect(css).toMatch(/\.astryx-richtext__table \{[^}]*border: 1px solid var\(--astryx-color-border, #ebebeb\);[^}]*border-collapse: collapse;/)
  })

  it('每个格子画行尾列线，最后一列不画，外沿交给表格边框', () => {
    expect(css).toMatch(/\.astryx-richtext__table-cell:not\(:last-child\) \{\n\s{4}border-inline-end: 1px solid var\(--astryx-color-border, #ebebeb\);\n\s{2}\}/)
  })

  it('最后一行的行线交给表格边框：去掉而不是设成透明，透明会压过表格边框让底边少一条线', () => {
    expect(css).toContain('.astryx-richtext__table-row:last-child { border-block-end: 0; }')
    expect(css).not.toContain('.astryx-richtext__table-row:last-child { border-block-end-color: transparent; }')
  })
})
