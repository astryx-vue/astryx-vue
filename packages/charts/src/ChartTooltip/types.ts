import type { SeriesDef } from '../types.js'
import type { TooltipSeriesValue } from '../tooltip.js'

/** 提示框相对悬停点的位置。 */
export type ChartTooltipPlacement = 'auto' | 'right' | 'left' | 'top'

export interface ChartTooltipProps {
  /**
   * 系列定义：用来把悬停的那行走成每个系列一行的内容。
   * 通过 `<Chart tooltip>` 打开时由 Chart 自动注入；单独用的时候要把同一份 `series` 传进来。
   */
  series?: readonly SeriesDef[]
  /**
   * 要不要在悬停的 x 位置画指示。柱状图在 band 轴上画整列高亮，折线/面积/散点画竖线。
   * @default true
   */
  hoverIndicator?: boolean
  /** 要不要在每个系列的点上画一个悬停圆点（柱状跳过）。@default true */
  showHoverDots?: boolean
  /**
   * 卡片相对悬停点的位置。`auto` 放在右边，放不下就翻到左边。
   * @default 'auto'
   */
  placement?: ChartTooltipPlacement
}

export interface ChartTooltipSlots {
  /**
   * 自定义卡片内容，作用域参数是悬停的 x 值和每个系列的一行。
   * 不写就用内置样式。返回空内容时不显示卡片，但高亮和圆点照画。
   */
  content?: (scope: { xValue: unknown, rows: TooltipSeriesValue[] }) => unknown
}
