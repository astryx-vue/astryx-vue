import type { PropType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { AXIS_TICK, GRID_STROKE, monotonePath, niceTicks, num, useChartWidth } from './playgroundChartKit'

export { monotonePath, niceTicks } from './playgroundChartKit'

export const PlaygroundResponsive = defineComponent({
  name: 'PlaygroundResponsive',
  props: {
    width: { type: String, default: '100%' },
    height: { type: Number, required: true },
  },
  setup(props, { slots }) {
    return () => h('div', {
      style: {
        width: props.width,
        height: `${props.height}px`,
        position: 'relative',
      },
    }, slots.default?.())
  },
})

export const PlaygroundSparkline = defineComponent({
  name: 'PlaygroundSparkline',
  props: {
    data: { type: Array as PropType<number[]>, required: true },
    color: { type: String, required: true },
    height: { type: Number, default: 40 },
    strokeWidth: { type: Number, default: 1.5 },
  },
  setup(props) {
    return () => {
      const values = props.data
      if (!values.length)
        return h('svg', { width: '100%', height: props.height })
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1
      const w = 100
      const hPx = props.height - 4
      const points = values.map((v, i) => {
        const x = values.length === 1 ? w / 2 : (i / (values.length - 1)) * w
        const y = 2 + hPx - ((v - min) / range) * hPx
        return `${x},${y}`
      }).join(' ')
      return h('svg', {
        width: '100%',
        height: props.height,
        viewBox: `0 0 ${w} ${props.height}`,
        preserveAspectRatio: 'none',
        'aria-hidden': 'true',
      }, [
        h('polyline', {
          fill: 'none',
          stroke: props.color,
          'stroke-width': props.strokeWidth,
          points,
        }),
      ])
    }
  },
})

export const PlaygroundLineChart = defineComponent({
  name: 'PlaygroundLineChart',
  props: {
    data: { type: Array as PropType<Record<string, unknown>[]>, required: true },
    xKey: { type: String, default: 't' },
    series: {
      type: Array as PropType<Array<{ key: string, color: string, name?: string }>>,
      required: true,
    },
    height: { type: Number, default: 260 },
    yUnit: { type: String, default: '' },
    xTicks: { type: Array as PropType<number[]>, default: () => [] },
    xTickFormat: { type: Function as PropType<(v: number) => string>, default: (v: number) => String(v) },
    yTicks: { type: Array as PropType<number[]>, default: () => [] },
    yDomain: { type: Array as unknown as PropType<[number, number]>, default: undefined },
    showVerticalGrid: { type: Boolean, default: false },
    monotone: { type: Boolean, default: false },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const pad = { top: 12, right: 16, bottom: 24, left: 48 }
      const innerW = chartW - pad.left - pad.right
      const innerH = props.height - pad.top - pad.bottom
      const rows = props.data
      if (!rows.length)
        return h('svg', { width: '100%', height: props.height })

      let yMin = props.yDomain?.[0]
      let yMax = props.yDomain?.[1]
      if (yMin == null || yMax == null) {
        const vals: number[] = []
        for (const row of rows) {
          for (const s of props.series)
            vals.push(num(row[s.key]))
        }
        yMin = Math.min(...vals)
        yMax = Math.max(...vals)
        if (yMin === yMax) {
          yMin -= 1
          yMax += 1
        }
      }
      const yTicks = props.yTicks.length ? props.yTicks : niceTicks(yMin, yMax)
      if (!props.yDomain) {
        yMin = yTicks[0]
        yMax = yTicks[yTicks.length - 1]
      }

      const xVals = rows.map(r => num(r[props.xKey]))
      const xMin = Math.min(...xVals)
      const xMax = Math.max(...xVals)

      const xScale = (x: number) => pad.left + ((x - xMin) / (xMax - xMin || 1)) * innerW
      const yScale = (y: number) => pad.top + innerH - ((y - yMin!) / (yMax! - yMin! || 1)) * innerH

      const gridLines: VNode[] = []
      const yTickNodes = yTicks.map((tick) => {
        const y = yScale(tick)
        if (props.showVerticalGrid) {
          gridLines.push(h('line', {
            x1: pad.left,
            y1: y,
            x2: pad.left + innerW,
            y2: y,
            stroke: GRID_STROKE,
          }))
        }
        else {
          gridLines.push(h('line', {
            x1: pad.left,
            y1: y,
            x2: pad.left + innerW,
            y2: y,
            stroke: GRID_STROKE,
          }))
        }
        return h('text', {
          x: pad.left - 8,
          y: y + 4,
          'text-anchor': 'end',
          fill: AXIS_TICK,
          'font-size': '12px',
        }, `${tick}${props.yUnit}`)
      })

      const xTickNodes = (props.xTicks.length ? props.xTicks : [xMin, xMax]).map((tick) => {
        const x = xScale(tick)
        if (props.showVerticalGrid) {
          gridLines.push(h('line', {
            x1: x,
            y1: pad.top,
            x2: x,
            y2: pad.top + innerH,
            stroke: GRID_STROKE,
          }))
        }
        return h('text', {
          x,
          y: props.height - 6,
          'text-anchor': 'middle',
          fill: AXIS_TICK,
          'font-size': '12px',
        }, props.xTickFormat(tick))
      })

      const lineNodes = props.series.map((s) => {
        const pts = rows.map(row => ({ x: xScale(num(row[props.xKey])), y: yScale(num(row[s.key])) }))
        const style = {
          'fill': 'none',
          'stroke': s.color,
          'stroke-width': s.key === 'actual' ? 2 : s.key === 'ideal' ? 1 : 1.5,
          'stroke-dasharray': s.key === 'ideal' ? '4 4' : undefined,
        }
        return props.monotone
          ? h('path', { ...style, d: monotonePath(pts) })
          : h('polyline', { ...style, points: pts.map(p => `${p.x},${p.y}`).join(' ') })
      })

      return h('svg', {
        width: '100%',
        height: props.height,
        ref: chart.el,
        viewBox: `0 0 ${chartW} ${props.height}`,
        role: 'img',
        'aria-label': 'Line chart',
      }, [
        ...gridLines,
        h('line', {
          x1: pad.left,
          y1: pad.top + innerH,
          x2: pad.left + innerW,
          y2: pad.top + innerH,
          stroke: GRID_STROKE,
        }),
        ...yTickNodes,
        ...xTickNodes,
        ...lineNodes,
      ])
    }
  },
})

