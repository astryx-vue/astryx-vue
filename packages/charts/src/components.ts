export { default as Chart } from './Chart/Chart.vue'
export type {
  ChartLegendConfig,
  ChartProps,
  ChartSlots,
  ChartTooltipConfig,
} from './Chart/types.js'
export { DEFAULT_MARGIN, MAX_TABLE_POINTS } from './Chart/types.js'

export { ChartAxis } from './ChartAxis/index.js'
export type { ChartAxisPosition, ChartAxisProps } from './ChartAxis/index.js'

export { ChartGrid } from './ChartGrid/index.js'
export type { ChartGridProps } from './ChartGrid/index.js'

export { ChartLegend } from './ChartLegend/index.js'
export type {
  ChartLegendProps,
  LegendAlignment,
  LegendItem,
  LegendPosition,
} from './ChartLegend/index.js'

export { ChartSwatch, swatchVariantForType } from './ChartSwatch/index.js'
export type { ChartSwatchProps, ChartSwatchVariant } from './ChartSwatch/index.js'

export { ChartTooltip, computeCardPosition } from './ChartTooltip/index.js'
export type {
  CardPositionInput,
  ChartTooltipPlacement,
  ChartTooltipProps,
  ChartTooltipSlots,
} from './ChartTooltip/index.js'

export { useChart } from './context.js'
export { useChartColors } from './useChartColors.js'
