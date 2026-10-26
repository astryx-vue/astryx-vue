import type { ChartContext, ChartPointerEvent, ResolvedPoint, SeriesDef } from '../types.js'
import { mount } from '@vue/test-utils'
import { scaleBand, scaleLinear } from 'd3-scale'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, provide, ref } from 'vue'
import { chartContextKey } from '../context.js'
import { ChartTooltip } from './index.js'

/**
 * 提示框。上游用例在手工搭的 `ChartProvider` 下渲染，好直接往指针流里推事件
 * （jsdom 里没有真实 SVG 几何，真图表算不出指针位置）；这里同样手搭上下文。
 *
 * 卡片的位置用 `offsetWidth/offsetHeight` 量，happy-dom 里量到 0，
 * 所以测定位的那几条用例把这两个值 mock 掉。
 */

const DATA = [
  { month: 'Jan', sales: 3, profit: 1 },
  { month: 'Feb', sales: 7, profit: 2 },
  { month: 'Mar', sales: 5, profit: 4 },
]

const SALES_POINTS: ResolvedPoint[] = [
  { px: 50, py: 120, py0: 200, dataIndex: 0 },
  { px: 250, py: 40, py0: 200, dataIndex: 1 },
  { px: 450, py: 80, py0: 200, dataIndex: 2 },
]

/** 一份「已经布局完」的系列定义，`_uid` 和 computeLayout 的写法一致。 */
function makeSeries(overrides: Partial<SeriesDef> = {}): SeriesDef {
  return {
    type: 'line',
    key: 'sales',
    dataKeys: ['sales'],
    label: 'Sales',
    color: '#ff0000',
    layout: {},
    resolve: () => [],
    render: () => null,
    _uid: '0:sales',
    ...overrides,
  } as SeriesDef
}

interface Harness {
  ctx: ChartContext
  handlers: Set<(event: ChartPointerEvent) => void>
  dispatch: (event: ChartPointerEvent) => void
  svgRef: ReturnType<typeof ref<SVGSVGElement | null>>
  root: HTMLElement
  unmount: () => void
}

/** 挂一个包着假上下文的提示框，顺便把 svgRef 接到真的 svg 上。 */
function renderTooltip(
  overrides: Partial<ChartContext> = {},
  props: Record<string, unknown> = {},
  slots: Record<string, (scope?: unknown) => unknown> = {},
): Harness {
  const handlers = new Set<(event: ChartPointerEvent) => void>()
  const svgRef = ref<SVGSVGElement | null>(null)
  const ctx: ChartContext = {
    width: 500,
    height: 200,
    margin: { top: 24, right: 24, bottom: 32, left: 48 },
    data: DATA,
    xKey: 'month',
    xScale: scaleBand<string>().domain(['Jan', 'Feb', 'Mar']).range([0, 500]).padding(0.2),
    yScale: scaleLinear().domain([0, 10]).range([200, 0]),
    resolved: new Map([['0:sales', SALES_POINTS]]),
    onPointer: (handler) => {
      handlers.add(handler)
      return () => handlers.delete(handler)
    },
    svgRef,
    ...overrides,
  }

  const wrapper = mount({
    setup() {
      provide(chartContextKey, ctx)
      return () => h('div', [
        h('svg', { ref: (element: unknown) => { svgRef.value = element as SVGSVGElement | null } }, [
          h('g', [h(ChartTooltip, props, slots)]),
        ]),
      ])
    },
  })
  const root = wrapper.element as HTMLElement

  return {
    ctx,
    handlers,
    svgRef,
    root,
    unmount: () => wrapper.unmount(),
    dispatch: (event: ChartPointerEvent) => {
      for (const handler of handlers)
        handler(event)
    },
  }
}

/** 提示框要等几帧才知道卡片多大、该不该显示。 */
async function settle(): Promise<void> {
  for (let i = 0; i < 6; i++)
    await nextTick()
}

function hoverAt(index: number): ChartPointerEvent {
  return {
    x: SALES_POINTS[index]!.px,
    y: 100,
    nearest: { ...SALES_POINTS[index]!, seriesKey: 'sales' },
    active: false,
  }
}

