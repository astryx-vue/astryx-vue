import type { PropType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { AXIS_TICK, GRID_STROKE, niceTicks, useChartWidth, wrapToWidth } from './playgroundChartKit'

/** 甘特图 y 轴的宽度，原版 recharts 的 `YAxis width={148}`。 */
const Y_AXIS_WIDTH = 148

export const PlaygroundHorizontalBarChart = defineComponent({
  name: 'PlaygroundHorizontalBarChart',
  props: {
    data: { type: Array as PropType<Array<{ label: string, value: number, color: string }>>, required: true },
    height: { type: Number, default: 260 },
    /** 开启后：行高 = 绘图区高 / 行数，柱高 26、圆角 4，底部画 5 档数值刻度和纵向网格，和 recharts 的横向柱图一样。 */
    hasAxis: { type: Boolean, default: false },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const max = Math.max(...props.data.map(d => d.value), 1)

      if (props.hasAxis) {
        const pad = { top: 0, right: 24, bottom: 30, left: 118 }
        const innerW = chartW - pad.left - pad.right
        const innerH = props.height - pad.top - pad.bottom
        const rowH = innerH / props.data.length
        const ticks = niceTicks(0, max, 5)
        const top = ticks[ticks.length - 1]
        const x = (v: number): number => pad.left + (v / top) * innerW
        return h('svg', {
          'width': '100%',
          'height': props.height,
          'ref': chart.el,
          'viewBox': `0 0 ${chartW} ${props.height}`,
          'role': 'img',
          'aria-label': 'Bar chart',
        }, [
          ...ticks.map(tick => h('line', { x1: x(tick), y1: pad.top, x2: x(tick), y2: pad.top + innerH, stroke: GRID_STROKE })),
          ...ticks.map(tick => h('text', { 'x': x(tick), 'y': pad.top + innerH + 13, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'fill': AXIS_TICK, 'font-size': '12px' }, String(tick))),
          ...props.data.flatMap((row, i) => {
            const cy = pad.top + rowH * i + rowH / 2
            return [
              h('text', { 'x': pad.left - 8, 'y': cy, 'text-anchor': 'end', 'dominant-baseline': 'central', 'fill': AXIS_TICK, 'font-size': '12px' }, row.label),
              h('rect', { x: pad.left, y: cy - 13, width: Math.max(0, x(row.value) - pad.left), height: 26, rx: 4, fill: row.color }),
            ]
          }),
        ])
      }

      const pad = { top: 8, right: 24, bottom: 8, left: 118 }
      const rowH = 44
      const innerW = chartW - pad.left - pad.right
      const hTotal = Math.max(props.height, props.data.length * rowH + pad.top + pad.bottom)

      return h('svg', {
        'width': '100%',
        'height': hTotal,
        'ref': chart.el,
        'viewBox': `0 0 ${chartW} ${hTotal}`,
        'role': 'img',
        'aria-label': 'Bar chart',
      }, props.data.flatMap((row, i) => {
        const y = pad.top + i * rowH + 8
        const w = (row.value / max) * innerW
        return [
          h('text', {
            'x': pad.left - 8,
            'y': y + 14,
            'text-anchor': 'end',
            'fill': AXIS_TICK,
            'font-size': '12px',
          }, row.label),
          h('rect', {
            x: pad.left,
            y,
            width: w,
            height: 20,
            rx: 4,
            fill: row.color,
          }),
        ]
      }))
    }
  },
})

