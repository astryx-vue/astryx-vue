import type { Component } from 'vue'
import { InternationalizationProvider } from '@astryx-vue/core'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { attr, byRole, queryByRole } from '../../test-support/a11y.js'
import { mountChart, stubResizeObserver } from '../../test-support/chart.js'
import { bar } from '../marks/bar.js'
import { line } from '../marks/line.js'
import Chart from './Chart.vue'
import { MAX_TABLE_POINTS } from './types.js'

const data = [
  { month: 'Jan', revenue: 100, profit: 20 },
  { month: 'Feb', revenue: 200, profit: 40 },
  { month: 'Mar', revenue: 150, profit: 30 },
]

describe('chart accessible name', () => {
  it('exposes the svg as a named image with a default label', () => {
    const { container } = mountChart({ data, xKey: 'month', series: [bar('revenue'), bar('profit')] })
    expect(byRole('img', 'Chart of revenue and profit by month', container)).not.toBeNull()
  })

  it('prefers the title prop as the accessible name', () => {
    const { container } = mountChart({
      data,
      xKey: 'month',
      series: [bar('revenue')],
      title: 'Quarterly revenue',
    })
    expect(byRole('img', 'Quarterly revenue', container)).not.toBeNull()
  })

  it('describes the svg from the subtitle and mirrors the title in an svg <title>', () => {
    const { container } = mountChart({
      data,
      xKey: 'month',
      series: [bar('revenue')],
      title: 'Quarterly revenue',
      subtitle: 'Revenue per month',
    })
    const svg = container.querySelector('svg')!
    expect(svg.querySelector('title')!.textContent).toBe('Quarterly revenue')
    const desc = svg.querySelector('desc')!
    expect(desc.textContent).toBe('Revenue per month')
    expect(attr(svg, 'aria-describedby')).toBe(desc.id)
  })

  it('localizes the generated name and data-table caption', async () => {
    // core 的文案目录还没收录图表那几条键，这里验证的是包内自带的 zh-CN 兜底。
    const wrapper = mount({
      render: () => h(InternationalizationProvider as Component, { locale: 'zh-CN' }, {
        default: () => h(Chart as Component, {
          width: 600,
          data,
          xKey: 'month',
          series: [bar('revenue'), bar('profit')],
        }),
      }),
    })
    await nextTick()
    const container = wrapper.element as HTMLElement
    const label = '按 month 显示 revenue和profit 的图表'
    expect(byRole('img', label, container)).not.toBeNull()
    expect(byRole('table', `${label}的数据`, container)).not.toBeNull()
    wrapper.unmount()
  })
})

describe('chart data table fallback', () => {
  it('renders a visually hidden table mirroring the data', () => {
    const { container } = mountChart({ data, xKey: 'month', series: [bar('revenue'), bar('profit')] })

    expect(byRole('table', undefined, container)).not.toBeNull()
    expect(byRole('columnheader', 'month', container)).not.toBeNull()
    expect(byRole('columnheader', 'revenue', container)).not.toBeNull()
    expect(byRole('columnheader', 'profit', container)).not.toBeNull()
    expect(byRole('rowheader', 'Feb', container)).not.toBeNull()
    expect(byRole('cell', '200', container)).not.toBeNull()
    expect(byRole('cell', '40', container)).not.toBeNull()

    // 视觉上藏起来，但仍在无障碍树里。
    const wrapperElement = byRole('table', undefined, container).parentElement!
    expect(wrapperElement.getAttribute('class')).toBeTruthy()
    expect(wrapperElement.hasAttribute('hidden')).toBe(false)
  })

  it('skips the table when the dataset exceeds the size cutoff', () => {
    const big = Array.from({ length: MAX_TABLE_POINTS + 1 }, (_, index) => ({
      month: `m${index}`,
      revenue: index,
    }))
    const { container } = mountChart({ data: big, xKey: 'month', series: [bar('revenue')] })
    expect(queryByRole('table', container)).toBeNull()
  })
})

