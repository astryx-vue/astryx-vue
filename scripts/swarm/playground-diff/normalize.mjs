/**
 * 演练场对比用到的文本与样式归一化。这里全是纯函数，不碰浏览器，
 * 单元测试直接喂字符串和样式对象。
 */

/** 合并空白、去掉首尾空白、转小写。`Item   One ` 和 `item one` 视为同一段文字。 */
export function normalizeText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim().toLowerCase()
}

/** 时间格式：`10:20`、`10:20:30`、`10:20 AM`。 */
const TIME_PATTERN = /(?<![\d.])\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?(?![\d.])/
/** 日期格式：`2025-01-15`、`2025/1/15`、`Jan 15, 2025`、`15 Jan 2025`。 */
const DATE_PATTERN = /(?<!\d)\d{4}[-/.]\d{1,2}[-/.]\d{1,2}(?!\d)|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:,?\s+\d{4})?\b|\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/
/** 相对时间：`3 minutes ago`、`in 2 hours`、`5分钟前`。 */
const RELATIVE_PATTERN = /\b\d+\s*(?:milliseconds?|seconds?|secs?|minutes?|mins?|hours?|hrs?|days?|weeks?|months?|years?)\s+ago\b|\bin\s+\d+\s*(?:milliseconds?|seconds?|secs?|minutes?|mins?|hours?|hrs?|days?|weeks?)\b|\b(?:just now|yesterday)\b|\d+\s*(?:秒钟?|分钟|小时|[天周年]|个月)前/
/** 一段耗时：`1.2s`、`340 ms`。 */
const DURATION_PATTERN = /(?<![\w.])\d+(?:\.\d+)?\s*(?:ms|milliseconds?|seconds?|secs?|s)(?![\w.])/

/**
 * 这段文字像不像「两边本来就该不一样」的动态文本（时间戳、相对时间、耗时）。
 * 只有同时出现数字和时间格式才算，避免把普通的数字当成动态文本放过。
 */
export function isDynamicText(text) {
  const value = String(text ?? '').trim()
  if (!/\d/.test(value))
    return false
  return TIME_PATTERN.test(value)
    || DATE_PATTERN.test(value)
    || RELATIVE_PATTERN.test(value)
    || DURATION_PATTERN.test(value)
}

/** `14px` → 14；拿不到数字时返回 null。 */
export function parsePx(value) {
  if (typeof value === 'number')
    return Number.isFinite(value) ? value : null
  const matched = /-?\d+(?:\.\d+)?/.exec(String(value ?? ''))
  return matched ? Number.parseFloat(matched[0]) : null
}

/** `bold`→700、`normal`→400、`600`→600。取不到时返回 null。 */
const WEIGHT_KEYWORDS = {
  thin: 100,
  hairline: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  demibold: 600,
  bold: 700,
  extrabold: 800,
  ultrabold: 800,
  black: 900,
  heavy: 900,
}

export function parseFontWeight(value) {
  const raw = String(value ?? '').trim().toLowerCase()
  if (!raw)
    return null
  const keyword = WEIGHT_KEYWORDS[raw]
  if (keyword != null)
    return keyword
  const number = Number.parseFloat(raw)
  return Number.isFinite(number) ? number : null
}

/**
 * 把计算样式里的颜色变成 `{r, g, b, a}`。
 * 支持 `rgb()`、`rgba()`、`color(srgb ...)` 和十六进制；认不出来时返回 null。
 */
export function parseColor(value) {
  const raw = String(value ?? '').trim().toLowerCase()
  if (!raw)
    return null
  if (raw === 'transparent')
    return { r: 0, g: 0, b: 0, a: 0 }
  const rgbMatch = /^rgba?\(([^)]+)\)$/.exec(raw)
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/[\s,/]+/).filter(Boolean)
    const [r, g, b, a] = parts
    const color = { r: toChannel(r), g: toChannel(g), b: toChannel(b), a: a == null ? 1 : clamp(Number.parseFloat(a), 0, 1) }
    return Number.isNaN(color.r) || Number.isNaN(color.g) || Number.isNaN(color.b) ? null : color
  }
  const srgbMatch = /^color\(srgb\s([^)]+)\)$/.exec(raw)
  if (srgbMatch) {
    const parts = srgbMatch[1].split(/[\s/]+/).filter(Boolean)
    const [r, g, b, a] = parts.map(part => Number.parseFloat(part))
    const color = { r: percentToChannel(r), g: percentToChannel(g), b: percentToChannel(b), a: a == null ? 1 : clamp(a, 0, 1) }
    return [color.r, color.g, color.b].some(Number.isNaN) ? null : color
  }
  const hexMatch = /^#([0-9a-f]{3,8})$/.exec(raw)
  if (hexMatch) {
    const hex = hexMatch[1]
    const expand = part => Number.parseInt(part.length === 1 ? part + part : part, 16)
    if (hex.length === 3 || hex.length === 4)
      return { r: expand(hex[0]), g: expand(hex[1]), b: expand(hex[2]), a: hex.length === 4 ? expand(hex[3]) / 255 : 1 }
    if (hex.length === 6 || hex.length === 8)
      return { r: expand(hex.slice(0, 2)), g: expand(hex.slice(2, 4)), b: expand(hex.slice(4, 6)), a: hex.length === 8 ? expand(hex.slice(6, 8)) / 255 : 1 }
  }
  return null
}

function toChannel(part) {
  if (part == null)
    return Number.NaN
  return part.endsWith('%') ? percentToChannel(Number.parseFloat(part)) : Number.parseFloat(part)
}

function percentToChannel(value) {
  return Number.isNaN(value) ? Number.NaN : clamp(Math.round(value * 255), 0, 255)
}

function clamp(value, min, max) {
  if (!Number.isFinite(value))
    return min
  return Math.min(max, Math.max(min, value))
}

/** 人看的颜色文本，保留原样，值缺失时给个短横线。 */
export function colorText(value) {
  return String(value ?? '').trim() || '（无）'
}
