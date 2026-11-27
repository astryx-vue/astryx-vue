import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/markdown.css'), 'utf8')

function rule(selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, selector).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

describe('markdown 列表待在正文这一栏里', () => {
  it('列表不向两侧外扩，宽度不超过正文这一栏', () => {
    const list = rule('.astryx-markdown :is(ul, ol).astryx-markdown__list')
    expect(list).toContain('margin-inline: 0;')
    expect(list).toContain('width: 100%;')
    expect(list).toContain('max-width: var(--astryx-markdown-measure, 100%);')
    expect(list).not.toMatch(/calc\(-1/)
    expect(list).not.toMatch(/calc\(100% \+/)
  })

  it('列表项和任务项行内不留左右边距，让序号和勾选框落在栏边上', () => {
    const row = rule('.astryx-markdown__item,\n  .astryx-markdown__task')
    expect(row).toContain('padding-inline: 0;')
  })
})
