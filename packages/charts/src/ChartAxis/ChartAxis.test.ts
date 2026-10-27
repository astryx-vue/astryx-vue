import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { allByRole, attr, byRole } from '../../test-support/a11y.js'
import { mountChart } from '../../test-support/chart.js'
import { bar } from '../marks/bar.js'
import { ChartAxis } from './index.js'

/**
 * 坐标轴画出来的样子。上游用例靠 ResizeObserver 上报 600 宽，
 * 这里直接把 `width: 600` 给 `<Chart>`，绘图区宽度同样是 528。
 */

const DATA = [
  { month: 'Jan', sales: 4 },
  { month: 'Feb', sales: 10 },
  { month: 'Mar', sales: 2 },
]

/** 把一条轴塞进 `axes` 插槽里挂一张图。 */
function mountWithAxes(axes: () => unknown, data = DATA) {
  return mountChart({ series: [bar('sales')], data, xKey: 'month' }, { axes })
}

function textOf(root: Element, label: string): Element | undefined {
  return [...root.querySelectorAll('text')].find(element => element.textContent?.trim() === label)
}

describe('chartAxis bottom (band scale)', () => {
  it('renders a labeled group with one tick label per category', () => {
    const { container } = mountWithAxes(() => [h(ChartAxis, { position: 'bottom' })])
    const axis = byRole('group', 'bottom axis', container)
    expect(textOf(axis, 'Jan')).toBeTruthy()
    expect(textOf(axis, 'Feb')).toBeTruthy()
    expect(textOf(axis, 'Mar')).toBeTruthy()
  })

  it('is translated to the bottom edge of the plot and draws its edge line by default', () => {
    const { container } = mountWithAxes(() => [h(ChartAxis, { position: 'bottom' })])
    const axis = byRole('group', 'bottom axis', container)
    // 默认 300px 高的图：300 - 24 - 32 = 244。
    expect(attr(axis, 'transform')).toBe('translate(0,244)')
    const edge = axis.querySelector('line')!
    expect(edge).not.toBeNull()
    expect(attr(edge, 'x2')).toBe('528')
  })

  it('caps labels to maxTicks by evenly skipping categories', () => {
    const { container } = mountWithAxes(() => [h(ChartAxis, { position: 'bottom', maxTicks: 2 })])
    const axis = byRole('group', 'bottom axis', container)
    // 3 个类压到 2 个 → 步长 2 → 留下第 0 和第 2 个。
    expect(textOf(axis, 'Jan')).toBeTruthy()
    expect(textOf(axis, 'Mar')).toBeTruthy()
    expect(textOf(axis, 'Feb')).toBeUndefined()
  })

  it('automatically reduces categorical labels as the plot narrows', () => {
    const denseData = Array.from({ length: 20 }, (_, index) => ({
      month: `Period ${index + 1}`,
      sales: index,
    }))
    const wide = mountWithAxes(() => [h(ChartAxis, { position: 'bottom' })], denseData)
    const wideCount = byRole('group', 'bottom axis', wide.container).querySelectorAll('text').length

    const { container } = mountChart(
      { series: [bar('sales')], data: denseData, xKey: 'month', width: 120 },
      { axes: () => [h(ChartAxis, { position: 'bottom' })] },
    )
    const narrowCount = byRole('group', 'bottom axis', container).querySelectorAll('text').length
    expect(narrowCount).toBeGreaterThan(0)
    expect(narrowCount).toBeLessThan(wideCount)
  })

  it('keeps the same auto-thinned labels after ASCII and Unicode truncation', () => {
    const asciiData = Array.from({ length: 9 }, (_, index) => ({ month: `${index + 1}AB`, sales: index }))
    const clusters = ['👨‍👩‍👧‍👦', '🇯🇵', '👩🏽‍🚀']
    const unicodeData = Array.from({ length: 9 }, (_, index) => ({
      month: `${index + 1}${clusters[index % clusters.length]}X`,
      sales: index,
    }))

    const retainedIndexes = (data: { month: string, sales: number }[]) => {
      const { container } = mountChart(
        { series: [bar('sales')], data, xKey: 'month', width: 300 },
        { axes: () => [h(ChartAxis, { position: 'bottom', truncate: 2 })] },
      )
      return [...byRole('group', 'bottom axis', container).querySelectorAll('text')]
        .map(label => Number(label.textContent?.match(/^(\d+)/)?.[1]))
    }

    expect(retainedIndexes(unicodeData)).toEqual(retainedIndexes(asciiData))
  })

  it('truncates long category labels with an ellipsis', () => {
    const { container } = mountWithAxes(
      () => [h(ChartAxis, { position: 'bottom', truncate: 4 })],
      [
        { month: 'January', sales: 4 },
        { month: 'Feb', sales: 10 },
      ],
    )
    const axis = byRole('group', 'bottom axis', container)
    expect(textOf(axis, 'Janu…')).toBeTruthy()
    // 短标签原样保留。
    expect(textOf(axis, 'Feb')).toBeTruthy()
  })

  it('preserves whole grapheme clusters when truncating labels', () => {
    const family = '👨‍👩‍👧‍👦'
    const { container } = mountWithAxes(
      () => [h(ChartAxis, { position: 'bottom', truncate: 1 })],
      [{ month: `${family}Q`, sales: 4 }],
    )
    expect(textOf(byRole('group', 'bottom axis', container), `${family}…`)).toBeTruthy()
  })
})

describe('chartAxis left (linear scale)', () => {
  it('renders d3-formatted value ticks without an edge line by default', () => {
    const { container } = mountWithAxes(() => [h(ChartAxis, { position: 'left' })])
    const axis = byRole('group', 'left axis', container)
    // 柱状系列把零基线算进范围 → 域 [0, 10] → 刻度 0,2,...,10。
    expect(textOf(axis, '0')).toBeTruthy()
    expect(textOf(axis, '4')).toBeTruthy()
    expect(textOf(axis, '10')).toBeTruthy()
    // 默认只有底轴画轴线。
    expect(axis.querySelector('line')).toBeNull()
  })

  it('applies a custom tick formatter', () => {
    const { container } = mountWithAxes(() => [
      h(ChartAxis, { position: 'left', tickFormat: (value: unknown) => `$${String(value)}` }),
    ])
    const axis = byRole('group', 'left axis', container)
    expect(textOf(axis, '$0')).toBeTruthy()
    expect(textOf(axis, '$10')).toBeTruthy()
  })

  it('showTicks draws a perpendicular mark per tick and forces the axis line on', () => {
    const { container } = mountWithAxes(() => [h(ChartAxis, { position: 'left', showTicks: true })])
    const axis = byRole('group', 'left axis', container)
    // 6 个刻度（0..10 步长 2）加被强制打开的轴线。
    expect(axis.querySelectorAll('line')).toHaveLength(7)
  })
})

describe('chartAxis top and right positions', () => {
  it('places both axes on their physical plot edges with outward labels', () => {
    const { container } = mountWithAxes(() => [
      h(ChartAxis, { position: 'top', showTicks: true }),
      h(ChartAxis, { position: 'right', showTicks: true }),
    ])

    const top = byRole('group', 'top axis', container)
    expect(attr(top, 'transform')).toBeNull()
    expect(attr(textOf(top, 'Jan')!, 'y')).toBe('-10')

    const right = byRole('group', 'right axis', container)
    expect(attr(right, 'transform')).toBe('translate(528,0)')
    const zero = textOf(right, '0')!
    expect(attr(zero, 'x')).toBe('10')
    expect(attr(zero, 'text-anchor')).toBe('start')
    expect(allByRole('group', container)).toHaveLength(2)
  })
})
