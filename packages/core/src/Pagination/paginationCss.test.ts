// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/pagination.css'), 'utf8')

describe('pagination dots 焦点与禁用外观', () => {
  it('aria-disabled 保留禁用外观，键盘焦点使用统一焦点环', () => {
    expect(css).toContain('.astryx-pagination-dot[aria-disabled=\'true\']')
    const focusRule = /\.astryx-pagination-dot:focus-visible\s*\{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(focusRule).toContain('--astryx-focus-outline-width')
    expect(focusRule).toContain('outline-offset')
  })
})
