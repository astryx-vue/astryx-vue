import type { ResolvedPoint, SeriesContext, SeriesDef } from '../types.js'
import { h } from 'vue'
import { isBandScale, xPixel } from '../utils.js'

export interface CandlestickOptions {
  open: string
  high: string
  low: string
  close: string
  upColor?: string
  downColor?: string
}

/** 读一个数据列的有限数字，缺失或不是数字时给 NaN。 */
function readNumber(d: Record<string, unknown>, key: string): number {
  const v = d[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : Number.NaN
}

/**
 * 一根蜡烛实体的像素宽度。band 比例尺就是带宽；线性/时间比例尺按相邻点的
 * 最小间距推，只有一个点时退到一个不大的固定宽度。
 */
function candleSlot(resolved: ResolvedPoint[], ctx: SeriesContext): number {
  const { xScale, width } = ctx
  if (isBandScale(xScale))
    return xScale.bandwidth()

  const xs = resolved
    .map(p => p.px)
    .filter(x => Number.isFinite(x))
    .sort((a, b) => a - b)
  let minGap = Number.POSITIVE_INFINITY
  for (let i = 1; i < xs.length; i++) {
    const gap = xs[i] - xs[i - 1]
    if (gap > 0 && gap < minGap)
      minGap = gap
  }
  return Number.isFinite(minGap) ? minGap : Math.min(width, 40)
}

/**
 * K 线（OHLC）系列。band 比例尺和线性/时间比例尺都能用。
 * 点位的 y 取收盘价；缺任何一个 OHLC 字段的那根蜡烛画的时候跳过，而不是画到 0。
 * 属于数据系列，会进图例和提示框。
 */
export function candlestick(options: CandlestickOptions): SeriesDef {
  // 收盘价高于开盘价用「涨」色，其余用「跌」色。
  const upColor = options.upColor ?? 'var(--astryx-color-success)'
  const downColor = options.downColor ?? 'var(--astryx-color-error)'

  return {
    type: 'candlestick',
    key: `ohlc-${options.close}`,
    dataKeys: [options.open, options.high, options.low, options.close],
    layout: {},

    resolve(ctx): ResolvedPoint[] {
      const { data, xKey, xScale, yScale } = ctx
      const points: ResolvedPoint[] = []
      for (let i = 0; i < data.length; i++) {
        const d = data[i]
        const close = readNumber(d, options.close)
        points.push({
          px: xPixel(d, xKey, xScale),
          py: yScale(close),
          py0: yScale(0),
          dataIndex: i,
        })
      }
      return points
    },

    render(resolved, ctx) {
      const { data, yScale } = ctx
      const bodyWidth = Math.max(1, candleSlot(resolved, ctx) * 0.6)

      return h('g', resolved.map((p) => {
        const d = data[p.dataIndex]
        const o = readNumber(d, options.open)
        const c = readNumber(d, options.close)
        const hi = readNumber(d, options.high)
        const lo = readNumber(d, options.low)
        // 缺任何一个 OHLC 字段（或者 x 放不下）就跳过这根蜡烛：
        // 留个缺口比画一根贴到 0 的满高蜡烛诚实。
        if (!Number.isFinite(p.px) || !Number.isFinite(o) || !Number.isFinite(c) || !Number.isFinite(hi) || !Number.isFinite(lo))
          return null

        const col = c >= o ? upColor : downColor
        const bodyTop = yScale(Math.max(o, c))
        const bodyHeight = Math.max(1, Math.abs(yScale(o) - yScale(c)))
        return h('g', { key: p.dataIndex }, [
          // 上下影线
          h('line', { 'x1': p.px, 'x2': p.px, 'y1': yScale(hi), 'y2': yScale(lo), 'stroke': col, 'stroke-width': 1 }),
          // 实体
          h('rect', { x: p.px - bodyWidth / 2, y: bodyTop, width: bodyWidth, height: bodyHeight, fill: col }),
        ])
      }))
    },
  }
}
