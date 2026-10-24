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

/** Paint `foreground` over an opaque `backdrop`. The result is opaque. */
export function compositeOver(foreground: RgbColor, backdrop: RgbColor): RgbColor {
  const a = foreground.a
  return {
    r: foreground.r * a + backdrop.r * (1 - a),
    g: foreground.g * a + backdrop.g * (1 - a),
    b: foreground.b * a + backdrop.b * (1 - a),
    a: 1,
  }
}

/** Ambient text counts as reading well on a surface at this contrast or more. */
const AMBIENT_READS_AT = 3

/**
 * Choose a media surface from the painted background.
 *
 * `off` means the ambient text already reads on that background at 3:1, so
 * no inverted context is needed. Otherwise the side whose text color, the
 * theme's `on-dark` or `on-light`, contrasts more wins. `null` means a color
 * could not be read.
 */
export function pickMediaMode(
  background: RgbColor,
  ambient: RgbColor | null,
  onDark: RgbColor | null,
  onLight: RgbColor | null,
): 'dark' | 'light' | 'off' | null {
  if (onDark === null || onLight === null)
    return null
  if (ambient !== null && contrastRatio(ambient, background) >= AMBIENT_READS_AT)
    return 'off'
  return contrastRatio(onDark, background) >= contrastRatio(onLight, background) ? 'dark' : 'light'
}
