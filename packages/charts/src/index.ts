// 组件（Vue 单文件组件）
export * from './components.js'

// 图表包入口：纯计算层 + 组件。

// 颜色工具（core 没有公开这套工具，所以图表包自带一份）
export { formatColor, formatHex, parseColor, parseHex, parseRgb, toGLFloats } from './color.js'
export type { RGBA } from './color.js'

// 刻度与数值格式化
export { compactNumber, currency, formatList, monthYear, percent, shortDate } from './formatters.js'
export type { ChartLocale } from './formatters.js'

// 配色：从「取变量值」的函数算出类别、顺序、发散三套颜色。
export { getChartColorsFromResolver } from './getChartColors.js'
export type { ChartColorsAPI, SequentialHue, TokenResolver } from './getChartColors.js'

export { computeLayout } from './layout.js'
export type { LayoutInput, LayoutResult } from './layout.js'
export { deriveLegendItems } from './legend.js'
export type { LegendItem } from './legend.js'
export { pointFill, seriesFill } from './markColor.js'

export {
  area,
  band,
  bar,
  candlestick,
  dot,
  errorBar,
  line,
  referenceLine,
} from './marks/index.js'
export type {
  AreaOptions,
  BandOptions,
  BarOptions,
  CandlestickOptions,
  DotOptions,
  ErrorBarOptions,
  LineOptions,
  ReferenceLineOptions,
} from './marks/index.js'

export { deriveTooltipSeriesValues, shouldRenderHoverDot } from './tooltip.js'
export type { TooltipSeriesValue } from './tooltip.js'

export type {
  ChartContext,
  ChartMargin,
  ChartPointerEvent,
  ChartScale,
  ColorAccessor,
  ResolvedPoint,
  ResolvedPositions,
  SeriesContext,
  SeriesDef,
  YBaseline,
} from './types.js'

export { isUtilityMarkType } from './types.js'
// 比例尺工具
export { isBandScale, xPixel } from './utils.js'
