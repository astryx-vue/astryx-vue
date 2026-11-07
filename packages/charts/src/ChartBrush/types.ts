export type BrushMode = 'x' | 'xy'

export interface BrushRange {
  x: [number, number]
  y?: [number, number]
}

export interface ChartBrushProps {
  /** x 只选横向范围；xy 选择矩形区域。 */
  mode?: BrushMode
  /** 选区颜色。 */
  color?: string
  /** 选区填充透明度。 */
  opacity?: number
}

export interface ChartBrushEmits {
  brush: [range: BrushRange, data: Record<string, unknown>[]]
  clear: []
}
