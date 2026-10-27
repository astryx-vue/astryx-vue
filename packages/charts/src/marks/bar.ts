import type { ScaleBand } from 'd3-scale'
import type { ColorAccessor, ResolvedPoint, SeriesContext, SeriesDef } from '../types.js'
import { h } from 'vue'
import { pointFill } from '../markColor.js'

export type { ColorAccessor }

export interface BarOptions {
  color?: ColorAccessor
  opacity?: number
  radius?: number
  stack?: string
  group?: string
  label?: string
}

/** 把用户给的透明度夹进 [0,1]，不是有限数就用兜底值。 */
function clampOpacity(value: number | undefined, fallback: number): number {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : fallback
  return Math.min(1, Math.max(0, n))
}

/** 把用户给的长度（圆角、宽度）变成有限非负数。 */
function nonNegative(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : fallback
}

/** 四个坐标都有限才算得出一条能画的矩形——非有限值会画出坏路径。 */
function rectIsFinite(x: number, y: number, w: number, h: number): boolean {
  return Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w) && Number.isFinite(h)
}

/**
 * 只圆上两个角的矩形路径。半径为 0 时画直角矩形；
 * 坐标非有限时返回空路径（也就是什么都不画）。
 */
function roundedTopRect(x: number, y: number, w: number, h: number, r: number): string {
  if (!rectIsFinite(x, y, w, h))
    return ''
  // 圆角不能超过短边的一半，否则弧线会互相穿过。
  const cr = Math.min(r, w / 2, h / 2)
  if (!(cr > 0))
    return `M${x},${y + h}V${y}H${x + w}V${y + h}Z`
  return `M${x},${y + h}`
    + `V${y + cr}Q${x},${y} ${x + cr},${y}`
    + `H${x + w - cr}Q${x + w},${y} ${x + w},${y + cr}`
    + `V${y + h}Z`
}

/** 只圆下两个角的矩形路径。坐标非有限时返回空路径。 */
function roundedBottomRect(x: number, y: number, w: number, h: number, r: number): string {
  if (!rectIsFinite(x, y, w, h))
    return ''
  const cr = Math.min(r, w / 2, h / 2)
  if (!(cr > 0))
    return `M${x},${y}V${y + h}H${x + w}V${y}Z`
  return `M${x},${y}`
    + `V${y + h - cr}Q${x},${y + h} ${x + cr},${y + h}`
    + `H${x + w - cr}Q${x + w},${y + h} ${x + w},${y + h - cr}`
    + `V${y}Z`
}

/**
 * 柱状图系列。y 轴按 `includeZero` 把 0 算进范围，负值从 0 往下长。
 *
 * 每条柱的像素宽度和偏移取决于分组情况，由 `resolve()` 现算并记在 `slot` 里，
 * 画的时候从同一份状态里取，所以两条路径看到的是同一个宽度。
 */
export function bar(dataKey: string, options: BarOptions = {}): SeriesDef {
  const color = options.color
  const opacity = clampOpacity(options.opacity, 1)
  const radius = nonNegative(options.radius, 4)

  /** 一条柱的像素宽度，以及它相对所在「带」左边的偏移。 */
  const slot = { width: 0, offset: 0 }

  const seriesDef: SeriesDef = {
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

    render(resolved, ctx: SeriesContext) {
      const { data } = ctx
      // 堆叠里只有最上面一层圆角，下面的层贴着上一层的底边，圆角会露出缝。
      const isTop = seriesDef._isTopOfStack !== false
      const r = isTop ? radius : 0
      if (!(slot.width > 0))
        return null

      return h('g', { opacity }, resolved.map((p) => {
        const d = data[p.dataIndex]
        if (!d || !Number.isFinite(p.px) || !Number.isFinite(p.py) || !Number.isFinite(p.py0))
          return null
        const fill = pointFill(seriesDef, color, d, p.dataIndex)
        const x = p.px - slot.width / 2
        const y = Math.min(p.py, p.py0)
        const barHeight = Math.max(0, Math.abs(p.py0 - p.py))
        const growsUp = p.py <= p.py0

        const pathData = growsUp
          ? roundedTopRect(x, y, slot.width, barHeight, r)
          : roundedBottomRect(x, y, slot.width, barHeight, r)

        return h('path', { key: p.dataIndex, d: pathData, fill })
      }))
    },
  }

  return seriesDef
}
