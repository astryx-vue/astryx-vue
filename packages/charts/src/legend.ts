import type { SeriesDef } from './types.js'
import { DEFAULT_SERIES_COLOR, isUtilityMarkType } from './types.js'

export interface LegendItem {
  label: string
  color: string
  /** 标记类型——决定色块形状（柱状是方块，其余是短线） */
  type?: string
}

/**
 * 一个系列要不要进图例：只有承载数据的主标记才进，标注类标记不进。
 * 代表色依次取：写死的颜色、图表根分配的调色板颜色、兜底 token。
 * 所以自动配色的系列和按点取色的系列都会出现在图例里。
 */
function legendColor(series: SeriesDef): string | undefined {
  if (isUtilityMarkType(series.type))
    return undefined
  return series.color ?? series._resolvedColor ?? DEFAULT_SERIES_COLOR
}

/** 从系列列表推出图例项，跳过标注类标记。 */
export function deriveLegendItems(series: readonly SeriesDef[]): LegendItem[] {
  const items: LegendItem[] = []
  for (const s of series) {
    const color = legendColor(s)
    if (color == null)
      continue
    items.push({ label: s.label ?? s.key, color, type: s.type })
  }
  return items
}
