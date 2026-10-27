/**
 * 颜色解析与序列化。图表配色、透明度换算、GL 通道都用这里的函数。
 *
 * 只认三类输入：hex（`#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa`，带不带 `#` 都行）、
 * `rgb()` / `rgba()`、以及 token 表达式里用到的几个颜色名。解析不了（比如
 * `var()`、`oklch()`）一律返回 null，让调用方原样保留原表达式，而不是猜一个值。
 */

/** 一个颜色拆成 0-255 的 RGB 三个通道和 0-1 的透明度。 */
export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

const NAMED_COLORS: Record<string, RGBA> = {
  transparent: { r: 0, g: 0, b: 0, a: 0 },
  black: { r: 0, g: 0, b: 0, a: 1 },
  white: { r: 255, g: 255, b: 255, a: 1 },
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** 把简写 hex 的每个字符重复一遍：`rgb` → `rrggbb`。 */
function expandShorthand(body: string): string {
  return body
    .split('')
    .map(c => c + c)
    .join('')
}

/**
 * 解析 hex 颜色。支持 `#rgb`、`#rgba`、`#rrggbb`、`#rrggbbaa`，`#` 可有可无。
 * 其它输入返回 null。
 */
export function parseHex(hex: string): RGBA | null {
  if (typeof hex !== 'string')
    return null

  const body = hex.trim().replace(/^#/, '')
  const normalized
    = body.length === 3 || body.length === 4 ? expandShorthand(body) : body

  if (
    (normalized.length !== 6 && normalized.length !== 8)
    || !/^[0-9a-f]+$/i.test(normalized)
  ) {
    return null
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1,
  }
}

/**
 * 解析 `rgb()` / `rgba()`。通道可以用逗号或空格分隔，可以用 `/ alpha`，
 * 也可以写百分比。通道和透明度都会夹到合法范围。
 */
export function parseRgb(value: string): RGBA | null {
  const open = value.indexOf('(')
  if (open === -1 || !value.trim().endsWith(')'))
    return null

  const body = value
    .slice(open + 1, value.lastIndexOf(')'))
    .replace(/\//g, ' ')
  const parts = body
    .split(/[\s,]+/)
    .map(p => p.trim())
    .filter(Boolean)
  if (parts.length < 3)
    return null

  function channel(p: string): number {
    const n = p.endsWith('%') ? (Number.parseFloat(p) / 100) * 255 : Number.parseFloat(p)
    return clamp(n, 0, 255)
  }

  const r = channel(parts[0])
  const g = channel(parts[1])
  const b = channel(parts[2])
  if ([r, g, b].some(Number.isNaN))
    return null

  let a = 1
  if (parts.length >= 4) {
    const raw = parts[3]
    a = raw.endsWith('%') ? Number.parseFloat(raw) / 100 : Number.parseFloat(raw)
    if (Number.isNaN(a))
      return null
    a = clamp(a, 0, 1)
  }
  return { r, g, b, a }
}

/**
 * 解析一个具体的 CSS 颜色字符串：hex、`rgb()` / `rgba()`，以及 token 表达式里
 * 用到的几个颜色名。解析不了返回 null。
 */
export function parseColor(value: string): RGBA | null {
  const trimmed = value.trim()
  const named = NAMED_COLORS[trimmed.toLowerCase()]
  if (named)
    return { ...named }
  if (trimmed.startsWith('#'))
    return parseHex(trimmed)
  if (/^rgba?\(/i.test(trimmed))
    return parseRgb(trimmed)
  return null
}

/** 把 0-255 的三个通道拼成大写 `#RRGGBB`。 */
export function formatHex(r: number, g: number, b: number): string {
  function channel(c: number): string {
    return clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0').toUpperCase()
  }
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/** 完全不透明时输出 `#RRGGBB`，否则输出 `rgba(r, g, b, a)`。 */
export function formatColor({ r, g, b, a }: RGBA): string {
  if (a >= 1)
    return formatHex(r, g, b)
  const round = (n: number): number => clamp(Math.round(n), 0, 255)
  return `rgba(${round(r)}, ${round(g)}, ${round(b)}, ${Number.parseFloat(a.toFixed(4))})`
}

/** 解析不了的颜色（null）和非有限通道用这个中性灰兜底，让 GPU 不会拿到 NaN。 */
const GL_FALLBACK: [number, number, number] = [0.5, 0.5, 0.5]

/**
 * 把解析后的颜色转成 0-1 的 `[r, g, b]` 浮点数，给 WebGL 的 uniform 和顶点属性用。
 *
 * 参数是解析后的结果，所以每个调用方都走同一条校验路径：`toGLFloats(parseHex(color))`。
 * 传 null 或通道非有限时返回中性灰。透明度故意丢掉，GL 那边自己混合。
 */
export function toGLFloats(color: RGBA | null): [number, number, number] {
  if (color === null || ![color.r, color.g, color.b].every(Number.isFinite))
    return GL_FALLBACK
  const channel = (c: number): number => clamp(c, 0, 255) / 255
  return [channel(color.r), channel(color.g), channel(color.b)]
}
