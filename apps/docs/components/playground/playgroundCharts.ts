import type { PropType, VNode } from 'vue'
import { defineComponent, h } from 'vue'
import { AXIS_TICK, GRID_STROKE, monotonePath, niceTicks, num, useChartWidth, wrapToWidth } from './playgroundChartKit'

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
    /** 开启后 viewBox 量真实宽度、坐标和像素一比一，线不会被横向拉伸；纵轴贴着数据的最小最大值。 */
    isMeasured: { type: Boolean, default: false },
    /** 量宽模式下的上下留白。 */
    padTop: { type: Number, default: 4 },
    padBottom: { type: Number, default: 2 },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const values = props.data
      if (!values.length)
        return h('svg', { width: '100%', height: props.height })
      const min = Math.min(...values)
      const max = Math.max(...values)
      const range = max - min || 1
      if (props.isMeasured) {
        const w = chart.width.value
        const inner = props.height - props.padTop - props.padBottom
        const points = values.map((v, i) => {
          const x = values.length === 1 ? w / 2 : (i / (values.length - 1)) * w
          const y = props.padTop + inner - ((v - min) / range) * inner
          return `${x.toFixed(2)},${y.toFixed(2)}`
        }).join(' ')
        return h('svg', {
          'width': '100%',
          'height': props.height,
          'viewBox': `0 0 ${w} ${props.height}`,
          'ref': chart.el,
          'aria-hidden': 'true',
        }, [
          h('polyline', { 'fill': 'none', 'stroke': props.color, 'stroke-width': props.strokeWidth, points }),
        ])
      }
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
    /** 绘图区四边留白；不传用默认。按原版的坐标轴宽度传可以逐像素对齐。 */
    pad: { type: Object as PropType<{ top: number, right: number, bottom: number, left: number }>, default: undefined },
    /** 刻度文字是否垂直居中在刻度线上（默认按基线 +4 对齐）。 */
    centerTicks: { type: Boolean, default: false },
    /** y 轴单位另起一行（数字在上、单位在下），和原版 recharts 窄轴的折行一致。 */
    isYUnitStacked: { type: Boolean, default: false },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const pad = props.pad ?? { top: 12, right: 16, bottom: 24, left: 48 }
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
        const tickX = pad.left - 8
        // 和 recharts 窄轴一样：刻度加单位放不进轴宽就按词折行；轴宽 = 左留白 pad.left 减去图表左边距 4px。
        const unitLines = props.isYUnitStacked ? wrapToWidth(`${tick}${props.yUnit}`, pad.left - 4) : []
        const isStacked = unitLines.length > 1
        const tickY = props.centerTicks ? Math.max(y, 9) : y + 4
        return h('text', {
          'x': tickX,
          'y': tickY,
          'dominant-baseline': props.centerTicks && !isStacked ? 'central' : undefined,
          'text-anchor': 'end',
          'fill': AXIS_TICK,
          'font-size': '12px',
        }, isStacked
          ? unitLines.map((line, k) => h('tspan', { x: tickX, dy: k === 0 ? '-0.145em' : '1em' }, line))
          : `${tick}${props.yUnit}`)
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
          'x': x,
          'y': props.centerTicks ? pad.top + innerH + 13 : props.height - 6,
          'dominant-baseline': props.centerTicks ? 'central' : undefined,
          'text-anchor': tick === xMax && x + 14 > pad.left + innerW + pad.right ? 'end' : 'middle',
          'fill': AXIS_TICK,
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
    /** Y 轴刻度；不传就是下界、中点、上界三档。 */
    yTicks: { type: Array as PropType<number[]>, default: () => [] },
    /** 绘图区四边留白；传了就覆盖默认。 */
    pad: { type: Object as PropType<{ top: number, right: number, bottom: number, left: number }>, default: undefined },
    /** 刻度文字是否垂直居中在刻度线上。 */
    centerTicks: { type: Boolean, default: false },
  },
  setup(props) {
    const chart = useChartWidth()
    return () => {
      const chartW = chart.width.value
      const inline = props.padInline ?? (props.hasYAxis ? 10 : 10)
      const pad = props.pad ?? { top: 10, right: inline, bottom: 24, left: props.hasYAxis ? 50 : inline }
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
      const yTicks = props.yTicks.length ? props.yTicks : [yMin, (yMin + yMax) / 2, yMax]

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
          y: props.centerTicks ? pad.top + innerH + 13 : props.height - 6,
          'dominant-baseline': props.centerTicks ? 'central' : undefined,
          'text-anchor': props.padInline != null && tick === xMin ? 'start' : props.padInline != null && tick === xMax ? 'end' : 'middle',
          fill: AXIS_TICK,
          'font-size': '12px',
        }, props.xTickFormat(tick))),
        ...(props.hasYAxis
          ? yTicks.map(tick => h('text', {
              'x': pad.left - 8,
              'y': props.centerTicks ? Math.max(yScale(tick), 9) : yScale(tick) + 4,
              'dominant-baseline': props.centerTicks ? 'central' : undefined,
              'text-anchor': 'end',
              fill: AXIS_TICK,
              'font-size': '12px',
            }, props.yTickFormat(tick)))
          : []),
      ])
    }
  },
})

export { PlaygroundDonutChart, PlaygroundGanttChart, PlaygroundHorizontalBarChart } from './playgroundChartsExtra'
