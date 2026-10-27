import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

function css(name: string): string {
  return readFileSync(resolve(process.cwd(), `packages/core/styles/${name}`), 'utf8')
}

describe('modifier rules keep winning over base rules (D12 alignment)', () => {
  it('Link size/weight modifiers carry the same specificity as the base `font: inherit` rule', () => {
    const source = css('link.css')
    const base = source.indexOf('.astryx-link.astryx-link {')
    expect(base).toBeGreaterThan(-1)
    for (const modifier of ['size-sm', 'size-md', 'size-lg', 'size-xl', 'weight-regular', 'weight-medium', 'weight-semibold', 'weight-bold']) {
      const rule = `.astryx-link.astryx-link--${modifier}`
      expect(source, rule).toContain(rule)
      expect(source.indexOf(rule), `${rule} after base`).toBeGreaterThan(base)
    }
  })

  it('Text weight modifiers come after the display type rules so explicit weight wins', () => {
    const source = css('text.css')
    const display3 = source.indexOf('.astryx-text--type-display-3 {')
    const weightBold = source.indexOf('.astryx-text--weight-bold {')
    expect(display3).toBeGreaterThan(-1)
    expect(weightBold).toBeGreaterThan(display3)
  })

  it('Table expansion panel pads at cell specificity so density cell padding cannot override it', () => {
    const source = css('table.css')
    const panel = source.indexOf('.astryx-table td.astryx-table__panel {')
    expect(panel).toBeGreaterThan(-1)
    const block = source.slice(panel, source.indexOf('}', panel))
    expect(block).toContain('padding-block: var(--astryx-spacing-4, 16px)')
    expect(block).toContain('padding-inline-end: var(--astryx-spacing-5, 20px)')
    const density = source.indexOf(".astryx-table[data-density='compact'] :is(th, td) {")
    expect(source.indexOf("td.astryx-table__panel", density)).toBeGreaterThan(density)
  })

  it('Token sm keeps the shared 8px inline padding', () => {
    const source = css('token.css')
    const sm = source.indexOf('.astryx-token.size-sm {')
    expect(sm).toBeGreaterThan(-1)
    const block = source.slice(sm, source.indexOf('}', sm))
    expect(block).not.toContain('padding-inline')
  })

  it('ProgressBar neutral fill uses the disabled gray, not the foreground ink', () => {
    const source = css('progress-bar.css')
    const neutral = source.indexOf(".astryx-progress-bar[data-variant='neutral'] .astryx-progress-bar-fill {")
    expect(neutral).toBeGreaterThan(-1)
    const block = source.slice(neutral, source.indexOf('}', neutral))
    expect(block).toContain('--astryx-color-text-disabled')
  })

  it('Tab font size follows the label token at every size', () => {
    const source = css('tab-list.css')
    for (const size of ['sm', 'md', 'lg']) {
      const rule = source.indexOf(`.astryx-tab--size-${size} {`)
      expect(rule, size).toBeGreaterThan(-1)
      const block = source.slice(rule, source.indexOf('}', rule))
      expect(block, size).toContain('font-size: var(--astryx-text-label-size, 0.875rem)')
    }
  })

})
