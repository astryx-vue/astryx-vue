import type { ColorAccessor, ResolvedPoint, SeriesDef } from '../types.js'
import { xPixel } from '../utils.js'

export type { ColorAccessor }

export interface DotOptions {
  color?: ColorAccessor
  radius?: number
  opacity?: number
  dodge?: boolean
  label?: string
}

/**
 * 散点系列。
 *
 * 缺失值和非有限值给 NaN，画的时候跳过，不会落到基线上。开了 `dodge` 会把落在
 * 同一 x 上的点横向错开，错开时不管非有限的点，一个缺失值不会把整组挤歪。
 */
export function dot(dataKey: string, options: DotOptions = {}): SeriesDef {
  const color = options.color
  const radius = typeof options.radius === 'number' && Number.isFinite(options.radius)
    ? Math.max(0, options.radius)
    : 4
  const dodge = options.dodge ?? false

  return {
    type: 'dot',
    key: dataKey,
    dataKeys: [dataKey],
    color: typeof color === 'string' ? color : undefined,
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

      if (dodge) {
        // 落在同一个 x 上的点（比如同一分类上的散点）横向错开，整体仍然以原位置为中心。
        const groups = new Map<number, ResolvedPoint[]>()
        for (const p of points) {
          // 只有真会被画出来的点（px 和 py 都有限）才参与错开；缺失值不能占位置，
          // 否则可见的点会偏到一边。
          if (!Number.isFinite(p.px) || !Number.isFinite(p.py))
            continue
          const key = Math.round(p.px)
          const group = groups.get(key) ?? []
          group.push(p)
          groups.set(key, group)
        }

        const spacing = radius * 2 + 1
        for (const group of groups.values()) {
          if (group.length < 2)
            continue
          const mid = (group.length - 1) / 2
          group.forEach((p, idx) => {
            p.px += (idx - mid) * spacing
          })
        }
      }

      return points
    },
  }
}
