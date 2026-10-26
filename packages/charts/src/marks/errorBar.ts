import type { ResolvedPoint, SeriesDef } from '../types.js'
import { h } from 'vue'
import { xPixel } from '../utils.js'

export interface ErrorBarOptions {
  /** 上界的数据列 */
  high: string
  /** 下界的数据列 */
  low: string
  /** 描边颜色 */
  color?: string
  /** 描边宽度 */
  strokeWidth?: number
  /** 须线两端小横杠的宽度（像素） */
  capWidth?: number
}

/**
 * 误差条（须线）系列：上下界是绝对值，所以不对称的区间也能画。
 * 配对 `bar()` 或 `dot()` 用。缺任何一侧上下界的点画的时候跳过，
 * 而不是贴着坐标轴画一根误导人的零高度须线。
 * 属于标注类标记，不进图例和提示框。
 *
 * @example
 * ```
 * series={[bar('mean'), errorBar({high: 'upper95', low: 'lower95'})]}
 * ```
 */
export function errorBar(options: ErrorBarOptions): SeriesDef {
  const { high, low } = options
  const color = options.color ?? 'var(--astryx-color-text-primary)'
  const strokeWidth = options.strokeWidth ?? 1.5
  const capWidth = options.capWidth ?? 8

  return {
    type: 'errorBar',
    key: `errorBar-${high}-${low}`,
    dataKeys: [high, low],
    layout: {},

    resolve(ctx): ResolvedPoint[] {
      const { data, xKey, xScale, yScale } = ctx
      const points: ResolvedPoint[] = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        // 缺一侧就给 NaN，画的时候整根须线跳过，避免把小横杠锚在坐标轴上。
        const hiVal = d[high]
        const loVal = d[low]
        const upper = typeof hiVal === 'number' && Number.isFinite(hiVal) ? hiVal : Number.NaN
        const lower = typeof loVal === 'number' && Number.isFinite(loVal) ? loVal : Number.NaN
        points.push({
          px: xPixel(d, xKey, xScale),
          py: yScale(upper),
          py0: yScale(lower),
          dataIndex: i,
        })
      }
      return points
    },

    render(resolved) {
      // 非有限的 capWidth 会漏进小横杠的 x 坐标里；当成非正数处理：留竖线，去掉小横杠。
      const half = Number.isFinite(capWidth) ? Math.max(0, capWidth) / 2 : 0
      return h('g', resolved.map((p) => {
        if (!Number.isFinite(p.px) || !Number.isFinite(p.py) || !Number.isFinite(p.py0))
          return null
        return h('g', { key: p.dataIndex }, [
          h('line', { x1: p.px, x2: p.px, y1: p.py, y2: p.py0, stroke: color, 'stroke-width': strokeWidth }),
          h('line', { x1: p.px - half, x2: p.px + half, y1: p.py, y2: p.py, stroke: color, 'stroke-width': strokeWidth }),
          h('line', { x1: p.px - half, x2: p.px + half, y1: p.py0, y2: p.py0, stroke: color, 'stroke-width': strokeWidth }),
        ])
      }))
    },
  }
}
