import type { ChartLegendProps } from '../ChartLegend/types.js'
import type { ChartTooltipProps } from '../ChartTooltip/types.js'
import type { ChartMargin, SeriesDef, YBaseline } from '../types.js'

/** 不写 `margin` 时绘图区四周留多少像素。 */
export const DEFAULT_MARGIN: ChartMargin = { top: 24, right: 24, bottom: 32, left: 48 }

/**
 * 数据点（行数 × 数据列数）不超过这个数时，额外输出一张视觉隐藏的数据表。
 * 再多的表对读屏用户只是噪音，所以大图表只保留名字。
 */
export const MAX_TABLE_POINTS = 100

/** 图例的配置。`legend` 给 `true` 就是用这一份默认值。 */
export type ChartLegendConfig = Omit<ChartLegendProps, 'items'> & {
  /** 显式指定图例项；不写就从系列推出来。 */
  items?: ChartLegendProps['items']
}

/** 提示框的配置。自定义内容用 `<Chart>` 的 `tooltip` 插槽，不走 props。 */
export type ChartTooltipConfig = Omit<ChartTooltipProps, 'series'>

export interface ChartProps {
  /** 要画的数据行。每行既有 x 那一列，也有一到多个系列的数据列。 */
  data: Record<string, unknown>[]
  /** 每行里当 x 用的字段名，所有系列共用。 */
  xKey: string
  /** 标记定义，按顺序画在同一条 x/y 坐标系上。 */
  series: SeriesDef[]
  /** 图表高度（CSS 像素）。非有限值和负数都当 0。@default 300 */
  height?: number
  /**
   * 图表宽度（CSS 像素）。浏览器里第一次量到容器宽度之后就不再用了，
   * 服务端渲染没有容器可量，靠它出图。
   * @default 0
   */
  width?: number
  /** 绘图区内边距的部分覆盖值，没写的边用默认值。 */
  margin?: Partial<ChartMargin>
  /** 没写 `yDomain` 时 y 轴范围怎么定。@default 'auto' */
  yBaseline?: YBaseline
  /** 显式 y 轴范围 `[min, max]`。它说了算——不加基线、不留余量。 */
  yDomain?: [number, number]
  /** 数值 x 轴的显式范围 `[min, max]`。`data` 为空时也照用（流式窗口要稳定）。band 轴上忽略。 */
  xDomain?: [number, number]
  /** 显示从系列推出来的图例，或者改成别的摆位。@default false */
  legend?: boolean | ChartLegendConfig
  /** 显示分组的悬停提示框。@default false */
  tooltip?: boolean | ChartTooltipConfig
  /** 图表标题，同时是 SVG 的无障碍名字。 */
  title?: string
  /** 标题下面的补充说明，同时是 SVG 的无障碍描述。 */
  subtitle?: string
}

export interface ChartSlots {
  /** 画在系列后面的网格，一般是 `<ChartGrid>`。 */
  grid?: () => unknown
  /** 画在系列后面的坐标轴，一般是若干个 `<ChartAxis>`。 */
  axes?: () => unknown
  /** 画在指针捕获层上面的交互层。 */
  interactions?: () => unknown
  /** 提示框的自定义内容，作用域参数是 `{ xValue, rows }`。 */
  tooltip?: (scope: { xValue: unknown, rows: unknown[] }) => unknown
  /** 额外内容，画在内置提示框之后。 */
  default?: () => unknown
}
