import { splitLightDark } from '../theme-tokens/parseTokens'
/** Advanced 面板里颜色行的读写：拆 `light-dark()`、读十六进制与透明度、按当前模式改回去。 */
import { normalizeHex } from './themeColor'

export type ColorMode = 'light' | 'dark'

export function parseLightDark(value: string): { light: string, dark: string } | null {
  return splitLightDark(value)
}

interface ParsedColor {
  hex: string
  alpha: number
}

/** 支持 `#rgb`、`#rrggbb`、`#rrggbbaa` 和 `rgb()/rgba()`；别的写法（oklch、var 等）读不出，返回 null。 */
export function parseColor(value: string): ParsedColor | null {
  const hex = normalizeHex(value)
  if (hex) {
    const alpha = hex.length === 9 ? Math.round(Number.parseInt(hex.slice(7), 16) / 255 * 100) / 100 : 1
    return { hex: hex.slice(0, 7), alpha }
  }
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(value.trim())
  if (!rgb)
    return null
  const channels = [rgb[1], rgb[2], rgb[3]].map(part => Math.min(255, Number(part)).toString(16).padStart(2, '0'))
  return { hex: `#${channels.join('')}`, alpha: rgb[4] ? Number(rgb[4]) : 1 }
}

export function colorToString(hex: string, alpha: number): string {
  if (alpha >= 1)
    return hex.toLowerCase()
  const byte = Math.round(alpha * 255).toString(16).padStart(2, '0')
  return `${hex}${byte}`.toLowerCase()
}

/** 当前模式下这一行要显示的颜色：`display` 是色块用的 CSS 值，`hex` 为空表示取色器不可用。 */
export function shownColor(value: string, mode: ColorMode): { display: string, hex: string | null, alpha: number, readout: string } {
  const pair = splitLightDark(value)
  const display = pair ? pair[mode] : value
  const parsed = parseColor(display)
  if (!parsed)
    return { display, hex: null, alpha: 1, readout: display }
  return { display, hex: parsed.hex, alpha: parsed.alpha, readout: `${parsed.hex}  ${Math.round(parsed.alpha * 100)}%` }
}

/**
 * 把输入框或取色器的新内容写回 token。
 * `#abc  40%` 这种读数拆成颜色和透明度；写不成十六进制的原样当作 CSS 值。
 * 原值是 `light-dark()` 时只改当前模式那一半。
 */
export function rewriteColor(current: string, mode: ColorMode, text: string, alpha?: number): string {
  const pair = splitLightDark(current)
  const parts = text.trim().split(/\s+/)
  const head = normalizeHex(parts[0] ?? '')
  let next = text.trim()
  if (head) {
    const percent = parts.find(part => part.endsWith('%'))
    const level = percent ? Math.min(100, Math.max(0, Number(percent.slice(0, -1)))) / 100 : (alpha ?? parseColor(pair ? pair[mode] : current)?.alpha ?? 1)
    next = colorToString(head.slice(0, 7), Number.isFinite(level) ? level : 1)
  }
  if (!pair)
    return next
  return mode === 'light' ? `light-dark(${next}, ${pair.dark})` : `light-dark(${pair.light}, ${next})`
}
