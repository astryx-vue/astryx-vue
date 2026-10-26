import type { ResolvedPoint, SeriesDef } from '../types.js'
import { xPixel } from '../utils.js'

export interface AreaOptions {
  color?: string
  opacity?: number
  curve?: 'linear' | 'monotone' | 'natural' | 'step'
  stack?: string
  gradient?: boolean
  stroke?: boolean
  label?: string
}

/**
 * 面积系列：线下面填色，支持堆叠和渐变。
 *
 * 缺失值、非有限值（包括堆叠基线断开的位置）给 NaN，画的时候留空洞，
 * 而不是掉到 0 画成一片假的面积。
 */
export function area(dataKey: string, options: AreaOptions = {}): SeriesDef {
  const color = options.color

  return {
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
  }
}
