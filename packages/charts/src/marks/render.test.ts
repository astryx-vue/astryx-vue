import { describe, expect, it } from 'vitest'
import { mountChart } from '../../test-support/chart.js'
import { area } from './area.js'
import { band } from './band.js'
import { bar } from './bar.js'
import { candlestick } from './candlestick.js'
import { dot } from './dot.js'
import { errorBar } from './errorBar.js'
import { line } from './line.js'
import { referenceLine } from './referenceLine.js'

/**
 * 各标记画出来的 SVG 形状。上游用例是挂载 `<Chart>` 后检查元素和属性，
 * 这里同样挂真图，只是改用 @vue/test-utils。
 *
 * 点位本身的行为在 `marks.test.ts` 里单独测（直接调 `resolve()`），
 * 这里只关心「画成了什么」。
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

describe('bar', () => {
  it('renders one top-rounded path per datum in the configured color', () => {
    const { plot } = mountChart({ series: [bar('v', { color: '#123456' })], data: DATA, xKey: 'm' })
    const paths = plot.querySelectorAll('path')
    expect(paths).toHaveLength(3)
    for (const path of paths) {
      expect(path.getAttribute('fill')).toBe('#123456')
      expect(path.getAttribute('d')).toMatch(/^M/)
      // 正值的柱子只圆上面两个角。
      expect(path.getAttribute('d')).toContain('Q')
    }
  })

  it('skips bars whose value is missing instead of drawing them at the baseline', () => {
    const { plot } = mountChart({ series: [bar('v')], data: GAPPY, xKey: 'm' })
    expect(plot.querySelectorAll('path')).toHaveLength(2)
  })

  it('stacked bars round only the topmost layer', () => {
    const stacked = [
      { m: 'A', a: 2, b: 3 },
      { m: 'B', a: 4, b: 1 },
    ]
    const { plot } = mountChart({
      series: [bar('a', { stack: 'total' }), bar('b', { stack: 'total' })],
      data: stacked,
      xKey: 'm',
    })
    const groups = [...plot.children].filter(element => element.tagName === 'g')
    const [lowerPaths, upperPaths] = groups.map(group => [...group.querySelectorAll('path')])
    expect(lowerPaths).toHaveLength(2)
    expect(upperPaths).toHaveLength(2)
    for (const path of lowerPaths)
      expect(path.getAttribute('d')).not.toContain('Q')
    for (const path of upperPaths)
      expect(path.getAttribute('d')).toContain('Q')
  })

  it('grouped bars render side by side within the band', () => {
    const grouped = [
      { m: 'A', a: 2, b: 3 },
      { m: 'B', a: 4, b: 1 },
    ]
    const { plot } = mountChart({
      series: [bar('a', { group: 'g' }), bar('b', { group: 'g' })],
      data: grouped,
      xKey: 'm',
    })
    const groups = [...plot.children].filter(element => element.tagName === 'g')
    const firstX = (group: Element) => Number(
      group.querySelector('path')!.getAttribute('d')!.match(/^M([\d.]+)/)![1],
    )
    // 同一类里，第二组的柱子从更右边开始。
    expect(firstX(groups[1]!)).toBeGreaterThan(firstX(groups[0]!))
  })
})

describe('line', () => {
  it('renders a single stroke path with the configured color and width', () => {
    const { plot } = mountChart({
      series: [line('v', { color: '#ff0000', strokeWidth: 3 })],
      data: DATA,
      xKey: 'm',
    })
    const paths = plot.querySelectorAll('path')
    expect(paths).toHaveLength(1)
    expect(paths[0]!.getAttribute('stroke')).toBe('#ff0000')
    expect(paths[0]!.getAttribute('stroke-width')).toBe('3')
    expect(paths[0]!.getAttribute('fill')).toBe('none')
    expect(paths[0]!.getAttribute('d')).toMatch(/^M/)
  })

  it('draws per-point dots only where the value is finite', () => {
    const { plot } = mountChart({ series: [line('v', { dots: true })], data: GAPPY, xKey: 'm' })
    expect(plot.querySelectorAll('circle')).toHaveLength(2)
  })
})

describe('dot', () => {
  it('renders one circle per datum with the configured radius', () => {
    const { plot } = mountChart({ series: [dot('v', { radius: 5 })], data: DATA, xKey: 'm' })
    const circles = plot.querySelectorAll('circle')
    expect(circles).toHaveLength(3)
    for (const circle of circles) {
      expect(circle.getAttribute('r')).toBe('5')
      expect(circle.getAttribute('opacity')).toBe('0.8')
    }
  })

  it('skips points whose value is missing', () => {
    const { plot } = mountChart({ series: [dot('v')], data: GAPPY, xKey: 'm' })
    expect(plot.querySelectorAll('circle')).toHaveLength(2)
  })

  it('dodge spreads coincident points horizontally, centered on the shared x', () => {
    // 同一类里的两行落在同一个带中心。
    const coincident = [
      { m: 'A', v: 4 },
      { m: 'A', v: 6 },
      { m: 'B', v: 2 },
    ]
    const { plot } = mountChart({
      series: [dot('v', { dodge: true, radius: 4 })],
      data: coincident,
      xKey: 'm',
    })
    const circles = [...plot.querySelectorAll('circle')]
    expect(circles).toHaveLength(3)
    const [a1, a2] = circles.slice(0, 2).map(circle => Number(circle.getAttribute('cx')))
    // 间距是半径 × 2 + 1 = 9px，围绕中心对称分开。
    expect(a2! - a1!).toBeCloseTo(9)
    const bandCenter = (a1! + a2!) / 2
    expect(Number(circles[0]!.getAttribute('cx'))).toBeCloseTo(bandCenter - 4.5)
  })
})

describe('area', () => {
  it('renders a translucent fill path plus a stroke path by default', () => {
    const { plot } = mountChart({ series: [area('v', { color: '#00aa00' })], data: DATA, xKey: 'm' })
    const paths = plot.querySelectorAll('path')
    expect(paths).toHaveLength(2)
    expect(paths[0]!.getAttribute('fill')).toBe('#00aa00')
    expect(paths[0]!.getAttribute('fill-opacity')).toBe('0.3')
    expect(paths[1]!.getAttribute('fill')).toBe('none')
    expect(paths[1]!.getAttribute('stroke')).toBe('#00aa00')
  })

  it('omits the stroke path when stroke is disabled', () => {
    const { plot } = mountChart({ series: [area('v', { stroke: false })], data: DATA, xKey: 'm' })
    expect(plot.querySelectorAll('path')).toHaveLength(1)
  })

  it('gradient mode defines a per-series gradient and fills with it', () => {
    const { plot } = mountChart({ series: [area('v', { gradient: true })], data: DATA, xKey: 'm' })
    const gradient = plot.querySelector('linearGradient')!
    expect(gradient).not.toBeNull()
    expect(gradient.querySelectorAll('stop')).toHaveLength(2)
    const fillPath = plot.querySelector('path')!
    expect(fillPath.getAttribute('fill')).toBe(`url(#${gradient.id})`)
  })
})

describe('band', () => {
  it('fills the region between the upper and lower bounds', () => {
    const { plot } = mountChart({
      series: [band({ upper: 'hi', lower: 'lo' })],
      data: BOUNDS,
      xKey: 'm',
    })
    const paths = plot.querySelectorAll('path')
    expect(paths).toHaveLength(1)
    expect(paths[0]!.getAttribute('fill-opacity')).toBe('0.15')
    expect(paths[0]!.getAttribute('d')).toMatch(/^M/)
  })

  it('renders nothing when no point has both bounds', () => {
    const missing = [
      { m: 'A', lo: 1 },
      { m: 'B', lo: 4 },
    ]
    const { plot } = mountChart({
      series: [band({ upper: 'hi', lower: 'lo' })],
      data: missing,
      xKey: 'm',
    })
    expect(plot.querySelectorAll('path')).toHaveLength(0)
  })
})

describe('candlestick', () => {
  const OHLC = [
    { m: 'A', o: 2, h: 6, l: 1, c: 5 },
    { m: 'B', o: 6, h: 7, l: 2, c: 3 },
    { m: 'C', o: 3, h: 5, l: 2, c: 4 },
  ]
  const series = () => candlestick({ open: 'o', high: 'h', low: 'l', close: 'c' })

  it('renders a wick line and a body rect per candle, colored by direction', () => {
    const { plot } = mountChart({ series: [series()], data: OHLC, xKey: 'm' })
    const rects = plot.querySelectorAll('rect')
    const wicks = plot.querySelectorAll('line')
    expect(rects).toHaveLength(3)
    expect(wicks).toHaveLength(3)
    // 涨跌颜色取自我们主题里的语义色 token（上游是 `--color-success`）。
    expect(rects[0]!.getAttribute('fill')).toBe('var(--astryx-color-success)')
    expect(rects[1]!.getAttribute('fill')).toBe('var(--astryx-color-error)')
    expect(rects[2]!.getAttribute('fill')).toBe('var(--astryx-color-success)')
  })

  it('skips candles missing any OHLC field', () => {
    const gappy = [OHLC[0], { m: 'B', o: 6, l: 2, c: 3 }, OHLC[2]]
    const { plot } = mountChart({ series: [series()], data: gappy, xKey: 'm' })
    expect(plot.querySelectorAll('rect')).toHaveLength(2)
    expect(plot.querySelectorAll('line')).toHaveLength(2)
  })
})

describe('errorBar', () => {
  it('renders a stem plus two whisker caps per point', () => {
    const { plot } = mountChart({
      series: [errorBar({ high: 'hi', low: 'lo' })],
      data: BOUNDS,
      xKey: 'm',
    })
    const lines = plot.querySelectorAll('line')
    expect(lines).toHaveLength(9)
    for (const lineElement of lines)
      expect(lineElement.getAttribute('stroke')).toBe('var(--astryx-color-text-primary)')
  })

  it('skips whiskers missing either bound', () => {
    const gappy = [BOUNDS[0], { m: 'B', hi: 8 }, BOUNDS[2]]
    const { plot } = mountChart({
      series: [errorBar({ high: 'hi', low: 'lo' })],
      data: gappy,
      xKey: 'm',
    })
    expect(plot.querySelectorAll('line')).toHaveLength(6)
  })
})

describe('referenceLine', () => {
  it('draws a dashed horizontal line across the plot with a label badge', () => {
    const { plot, container } = mountChart({
      series: [line('v'), referenceLine({ y: 5, label: 'Target' })],
      data: DATA,
      xKey: 'm',
    })
    const dashed = plot.querySelector('line[stroke-dasharray="6 3"]')!
    expect(dashed).not.toBeNull()
    expect(dashed.getAttribute('x1')).toBe('0')
    expect(dashed.getAttribute('x2')).toBe('528')
    expect(dashed.getAttribute('y1')).toBe(dashed.getAttribute('y2'))
    expect([...container.querySelectorAll('text')].some(text => text.textContent?.trim() === 'Target')).toBe(true)
    expect(plot.querySelector('rect[rx="3"]')).not.toBeNull()
  })

  it('shades a band between y and y2 bounded by two dashed lines', () => {
    const { plot } = mountChart({
      series: [line('v'), referenceLine({ y: 2, y2: 6 })],
      data: DATA,
      xKey: 'm',
    })
    expect(plot.querySelectorAll('line[stroke-dasharray="6 3"]')).toHaveLength(2)
    const bandRect = plot.querySelector('rect[opacity="0.1"]')!
    expect(bandRect).not.toBeNull()
    expect(bandRect.getAttribute('width')).toBe('528')
  })

  it('draws a vertical dashed line at a numeric x on a linear scale', () => {
    const numeric = [
      { x: 0, v: 1 },
      { x: 5, v: 7 },
      { x: 10, v: 3 },
    ]
    const { plot } = mountChart({
      series: [line('v'), referenceLine({ x: 5 })],
      data: numeric,
      xKey: 'x',
    })
    const dashed = plot.querySelector('line[stroke-dasharray="6 3"]')!
    expect(dashed).not.toBeNull()
    expect(dashed.getAttribute('x1')).toBe(dashed.getAttribute('x2'))
    expect(dashed.getAttribute('y1')).toBe('0')
    expect(dashed.getAttribute('y2')).toBe('244')
  })
})
