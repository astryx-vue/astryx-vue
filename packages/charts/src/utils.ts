import type { ScaleBand } from 'd3-scale'
import type { ChartScale } from './types.js'

/** 判断一个比例尺是不是 d3 的 band 比例尺（分类轴上每个类占一条「带」）。 */
export function isBandScale(scale: ChartScale): scale is ScaleBand<string> {
  return typeof scale === 'function' && 'bandwidth' in scale
}

/**
 * 算出一条数据在 x 方向的像素位置。band 比例尺返回这条「带」的中心。
 *
 * 非 band 比例尺走数值路径：有限数字直接用，Date 和数字字符串也照 d3 的规则转换。
 * 转出来不是有限值的（读不成数字、或者原始值就是 ±Infinity）一律给 NaN——标记看到
 * NaN 会跳过这个点（画在画布外），而不是照 d3 的换算画到某个错位置。
 */
export function xPixel(
  d: Record<string, unknown>,
  xKey: string,
  xScale: ChartScale,
): number {
  const raw = d[xKey]
  if (isBandScale(xScale))
    return (xScale(String(raw)) ?? 0) + xScale.bandwidth() / 2

  const value = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(value) ? xScale(value) : Number.NaN
}

/**
 * 会写进 SVG 属性的数值先舍到固定位数，坐标默认 3 位小数，和 d3-shape 生成路径的默认精度一致。
 *
 * `Math.sin`、`Math.cos` 这类函数的结果由 JS 引擎自行近似，Node 和浏览器可能只差最后
 * 一位。原样写进属性的话，服务端渲染的 HTML 和客户端 hydration 算出的值对不上。
 * 0.001px 远小于屏幕能分辨的距离。
 */
export function roundForMarkup(value: number, digits = 3): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}
