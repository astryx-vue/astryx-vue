import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Chart from './Chart/Chart.vue'
import { ChartAxis } from './ChartAxis/index.js'
import { ChartGrid } from './ChartGrid/index.js'
import { ChartLegend } from './ChartLegend/index.js'
import { ChartTooltip } from './ChartTooltip/index.js'
import { bar } from './marks/bar.js'
import { line } from './marks/line.js'

/**
 * 服务端渲染。没有 DOM、量不到容器宽度，宽度只能由 `width` prop 给；
 * 输出必须是完整的 SVG（图、轴、网格、图例都在），而提示框卡片是浏览器才有的东西。
 */

const data = [
  { month: 'Jan', revenue: 100, trend: 90 },
  { month: 'Feb', revenue: 200, trend: 180 },
  { month: 'Mar', revenue: 150, trend: 160 },
]

describe('chart server rendering', () => {
  it('outputs the full svg for a bar plus line chart', async () => {
    const app = createSSRApp({
      render: () => h(Chart, {
        data,
        xKey: 'month',
        series: [bar('revenue'), line('trend')],
        width: 600,
        legend: true,
        tooltip: true,
      }, {
        grid: () => h(ChartGrid),
        axes: () => [h(ChartAxis, { position: 'bottom' }), h(ChartAxis, { position: 'left' })],
      }),
    })

    const html = await renderToString(app)

    expect(html).toContain('<svg')
    expect(html).toContain('role="img"')
    expect(html).toContain('<rect')
    expect(html).toContain('<path')
    expect(html).toContain('translate(48,24)')
    expect(html).toContain('bottom axis')
    expect(html).toContain('Chart legend')
    // 卡片是浏览器里才有的一层，服务端不该出现。
    expect(html).not.toContain('role="tooltip"')
  })

  it('renders a standalone tooltip without the browser-only card', async () => {
    const app = createSSRApp({
      render: () => h(Chart, { data, xKey: 'month', series: [line('trend')], width: 400 }, {
        interactions: () => h(ChartTooltip, { series: [line('trend')] }),
      }),
    })

    const html = await renderToString(app)
    expect(html).toContain('<svg')
    expect(html).not.toContain('role="tooltip"')
  })

  it('renders the legend list on its own', async () => {
    const app = createSSRApp({
      render: () => h(ChartLegend, {
        items: [{ label: 'Revenue', color: '#ff0000', type: 'bar' }],
      }),
    })

    const html = await renderToString(app)
    expect(html).toContain('role="list"')
    expect(html).toContain('Revenue')
  })
})
