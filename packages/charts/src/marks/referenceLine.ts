import type { ResolvedPoint, SeriesDef } from '../types.js'

export interface ReferenceLineOptions {
  /** 在这个 y 值处画一条横线 */
  y?: number
  /** 第二个 y 值——在 y 和 y2 之间涂一条带 */
  y2?: number
  /** 在这个 x 值处画一条竖线 */
  x?: number
  /** 线或带的颜色 */
  color?: string
  /** 描边宽度（画线时用） */
  strokeWidth?: number
  /** 虚线样式 */
  strokeDasharray?: string
  /** 文字标签 */
  label?: string
  /** 标签位置 */
  labelPosition?: 'start' | 'end'
  /** 涂带的透明度（设了 y2 时用） */
  bandOpacity?: number
}

/**
 * 横向或纵向的参考线、参考带。它不是数据系列，画在固定的数值上。
 *
 * 画的位置要现算（取决于比例尺、绘图区大小和标签宽度），所以这个工厂没有点位可算，
 * `resolve()` 永远返回空数组。
 *
 * @example
 * ```
 * series={[line('revenue'), referenceLine({ y: 100, label: 'Target' })]}
 * ```
 */
export function referenceLine(options: ReferenceLineOptions): SeriesDef {
  return {
    type: 'referenceLine',
    key: `ref-${options.y ?? options.x ?? 'none'}`,
    dataKeys: [],
    layout: {},

    resolve(): ResolvedPoint[] {
      return []
    },
  }
}
