import type { SeriesDef } from './types.js'
import { DEFAULT_SERIES_COLOR, isUtilityMarkType } from './types.js'

/**
 * 提示框里的一行：某个系列在鼠标停留的 x 位置上的取值。
 * 形状稳定，用户可以依赖它写自己的提示框内容。
 */
export interface TooltipSeriesValue {
  /** 系列键（就是 SeriesDef.key） */
  key: string
  /** 显示文案，系列没写就用 key */
  label: string
  /** 系列颜色 */
  color: string
  /** 标记类型——决定默认样式里色块的形状 */
  type: string
  /** 这个系列在鼠标位置的原始值 */
  value: unknown
}

/**
 * 生成提示框要显示的行。跳过标注类标记，也跳过布局没能算出点位的系列。
 *
 * 纯函数、同步，调用方可以放心缓存结果。
 */
export function deriveTooltipSeriesValues(
  series: readonly SeriesDef[],
  datum: Record<string, unknown> | undefined,
  resolvedKeys: ReadonlySet<string>,
): TooltipSeriesValue[] {
  if (!datum)
    return []

  const out: TooltipSeriesValue[] = []
  for (const s of series) {
    if (isUtilityMarkType(s.type))
      continue
    // resolvedKeys 里放的是布局分配的 `_uid`（不会重名），不是 `key`。
    if (!s._uid || !resolvedKeys.has(s._uid))
      continue
    out.push({
      key: s.key,
      label: s.label ?? s.key,
      // 和图表例用同一套优先级，所以同一个系列的色块在提示框和图例里颜色一致。
      color: s.color ?? s._resolvedColor ?? DEFAULT_SERIES_COLOR,
      type: s.type,
      value: datum[s.dataKeys[0]],
    })
  }
  return out
}

/**
 * 鼠标停在某个下标上时，这个系列要不要画一个悬停圆点。
 * 柱状改成高亮整条「带」，标注类标记没有数据点可高亮。
 */
export function shouldRenderHoverDot(seriesType: string): boolean {
  return seriesType !== 'bar' && !isUtilityMarkType(seriesType)
}
