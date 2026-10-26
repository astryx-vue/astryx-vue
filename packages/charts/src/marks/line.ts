import type { ResolvedPoint, SeriesDef } from '../types.js'
import type { CurveFactory } from 'd3-shape'
import { curveLinear, curveMonotoneX, curveNatural, curveStep, line as d3Line } from 'd3-shape'
import { h } from 'vue'
import { seriesFill } from '../markColor.js'
import { xPixel } from '../utils.js'

const CURVES: Record<string, CurveFactory> = {
  linear: curveLinear,
  monotone: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
}

export type CurveType = 'linear' | 'monotone' | 'natural' | 'step'

export interface LineOptions {
  color?: string
  curve?: CurveType
  strokeWidth?: number
  dots?: boolean
  label?: string
}

/** 两个坐标都有限的点才画得出来。 */
function isFinitePoint(p: ResolvedPoint): boolean {
  return Number.isFinite(p.px) && Number.isFinite(p.py)
}

/**
 * 折线系列。
 *
 * 缺失值和非有限值给 NaN，画的时候会断开（而不是掉到基线画出一条假线），
 * 逐点的小圆点也只画在有限的位置上。
 */
export function line(dataKey: string, options: LineOptions = {}): SeriesDef {
  const color = options.color
  const curve = options.curve ?? 'monotone'
  const strokeWidth = typeof options.strokeWidth === 'number' && Number.isFinite(options.strokeWidth)
    ? Math.max(0, options.strokeWidth)
    : 2
  const dots = options.dots ?? false

  const seriesDef: SeriesDef = {
    type: 'line',
    key: dataKey,
    dataKeys: [dataKey],
    color,
    label: options.label ?? dataKey,
    layout: {},

    resolve(ctx): ResolvedPoint[] {
      const { data, xKey, xScale, yScale } = ctx
      const points: ResolvedPoint[] = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const raw = d[dataKey]
        const v = typeof raw === 'number' && Number.isFinite(raw) ? raw : Number.NaN
        points.push({
          px: xPixel(d, xKey, xScale),
          py: yScale(v),
          py0: yScale(0),
          dataIndex: i,
        })
      }
      return points
    },

    render(resolved) {
      if (resolved.length === 0)
        return null

      const pathGen = d3Line<ResolvedPoint>()
        .defined(isFinitePoint)
        .x(d => d.px)
        .y(d => d.py)
        .curve(CURVES[curve] ?? curveMonotoneX)

      const pathD = pathGen(resolved) ?? ''
      const strokeColor = seriesFill(seriesDef, color)
      return h('g', [
        h('path', {
          d: pathD,
          fill: 'none',
          stroke: strokeColor,
          'stroke-width': strokeWidth,
        }),
        dots
          ? resolved.filter(isFinitePoint).map(p => h('circle', {
            key: p.dataIndex,
            cx: p.px,
            cy: p.py,
            r: 3,
            fill: strokeColor,
          }))
          : null,
      ])
    },
  }

  return seriesDef
}