const staleHover: ChartPointerEvent = {
  x: 0,
  y: 0,
  nearest: { px: 50, py: 120, py0: 200, dataIndex: 99, seriesKey: 'sales' },
  active: false,
}

const pointerLeave: ChartPointerEvent = {
  x: -1,
  y: -1,
  nearest: null,
  active: false,
}

const card = (root: HTMLElement): HTMLElement => root.querySelector('[role="tooltip"]')!

/**
 * 让卡片能量出「固定」的尺寸，好在 happy-dom 里验证定位：
 * happy-dom 的 `offsetWidth` 是 undefined，浏览器里也不会是 0 以外的怪值。
 */
function stubCardSize(width: number, height: number): void {
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(width)
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(height)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('chartTooltip card', () => {
  it('portals the card into the nearest chart HTML container', async () => {
    const harness = renderTooltip()
    await settle()
    const cardElement = card(harness.root)
    expect(cardElement).not.toBeNull()
    expect(cardElement.parentElement).toBe(harness.root)
    expect(harness.svgRef.value!.contains(cardElement)).toBe(false)
    expect(cardElement.textContent).toBe('')
  })

  it('shows the hovered x value and the bare value for a single series', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    harness.dispatch(hoverAt(1))
    await settle()
    expect(card(harness.root).textContent).toContain('Feb')
    expect(card(harness.root).textContent).toContain('7')
  })

  it('lists a labeled row per series for multi-series charts', async () => {
    const profitPoints = SALES_POINTS.map(point => ({ ...point, py: point.py + 30 }))
    const series = [
      makeSeries(),
      makeSeries({ key: 'profit', dataKeys: ['profit'], label: 'Profit', _uid: '1:profit' }),
    ]
    const harness = renderTooltip({
      resolved: new Map([
        ['0:sales', SALES_POINTS],
        ['1:profit', profitPoints],
      ]),
    }, { series })
    harness.dispatch(hoverAt(1))
    await settle()
    const text = card(harness.root).textContent ?? ''
    expect(text).toContain('Sales')
    expect(text).toContain('7')
    expect(text).toContain('Profit')
    expect(text).toContain('2')
  })

  it('reveals the card on hover and hides it again when the pointer leaves', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    await settle()

    harness.dispatch(hoverAt(0))
    await settle()
    expect(card(harness.root).style.display).not.toBe('none')
    expect(card(harness.root).textContent).toContain('Jan')

    harness.dispatch(pointerLeave)
    await settle()
    expect(card(harness.root).style.display).toBe('none')
  })

  it('keeps the card open while moving between valid data points', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    harness.dispatch(hoverAt(0))
    await settle()
    const openCard = card(harness.root)
    expect(openCard.textContent).toContain('Jan')

    harness.dispatch(hoverAt(1))
    await settle()
    expect(card(harness.root)).toBe(openCard)
    expect(openCard.textContent).toContain('Feb')

    harness.dispatch(pointerLeave)
    await settle()
    expect(openCard.style.display).toBe('none')

    harness.dispatch(hoverAt(2))
    await settle()
    expect(card(harness.root)).toBe(openCard)
    expect(openCard.textContent).toContain('Mar')
  })

  it('measures the card before pinning it for placement="left"', async () => {
    stubCardSize(120, 40)
    const harness = renderTooltip({}, { series: [makeSeries()], placement: 'left' })
    harness.dispatch(hoverAt(1))
    await settle()
    // svgLeft(0) + marginLeft(48) + px(250) - width(120) - gap(8)
    expect(card(harness.root).style.left).toBe('170px')
  })

  it('pins the card beside the hovered point for placement="right"', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()], placement: 'right' })
    harness.dispatch(hoverAt(1))
    await settle()
    // svgLeft(0) + marginLeft(48) + px(250) + gap(8)
    expect(card(harness.root).style.left).toBe('306px')
  })

  it('does not open the card when the hovered index no longer exists in data', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    harness.dispatch(staleHover)
    await settle()
    expect(card(harness.root).textContent).toBe('')
    expect(card(harness.root).style.display).toBe('none')
  })

  it('closes an open card for a stale index and reopens for later valid data', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    harness.dispatch(hoverAt(0))
    await settle()
    expect(card(harness.root).textContent).toContain('Jan')

    harness.dispatch(staleHover)
    await settle()
    expect(card(harness.root).textContent).toBe('')
    expect(card(harness.root).style.display).toBe('none')

    harness.dispatch(hoverAt(1))
    await settle()
    expect(card(harness.root).textContent).toContain('Feb')
    expect(card(harness.root).style.display).not.toBe('none')
  })
})

