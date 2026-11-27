// @vitest-environment node
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const stylesDir = resolve(dirname(fileURLToPath(import.meta.url)), '../styles')
const read = (name: string): string => readFileSync(resolve(stylesDir, name), 'utf8')

/** 某个选择器第一次出现的规则体。 */
function ruleBody(css: string, selector: string): string {
  const start = css.indexOf(`${selector} {`)
  expect(start, `找不到 ${selector}`).toBeGreaterThanOrEqual(0)
  return css.slice(start, css.indexOf('}', start))
}

/** `@media (prefers-reduced-motion: reduce)` 块里的全部文字。 */
function reducedMotionBlocks(css: string): string {
  return css.split('@media (prefers-reduced-motion: reduce)').slice(1).map(part => part.slice(0, part.indexOf('\n  }\n'))).join('\n')
}

describe('卡片的按压层', () => {
  const css = read('clickable-card.css')

  it('手指的按压写在悬停后面，盖过悬停的颜色', () => {
    const hover = css.indexOf('.astryx-clickable-card:hover::after')
    const press = css.indexOf('.astryx-clickable-card[data-astryx-press]::after')
    expect(hover).toBeGreaterThanOrEqual(0)
    expect(press).toBeGreaterThan(hover)
  })

  it('按压期间颜色不做过渡，直接让位给按压图', () => {
    const body = ruleBody(css, '.astryx-clickable-card[data-astryx-press]::after')
    expect(body).toContain('background-color: transparent')
    expect(body).toContain('background-image: var(--_press-paint-image)')
    expect(body).toContain('transition-property: none')
  })

  it('减少动态效果时卡片和缩略图的颜色立即切换', () => {
    expect(reducedMotionBlocks(css)).toMatch(/\.astryx-clickable-card::after,\s*\.astryx-selectable-card \{\s*transition-duration: 0s/)
    expect(reducedMotionBlocks(read('thumbnail.css'))).toMatch(/\.astryx-thumbnail__open::after,[^{]*\{\s*transition-duration: 0s/)
  })
})

describe('按钮的按压', () => {
  const css = read('button.css')

  it('减少动态效果时按下不缩放', () => {
    expect(reducedMotionBlocks(css)).toMatch(/:is\(:active, \[data-astryx-press='on'\]\) \{\s*transform: none/)
  })

  it('自己的弹层开着时按下不缩放，缩放也不过渡', () => {
    const popupOpen = '.astryx-button[aria-expanded=\'true\'][aria-haspopup]:not([aria-haspopup=\'false\'])'
    expect(ruleBody(css, popupOpen)).not.toContain('transform')
    expect(ruleBody(css, `${popupOpen}:is(:active, [data-astryx-press='on'])`)).toContain('transform: none')
  })

  it('粗指针下按压画在 ::before 上，抬手时淡出的是这一层的 opacity', () => {
    const coarse = css.slice(css.indexOf('@media (pointer: coarse)'))
    const host = ruleBody(coarse, '.astryx-button:not(:disabled):not([aria-disabled=\'true\'])[data-astryx-press]')
    expect(host).toContain('isolation: isolate')
    expect(host).toContain('will-change: transform')
    expect(host).toContain('background-image: none')
    const layer = ruleBody(coarse, '.astryx-button:not(:disabled):not([aria-disabled=\'true\'])[data-astryx-press]::before')
    expect(layer).toContain('z-index: -1')
    const fading = ruleBody(coarse, '.astryx-button:not(:disabled):not([aria-disabled=\'true\'])[data-astryx-press=\'fading\']::before')
    expect(fading).toContain('astryx-button-press-release var(--astryx-duration-exit')
    expect(css).toMatch(/@keyframes astryx-button-press-release \{\s*from \{\s*opacity: 1;/)
  })
})

describe('共用的按压淡出', () => {
  it('减少动态效果时最多 200ms', () => {
    expect(reducedMotionBlocks(read('pressable.css'))).toContain('animation-duration: min(var(--astryx-duration-exit, 175ms), 200ms)')
  })

  it('列表行的按压层淡出只动 opacity', () => {
    expect(read('pressable.css')).toMatch(/@keyframes astryx-press-layer-release \{\s*from \{\s*opacity: 1;\s*\}\s*to \{\s*opacity: 0;/)
  })
})

/** 写着 `layer` 这条按压层规则的那个 `@media (pointer: coarse)` 块，从块开头到文件末尾。 */
function coarseBlock(css: string, layer: string): string {
  const start = css.lastIndexOf('@media (pointer: coarse)', css.indexOf(layer))
  expect(start, '找不到粗指针分支').toBeGreaterThanOrEqual(0)
  return css.slice(start)
}

describe('列表行的触屏按压在合成层上淡出', () => {
  const RELEASE = 'astryx-press-layer-release var(--astryx-duration-exit, 175ms) var(--astryx-ease-exit'

  it('list 的行在按压期间把按压色画在自己的 ::before 上，抬手淡出这一层', () => {
    const row = '.astryx-item[data-astryx-press]:not([data-disabled=\'true\'])'
    const coarse = coarseBlock(read('list.css'), `${row}::before`)
    const host = ruleBody(coarse, row)
    expect(host).toContain('isolation: isolate')
    expect(host).toContain('background-image: none')
    const layer = ruleBody(coarse, `${row}::before`)
    expect(layer).toContain('z-index: -1')
    expect(layer).toContain('background-color: var(--astryx-list-item-pressed-background')
    const fading = ruleBody(coarse, '.astryx-item[data-astryx-press=\'fading\']:not([data-disabled=\'true\'])::before')
    expect(fading).toContain(RELEASE)
    expect(reducedMotionBlocks(coarse)).toContain('animation-duration: min(var(--astryx-duration-exit, 175ms), 200ms)')
  })

  it('treeList 的行把按压层的图片换成底色，抬手淡出这一层', () => {
    const row = '.astryx-tree-list__content.astryx-pressable:not([data-disabled=\'true\'])'
    const coarse = coarseBlock(read('tree-list.css'), `${row}[data-astryx-press]::after`)
    const layer = ruleBody(coarse, `${row}[data-astryx-press]::after`)
    expect(layer).toContain('background-image: none')
    expect(layer).toContain('background-color: var(--astryx-color-overlay-pressed')
    expect(ruleBody(coarse, `${row}[data-astryx-press='fading']::after`)).toContain(RELEASE)
    expect(reducedMotionBlocks(coarse)).toContain('animation-duration: min(var(--astryx-duration-exit, 175ms), 200ms)')
  })
})
