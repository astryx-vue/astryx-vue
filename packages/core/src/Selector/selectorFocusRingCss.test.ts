// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const css = readFileSync('packages/core/styles/selector.css', 'utf8')

describe('幽灵和次要 Selector 的焦点环', () => {
  it('触发器聚焦时环画在外框，清除按钮聚焦时环画在它自己身上', () => {
    const rule = /\.astryx-selector-field:is\(\.is-ghost, \[data-variant='secondary'\]\):has\(\.astryx-selector-trigger:focus-visible\),\s*\.astryx-selector-field:is\(\.is-ghost, \[data-variant='secondary'\]\) \.astryx-selector-clear:focus-visible\s*\{([^}]+)\}/.exec(css)
    expect(rule?.[1]).toContain('outline:')
  })

  it('环写在无层级的样式里，盖得过无层级的 outline: none', () => {
    const index = css.indexOf(':has(.astryx-selector-trigger:focus-visible)')
    const suppressed = css.indexOf('.astryx-selector-trigger:focus,')
    expect(index).toBeGreaterThan(suppressed)
    expect(css.slice(suppressed, index)).not.toMatch(/@layer/)
  })
})
