import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/layout.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** 取出带指定声明的规则里、指向 LayoutContent 的选择器。 */
function selectorsFor(declaration: string): string[] {
  const rules = css.split('}').filter(chunk => chunk.includes(declaration))
  return rules.flatMap((rule) => {
    const head = rule.slice(0, rule.indexOf('{'))
    return head.split(',').map(selector => selector.trim()).filter(selector => selector.includes('> .astryx-layout-content'))
  })
}

function layout(options: { header?: 'plain' | 'divider', footer?: 'plain' | 'divider', nested?: boolean }): HTMLElement {
  const root = document.createElement('div')
  const header = options.header == null ? '' : `<div class="astryx-layout-header" ${options.header === 'divider' ? 'data-divider' : ''}></div>`
  const footer = options.footer == null ? '' : `<div class="astryx-layout-footer" ${options.footer === 'divider' ? 'data-divider' : ''}></div>`
  const inner = options.nested
    ? '<div class="astryx-layout__inner"><div class="astryx-layout__middle"><div class="astryx-layout__content-slot"><div class="astryx-layout-content" id="nested"></div></div></div></div>'
    : ''
  root.innerHTML = `<div class="astryx-layout__inner">${header}<div class="astryx-layout__middle"><div class="astryx-layout__content-slot"><div class="astryx-layout-content" id="outer">${inner}</div></div></div>${footer}</div>`
  document.body.append(root)
  return root
}

function matches(root: HTMLElement, selectors: string[], id: string): boolean {
  const target = root.querySelector(`#${id}`)
  return selectors.some(selector => target?.matches(selector) ?? false)
}

describe('layout content collapse next to a plain header or footer', () => {
  const top = selectorsFor('--container-padding-block-start: 0px')
  const bottom = selectorsFor('--container-padding-block-end: 0px')

  it('reads the sibling relations of this layout only', () => {
    expect(top.length).toBeGreaterThan(0)
    expect(bottom.length).toBeGreaterThan(0)
    const plain = layout({ header: 'plain', footer: 'plain' })
    expect(matches(plain, top, 'outer')).toBe(true)
    const divided = layout({ header: 'divider', footer: 'divider' })
    expect(matches(divided, top, 'outer')).toBe(false)
    // 页脚在中间行后面，只能用 :has 往后看兄弟；它只落在这一个 Layout 自己的中间行上。
    expect(bottom).toEqual([
      '.astryx-layout__middle:has(~ .astryx-layout-footer:not([data-divider])) > .astryx-layout__content-slot > .astryx-layout-content:not([data-explicit-padding])',
    ])
  })

  it('does not hand an outer layout\'s collapse to a nested layout', () => {
    const outer = layout({ header: 'plain', footer: 'plain', nested: true })
    expect(matches(outer, top, 'nested')).toBe(false)
    expect(bottom.every(selector => selector.includes('.astryx-layout__middle:has(~ ') && selector.includes('> .astryx-layout__content-slot > .astryx-layout-content'))).toBe(true)
  })

  it('publishes the inline-end inset from the end edge, not the start edge', () => {
    const start = css.slice(css.indexOf('.astryx-layout-content[data-edge-start]:not([data-explicit-padding]) {'))
    expect(start.slice(0, start.indexOf('}'))).not.toContain('--container-padding-inline-end')
    const end = css.slice(css.indexOf('.astryx-layout-content[data-edge-end]:not([data-explicit-padding]) {'))
    expect(end.slice(0, end.indexOf('}'))).toContain('--container-padding-inline-end')
  })

  it('caps no header or footer when the layout sets no contentWidth', () => {
    const inner = css.slice(css.indexOf('\n  .astryx-layout__inner {'))
    expect(inner.slice(0, inner.indexOf('}'))).toContain('--layout-content-width: initial')
  })

  it('publishes the panel padding it applies on each outer edge', () => {
    for (const edge of ['inline-start', 'inline-end', 'block-start', 'block-end']) {
      const marker = css.indexOf(`padding-${edge}: var(--layout-pad-outer-`, css.indexOf('.astryx-layout-panel[data-area=\'start\']:not([data-explicit-padding])'))
      expect(marker).toBeGreaterThan(-1)
      const block = css.slice(marker, css.indexOf('}', marker))
      expect(block).toContain(`--container-padding-${edge}: var(--layout-pad-outer-`)
    }
  })
})
