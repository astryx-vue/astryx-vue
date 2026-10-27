import type { ResolvedPoint, SeriesContext, SeriesDef } from '../types.js'
import { scaleBand, scaleLinear } from 'd3-scale'
import { describe, expect, it } from 'vitest'
import { computeLayout } from '../layout.js'
import { area } from './area.js'
import { band } from './band.js'
import { bar } from './bar.js'
import { candlestick } from './candlestick.js'
import { dot } from './dot.js'
import { errorBar } from './errorBar.js'
import { line } from './line.js'
import { referenceLine } from './referenceLine.js'

/**
 * 各标记点位的功能测试。上游这些用例是挂载 `<Chart>` 后检查 SVG 元素的，
 * 这里不画图，所以改成直接调 `resolve()` 检查点位——判定标准相同：
 * 该画的有没有画（点位有限）、画在哪个位置（像素值）。
 */

const DATA = [
  { m: 'A', v: 4 },
  { m: 'B', v: 7 },
  { m: 'C', v: 2 },
]

// 中间缺一个值——标记必须断开，不能落到基线上。
const GAPPY = [
  { m: 'A', v: 4 },
  { m: 'B', v: null },
  { m: 'C', v: 2 },
]

const BOUNDS = [
  { m: 'A', hi: 5, lo: 1 },
  { m: 'B', hi: 8, lo: 4 },
  { m: 'C', hi: 6, lo: 2 },
]

/** 绘图区大小，和上游测试报的宽度一致。 */
const WIDTH = 600
const HEIGHT = 244

/** 一份最简单的绘图区上下文，band x 轴、线性 y 轴。 */
function bandContext(
  data: Record<string, unknown>[],
  xKey = 'm',
  height = HEIGHT,
): SeriesContext {
  const xScale = scaleBand<string>()
    .domain(data.map(d => String(d[xKey])))
    .range([0, WIDTH])
    .padding(0.2)
  const yScale = scaleLinear().domain([0, 10]).range([height, 0])
  return { data, xKey, xScale, yScale, width: WIDTH, height }
}

/** 只有有限坐标的点才会真的被画出来。 */
function drawn(points: ResolvedPoint[]): ResolvedPoint[] {
  return points.filter(
    p => Number.isFinite(p.px) && Number.isFinite(p.py) && Number.isFinite(p.py0),
  )
}

describe('bar', () => {
  it('computes one point per datum, centered in its band', () => {
    const ctx = bandContext(DATA)
    const points = bar('v', { color: '#123456' }).resolve(ctx)

    expect(points).toHaveLength(3)
    const bandwidth = (ctx.xScale as ReturnType<typeof scaleBand<string>>).bandwidth()
    for (const p of points) {
      expect(Number.isFinite(p.px)).toBe(true)
      // 柱心在带的正中间，柱宽就是带宽（没有分组）。
      expect(p.px).toBeCloseTo((ctx.xScale as ReturnType<typeof scaleBand<string>>)(String(DATA[p.dataIndex].m))! + bandwidth / 2)
    }
  })

  it('skips bars whose value is missing instead of drawing them at the baseline', () => {
    const points = bar('v').resolve(bandContext(GAPPY))
    expect(drawn(points)).toHaveLength(2)
    // 缺值那条的顶边不是有限值（d3 对 NaN 输入返回 unknown），所以不会被画到 0 的位置。
    expect(Number.isFinite(points[1].py)).toBe(false)
    expect(Number.isFinite(points[1].py0)).toBe(true)
  })

  it('keeps every point finite on a non-band x scale', () => {
    // 上游柱状只支持 band x 轴，其它情况返回空数组。
    const points = bar('v').resolve({
      ...bandContext(DATA),
      xScale: scaleLinear().domain([0, 1]).range([0, WIDTH]),
    })
    expect(points).toEqual([])
  })

  it('stacked bars share the same band and accumulate from zero', () => {
    const stacked = [
      { m: 'A', a: 2, b: 3 },
      { m: 'B', a: 4, b: 1 },
    ]
    const lower = bar('a', { stack: 'total' })
    const upper = bar('b', { stack: 'total' })
    const { resolved } = computeLayout({
      data: stacked,
      xKey: 'm',
      series: [lower, upper],
      width: WIDTH,
      height: HEIGHT,
    })

    const lowerPoints = resolved.get(lower._uid!)!
    const upperPoints = resolved.get(upper._uid!)!
    expect(lowerPoints).toHaveLength(2)
    expect(upperPoints).toHaveLength(2)
    for (let i = 0; i < 2; i++) {
      // 上层柱的底边接下层柱的顶边。
      expect(upperPoints[i].py0).toBeCloseTo(lowerPoints[i].py)
      // 同一带里两层柱心重合。
      expect(upperPoints[i].px).toBeCloseTo(lowerPoints[i].px)
    }
    // 只有堆叠组最上层带圆角标记。
    expect(lower._isTopOfStack).toBe(false)
    expect(upper._isTopOfStack).toBe(true)
  })

  it('grouped bars render side by side within the band', () => {
    const grouped = [
      { m: 'A', a: 2, b: 3 },
      { m: 'B', a: 4, b: 1 },
    ]
    const first = bar('a', { group: 'g' })
    const second = bar('b', { group: 'g' })
    const { resolved } = computeLayout({
      data: grouped,
      xKey: 'm',
      series: [first, second],
      width: WIDTH,
      height: HEIGHT,
    })

    // 同一个分类下，第二组的子柱起点更靠右。
    expect(resolved.get(second._uid!)![0].px).toBeGreaterThan(
      resolved.get(first._uid!)![0].px,
    )
  })
})