export const PlaygroundGanttChart = defineComponent({
  name: 'PlaygroundGanttChart',
  props: {
    items: {
      type: Array as PropType<Array<{ name: string, start: number, end: number, color: string }>>,
      required: true,
    },
    domainMax: { type: Number, required: true },
    today: { type: Number, default: undefined },
    ticks: { type: Array as PropType<number[]>, default: () => [] },
    /** 按原版的 recharts 布局：行高 = 绘图区高 / 行数，柱高 = 行高的 40%，Today 标注画在图顶外侧，长名字折成两行。 */
    isRechartsLayout: { type: Boolean, default: false },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      if (props.isRechartsLayout) {
        // 原版的 Today 标注画在绘图区上方、图表外，实际被裁掉，所以这里不画。
        const pad = { top: 4, right: 16, bottom: 34, left: 156 }
        const rowH = 44
        const hTotal = Math.max(160, props.items.length * rowH)
        const innerW = chartW - pad.left - pad.right
        const innerH = hTotal - pad.top - pad.bottom
        const band = innerH / props.items.length
        const barH = Math.round(band * 0.4)
        const scale = (d: number): number => pad.left + (d / props.domainMax) * innerW
        const nodes: VNode[] = []
        for (const tick of props.ticks) {
          const x = scale(tick)
          nodes.push(h('line', { x1: x, y1: pad.top, x2: x, y2: pad.top + innerH, stroke: GRID_STROKE }))
          nodes.push(h('text', { 'x': x, 'y': pad.top + innerH + 13, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'fill': AXIS_TICK, 'font-size': '12px' }, `D${tick}`))
        }
        if (props.today != null) {
          const x = scale(props.today)
          nodes.push(h('line', { 'x1': x, 'y1': pad.top, 'x2': x, 'y2': pad.top + innerH, 'stroke': 'var(--astryx-color-data-neutral, #8494A3)', 'stroke-dasharray': '4 4' }))
        }
        props.items.forEach((item, i) => {
          const cy = pad.top + band * i + band / 2
          const lines = wrapToWidth(item.name, Y_AXIS_WIDTH, '12px')
          nodes.push(h('text', { 'x': pad.left - 8, 'y': cy, 'text-anchor': 'end', 'fill': AXIS_TICK, 'font-size': '12px' }, lines.map((line, k) => h('tspan', { x: pad.left - 8, dy: lines.length === 1 ? '0.355em' : k === 0 ? `${-0.145 - 0}em` : '1em' }, line))))
          nodes.push(h('rect', { x: scale(item.start), y: cy - barH / 2, width: Math.max(2, scale(item.end) - scale(item.start)), height: barH, rx: 4, fill: item.color }))
        })
        return h('svg', {
          'width': '100%',
          'height': hTotal,
          'ref': chart.el,
          'viewBox': `0 0 ${chartW} ${hTotal}`,
          'role': 'img',
          'aria-label': 'Gantt chart',
          'style': { overflow: 'visible' },
        }, nodes)
      }
      const pad = { top: 4, right: 16, bottom: 4, left: 156 }
      const rowH = 44
      const innerW = chartW - pad.left - pad.right
      const hTotal = Math.max(160, props.items.length * rowH + pad.top + pad.bottom)
      const scale = (d: number): number => pad.left + (d / props.domainMax) * innerW

      const nodes: VNode[] = []
      for (const tick of props.ticks) {
        const x = scale(tick)
        nodes.push(h('line', { x1: x, y1: pad.top, x2: x, y2: hTotal - pad.bottom, stroke: GRID_STROKE }))
        nodes.push(h('text', {
          x,
          'y': hTotal - 2,
          'text-anchor': 'middle',
          'fill': AXIS_TICK,
          'font-size': '12px',
        }, `D${tick}`))
      }
      if (props.today != null) {
        const x = scale(props.today)
        nodes.push(h('line', {
          'x1': x,
          'y1': pad.top,
          'x2': x,
          'y2': hTotal - pad.bottom,
          'stroke': 'var(--astryx-color-data-neutral, #8494A3)',
          'stroke-dasharray': '4 4',
        }))
        nodes.push(h('text', {
          x,
          'y': pad.top + 12,
          'text-anchor': 'middle',
          'fill': 'var(--astryx-color-data-neutral, #8494A3)',
          'font-size': '11px',
        }, 'Today'))
      }
      props.items.forEach((item, i) => {
        const y = pad.top + i * rowH + 10
        nodes.push(h('text', {
          'x': pad.left - 8,
          'y': y + 12,
          'text-anchor': 'end',
          'fill': AXIS_TICK,
          'font-size': '12px',
        }, item.name))
        nodes.push(h('rect', {
          x: scale(item.start),
          y,
          width: Math.max(2, scale(item.end) - scale(item.start)),
          height: 20,
          rx: 4,
          fill: item.color,
        }))
      })
      return h('svg', {
        'width': '100%',
        'height': hTotal,
        'ref': chart.el,
        'viewBox': `0 0 ${chartW} ${hTotal}`,
        'role': 'img',
        'aria-label': 'Gantt chart',
      }, nodes)
    }
  },
})

export const PlaygroundDonutChart = defineComponent({
  name: 'PlaygroundDonutChart',
  props: {
    segments: {
      type: Array as PropType<Array<{ value: number, color: string }>>,
      required: true,
    },
    size: { type: Number, default: 208 },
    innerRadius: { type: Number, default: 70 },
    outerRadius: { type: Number, default: 104 },
    /** 相邻两段之间的间隙角（度）；默认不留间隙。 */
    gapAngle: { type: Number, default: 0 },
  },
  setup(props) {
    return () => {
      const total = props.segments.reduce((s, seg) => s + seg.value, 0) || 1
      const cx = props.size / 2
      const cy = props.size / 2
      let angle = -Math.PI / 2
      const paths: VNode[] = []
      for (const seg of props.segments) {
        const gap = (props.gapAngle * Math.PI) / 180
        const sweep = Math.max(0.0001, (seg.value / total) * Math.PI * 2 - gap)
        angle += gap / 2
        const x1 = cx + props.outerRadius * Math.cos(angle)
        const y1 = cy + props.outerRadius * Math.sin(angle)
        angle += sweep
        const x2 = cx + props.outerRadius * Math.cos(angle)
        const y2 = cy + props.outerRadius * Math.sin(angle)
        const xi1 = cx + props.innerRadius * Math.cos(angle - sweep)
        const yi1 = cy + props.innerRadius * Math.sin(angle - sweep)
        const xi2 = cx + props.innerRadius * Math.cos(angle)
        const yi2 = cy + props.innerRadius * Math.sin(angle)
        const large = sweep > Math.PI ? 1 : 0
        angle += gap / 2
        const d = `M ${x1} ${y1} A ${props.outerRadius} ${props.outerRadius} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${props.innerRadius} ${props.innerRadius} 0 ${large} 0 ${xi1} ${yi1} Z`
        paths.push(h('path', { d, fill: seg.color }))
      }
      return h('svg', {
        'width': props.size,
        'height': props.size,
        'viewBox': `0 0 ${props.size} ${props.size}`,
        'role': 'img',
        'aria-label': 'Donut chart',
      }, paths)
    }
  },
})
