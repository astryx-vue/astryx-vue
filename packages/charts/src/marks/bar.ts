import type { ScaleBand } from 'd3-scale'
import type { ColorAccessor, ResolvedPoint, SeriesDef } from '../types.js'

export type { ColorAccessor }

export interface BarOptions {
  color?: ColorAccessor
  opacity?: number
  radius?: number
  stack?: string
  group?: string
  label?: string
}

/**
 * 柱状图系列。y 轴按 `includeZero` 把 0 算进范围，负值从 0 往下长。
 *
 * 每条柱的像素宽度和偏移取决于分组情况，由 `resolve()` 现算并记在 `slot` 里；
 * 画的时候（本包还没做）从同一份状态里取。
 */
export function bar(dataKey: string, options: BarOptions = {}): SeriesDef {
  const color = options.color

  /** 一条柱的像素宽度，以及它相对所在「带」左边的偏移。 */
  const slot = { width: 0, offset: 0 }

  return {
    type: 'bar',
    key: dataKey,
    dataKeys: [dataKey],
    color: typeof color === 'string' ? color : undefined,
    label: options.label ?? dataKey,
    layout: {
      stack: options.stack,
      group: options.group,
      includeZero: true,
    },

    resolve(ctx, stackOffsets, groupInfo): ResolvedPoint[] {
      const { data, xKey, xScale, yScale } = ctx
      if (!('bandwidth' in xScale))
        return []

      const bandScale = xScale as ScaleBand<string>
      const bw = bandScale.bandwidth()

      if (groupInfo && groupInfo.count > 0) {
        const gutter = bw * 0.05
        const totalGutters = gutter * (groupInfo.count - 1)
        // 夹一下：带很窄、组又很多时，缝的总宽会超过带，算出来的宽度变成负数，
        // 负宽度的矩形会左右翻过来。
        slot.width = Math.max(0, (bw - totalGutters) / groupInfo.count)
        slot.offset = groupInfo.index * (slot.width + gutter)
      }
      else {
        slot.width = bw
        slot.offset = 0
      }

      const points: ResolvedPoint[] = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        // 分类不在 band 的域里 → x 给 NaN，画的时候跳过，而不是把幽灵柱堆在原点。
        const xBase = bandScale(String(d[xKey]))
        const px = xBase == null ? Number.NaN : xBase + slot.offset + slot.width / 2

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
        points.push({ px, py, py0, dataIndex: i })
      }
      return points
    },
  }
}