export const PlaygroundAreaChart = defineComponent({
  name: 'PlaygroundAreaChart',
  props: {
    data: { type: Array as PropType<Record<string, unknown>[]>, required: true },
    xKey: { type: String, default: 'month' },
    yKey: { type: String, default: 'value' },
    color: { type: String, required: true },
    height: { type: Number, default: 340 },
    yDomain: { type: Array as unknown as PropType<[number, number]>, required: true },
    xDomain: { type: Array as unknown as PropType<[number, number]>, default: () => [0, 12] },
    xTicks: { type: Array as PropType<number[]>, default: () => [] },
    xTickFormat: { type: Function as PropType<(v: number) => string>, default: (v: number) => String(v) },
    yTickFormat: { type: Function as PropType<(v: number) => string>, default: (v: number) => String(v) },
    /** 是否画 Y 轴刻度和横向网格。关掉后左边距收窄，曲线撑满宽度。 */
    hasYAxis: { type: Boolean, default: true },
    hasGrid: { type: Boolean, default: true },
    /** 画一条虚线基准，例如统计窗口的起点。 */
    referenceValue: { type: Number, default: undefined },
    /** 渐变填充的起止透明度。 */
    fillOpacity: { type: Array as unknown as PropType<[number, number]>, default: () => [0.3, 0.05] },
    /** 左右留白。没有 Y 轴时用它给曲线和刻度文字留边。 */
    padInline: { type: Number, default: undefined },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const inline = props.padInline ?? (props.hasYAxis ? 10 : 10)
      const pad = { top: 10, right: inline, bottom: 24, left: props.hasYAxis ? 50 : inline }
      const innerW = chartW - pad.left - pad.right
      const innerH = props.height - pad.top - pad.bottom
      const rows = props.data
      const [yMin, yMax] = props.yDomain
      const [xMin, xMax] = props.xDomain
      const xScale = (x: number) => pad.left + ((x - xMin) / (xMax - xMin || 1)) * innerW
      const yScale = (y: number) => pad.top + innerH - ((y - yMin) / (yMax - yMin || 1)) * innerH

      const linePts = rows.map(r => `${xScale(num(r[props.xKey]))},${yScale(num(r[props.yKey]))}`).join(' ')
      const baseY = yScale(yMin)
      const areaPts = `${pad.left},${baseY} ${linePts} ${xScale(num(rows[rows.length - 1]?.[props.xKey]))},${baseY}`

      const gradId = `pg-area-${props.color.replace(/\W/g, '')}`
      const yTicks = [yMin, (yMin + yMax) / 2, yMax]

      return h('svg', {
        width: '100%',
        height: props.height,
        ref: chart.el,
        viewBox: `0 0 ${chartW} ${props.height}`,
        role: 'img',
        'aria-label': 'Area chart',
      }, [
        h('defs', {}, [
          h('linearGradient', { id: gradId, x1: '0', y1: '0', x2: '0', y2: '1' }, [
            h('stop', { offset: '0%', 'stop-color': props.color, 'stop-opacity': String(props.fillOpacity[0]) }),
            h('stop', { offset: '100%', 'stop-color': props.color, 'stop-opacity': String(props.fillOpacity[1]) }),
          ]),
        ]),
        ...(props.hasGrid
          ? yTicks.map((tick) => h('line', {
              x1: pad.left,
              y1: yScale(tick),
              x2: pad.left + innerW,
              y2: yScale(tick),
              stroke: GRID_STROKE,
            }))
          : []),
        h('polygon', { points: areaPts, fill: `url(#${gradId})` }),
        ...(props.referenceValue != null
          ? [h('line', {
              x1: pad.left,
              y1: yScale(props.referenceValue),
              x2: pad.left + innerW,
              y2: yScale(props.referenceValue),
              stroke: GRID_STROKE,
              'stroke-dasharray': '3 3',
            })]
          : []),
        h('polyline', {
          fill: 'none',
          stroke: props.color,
          'stroke-width': 1.5,
          points: linePts,
        }),
        ...(props.xTicks.length ? props.xTicks : [xMin, xMax]).map(tick => h('text', {
          x: xScale(tick),
          y: props.height - 6,
          'text-anchor': props.padInline != null && tick === xMin ? 'start' : props.padInline != null && tick === xMax ? 'end' : 'middle',
          fill: AXIS_TICK,
          'font-size': '12px',
        }, props.xTickFormat(tick))),
        ...(props.hasYAxis
          ? yTicks.map(tick => h('text', {
              x: pad.left - 8,
              y: yScale(tick) + 4,
              'text-anchor': 'end',
              fill: AXIS_TICK,
              'font-size': '12px',
            }, props.yTickFormat(tick)))
          : []),
      ])
    }
  },
})

