export interface RgbColor {
  r: number
  g: number
  b: number
  a: number
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+)(%)?)?\s*\)$/i

export function parseColor(input: string): RgbColor | null {
  const value = input.trim().toLowerCase()
  if (value === 'transparent')
    return { r: 0, g: 0, b: 0, a: 0 }

  const hex = HEX.exec(value)
  if (hex?.[1]) {
    const raw = hex[1]
    const expanded = raw.length === 3
      ? raw.split('').map(part => part + part).join('')
      : raw
    const channels = expanded.length === 6 ? `${expanded}ff` : expanded
    return {
      r: Number.parseInt(channels.slice(0, 2), 16),
      g: Number.parseInt(channels.slice(2, 4), 16),
      b: Number.parseInt(channels.slice(4, 6), 16),
      a: Number.parseInt(channels.slice(6, 8), 16) / 255,
    }
  }

  const rgb = RGB.exec(value)
  if (!rgb)
    return null
  const alpha = rgb[4] == null
    ? 1
    : rgb[5] === '%'
      ? Number.parseFloat(rgb[4]) / 100
      : Number.parseFloat(rgb[4])
  return {
    r: Number.parseFloat(rgb[1] ?? '0'),
    g: Number.parseFloat(rgb[2] ?? '0'),
    b: Number.parseFloat(rgb[3] ?? '0'),
    a: alpha,
  }
}

function channel(value: number): number {
  const scaled = value / 255
  return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(color: RgbColor): number {
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b)
}

/** WCAG contrast ratio. 1 is no contrast. */
export function contrastRatio(foreground: RgbColor, background: RgbColor): number {
  const first = relativeLuminance(foreground)
  const second = relativeLuminance(background)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

const ON_DARK: RgbColor = { r: 255, g: 255, b: 255, a: 1 }
const ON_LIGHT: RgbColor = { r: 23, g: 23, b: 23, a: 1 }

/**
 * Choose a media surface from the painted background.
 *
 * `off` means the ambient text already reads on that background at 3:1, so no
 * inverted context is needed. `null` means the background is too transparent
 * to judge.
 */
export function pickMediaMode(background: RgbColor, ambientText: RgbColor): 'dark' | 'light' | 'off' | null {
  if (background.a < 0.2)
    return null
  if (contrastRatio(ambientText, background) >= 3)
    return 'off'
  const onDark = contrastRatio(ON_DARK, background)
  const onLight = contrastRatio(ON_LIGHT, background)
  return onDark >= onLight ? 'dark' : 'light'
}
