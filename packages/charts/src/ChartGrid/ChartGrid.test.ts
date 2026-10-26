import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { attr } from '../../test-support/a11y.js'
import { mountChart } from '../../test-support/chart.js'
import { bar } from '../marks/bar.js'
import { ChartGrid } from './index.js'

/**
 * 网格线。这些用例里不挂坐标轴，标记画的是 `path`、指针捕获层是 `rect`，
 * 所以 svg 里的每一条 `<line>` 都属于网格。
 */

const DATA = [
  { month: 'Jan', sales: 4 },
  { month: 'Feb', sales: 10 },
  { month: 'Mar', sales: 2 },
]

function renderGrid(grid: () => unknown, data = DATA, xKey = 'month') {
  const mounted = mountChart({ series: [bar('sales')], data, xKey }, { grid })
  const lines = [...mounted.container.querySelectorAll('svg line')]
  return { ...mounted, lines }
}

describe('chartGrid', () => {
  it('draws horizontal lines across the plot for every y tick except the y=0 baseline', () => {
    const { lines } = renderGrid(() => [h(ChartGrid)])
    // 域 [0, 10] → 刻度 0,2,4,6,8,10；跳过 0 那条 → 5 条。
    expect(lines).toHaveLength(5)
    for (const line of lines) {
      expect(attr(line, 'x1')).toBe('0')
      expect(attr(line, 'x2')).toBe('528')
      expect(attr(line, 'y1')).toBe(attr(line, 'y2'))
      // y=0 落在绘图区底边 244，绝不会和坐标轴叠着画两遍。
      expect(attr(line, 'y1')).not.toBe('244')
    }
  })

  it('draws a vertical line at each band center when vertical is enabled', () => {
    const { lines } = renderGrid(() => [h(ChartGrid, { horizontal: false, vertical: true })])
    expect(lines).toHaveLength(3)
    for (const line of lines) {
      expect(attr(line, 'x1')).toBe(attr(line, 'x2'))
      expect(attr(line, 'y1')).toBe('0')
      expect(attr(line, 'y2')).toBe('244')
    }
    const xs = lines.map(line => Number(attr(line, 'x1')))
    expect(xs[0]!).toBeLessThan(xs[1]!)
    expect(xs[1]!).toBeLessThan(xs[2]!)
  })

  it('combines horizontal and vertical lines when both are enabled', () => {
    const { lines } = renderGrid(() => [h(ChartGrid, { vertical: true })])
    expect(lines).toHaveLength(8)
  })

  it('uses zero to request no continuous grid lines', () => {
    const { lines } = renderGrid(() => [h(ChartGrid, { tickCount: 0 })])
    expect(lines).toHaveLength(0)
  })

  it('falls back to the default density for a non-finite tick count', () => {
    const { lines } = renderGrid(() => [h(ChartGrid, { tickCount: Number.POSITIVE_INFINITY })])
    expect(lines).toHaveLength(5)
  })

  it('caps a huge continuous tick request without throwing', () => {
    const { lines } = renderGrid(() => [h(ChartGrid, { tickCount: 1e9 })])
    expect(lines.length).toBeGreaterThan(0)
    expect(lines.length).toBeLessThanOrEqual(1001)
  })

  it('places vertical lines at d3 tick values on a linear x scale', () => {
    const numeric = [
      { month: 0, sales: 1 },
      { month: 5, sales: 7 },
      { month: 10, sales: 3 },
    ]
    const { lines } = renderGrid(
      () => [h(ChartGrid, { horizontal: false, vertical: true })],
      numeric,
    )
    // 线性域 [0, 10] → 刻度 0,2,4,6,8,10 → 6 条等距竖线。
    expect(lines).toHaveLength(6)
    const xs = lines.map(line => Number(attr(line, 'x1')))
    expect(xs[0]).toBe(0)
    expect(xs[5]).toBe(528)
    expect(xs[1]! - xs[0]!).toBeCloseTo(528 / 5)
  })
})
