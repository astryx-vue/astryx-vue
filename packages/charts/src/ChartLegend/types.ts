import type { LegendItem } from '../legend.js'

export type { LegendItem }

/** 图例摆在图表的哪一边。`start` / `end` 是逻辑方位，跟着书写方向走。 */
export type LegendPosition = 'top' | 'bottom' | 'start' | 'end'

/** 图例在它所在的那条边上怎么对齐。 */
export type LegendAlignment = 'start' | 'center' | 'end'

export interface ChartLegendProps {
  /** 要显示的图例项 @default [] */
  items?: LegendItem[]
  /** 图例相对图表的位置 @default 'bottom' */
  position?: LegendPosition
  /** 图例在位置上怎么对齐 @default 'start' */
  alignment?: LegendAlignment
}
