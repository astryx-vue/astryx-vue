// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/tree-list.css'), 'utf8')

describe('tree list 全宽嵌套行', () => {
  it('把缩进放在行内，并让 guide 保持可读但不拦截指针', () => {
    expect(css).toContain('.astryx-tree-list__indented')
    expect(css).toContain('padding-inline-start: var(--_tree-indent, 0px)')
    expect(css).not.toContain('margin-inline-start: var(--_tree-indent')
    const guide = /\.astryx-tree-list__guide\s*\{([^}]+)\}/.exec(css)?.[1] ?? ''
    expect(guide).toContain('z-index: 1')
    expect(guide).toContain('pointer-events: none')
  })
})

describe('tree list 内部焦点', () => {
  it('内部按钮或链接聚焦时，整行画出焦点环', () => {
    const focusRule = /\.astryx-tree-list__item:has\(:focus-visible\) > \.astryx-tree-list__row > \.astryx-tree-list__content\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(focusRule).toContain('--astryx-focus-outline-width')
    expect(focusRule).toContain('outline-offset')
  })
})
