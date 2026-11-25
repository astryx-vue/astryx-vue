// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/kbd.css'), 'utf8')

describe('kbd 键帽尺寸', () => {
  it('字号变大时键帽跟着长高，默认字号下保持主题高度', () => {
    const rule = /\.astryx-kbd__key\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(rule).toMatch(/height: var\(--astryx-spacing-5, 20px\);/)
    expect(rule).toMatch(/min-height: 1lh;/)
  })
})
