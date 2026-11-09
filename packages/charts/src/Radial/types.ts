import type { Ref } from 'vue'

export type RadialMode = 'spider' | 'pie'

export interface RadialSliceDatum {
  key: string
  value: number
  startAngle: number
  endAngle: number
  percentage: number
}

/** RadialChart 提供给网格、面积、扇区和提示框的实时坐标空间。 */
export interface RadialContext {
  readonly cx: number
  readonly cy: number
  readonly radius: number
  readonly innerRadius: number
  readonly data: Record<string, unknown>[]
  readonly mode: RadialMode
  readonly interactive: boolean
  readonly svgRef: Ref<SVGSVGElement | null>
  readonly axes?: string[]
  readonly angleByAxis?: Map<string, number>
  readonly radiusScale?: (ratio: number) => number
  readonly axisDomains?: Map<string, [number, number]>
  readonly slices?: RadialSliceDatum[]
}

export interface RadialChartProps {
  data: Record<string, unknown>[]
  /** 浏览器里的容器宽度；量不到时（例如 SSR）由该属性兜底。 */
  width?: number
  height?: number
  /** 提供 axes 时使用雷达图模式。 */
  axes?: string[]
  /** 不提供 axes 时，用该数值字段计算饼图扇区。 */
  valueKey?: string
  labelKey?: string
  /** 内半径占外半径的比例，0 为饼图，0.6 等值为 donut。 */
  innerRadius?: number
  /** 相邻扇区间的弧度间隔。 */
  padAngle?: number
  /** 触摸拖动时是否阻止页面滚动。 */
  interactive?: boolean
  /** SVG 的无障碍名称；省略时按模式和字段生成。 */
  label?: string
}

export interface RadialGridProps {
  rings?: number
}

export interface RadialAreaProps {
  /** 匹配数据行里任意一个字符串字段的值；没有匹配时使用第一行。 */
  dataKey: string
  color: string
  opacity?: number
  strokeWidth?: number
  dots?: boolean
  dotRadius?: number
}

export interface RadialAxisProps {
  labelOffset?: number
}

export interface RadialSliceProps {
  colors: string[]
  /** SVG 扇区的真实圆角半径。 */
  cornerRadius?: number
  labels?: boolean
  /** 百分比达到该值才显示扇区标签。 */
  labelThreshold?: number
}

export interface RadialTooltipDatum {
  label: string
  value: number
  percentage?: number
  index: number
}

export interface RadialTooltipProps {
  highlight?: boolean
  highlightOffset?: number
}

export interface RadialTooltipSlots {
  default?: (datum: RadialTooltipDatum) => unknown
}
