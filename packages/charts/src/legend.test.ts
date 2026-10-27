import type { SeriesDef } from './types.js'
import { describe, expect, it } from 'vitest'
import { deriveLegendItems } from './legend.js'
import { pointFill, seriesFill } from './markColor.js'
import { band } from './marks/band.js'
import { bar } from './marks/bar.js'
import { line } from './marks/line.js'
import { referenceLine } from './marks/referenceLine.js'
import { deriveTooltipSeriesValues, shouldRenderHoverDot } from './tooltip.js'

/** 一个最小可用的系列替身，只填测试要看的字段。 */
function fakeSeries(overrides: Partial<SeriesDef> & { type: string, key: string }): SeriesDef {
  return {
    dataKeys: [overrides.key],
    layout: {},
    resolve: () => [],
    ...overrides,
  } as SeriesDef
}

describe('deriveLegendItems', () => {
  it('uses the static color when the series has one', () => {
    expect(deriveLegendItems([bar('v', { color: '#123456', label: '收入' })])).toEqual([
      { label: '收入', color: '#123456', type: 'bar' },
    ])
  })

  it('falls back to the palette color assigned by the chart root', () => {
    const series = fakeSeries({ type: 'line', key: 'v' })
    series._resolvedColor = '#abcdef'
    expect(deriveLegendItems([series])[0].color).toBe('#abcdef')
  })

  it('falls back to the last-resort token when nothing is set', () => {
    expect(deriveLegendItems([line('v')])[0].color).toBe('var(--color-accent)')
  })

  it('labels with the key when no label is given', () => {
    expect(deriveLegendItems([line('revenue')])[0].label).toBe('revenue')
  })

  it('skips utility marks', () => {
    const items = deriveLegendItems([
      line('v'),
      band({ upper: 'hi', lower: 'lo' }),
      referenceLine({ y: 5 }),
    ])
    expect(items.map(i => i.type)).toEqual(['line'])
  })
})

describe('deriveTooltipSeriesValues', () => {
  it('returns nothing without a datum', () => {
    const series = [line('v')]
    series[0]._uid = '0:v'
    expect(deriveTooltipSeriesValues(series, undefined, new Set(['0:v']))).toEqual([])
  })

  it('returns one row per resolved, non-utility series', () => {
    const a = line('a')
    const b = bar('b')
    const resolvedKeys = new Set(['0:a', '1:b'])
    a._uid = '0:a'
    b._uid = '1:b'
    const rows = deriveTooltipSeriesValues(
      [a, b, band({ upper: 'hi', lower: 'lo' })],
      { a: 3, b: 7 },
      resolvedKeys,
    )
    expect(rows).toEqual([
      { key: 'a', label: 'a', color: 'var(--color-accent)', type: 'line', value: 3 },
      { key: 'b', label: 'b', color: 'var(--color-accent)', type: 'bar', value: 7 },
    ])
  })

  it('skips series the layout did not resolve', () => {
    const a = line('a')
    a._uid = '0:a'
    expect(deriveTooltipSeriesValues([a], { a: 3 }, new Set())).toEqual([])
  })

  it('shares the representative color with the legend', () => {
    const a = line('a', { color: '#ff0000' })
    a._uid = '0:a'
    expect(deriveTooltipSeriesValues([a], { a: 3 }, new Set(['0:a']))[0].color).toBe('#ff0000')
  })
})

describe('shouldRenderHoverDot', () => {
  it('draws dots for data series but not for bars or utility marks', () => {
    expect(shouldRenderHoverDot('line')).toBe(true)
    expect(shouldRenderHoverDot('bar')).toBe(false)
    expect(shouldRenderHoverDot('band')).toBe(false)
    expect(shouldRenderHoverDot('referenceLine')).toBe(false)
  })
})

describe('seriesFill / pointFill', () => {
  it('prefers an explicit color over the palette', () => {
    const def = fakeSeries({ type: 'line', key: 'v' })
    def._resolvedColor = '#abcdef'
    expect(seriesFill(def, '#123456')).toBe('#123456')
  })

  it('treats blank strings as unset', () => {
    const def = fakeSeries({ type: 'line', key: 'v' })
    def._resolvedColor = '#abcdef'
    expect(seriesFill(def, '   ')).toBe('#abcdef')
  })

  it('uses an accessor per datum', () => {
    const def = fakeSeries({ type: 'bar', key: 'v' })
    const fill = pointFill(def, (_d, i) => (i === 1 ? '#00ff00' : ''), {}, 1)
    expect(fill).toBe('#00ff00')
  })

  it('falls back to the palette when the accessor throws', () => {
    const def = fakeSeries({ type: 'bar', key: 'v' })
    def._resolvedColor = '#abcdef'
    const fill = pointFill(def, () => {
      throw new Error('bad datum')
    }, {}, 0)
    expect(fill).toBe('#abcdef')
  })
})
