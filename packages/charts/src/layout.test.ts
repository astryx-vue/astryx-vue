import type { scaleBand } from 'd3-scale'
import type { ResolvedPoint, SeriesContext, SeriesDef } from './types.js'
import { describe, expect, it } from 'vitest'
import { computeLayout } from './layout.js'
import { isBandScale } from './utils.js'

/**
 * 一个只记录上下文的假系列：`resolve()` 把收到的上下文存下来，方便检查布局给了什么。
 */
function spySeries(overrides: Partial<SeriesDef> = {}): SeriesDef & { seen?: SeriesContext } {
  const def = {
    type: 'line',
    key: 'v',
    dataKeys: ['v'],
    layout: {},
    resolve(ctx: SeriesContext): ResolvedPoint[] {
      def.seen = ctx
      return ctx.data.map((_, i) => ({ px: i, py: i, py0: 0, dataIndex: i }))
    },
    ...overrides,
  } as SeriesDef & { seen?: SeriesContext }
  return def
}

const DATA = [
  { m: 'A', v: 4 },
  { m: 'B', v: 7 },
  { m: 'C', v: 2 },
]

describe('computeLayout x scale', () => {
  it('builds a band scale for categorical x with outer padding', () => {
    const { xScale } = computeLayout({ data: DATA, xKey: 'm', series: [spySeries()], width: 600, height: 244 })
    expect(isBandScale(xScale)).toBe(true)
    expect((xScale as ReturnType<typeof scaleBand<string>>).padding()).toBeCloseTo(0.2)
  })

  it('drops the outer padding when the y axis is categorical', () => {
    const series = spySeries({ layout: { yBandKey: 'm' } })
    const { xScale, yBandScale } = computeLayout({
      data: DATA,
      xKey: 'm',
      series: [series],
      width: 600,
      height: 244,
    })
    expect((xScale as ReturnType<typeof scaleBand<string>>).padding()).toBe(0)
    // 分类 y 轴把每个分类铺满高度，也不留 padding。
    expect([...yBandScale!.domain()]).toEqual(['A', 'B', 'C'])
    expect(yBandScale!.padding()).toBe(0)
  })

  it('builds a nice linear scale for numeric x', () => {
    const numeric = [
      { x: 1, v: 1 },
      { x: 9, v: 2 },
    ]
    const { xScale } = computeLayout({ data: numeric, xKey: 'x', series: [spySeries()], width: 600, height: 244 })
    expect(isBandScale(xScale)).toBe(false)
    expect((xScale as (v: number) => number)(1)).toBe(0)
    expect((xScale as (v: number) => number)(9)).toBe(600)
  })

  it('honors an explicit x domain even with no data', () => {
    const { xScale } = computeLayout({
      data: [],
      xKey: 'x',
      series: [spySeries()],
      width: 600,
      height: 244,
      xDomain: [0, 10],
    })
    expect((xScale as (v: number) => number)(5)).toBe(300)
  })

  it('ignores a non-finite x domain', () => {
    const { xScale } = computeLayout({
      data: DATA,
      xKey: 'm',
      series: [spySeries()],
      width: 600,
      height: 244,
      xDomain: [Number.NaN, 10],
    })
    expect(isBandScale(xScale)).toBe(true)
  })
})

