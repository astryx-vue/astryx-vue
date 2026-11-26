// @vitest-environment node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { describe, expect, it } from 'vitest'

const css = readFileSync(resolve(process.cwd(), 'packages/core/styles/date-range-input.css'), 'utf8')

function rule(source: string, selector: string): string {
  const at = source.indexOf(`${selector} {`)
  expect(at, selector).toBeGreaterThan(-1)
  return source.slice(at, source.indexOf('}', at))
}

describe('dateRangeInput 窄页面上的预设', () => {
  const stacked = css.slice(css.indexOf('@container (max-width: 26rem)'))

  it('预设和一个月的日历并排放不下时，预设叠到日历上面', () => {
    expect(css).toContain('@container (max-width: 26rem)')
    expect(rule(stacked, '.astryx-date-range-panel')).toContain('flex-direction: column')
  })

  it('叠起来以后分隔线从右边换到下边', () => {
    const presets = rule(stacked, '.astryx-date-range-presets')
    expect(presets).toContain('border-inline-end: 0')
    expect(presets).toContain('border-block-end: 1px solid')
  })

  it('弹层自己在层的高度上限内滚动，面板不再各自滚动', () => {
    const popover = rule(css, '.astryx-date-range-popover')
    expect(popover).toContain('overflow-y: auto')
    expect(popover).toContain('max-height: min(32rem, calc(100vh - 32px))')
    expect(rule(css, '.astryx-date-range-panel')).not.toContain('overflow')
  })
})