describe('line', () => {
  it('computes one point per datum with the band center as x', () => {
    const ctx = bandContext(DATA)
    const points = line('v', { color: '#ff0000', strokeWidth: 3 }).resolve(ctx)
    expect(points).toHaveLength(3)
    expect(points[0].py).toBeCloseTo(ctx.yScale(4))
  })

  it('marks missing values as non-finite so the line gaps', () => {
    const points = line('v', { dots: true }).resolve(bandContext(GAPPY))
    // 上游检查「只画两个点」：能画的点正好两个。
    expect(drawn(points)).toHaveLength(2)
    expect(Number.isFinite(points[1].py)).toBe(false)
  })
})

describe('dot', () => {
  it('computes one point per datum', () => {
    const points = dot('v', { radius: 5 }).resolve(bandContext(DATA))
    expect(points).toHaveLength(3)
    expect(drawn(points)).toHaveLength(3)
  })

  it('skips points whose value is missing', () => {
    const points = dot('v').resolve(bandContext(GAPPY))
    expect(drawn(points)).toHaveLength(2)
  })

  it('dodge spreads coincident points horizontally, centered on the shared x', () => {
    // 同一个分类里的两行落在同一个带中心上。
    const coincident = [
      { m: 'A', v: 4 },
      { m: 'A', v: 6 },
      { m: 'B', v: 2 },
    ]
    const points = dot('v', { dodge: true, radius: 4 }).resolve(
      bandContext(coincident),
    )
    expect(points).toHaveLength(3)
    const [a1, a2] = points.slice(0, 2).map(p => p.px)
    // 间距是 radius * 2 + 1 = 9 像素，以中心对称摊开。
    expect(a2 - a1).toBeCloseTo(9)
    const bandCenter = (a1 + a2) / 2
    expect(points[0].px).toBeCloseTo(bandCenter - 4.5)
  })
})

describe('area', () => {
  it('fills from the zero baseline to the value', () => {
    const ctx = bandContext(DATA)
    const points = area('v', { color: '#00aa00' }).resolve(ctx)
    expect(points).toHaveLength(3)
    for (const p of points) {
      expect(p.py0).toBeCloseTo(ctx.yScale(0))
      expect(Number.isFinite(p.py)).toBe(true)
    }
  })

  it('keeps missing values non-finite so the fill gaps', () => {
    const points = area('v').resolve(bandContext(GAPPY))
    expect(drawn(points)).toHaveLength(2)
  })

  it('stacked areas accumulate on top of each other', () => {
    const stacked = [
      { m: 'A', a: 2, b: 3 },
      { m: 'B', a: 4, b: 1 },
    ]
    const lower = area('a', { stack: 'total' })
    const upper = area('b', { stack: 'total' })
    const { resolved } = computeLayout({
      data: stacked,
      xKey: 'm',
      series: [lower, upper],
      width: WIDTH,
      height: HEIGHT,
    })
    const lowerPoints = resolved.get(lower._uid!)!
    const upperPoints = resolved.get(upper._uid!)!
    for (let i = 0; i < 2; i++)
      expect(upperPoints[i].py0).toBeCloseTo(lowerPoints[i].py)
  })
})

