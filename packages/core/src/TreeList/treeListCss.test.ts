// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/tree-list.css'), 'utf8')

describe('tree list 内部焦点', () => {
  it('内部按钮或链接聚焦时，整行画出焦点环', () => {
    const focusRule = /\.astryx-tree-list__item:has\(:focus-visible\)[^{]*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(focusRule).toContain('--astryx-focus-outline-width')
    expect(focusRule).toContain('outline-offset')
  })
})