describe('chartTooltip hover indicators', () => {
  it('marks the hovered point of each series with a dot in the series color', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    harness.dispatch(hoverAt(1))
    await settle()
    const dot = harness.root.querySelector('circle')!
    expect(dot).not.toBeNull()
    expect(dot.getAttribute('cx')).toBe('250')
    expect(dot.getAttribute('cy')).toBe('40')
    expect(dot.getAttribute('stroke')).toBe('#ff0000')
  })

  it('skips the hover dot when the series value is missing at that index', async () => {
    const gappy = SALES_POINTS.map((point, index) => (index === 1 ? { ...point, py: Number.NaN } : point))
    const harness = renderTooltip({ resolved: new Map([['0:sales', gappy]]) }, { series: [makeSeries()] })
    harness.dispatch(hoverAt(1))
    await settle()
    expect(harness.root.querySelector('circle')).toBeNull()
  })

  it('draws a vertical crosshair through the hovered x for line charts', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    harness.dispatch(hoverAt(1))
    await settle()
    const crosshair = harness.root.querySelector('line')!
    expect(crosshair).not.toBeNull()
    expect(crosshair.getAttribute('x1')).toBe(crosshair.getAttribute('x2'))
    expect(crosshair.getAttribute('y1')).toBe('0')
    expect(crosshair.getAttribute('y2')).toBe('200')
  })

  it('draws a soft band-highlight rect instead of a crosshair when the chart has bars', async () => {
    const harness = renderTooltip({}, { series: [makeSeries({ type: 'bar' })] })
    harness.dispatch(hoverAt(1))
    await settle()
    expect(harness.root.querySelector('line')).toBeNull()
    const highlight = harness.root.querySelector('rect')!
    expect(highlight).not.toBeNull()
    expect(Number(highlight.getAttribute('width'))).toBeGreaterThan(0)
  })
})

describe('chartTooltip custom content', () => {
  it('replaces the card body and receives the x value plus one row per series', async () => {
    const seen: unknown[] = []
    const harness = renderTooltip({}, { series: [makeSeries()] }, {
      content: (scope: unknown) => {
        seen.push(scope)
        return 'custom body'
      },
    })
    harness.dispatch(hoverAt(1))
    await settle()
    expect(card(harness.root).textContent).toBe('custom body')
    const scope = seen.at(-1) as { xValue: unknown, rows: { key: string, label: string, value: unknown }[] }
    expect(scope.xValue).toBe('Feb')
    expect(scope.rows).toMatchObject([{ key: 'sales', label: 'Sales', value: 7 }])
  })

  it('never opens the card when the custom content renders nothing', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] }, { content: () => null })
    harness.dispatch(hoverAt(1))
    await settle()
    expect(card(harness.root).textContent).toBe('')
    expect(card(harness.root).style.display).toBe('none')
  })

  it('closes for empty custom content and reopens for later content', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] }, {
      content: (scope: unknown) => ((scope as { xValue: unknown }).xValue === 'Feb' ? null : String((scope as { xValue: unknown }).xValue)),
    })
    harness.dispatch(hoverAt(0))
    await settle()
    expect(card(harness.root).textContent).toBe('Jan')

    harness.dispatch(hoverAt(1))
    await settle()
    expect(card(harness.root).textContent).toBe('')
    expect(card(harness.root).style.display).toBe('none')

    harness.dispatch(hoverAt(2))
    await settle()
    expect(card(harness.root).textContent).toBe('Mar')
    expect(card(harness.root).style.display).not.toBe('none')
  })
})

describe('chartTooltip lifecycle', () => {
  it('removes the card and unsubscribes from the pointer stream on unmount', async () => {
    const harness = renderTooltip({}, { series: [makeSeries()] })
    await settle()
    expect(harness.handlers.size).toBe(1)
    harness.unmount()
    expect(card(harness.root)).toBeNull()
    expect(harness.handlers.size).toBe(0)
  })
})