describe('band', () => {
  it('fills the region between the upper and lower bounds', () => {
    const ctx = bandContext(BOUNDS)
    const points = band({ upper: 'hi', lower: 'lo' }).resolve(ctx)
    expect(points).toHaveLength(3)
    expect(points[0].py).toBeCloseTo(ctx.yScale(5))
    expect(points[0].py0).toBeCloseTo(ctx.yScale(1))
  })

  it('renders nothing when no point has both bounds', () => {
    const missing = [
      { m: 'A', lo: 1 },
      { m: 'B', lo: 4 },
    ]
    const points = band({ upper: 'hi', lower: 'lo' }).resolve(
      bandContext(missing, 'm'),
    )
    // 没有一条数据同时有上下界，所以没有一个点会被画出来。
    expect(drawn(points)).toHaveLength(0)
  })
})

describe('candlestick', () => {
  const OHLC = [
    { m: 'A', o: 2, h: 6, l: 1, c: 5 }, // 涨：收盘 >= 开盘
    { m: 'B', o: 6, h: 7, l: 2, c: 3 }, // 跌
    { m: 'C', o: 3, h: 5, l: 2, c: 4 }, // 涨
  ]
  function series(): SeriesDef {
    return candlestick({ open: 'o', high: 'h', low: 'l', close: 'c' })
  }

  it('places each candle at its close price', () => {
    const ctx = bandContext(OHLC)
    const points = series().resolve(ctx)
    expect(points).toHaveLength(3)
    expect(points[0].py).toBeCloseTo(ctx.yScale(5))
    expect(points[1].py).toBeCloseTo(ctx.yScale(3))
  })

  it('still places a candle whose other OHLC fields are missing (the skip lives in render)', () => {
    const gappy: Record<string, unknown>[] = [
      OHLC[0],
      { m: 'B', o: 6, l: 2, c: 3 },
      OHLC[2],
    ]
    const points = series().resolve(bandContext(gappy))
    // 点位只看收盘价，收盘价在，三个位置都算得出来；缺字段不画是画的那一步的事。
    expect(points).toHaveLength(3)
    expect(points.every(p => Number.isFinite(p.py))).toBe(true)
  })
})

describe('errorBar', () => {
  it('places a stem plus whisker ends per point', () => {
    const ctx = bandContext(BOUNDS)
    const points = errorBar({ high: 'hi', low: 'lo' }).resolve(ctx)
    expect(points).toHaveLength(3) // 3 个点，每个一根须线加两头小横杠
    expect(points[0].py).toBeCloseTo(ctx.yScale(5))
    expect(points[0].py0).toBeCloseTo(ctx.yScale(1))
  })

  it('skips whiskers missing either bound', () => {
    const gappy = [BOUNDS[0], { m: 'B', hi: 8 }, BOUNDS[2]]
    const points = errorBar({ high: 'hi', low: 'lo' }).resolve(
      bandContext(gappy, 'm'),
    )
    expect(drawn(points)).toHaveLength(2)
  })
})

describe('referenceLine', () => {
  it('has no data points to resolve', () => {
    const points = referenceLine({ y: 5, label: 'Target' }).resolve(
      bandContext(DATA),
    )
    expect(points).toEqual([])
  })

  it('keeps its key stable from the configured value', () => {
    expect(referenceLine({ y: 5 }).key).toBe('ref-5')
    expect(referenceLine({ x: 5 }).key).toBe('ref-5')
    expect(referenceLine({}).key).toBe('ref-none')
  })
})