describe('computeLayout y domain', () => {
  function domainOf(data: Record<string, unknown>[], series: SeriesDef[], extra: object = {}): [number, number] {
    const { yScale } = computeLayout({ data, xKey: 'm', series, width: 600, height: 244, ...extra })
    return yScale.domain() as [number, number]
  }

  it('pins a zero baseline for marks that ask for it', () => {
    const [lo, hi] = domainOf(DATA, [spySeries({ layout: { includeZero: true } })])
    expect(lo).toBe(0)
    expect(hi).toBeGreaterThanOrEqual(7)
  })

  it('leaves headroom for continuous-only charts', () => {
    const [lo, hi] = domainOf(DATA, [spySeries()])
    // 2-7 的数据上下各留 8% 余量，再经过 .nice()。
    expect(lo).toBeLessThan(2)
    expect(hi).toBeGreaterThan(7)
  })

  it('symmetrizes the range for the zero baseline mode', () => {
    const [, hi] = domainOf(DATA, [spySeries()], { yBaseline: 'zero' })
    const [lo] = domainOf(DATA, [spySeries()], { yBaseline: 'zero' })
    expect(lo).toBeCloseTo(-hi)
  })

  it('fits the data tightly for the data baseline mode', () => {
    expect(domainOf(DATA, [spySeries()], { yBaseline: 'data' })).toEqual([2, 7])
  })

  it('uses an explicit domain verbatim, without nice()', () => {
    expect(domainOf(DATA, [spySeries()], { yDomain: [3, 5] })).toEqual([3, 5])
  })

  it('expands a degenerate single-value range so marks stay visible', () => {
    const flat = [{ m: 'A', v: 5 }]
    const [lo, hi] = domainOf(flat, [spySeries({ layout: { includeZero: true } })])
    expect(lo).toBe(0)
    expect(hi).toBeGreaterThan(5)
  })

  it('falls back to 0-1 when there are no finite values at all', () => {
    expect(domainOf([], [spySeries({ layout: { includeZero: true } })])).toEqual([0, 1])
  })

  it('counts every stacked layer boundary, not just the total', () => {
    // 正负混合：累计经过 5 和 1，总量只有 1。
    const mixed = [{ m: 'A', a: 5, b: -4 }]
    const [, hi] = domainOf(mixed, [
      spySeries({ type: 'bar', key: 'a', dataKeys: ['a'], layout: { stack: 's', includeZero: true } }),
      spySeries({ type: 'bar', key: 'b', dataKeys: ['b'], layout: { stack: 's', includeZero: true } }),
    ])
    expect(hi).toBeGreaterThanOrEqual(5)
  })
})

describe('computeLayout stacking and grouping', () => {
  it('hands pre-computed stack offsets to each series', () => {
    const data = [
      { m: 'A', a: 2, b: 3 },
      { m: 'B', a: 4, b: 1 },
    ]
    const seen: { stackOffsets?: { y0: number, y1: number }[] } = {}
    const upper = spySeries({
      type: 'bar',
      key: 'b',
      dataKeys: ['b'],
      layout: { stack: 'total' },
      resolve(ctx, stackOffsets) {
        seen.stackOffsets = stackOffsets
        return ctx.data.map((_, i) => ({ px: i, py: i, py0: 0, dataIndex: i }))
      },
    })
    computeLayout({
      data,
      xKey: 'm',
      series: [
        spySeries({ type: 'bar', key: 'a', dataKeys: ['a'], layout: { stack: 'total' } }),
        upper,
      ],
      width: 600,
      height: 244,
    })
    expect(seen.stackOffsets).toEqual([
      { y0: 2, y1: 5 },
      { y0: 4, y1: 5 },
    ])
  })

  it('gives each series a unique uid and marks the stack top', () => {
    const lower = spySeries({ type: 'bar', key: 'a', dataKeys: ['a'], layout: { stack: 'total' } })
    const upper = spySeries({ type: 'bar', key: 'b', dataKeys: ['b'], layout: { stack: 'total' } })
    const { resolved } = computeLayout({
      data: DATA,
      xKey: 'm',
      series: [lower, upper],
      width: 600,
      height: 244,
    })
    expect(lower._uid).toBe('0:a')
    expect(upper._uid).toBe('1:b')
    expect(resolved.size).toBe(2)
    expect(lower._isTopOfStack).toBe(false)
    expect(upper._isTopOfStack).toBe(true)
  })

  it('numbers the group slots for grouped bars only', () => {
    const first = spySeries({ type: 'bar', key: 'a', dataKeys: ['a'], layout: { group: 'g' } })
    const second = spySeries({ type: 'bar', key: 'b', dataKeys: ['b'], layout: { group: 'g' } })
    const plain = spySeries({ type: 'line', key: 'c', dataKeys: ['c'] })
    const seen = new Map<SeriesDef, { index: number, count: number } | undefined>()
    for (const [def, key] of [[first, 'a'], [second, 'b'], [plain, 'c']] as const) {
      def.resolve = (ctx, _stackOffsets, groupInfo) => {
        seen.set(def, groupInfo)
        return ctx.data.map((_, i) => ({ px: i, py: i, py0: 0, dataIndex: i }))
      }
      void key
    }
    computeLayout({
      data: [{ m: 'A', a: 1, b: 2, c: 3 }],
      xKey: 'm',
      series: [first, second, plain],
      width: 600,
      height: 244,
    })
    expect(seen.get(first)).toEqual({ index: 0, count: 2 })
    expect(seen.get(second)).toEqual({ index: 1, count: 2 })
    expect(seen.get(plain)).toBeUndefined()
  })
})
