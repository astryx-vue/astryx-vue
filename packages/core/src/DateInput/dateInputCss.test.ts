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

  it('抓手条下面的 24px 由底部面板自己留，选择面板不再补', () => {
    expect(css).not.toContain('calc(var(--astryx-spacing-6, 24px) - var(--container-padding-block-start, 0px))')
    expect(block('.astryx-date-time-touch-tabs', css.indexOf('.astryx-date-touch,\n  .astryx-time-touch,\n  .astryx-date-time-touch-tabs {'))).toContain('padding-block-start: 0')
  })

  it('鼠标下的列按颜色渐隐、往里倾倒，选中和禁用的行保留自己的颜色', () => {
    const supports = css.indexOf('@supports (animation-timeline: view())')
    expect(supports).toBeGreaterThanOrEqual(0)
    const scoped = css.slice(supports)
    // 渐隐在行上，用主、次文字色的中点；选中和禁用的行不吃这条渐变。
    expect(block('.astryx-picker-wheel-option:not([aria-selected=\'true\']):not(:disabled)', supports)).toContain('animation: astryx-wheel-fade linear both')
    expect(css).toMatch(/@keyframes astryx-wheel-fade \{[^}]*color-mix\(in oklab, var\(--astryx-color-text-primary[^}]*var\(--astryx-color-text-secondary/)
    // 倾倒在行里的文字元素上，行本身不动，也不是滚动容器。
    expect(block('.astryx-picker-wheel-option-label', supports)).toContain('animation: astryx-wheel-tip linear both')
    expect(scoped).toContain('animation-timeline: view(y)')
    // 禁用的行按不透明度淡出。
    expect(block('.astryx-picker-wheel-option:disabled .astryx-picker-wheel-option-label', supports)).toContain('astryx-wheel-tip-dim')
    expect(css).toMatch(/@keyframes astryx-wheel-tip-dim \{[^}]*opacity: 0\.3/)
  })

  it('减少动态效果时不再倾倒，保留颜色渐变，禁用行只按不透明度淡出', () => {
    const supports = css.indexOf('@supports (animation-timeline: view())')
    const reduced = css.indexOf('@media (prefers-reduced-motion: reduce)', supports)
    expect(reduced).toBeGreaterThan(supports)
    expect(block('.astryx-picker-wheel-option-label', reduced)).toContain('animation-name: none')
    expect(block('.astryx-picker-wheel-option:disabled .astryx-picker-wheel-option-label', reduced)).toContain('animation-name: astryx-wheel-dim')
  })
})
