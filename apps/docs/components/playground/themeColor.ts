/** 颜色的读写和换算：十六进制规范化、读数格式、取色器合并、对比色。 */
import type { ThemeColorKey, ThemeColors, ThemeState } from './themeTypes'

/** Upstream `getTokenLabel`, with this package's `--astryx-` prefix removed. */
export function colorTokenLabel(variable: string): string {
  return variable
    .replace(/^--astryx-/, '')
    .replace(/-/g, ' ')
    .replace(/\bbackground /gi, '')
    .replace(/\b\w/g, char => char.toUpperCase())
}

/** `#ffffff  10%`, matching upstream ColorSwatch's readout (two spaces). */
export function formatColorReadout(value: string): string {
  const normalized = normalizeHex(value)
  if (!normalized)
    return value
  const hex = normalized.slice(0, 7)
  const alpha = normalized.length === 9
    ? Math.round(Number.parseInt(normalized.slice(7), 16) / 255 * 100)
    : 100
  return `${hex}  ${alpha}%`
}

/** Inverse of formatColorReadout. Returns null when the text is not a color. */
export function parseColorReadout(raw: string): string | null {
  const parts = raw.trim().split(/\s+/)
  const head = parts[0] ?? ''
  const pct = parts.find(part => part.endsWith('%'))
  const alpha = pct
    ? Math.min(100, Math.max(0, Number(pct.slice(0, -1)))) / 100
    : 1
  const normalized = normalizeHex(head)
  if (!normalized || !Number.isFinite(alpha))
    return null
  if (alpha >= 1)
    return normalized.slice(0, 7)
  const byte = Math.round(alpha * 255).toString(16).padStart(2, '0')
  return `${normalized.slice(0, 7)}${byte}`
}

/** 预览当前是浅色还是深色，就返回那一套颜色。 */
export function activeColors(theme: ThemeState): ThemeColors {
  return theme.dark ? theme.colors.dark : theme.colors.light
}

export function setThemeColor(theme: ThemeState, key: ThemeColorKey, value: string): void {
  const next = normalizeHex(value)
  if (!next)
    return
  activeColors(theme)[key] = next
}

/** `<input type="color">` 只认 `#rrggbb`，这里去掉透明度。 */
export function colorInputValue(value: string): string {
  const normalized = normalizeHex(value)
  if (!normalized)
    return '#000000'
  return normalized.slice(0, 7)
}

/** 取色器只给出不透明颜色，原来带透明度的话把透明度接回去。 */
export function applyColorPicker(current: string, picked: string): string {
  const next = normalizeHex(picked)
  const previous = normalizeHex(current)
  if (!next)
    return previous ?? '#000000'
  if (previous && previous.length === 9)
    return `${next}${previous.slice(7)}`
  return next
}

/** 放在这个颜色上的文字该用深色还是白色。 */
export function contrastingInk(color: string): string {
  const channels = hexChannels(color)
  if (!channels)
    return '#ffffff'
  const [red, green, blue] = channels.map(channelToLinear)
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
  return luminance > 0.45 ? '#171717' : '#ffffff'
}

/** 把 3、4、6、8 位的十六进制颜色统一成小写的 6 或 8 位。不是颜色时返回 null。 */
export function normalizeHex(value: string): string | null {
  const trimmed = value.trim().toLowerCase()
  const match = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.exec(trimmed)
  if (!match?.[1])
    return null
  const hex = match[1]
  if (hex.length === 3 || hex.length === 4)
    return `#${[...hex].map(channel => channel + channel).join('')}`
  return `#${hex}`
}

function hexChannels(value: string): [number, number, number] | null {
  const normalized = normalizeHex(value)
  if (!normalized)
    return null
  return [
    Number.parseInt(normalized.slice(1, 3), 16),
    Number.parseInt(normalized.slice(3, 5), 16),
    Number.parseInt(normalized.slice(5, 7), 16),
  ]
}

function channelToLinear(channel: number): number {
  const value = channel / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}
