// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const FORCED_COLORS = '@media (forced-colors: active) {'
const LAST_MEMBER = ':nth-last-child(1 of :not([popover], template, dialog))'

function css(name: string): string {
  return readFileSync(resolve(process.cwd(), `packages/core/styles/${name}`), 'utf8')
}

/** 从 `start` 处的左花括号开始，取到与之配对的右花括号为止的内容。 */
function blockAt(source: string, start: number): string {
  let depth = 0
  for (let index = start; index < source.length; index++) {
    if (source[index] === '{') {
      depth++
    }
    else if (source[index] === '}') {
      depth--
      if (depth === 0)
        return source.slice(start + 1, index)
    }
  }
  throw new Error('unbalanced braces')
}

/** 文件里所有强制配色媒体查询的内容，拼在一起。 */
function forcedColorsRules(name: string): string {
  const source = css(name)
  const parts: string[] = []
  let at = source.indexOf(FORCED_COLORS)
  while (at !== -1) {
    parts.push(blockAt(source, at + FORCED_COLORS.length - 1))
    at = source.indexOf(FORCED_COLORS, at + 1)
  }
  return parts.join('\n')
}

/** 某个选择器（逗号分隔中的一项即可）对应规则体里的声明。 */
function declarationsFor(rules: string, selector: string): string {
  const at = rules.indexOf(selector)
  expect(at, selector).toBeGreaterThan(-1)
  return blockAt(rules, rules.indexOf('{', at))
}

function withoutForcedColors(name: string): string {
  const source = css(name)
  let result = source
  let at = result.indexOf(FORCED_COLORS)
  while (at !== -1) {
    const body = blockAt(result, at + FORCED_COLORS.length - 1)
    result = result.slice(0, at) + result.slice(at + FORCED_COLORS.length + body.length + 1)
    at = result.indexOf(FORCED_COLORS)
  }
  return result
}

describe('forced-colors edges', () => {
  it('gives solid Buttons a ButtonText edge, destructive a CanvasText one, and ghost none', () => {
    const rules = forcedColorsRules('button.css')
    expect(declarationsFor(rules, '.astryx-button {')).toContain('border: 1px solid ButtonText')
    expect(declarationsFor(rules, '.astryx-button[data-variant=\'destructive\'] {')).toContain('border-color: CanvasText')
    expect(declarationsFor(rules, '.astryx-button[data-variant=\'ghost\'] {')).toContain('border: 0')
  })

  it('leaves one seam between grouped buttons and keeps the group’s outer edge', () => {
    const rules = forcedColorsRules('button-group.css')
    expect(declarationsFor(rules, `.astryx-button-group[data-orientation='horizontal'] > .astryx-button:not(${LAST_MEMBER})`))
      .toContain('border-inline-end-width: 0')
    expect(declarationsFor(rules, `.astryx-button-group[data-orientation='vertical'] > .astryx-button:not(${LAST_MEMBER})`))
      .toContain('border-block-end-width: 0')
  })

  it.each([
    ['popover.css', '.astryx-popover {'],
    ['context-menu.css', '.astryx-context-menu {'],
    ['dropdown-menu.css', '.astryx-dropdown-menu:not(.is-sheet, .is-in-frame),'],
    ['dropdown-menu.css', '.astryx-dropdown-menu-popover {'],
    ['dialog.css', '.astryx-dialog:not(.astryx-dialog--fullscreen) {'],
  ])('gives the %s surface %s a CanvasText edge', (file, selector) => {
    expect(declarationsFor(forcedColorsRules(file), selector)).toContain('border: 1px solid CanvasText')
  })

  it.each(['popover.css', 'context-menu.css', 'dropdown-menu.css'])('sets no border on the %s surface outside forced colors', (file) => {
    expect(withoutForcedColors(file)).not.toContain('CanvasText')
  })
})

describe('button group last member', () => {
  it('rounds the last member that is not layer infrastructure, without a sibling-relative :has()', () => {
    const source = css('button-group.css')
    for (const orientation of ['horizontal', 'vertical']) {
      expect(source).toContain(`.astryx-button-group[data-orientation='${orientation}'] > .astryx-button${LAST_MEMBER} {`)
      expect(source).not.toContain(`.astryx-button-group[data-orientation='${orientation}'] > .astryx-button:last-child`)
    }
    expect(source).not.toContain(':has(~')
  })
})
