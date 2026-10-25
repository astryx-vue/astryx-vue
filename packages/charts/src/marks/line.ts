import type { ResolvedPoint, SeriesDef } from '../types.js'
import { xPixel } from '../utils.js'

export interface LineOptions {
  color?: string
  curve?: 'linear' | 'monotone' | 'natural' | 'step'
  strokeWidth?: number
  dots?: boolean
  label?: string
}

/**
 * 折线系列。
 *
 * 缺失值和非有限值给 NaN，画的时候会断开（而不是掉到基线画出一条假线），
 * 逐点的小圆点也只画在有限的位置上。
 */
export function line(dataKey: string, options: LineOptions = {}): SeriesDef {
  const color = options.color

  return {
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
  }
}
