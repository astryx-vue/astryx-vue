import type { CurveFactory } from 'd3-shape'
import type { ResolvedPoint, SeriesDef } from '../types.js'
import {
  curveLinear,
  curveMonotoneX,
  curveNatural,
  curveStep,
  area as d3Area,
  line as d3Line,
} from 'd3-shape'
import { defineComponent, h, useId } from 'vue'
import { seriesFill } from '../markColor.js'
import { xPixel } from '../utils.js'

const CURVES: Record<string, CurveFactory> = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
}

/**
 * 渐变填充：渐变 id 取自 `useId()`，整页唯一。
 * 同一页上两张图画同一个系列时，不会引用到对方的渐变。
 */
const GradientFill = defineComponent({
  name: 'AreaGradientFill',
  props: {
    pathD: { type: String, required: true },
    color: { type: String, required: true },
    opacity: { type: Number, required: true },
  },
  setup(props) {
    // `url(#id)` 里放不下冒号等字符，只留字母数字和连字符。
    const gradientId = `area-grad-${useId().replace(/[^\w-]/g, '')}`
    return () => [
      h('defs', [
        h('linearGradient', { id: gradientId, x1: 0, y1: 0, x2: 0, y2: 1 }, [
          h('stop', { 'offset': '0%', 'stop-color': props.color, 'stop-opacity': props.opacity }),
          h('stop', { 'offset': '100%', 'stop-color': props.color, 'stop-opacity': 0 }),
        ]),
      ]),
      h('path', { 'd': props.pathD, 'fill': `url(#${gradientId})`, 'fill-opacity': 1, 'stroke': 'none' }),
    ]
  },
})

export interface AreaOptions {
  color?: string
  opacity?: number
  /** 点怎么连。默认 `'linear'`：直线段 */
  curve?: 'linear' | 'monotone' | 'natural' | 'step'
  stack?: string
  gradient?: boolean
  stroke?: boolean
  label?: string
}

/** 面积的两条边界都有限，这段才画得出来。 */
function isFinitePoint(p: ResolvedPoint): boolean {
  return Number.isFinite(p.px) && Number.isFinite(p.py) && Number.isFinite(p.py0)
}

/**
 * 面积系列：线下面填色，支持堆叠和渐变。
 *
 * 缺失值、非有限值（包括堆叠基线断开的位置）给 NaN，画的时候留空洞，
 * 而不是掉到 0 画成一片假的面积。
 */
export function area(dataKey: string, options: AreaOptions = {}): SeriesDef {
  const color = options.color
  const opacity = typeof options.opacity === 'number' && Number.isFinite(options.opacity)
    ? Math.min(1, Math.max(0, options.opacity))
    : 0.3
  const curve = options.curve ?? 'linear'
  const gradient = options.gradient ?? false
  const stroke = options.stroke ?? true

  const seriesDef: SeriesDef = {
    type: 'area',
    key: dataKey,
    dataKeys: [dataKey],
    color,
    label: options.label ?? dataKey,
    layout: { stack: options.stack, includeZero: true },

    resolve(ctx, stackOffsets): ResolvedPoint[] {
      const { data, xKey, xScale, yScale } = ctx
      const points: ResolvedPoint[] = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        let py: number
        let py0: number
        if (stackOffsets) {
          const offset = stackOffsets[i]
          py = offset ? yScale(offset.y1) : Number.NaN
          py0 = offset ? yScale(offset.y0) : Number.NaN
        }
        else {
          const raw = d[dataKey]
          const v = typeof raw === 'number' && Number.isFinite(raw) ? raw : Number.NaN
          py = yScale(v)
          py0 = yScale(0)
        }
        points.push({ px: xPixel(d, xKey, xScale), py, py0, dataIndex: i })
      }
      return points
    },

    render(resolved) {
      if (resolved.length === 0)
        return null
      const curveFactory = CURVES[curve] ?? curveLinear

      const areaGen = d3Area<ResolvedPoint>()
        .defined(isFinitePoint)
        .x(d => d.px)
        .y0(d => d.py0)
        .y1(d => d.py)
        .curve(curveFactory)
      const pathD = areaGen(resolved) ?? ''

      const lineGen = d3Line<ResolvedPoint>()
        .defined(isFinitePoint)
        .x(d => d.px)
        .y(d => d.py)
        .curve(curveFactory)
      const strokeD = lineGen(resolved) ?? ''

      const fillColor = seriesFill(seriesDef, color)

      return h('g', [
        gradient
          ? h(GradientFill, { pathD, color: fillColor, opacity })
          : h('path', { 'd': pathD, 'fill': fillColor, 'fill-opacity': opacity, 'stroke': 'none' }),
        stroke
          ? h('path', { 'd': strokeD, 'fill': 'none', 'stroke': fillColor, 'stroke-width': 2 })
          : null,
      ])
    },
  }

  return seriesDef
}
