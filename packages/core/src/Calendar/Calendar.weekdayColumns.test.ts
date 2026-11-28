// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/calendar.css'), 'utf8')

function lastRule(source: string, selector: string): string {
  const at = source.lastIndexOf(`${selector} {`)
  expect(at, selector).toBeGreaterThan(-1)
  return source.slice(at, source.indexOf('}', at))
}

describe('calendar weekday columns', () => {
  const supports = css.slice(css.indexOf('@supports (grid-template-columns: subgrid)'))

  it('gives a weekday name a minimum width, not a fixed one', () => {
    const weekday = lastRule(css.slice(0, css.indexOf('@supports')), '.astryx-calendar-weekday')
    expect(weekday).toContain('min-width: var(--astryx-input-height-md, 32px)')
  })

  it('gives a day button a minimum height so it grows with its number', () => {
    const cellRules = [...css.matchAll(/\.astryx-calendar-cell \{[^}]*\}/g)].map(match => match[0])
    expect(cellRules.some(rule => rule.includes('min-height: var(--astryx-input-height-md, 32px)'))).toBe(true)
    expect(cellRules.some(rule => /(?<!min-)height:/.test(rule))).toBe(false)
  })

  it('shares one set of columns that are never narrower than their widest cell', () => {
    expect(supports).toContain('grid-template-columns: repeat(7, minmax(min-content, 1fr))')
    expect(supports).toContain('grid-template-columns: var(--astryx-spacing-6, 24px) repeat(7, minmax(min-content, 1fr))')
    expect(lastRule(supports, '.astryx-calendar-grid[data-week-numbers] .astryx-calendar-row')).toContain('grid-template-columns: subgrid')
    expect(supports).toMatch(/\.astryx-calendar-grid \.astryx-calendar-weekdays,[^{]*\{[^}]*grid-template-columns: subgrid/)
  })

  it('keeps the subgrid after the fixed week-number columns so it wins at equal specificity', () => {
    const fixed = css.indexOf('.astryx-calendar-grid[data-week-numbers] .astryx-calendar-row {')
    const subgrid = css.indexOf('grid-template-columns: subgrid')
    expect(fixed).toBeGreaterThan(-1)
    expect(subgrid).toBeGreaterThan(fixed)
  })
})
