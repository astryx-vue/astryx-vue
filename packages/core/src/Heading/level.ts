import type { HeadingLevel } from './types.js'

/** `level` 缺失或不是 1–6 时渲染的级别。 */
const FALLBACK_LEVEL: HeadingLevel = 2

/** 把 `level` 读成 1–6 的数字；数字字符串按数字读，其余情况退回 2 级。 */
export function resolveHeadingLevel(level: unknown): HeadingLevel {
  const value = typeof level === 'number' || typeof level === 'string' ? Number(level) : Number.NaN
  return Number.isInteger(value) && value >= 1 && value <= 6 ? value as HeadingLevel : FALLBACK_LEVEL
}

/** 警告里展示调用方传的值：字符串带引号，其余原样。 */
export function describeLevel(level: unknown): string {
  return typeof level === 'string' ? JSON.stringify(level) : String(level)
}