export const PlaygroundHorizontalBarChart = defineComponent({
  name: 'PlaygroundHorizontalBarChart',
  props: {
    data: { type: Array as PropType<Array<{ label: string, value: number, color: string }>>, required: true },
    height: { type: Number, default: 260 },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const pad = { top: 8, right: 24, bottom: 8, left: 118 }
      const rowH = 44
      const innerW = chartW - pad.left - pad.right
      const max = Math.max(...props.data.map(d => d.value), 1)
      const hTotal = Math.max(props.height, props.data.length * rowH + pad.top + pad.bottom)

      return h('svg', {
        width: '100%',
        height: hTotal,
        ref: chart.el,
        viewBox: `0 0 ${chartW} ${hTotal}`,
        role: 'img',
        'aria-label': 'Bar chart',
      }, props.data.flatMap((row, i) => {
        const y = pad.top + i * rowH + 8
        const w = (row.value / max) * innerW
        return [
          h('text', {
            x: pad.left - 8,
            y: y + 14,
            'text-anchor': 'end',
            fill: AXIS_TICK,
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
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const pad = { top: 4, right: 16, bottom: 4, left: 156 }
      const rowH = 44
      const innerW = chartW - pad.left - pad.right
      const hTotal = Math.max(160, props.items.length * rowH + pad.top + pad.bottom)
      const scale = (d: number) => pad.left + (d / props.domainMax) * innerW

      const nodes: VNode[] = []
      for (const tick of props.ticks) {
        const x = scale(tick)
        nodes.push(h('line', { x1: x, y1: pad.top, x2: x, y2: hTotal - pad.bottom, stroke: GRID_STROKE }))
        nodes.push(h('text', {
          x,
          y: hTotal - 2,
          'text-anchor': 'middle',
          fill: AXIS_TICK,
          'font-size': '12px',
        }, `D${tick}`))
      }
      if (props.today != null) {
        const x = scale(props.today)
        nodes.push(h('line', {
          x1: x,
          y1: pad.top,
          x2: x,
          y2: hTotal - pad.bottom,
          stroke: 'var(--astryx-color-data-neutral, #8494A3)',
          'stroke-dasharray': '4 4',
        }))
        nodes.push(h('text', {
          x,
          y: pad.top + 12,
          'text-anchor': 'middle',
          fill: 'var(--astryx-color-data-neutral, #8494A3)',
          'font-size': '11px',
        }, 'Today'))
      }
      props.items.forEach((item, i) => {
        const y = pad.top + i * rowH + 10
        nodes.push(h('text', {
          x: pad.left - 8,
          y: y + 12,
          'text-anchor': 'end',
          fill: AXIS_TICK,
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
        width: '100%',
        height: hTotal,
        ref: chart.el,
        viewBox: `0 0 ${chartW} ${hTotal}`,
        role: 'img',
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
  },
  setup(props) {
    return () => {
      const total = props.segments.reduce((s, seg) => s + seg.value, 0) || 1
      const cx = props.size / 2
      const cy = props.size / 2
      let angle = -Math.PI / 2
      const paths: VNode[] = []
      for (const seg of props.segments) {
        const sweep = (seg.value / total) * Math.PI * 2
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
        const d = `M ${x1} ${y1} A ${props.outerRadius} ${props.outerRadius} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${props.innerRadius} ${props.innerRadius} 0 ${large} 0 ${xi1} ${yi1} Z`
        paths.push(h('path', { d, fill: seg.color }))
      }
      return h('svg', {
        width: props.size,
        height: props.size,
        viewBox: `0 0 ${props.size} ${props.size}`,
        role: 'img',
        'aria-label': 'Donut chart',
      }, paths)
    }
  },
})
