import type { ChartSwatchVariant } from './types.js'

/**
 * 标记类型对应的色块形态：柱状是方块，其余（折线、散点、面积……）都是一小段线。
 *
 * 图例和提示框都走这一条规则，同一个系列在两处长得一样。
 */
export function swatchVariantForType(type: string | undefined): ChartSwatchVariant {
  return type === 'bar' ? 'square' : 'line'
}
