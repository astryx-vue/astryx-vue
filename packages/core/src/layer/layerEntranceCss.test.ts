import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { reducedMotionKeys } from '../motion/reducedMotionCss.js'
import { LAYER_ENTER_GAP_PROPERTY, LAYER_ENTER_ORIGIN_PROPERTY, LAYER_ENTER_X_PROPERTY, LAYER_ENTER_Y_PROPERTY } from './layerEntranceSide.js'

const STYLES = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')
const read = (name: string): string => readFileSync(resolve(STYLES, name), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** `query` 打开的每个块的内容，括号配平。 */
function blocksUnder(source: string, query: string): string[] {
  const blocks: string[] = []
  for (let at = source.indexOf(query); at >= 0; at = source.indexOf(query, at + 1)) {
    const open = source.indexOf('{', at)
    let depth = 0
    for (let i = open; i < source.length; i++) {
      if (source[i] === '{') {
        depth++
      }
      else if (source[i] === '}' && --depth === 0) {
        blocks.push(source.slice(open + 1, i))
        break
      }
    }
  }
  return blocks
}

const LAYERS = [
  ['popover.css', '.astryx-popover'],
  ['tooltip.css', '.astryx-tooltip'],
  ['hover-card.css', '.astryx-hover-card-enter-active'],
  ['context-menu.css', '.astryx-context-menu'],
  ['selector.css', '.astryx-selector-listbox'],
  ['multi-selector.css', '.astryx-multi-selector-listbox'],
  ['typeahead.css', '.astryx-typeahead-listbox'],
  ['dropdown-menu.css', '.astryx-dropdown-menu'],
  ['dropdown-menu.css', '.astryx-dropdown-menu-popover'],
  ['more-menu.css', '.astryx-more-menu__layer'],
] as const

describe('the anchored layer entrance', () => {
  it('slides from the side the runtime writes, never further than the room to the trigger', () => {
    const [frames] = blocksUnder(read('layer.css'), '@keyframes astryx-layer-enter ')
    expect(frames).toContain(`var(${LAYER_ENTER_X_PROPERTY}, var(--_astryx-layer-enter-from-x, 0))`)
    expect(frames).toContain(`var(${LAYER_ENTER_Y_PROPERTY}, var(--_astryx-layer-enter-from-y, -1))`)
    expect(frames).toContain(`min(var(--astryx-spacing-2, 8px), var(${LAYER_ENTER_GAP_PROPERTY}, var(--astryx-spacing-2, 8px)))`)
    expect(frames).toContain('scale(0.95)')
  })

  it.each(LAYERS)('%s plays it and scales about the point where the layer meets its trigger', (file, selector) => {
    const css = read(file)
    const [rule] = blocksUnder(css, `${selector}[data-placement] {`)
    expect(rule).toContain('animation-name: astryx-layer-enter;')
    expect(rule).toContain(`transform-origin: var(${LAYER_ENTER_ORIGIN_PROPERTY}, 50% 50%);`)
    // 不再按 placement 换一套写死方向的关键帧。
    expect(css).not.toMatch(/@keyframes astryx-[\w-]+-enter-(?:above|below|start|end)\b/)
  })

  it.each(LAYERS)('%s fades in under a finger with Reduce Motion, and appears at once otherwise', (file, selector) => {
    const css = read(file)
    const fade = blocksUnder(css, reducedMotionKeys.fade).join('\n')
    expect(fade).toContain(`${selector}[data-placement]`)
    expect(fade).toContain('animation-name: astryx-layer-fade-in;')
    expect(fade).toContain('animation-duration: var(--_astryx-reduced-motion-fade-duration, 200ms);')
    expect(fade).toContain('animation-timing-function: var(--_astryx-reduced-motion-fade-easing, cubic-bezier(0.42, 0, 0.58, 1));')
    const instant = [...blocksUnder(css, reducedMotionKeys.instant), ...blocksUnder(css, '@media (prefers-reduced-motion: reduce) {')].join('\n')
    expect(instant).toMatch(new RegExp(`${selector.replace(/[.[\]]/g, '\\$&')}\\[data-placement\\][^{]*\\{\\s*animation: none;`))
  })

  it('fades a layer in with opacity only', () => {
    const [frames] = blocksUnder(read('layer.css'), '@keyframes astryx-layer-fade-in ')
    expect(frames).toContain('opacity: 0;')
    expect(frames).not.toContain('transform')
  })
})

describe('the dialog entrance under Reduce Motion', () => {
  it('fades in where it lands on a touch screen, 200 ms on easeInOut, and appears at once with a mouse', () => {
    const css = read('dialog.css')
    const fade = blocksUnder(css, reducedMotionKeys.fade).join('\n')
    expect(fade).toContain('animation: astryx-dialog-fade-in var(--_astryx-reduced-motion-fade-duration, 200ms) var(--_astryx-reduced-motion-fade-easing, cubic-bezier(0.42, 0, 0.58, 1)) backwards;')
    const [frames] = blocksUnder(css, '@keyframes astryx-dialog-fade-in ')
    expect(frames).not.toContain('transform')
    expect(blocksUnder(css, reducedMotionKeys.instant).join('\n')).toContain('animation: none;')
  })
})
