import type { ScaleBand, ScaleLinear } from 'd3-scale'
import type { Ref, VNodeChild } from 'vue'

/**
 * 图表的核心类型。比例尺、标记、交互都从这里取。
 *
 * 和上游的区别只有两处：① `render()` 返回 Vue 的 `VNodeChild`，不再是 ReactNode；
 * ② `render()` 是可选的——这个包目前只做「算」，不算「画」，渲染由后续工作补上。
 */

export type ChartScale = ScaleLinear<number, number> | ScaleBand<string>

/**
 * 一个标记的颜色：要么是一串固定颜色，要么是一个按数据点取色的函数
 * （比如正值一个色、负值一个色）。
 */
export type ColorAccessor
  = | string
    | ((datum: Record<string, unknown>, index: number) => string)

/**
 * 既没有显式颜色、也没有被图表根分配调色板颜色时，最后兜底用的颜色。
 *
 * 用 core 真正输出的 `--color-accent`：数据配色的 `--color-data-*` 是 JS 里算出来的
 * 具体颜色值，不是 CSS 变量，写 `var(--color-data-*)` 什么也画不出来。正常情况图表根
 * 会给每个系列分配颜色，所以这只是最后一道兜底。
 */
export const DEFAULT_SERIES_COLOR = 'var(--color-accent)'

/**
 * 没有显式 `yDomain` 时，y 轴范围怎么定：
 * - `'auto'`（默认）：带零基线的标记（bar、area）把 0 算进范围；只有连续点的
 *   图表（line、dot 等）上下留一点余量，免得点和边缘粘在一起。
 * - `'zero'`：以 0 为中心对称，适合正负数据（比如盈亏）。
 * - `'data'`：紧贴数据范围，不强制含 0，也不留余量。
 */
export type YBaseline = 'auto' | 'zero' | 'data'

export interface ChartMargin {
  top: number
  right: number
  bottom: number
  left: number
}

/** 一个数据点算出来的像素位置。 */
export interface ResolvedPoint {
  /** 绘图区坐标系里的 x 像素 */
  px: number
  /** 绘图区坐标系里的 y 像素（标记的顶边） */
  py: number
  /** y 方向的基线像素（标记的底边）；堆叠时和 `py` 不同 */
  py0: number
  /** 在数据数组里的下标 */
  dataIndex: number
}

/** 传给每个系列的 `resolve()` 和 `render()` 的上下文。 */
export interface SeriesContext {
  data: Record<string, unknown>[]
  xKey: string
  xScale: ChartScale
  yScale: ScaleLinear<number, number>
  /**
   * 按行排布的标记（如热力图）用的分类 y 比例尺。只有系列声明了
   * `layout.yBandKey` 时才存在，这时 y 轴是分类轴，线性 `yScale` 便用不上了。
   */
  yBandScale?: ScaleBand<string>
  /** 绘图区宽度 */
  width: number
  /** 绘图区高度 */
  height: number
}

/**
 * 每个标记工厂返回的对象的统一形状。标记自己知道怎么算位置、怎么画，
 * 图表根只负责遍历和调用。
 *
 * 一个 SeriesDef 只能用一次：布局和渲染会就地往上写 `_uid`、`_isTopOfStack`、
 * `_resolvedColor`，所以同一个对象不能同时给两个 `<Chart>` 用。每张图都要新建一份。
 */
export interface SeriesDef {
  /** 标记类型标识 */
  readonly type: string
  /**
   * 这个系列的语义键，通常就是 dataKey。既当图例文案的兜底，也用来协调堆叠和分组。
   * 它不保证唯一（两个系列可以共用同一个 dataKey），所以绝不能当 Map 的键或列表的
   * 渲染键——那是 `_uid` 的活。
   */
  readonly key: string
  /** 这个系列读哪些数据列——用来算 y 轴范围 */
  readonly dataKeys: string[]
  /**
   * 一次布局里唯一的实例身份，由布局按系列在 `series` 数组里的位置赋值。
   * 算好的点位映射、渲染键、提示框查找都用它。不要自己设。
   */
  _uid?: string
  /** 这个系列是不是所在堆叠组的最上一层（布局时写入） */
  _isTopOfStack?: boolean
  /** 图例上显示的固定颜色。颜色是按点取色时为 undefined。 */
  readonly color?: string
  /**
   * 图表根给没写死颜色的系列（自动配色或按点取色）分配的调色板颜色。
   * 既当渲染兜底，也当图例和提示框的代表色。不要自己设。
   */
  _resolvedColor?: string
  /** 图例上的可读文案，没给就用 `key`。 */
  readonly label?: string
  /** 图表根用来跨系列协调的布局提示 */
  readonly layout: {
    /** 堆叠组：同一组的系列累加 */
    stack?: string
    /** 柱状分组：同一组的系列把带宽平分 */
    group?: string
    /** 这个系列是否要求 y 轴范围包含 0 */
    includeZero?: boolean
    /**
     * 设了它，图表的 y 轴就按这个数据列的不同取值建分类比例尺（比如热力图的每一天），
     * 而不是数值比例尺。布局会把它以 `yBandScale` 交给标记和坐标轴，左侧坐标轴就能把
     * 分类对齐到每一行。热力图还应该写 `dataKeys: []`，免得喂给（已经用不上的）线性 y 轴范围。
     */
    yBandKey?: string
  }
  /**
   * 算出每个数据点的像素位置。布局阶段由图表根调用。
   * 堆叠时收到预先算好的累计偏移。
   */
  resolve: (
    ctx: SeriesContext,
    stackOffsets?: { y0: number, y1: number }[],
    groupInfo?: { index: number, count: number },
  ) => ResolvedPoint[]
  /**
   * 按算好的位置把标记画出来。渲染阶段由图表根调用。
   * 返回 SVG 元素（WebGL 标记自己管 canvas）。
   */
  render?: (resolved: ResolvedPoint[], ctx: SeriesContext) => VNodeChild
}

/** 所有系列算好的位置 */
export type ResolvedPositions = Map<string, ResolvedPoint[]>

/** 换算成绘图区坐标的指针事件 */
export interface ChartPointerEvent {
  x: number
  y: number
  nearest: (ResolvedPoint & { seriesKey: string }) | null
  active: boolean
}

/** 图表根提供给交互子组件的上下文 */
export interface ChartContext {
  width: number
  height: number
  margin: ChartMargin
  data: Record<string, unknown>[]
  xKey: string
  xScale: ChartScale
  yScale: ScaleLinear<number, number>
  /**
   * 分类 y 比例尺（比如热力图的每一行），系列声明了 `layout.yBandKey` 时才有。
   * 画 y 轴的东西（`ChartAxis`）在它存在时应该优先用它。
   */
  yBandScale?: ScaleBand<string>
  resolved: Map<string, ResolvedPoint[]>
  onPointer: (handler: (e: ChartPointerEvent) => void) => () => void
  svgRef: Ref<SVGSVGElement | null>
}

/**
 * 只做标注、不承载数据的标记类型。它们不参与图例和提示框，因为用户不是拿它们比大小。
 */
export const UTILITY_MARK_TYPES: ReadonlySet<string> = new Set([
  'referenceLine',
  'errorBar',
  'band',
])

/** 这个标记类型是不是纯标注类。 */
export function isUtilityMarkType(type: string): boolean {
  return UTILITY_MARK_TYPES.has(type)
}