describe('chart measurement gate', () => {
  it('renders only an empty height-reserving placeholder until the container reports a width', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const wrapper = mount(Chart as Component, {
      props: { data, xKey: 'month', series: [bar('revenue')], height: 300, width: 0 },
    })
    const container = (wrapper.element as HTMLElement).querySelector<HTMLElement>('.astryx-chart')!
    expect(container.querySelector('svg')).toBeNull()
    expect(container.tagName).toBe('DIV')
    expect(container.style.height).toBe('300px')
    expect(container.childElementCount).toBe(0)
    vi.unstubAllGlobals()
    wrapper.unmount()
  })

  it('renders the svg once the container reports a width', async () => {
    const observer = stubResizeObserver()
    const wrapper = mount(Chart as Component, {
      props: { data, xKey: 'month', series: [bar('revenue')], width: 0 },
    })
    const root = wrapper.element as HTMLElement
    expect(root.querySelector('svg')).toBeNull()

    await observer.reportWidth(600)
    // 宽度从 0 变成 600 会换掉根节点，要重新查。
    expect(root.querySelector('svg')).not.toBeNull()
    vi.unstubAllGlobals()
    wrapper.unmount()
  })
})

describe('chart root contract', () => {
  it('forwards DOM props to the root container', async () => {
    const onClick = vi.fn()
    const { container } = mountChart(
      { data, xKey: 'month', series: [bar('revenue')] },
      {},
      { 'class': 'consumer-chart', 'style': 'max-width: 480px', 'data-testid': 'chart-root', onClick },
    )
    expect(container.classList.contains('consumer-chart')).toBe(true)
    expect(container.style.maxWidth).toBe('480px')
    expect(attr(container, 'data-testid')).toBe('chart-root')

    container.click()
    await nextTick()
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('chart render delegation', () => {
  it('renders one clipped group per series', () => {
    const { plot } = mountChart({ data, xKey: 'month', series: [bar('revenue'), line('profit')] })
    const seriesGroups = [...plot.children].filter(element => element.tagName === 'g')
    expect(seriesGroups).toHaveLength(2)
    expect(seriesGroups[0]!.querySelectorAll('path').length).toBeGreaterThan(0)
    expect(seriesGroups[1]!.querySelectorAll('path').length).toBeGreaterThan(0)
  })

  it('sizes the transparent event-capture rect to the plot area inside the default margins', () => {
    const { container } = mountChart({ data, xKey: 'month', series: [bar('revenue')], height: 300 })
    // 600 - 48（左）- 24（右）= 528；300 - 24（上）- 32（下）= 244。
    const eventRect = container.querySelector('svg > g > rect[fill="transparent"]')!
    expect(eventRect).not.toBeNull()
    expect(attr(eventRect, 'width')).toBe('528')
    expect(attr(eventRect, 'height')).toBe('244')
  })

  it('assigns distinct palette colors to series that do not declare one', () => {
    const { container } = mountChart({ data, xKey: 'month', series: [line('revenue'), line('profit')] })
    const strokes = [...container.querySelectorAll('g[clip-path] path[stroke]')]
      .map(path => path.getAttribute('stroke'))
    expect(strokes).toHaveLength(2)
    expect(strokes[0]).toBeTruthy()
    expect(strokes[1]).toBeTruthy()
    expect(strokes[0]).not.toBe(strokes[1])
  })
})

describe('chart legend slot', () => {
  it('derives legend items from series labels when legend is enabled', () => {
    const { container } = mountChart({
      data,
      xKey: 'month',
      series: [bar('revenue', { label: 'Revenue' }), line('profit')],
      legend: true,
    })
    const list = byRole('list', 'Chart legend', container)
    const rows = [...list.querySelectorAll('[role="listitem"]')]
    expect(rows).toHaveLength(2)
    expect(rows[0]!.textContent).toContain('Revenue')
    // 没写 label 时退回 dataKey。
    expect(rows[1]!.textContent).toContain('profit')
  })
})

describe('chart tooltip slot', () => {
  it('mounts the grouped tooltip card only when tooltip is enabled', async () => {
    const off = mountChart({ data, xKey: 'month', series: [bar('revenue')] })
    expect(off.container.querySelector('[role="tooltip"]')).toBeNull()
    off.wrapper.unmount()

    const on = mountChart({ data, xKey: 'month', series: [bar('revenue')], tooltip: true })
    // 卡片的挂载目标是 svg 的父元素，挂载完成后才解析得到，所以等一帧再查。
    await nextTick()
    expect(on.container.querySelector('[role="tooltip"]')).not.toBeNull()
    on.wrapper.unmount()
  })
})
