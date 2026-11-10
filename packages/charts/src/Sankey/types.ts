export type SankeyColor = [number, number, number]

export interface SankeyNodeDatum {
  id: string
  label: string
  value: number
  /** OKLCH 的 lightness、chroma、hue 三个通道。 */
  color?: SankeyColor
}

export interface SankeyLinkDatum {
  source: string
  target: string
  value: number
}

export interface SankeyColumnDef {
  ids: string[]
  label?: string
}

export type SankeyColumn = string[] | SankeyColumnDef

export interface SankeyChartProps {
  nodes: SankeyNodeDatum[]
  links: SankeyLinkDatum[]
  /** 省略时按连线方向自动分列。 */
  columns?: SankeyColumn[]
  /** SSR 和首次测量的显式宽度；0 表示等待容器测量。 */
  width?: number
  height?: number
  nodeWidth?: number
  nodeGap?: number
  nodeColor?: string
  minColumnWidth?: number
  label?: string
}

export interface SankeyNodeLayout {
  id: string
  label: string
  value: number
  color: SankeyColor
  x: number
  y: number
  width: number
  height: number
  column: number
  sourceOffset: number
  targetOffset: number
}

export interface SankeyLinkLayout {
  source: SankeyNodeLayout
  target: SankeyNodeLayout
  value: number
  height: number
  sourceY: number
  targetY: number
}

export interface SankeyColumnLayout {
  x: number
  ids: string[]
  label?: string
}

export interface SankeyContext {
  readonly nodes: SankeyNodeLayout[]
  readonly links: SankeyLinkLayout[]
  readonly columns: SankeyColumnLayout[]
  readonly width: number
  readonly height: number
  readonly valueScale: number
  readonly maxValue: number
  readonly nodeWidth: number
  readonly nodeColor?: string
  readonly gradientIdPrefix: string
}

export interface SankeyGridProps {
  dashArray?: string
  color?: string
  opacity?: number
  showHeaders?: boolean
}

export interface SankeyNodeProps {
  glow?: boolean
}

export type SankeyLinkColor = 'gradient' | 'source' | 'target' | { gradient: number } | (string & {})

export interface SankeyLinkProps {
  color?: SankeyLinkColor
  opacity?: number
  tension?: number
}

export interface SankeyLabelProps {
  showPercent?: boolean
  formatValue?: (value: number) => string
}
