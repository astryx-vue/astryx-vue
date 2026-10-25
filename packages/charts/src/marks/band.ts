import type { ResolvedPoint, SeriesDef } from '../types.js'
import { DEFAULT_SERIES_COLOR } from '../types.js'
import { xPixel } from '../utils.js'

export interface BandOptions {
  upper: string
  lower: string
  color?: string
  opacity?: number
}

/**
 * 置信区间带：上下界之间的那条面积。
 *
 * 上下界缺失或不是数字时给 NaN，画的时候断成空洞，而不是塌成一条零基线。
 * 属于标注类标记，不进图例和提示框。
 */
export function band(options: BandOptions): SeriesDef {
  return {
    type: 'band',
    key: `band-${options.upper}-${options.lower}`,
    dataKeys: [options.upper, options.lower],
    color: options.color ?? DEFAULT_SERIES_COLOR,
    layout: {},

    resolve(ctx): ResolvedPoint[] {
      const { data, xKey, xScale, yScale } = ctx
      const points: ResolvedPoint[] = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        // 缺失的上下界给 NaN，画的时候面积断开，而不是扎一根尖线到坐标轴。
        const upperVal = d[options.upper]
        const lowerVal = d[options.lower]
        const upper = typeof upperVal === 'number' && Number.isFinite(upperVal) ? upperVal : Number.NaN
        const lower = typeof lowerVal === 'number' && Number.isFinite(lowerVal) ? lowerVal : Number.NaN
        points.push({
          px: xPixel(d, xKey, xScale),
          py: yScale(upper),
          py0: yScale(lower),
          dataIndex: i,
        })
      }
      return points
    },
  }
}
