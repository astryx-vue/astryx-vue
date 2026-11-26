// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')
const css = readFileSync(resolve(stylesDir, 'date-input.css'), 'utf8')

function block(selector: string, from = 0): string {
  const start = css.indexOf(`${selector} {`, from)
  expect(start, selector).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

describe('date-input.css', () => {
  it('仍可聚焦的禁用字段聚焦时保留焦点环', () => {
    expect(block('.astryx-date-input-wrapper[data-disabled=\'true\']:focus-within')).toContain('box-shadow: inset 0 0 0 2px')
  })

  it('忙碌的字段不显示悬停环', () => {
    expect(css).toContain('.astryx-date-input-wrapper:hover:not([data-disabled=\'true\']):not([data-busy]):not(:focus-within)')
  })

  it('强制颜色下聚焦的字段（含禁用的）边框用 Highlight', () => {
    const forced = css.indexOf('@media (forced-colors: active)')
    expect(forced).toBeGreaterThanOrEqual(0)
    const rule = block('.astryx-date-input-wrapper[data-disabled=\'true\']:focus-within', forced)
    expect(rule).toContain('border-color: Highlight')
  })

  it('粗指针下焦点样子不渐变', () => {
    const media = css.indexOf('(pointer: coarse) {\n    .astryx-date-input-wrapper')
    const combined = css.indexOf('@media (prefers-reduced-motion: reduce), (pointer: coarse)')
    expect(Math.max(media, combined)).toBeGreaterThanOrEqual(0)
  })

  it('底部面板第一行落在抓手条下面', () => {
    expect(css).toContain('calc(var(--astryx-spacing-6, 24px) - var(--container-padding-block-start, 0px))')
  })
})
