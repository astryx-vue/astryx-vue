import type { ColorAccessor, SeriesDef } from './types.js'
import { DEFAULT_SERIES_COLOR } from './types.js'

/**
 * 决定一个标记最终用什么颜色，各个标记共用。
 *
 * 优先级：显式给的颜色（固定串或按点取色的函数）最高；没给就用图表根分配的调色板
 * 颜色（`_resolvedColor`）；都没有才用兜底 token。所以一个没写颜色的
 * `bar('revenue')` 也能画出真颜色。
 *
 * 空字符串在每一层都当作「没设」——空的 `fill` / `stroke` 什么也画不出来。按点取色的
 * 函数返回非字符串或空串时也退回调色板，免得把非法颜色写进属性。
 */

/** 判断一个值能不能当 CSS 颜色用：非空白字符串。 */
function isPaint(value: unknown): value is string {
  // 全是空白的字符串同样画不出来，和空串一样处理。
  return typeof value === 'string' && value.trim().length > 0
}

/** 图表根分配的颜色，没有就用最后兜底的 token。 */
function fallbackFill(def: SeriesDef): string {
  return isPaint(def._resolvedColor) ? def._resolvedColor : DEFAULT_SERIES_COLOR
}

/** 整个系列共用一种颜色时（line、area、band 等）的取色。 */
export function seriesFill(def: SeriesDef, color: ColorAccessor | undefined): string {
  if (isPaint(color))
    return color
  return fallbackFill(def)
}

/** 每个数据点各取一色：取色函数优先，其次固定串，最后调色板。 */
export function pointFill(
  def: SeriesDef,
  color: ColorAccessor | undefined,
  datum: Record<string, unknown>,
  index: number,
): string {
  if (typeof color === 'function') {
    try {
      const resolved = color(datum, index)
      if (isPaint(resolved))
        return resolved
    }
    catch {
      // 用户写的取色函数可能因为数据不符合预期而抛错；这里退回调色板，
      // 不要让整张图崩掉。
    }
  }
  else if (isPaint(color)) {
    return color
  }
  return fallbackFill(def)
}
