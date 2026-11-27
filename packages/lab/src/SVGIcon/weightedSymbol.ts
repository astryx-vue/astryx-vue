import type { WeightedIconDef } from './buildWeightedIcon.js'

/** 图标在精灵里的 symbol id。 */
export function weightedIconSymbolId(icon: WeightedIconDef): string {
  return `astryx-weighted-icon-${icon.name}`
}

/** 一层的 class：覆盖 [from, to] 字重，样式见 weighted-svg-icon.css。 */
export function weightedLayerClass(layer: { from: number, to: number }): string {
  return `astryx-weight-r${layer.from}_${layer.to}`
}
