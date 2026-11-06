// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('selector 窄列表', () => {
  it('选项允许收缩，长标签才能省略', () => {
    const css = readFileSync('packages/core/styles/selector.css', 'utf8')
    const rule = /^ {2}\.astryx-selector-option\s*\{([^}]*)\}/m.exec(css)?.[1] ?? ''
    expect(rule).toContain('min-width: 0')
    expect(css).toContain('text-overflow: ellipsis')
    expect(css).toContain('white-space: nowrap')
    const labelRule = /\.astryx-selector-option-label\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(labelRule).toContain('min-width: 0')
    expect(labelRule).toContain('max-width: 100%')
  })
})
