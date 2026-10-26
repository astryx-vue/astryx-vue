/** 色块的视觉形态，由标记类型决定。 */
export type ChartSwatchVariant = 'square' | 'line'

export interface ChartSwatchProps {
  /** 填充色，一般就是系列颜色 */
  color: string
  /**
   * 形态。`square` 是方块（柱状系列），`line` 是一小段横线（折线、散点、面积等）。
   * @default 'square'
   */
  variant?: ChartSwatchVariant
}
