import type { ResolvedPoint, SeriesDef } from '../types.js'
import { xPixel } from '../utils.js'

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
 * K 线（OHLC）系列。band 比例尺和线性/时间比例尺都能用。
 * 点位的 y 取收盘价；缺任何一个 OHLC 字段的那根蜡烛画的时候跳过，而不是画到 0。
 * 属于数据系列，会进图例和提示框。
 */
export function candlestick(options: CandlestickOptions): SeriesDef {
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
  }
}
