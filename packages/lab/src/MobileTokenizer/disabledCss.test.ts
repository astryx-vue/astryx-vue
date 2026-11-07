// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/mobile-tokenizer.css'), 'utf8')
const forcedColors = css.split('@media (forced-colors: active)')[1] ?? ''

describe('mobileTokenizer 禁用外观', () => {
  it.each(['.astryx-mobile-tokenizer__trigger', '.astryx-mobile-tokenizer__trigger-placeholder', '.astryx-token', '.astryx-mobile-tokenizer__row'])('%s 在强制颜色模式使用 GrayText', (selector) => {
    expect(forcedColors).toContain(selector)
  })
  it('强制颜色规则使用 GrayText', () => {
    expect(forcedColors).toContain('color: GrayText')
  })
})
