/**
 * HCT as used by the theme palette: Lab hue, C*ab chroma, and L* tone.
 *
 * A color that falls outside sRGB keeps its hue and tone and loses chroma
 * until it fits. Tone 0 and 100 are black and white. This is the same model
 * the upstream palette helper uses, so one accent seed produces one palette.
 */

export interface HctColor {
  hue: number
  chroma: number
  tone: number
}

const D65_WHITE: readonly [number, number, number] = [0.95047, 1, 1.08883]
const PALETTE_TONES = [0, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100]
const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

export function isHexColor(value: string): boolean {
  return HEX.test(value.trim())
}

function srgbToLinear(channel: number): number {
  const scaled = channel / 255
  return scaled <= 0.04045 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
}

function linearToSrgb(channel: number): number {
  const scaled = channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055
  return Math.round(Math.min(255, Math.max(0, scaled * 255)))
}

function linearRgbToXyz(r: number, g: number, b: number): [number, number, number] {
  return [
    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
    0.0193339 * r + 0.119192 * g + 0.9503041 * b,
  ]
}

function xyzToLinearRgb(x: number, y: number, z: number): [number, number, number] {
  return [
    3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.969266 * x + 1.8760108 * y + 0.041556 * z,
    0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ]
}

function labF(t: number): number {
  const delta = 6 / 29
  return t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta * delta) + 4 / 29
}

function labFInv(t: number): number {
  const delta = 6 / 29
  return t > delta ? t ** 3 : 3 * delta * delta * (t - 4 / 29)
}

function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  const fx = labF(x / D65_WHITE[0])
  const fy = labF(y / D65_WHITE[1])
  const fz = labF(z / D65_WHITE[2])
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

function labToXyz(l: number, a: number, b: number): [number, number, number] {
  const fy = (l + 16) / 116
  const fx = a / 500 + fy
  const fz = fy - b / 200
  return [
    labFInv(fx) * D65_WHITE[0],
    labFInv(fy) * D65_WHITE[1],
    labFInv(fz) * D65_WHITE[2],
  ]
}

function toneToY(tone: number): number {
  return labFInv((tone + 16) / 116)
}

export function formatHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(channel => channel.toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

function parseHexChannels(hex: string): [number, number, number] | null {
  const match = HEX.exec(hex.trim())
  const raw = match?.[1]
  if (!raw)
    return null
  const expanded = raw.length === 3 ? raw.split('').map(part => part + part).join('') : raw
  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ]
}

/** Hue 0–360, chroma from 0, tone 0–100. An unreadable hex is black. */
export function hexToHct(hex: string): HctColor {
  const channels = parseHexChannels(hex) ?? [0, 0, 0]
  const [r, g, b] = channels
  const [x, y, z] = linearRgbToXyz(srgbToLinear(r), srgbToLinear(g), srgbToLinear(b))
  const [l, a, bLab] = xyzToLab(x, y, z)
  let hue = (Math.atan2(bLab, a) * 180) / Math.PI
  if (hue < 0)
    hue += 360
  return {
    hue,
    chroma: Math.sqrt(a * a + bLab * bLab),
    tone: Math.max(0, Math.min(100, l)),
  }
}

function toneToGray(tone: number): number {
  return linearToSrgb(toneToY(tone))
}

function hctComponentToHex(hue: number, chroma: number, tone: number): string | null {
  const hueRad = (hue * Math.PI) / 180
  const a = Math.cos(hueRad) * chroma
  const b = Math.sin(hueRad) * chroma
  const [x, y, z] = labToXyz(tone, a, b)
  const [linearR, linearG, linearB] = xyzToLinearRgb(x, y, z)
  const r = linearToSrgb(linearR)
  const g = linearToSrgb(linearG)
  const bOut = linearToSrgb(linearB)
  const tolerance = 0.02
  if (
    Math.abs(srgbToLinear(r) - linearR) > tolerance
    || Math.abs(srgbToLinear(g) - linearG) > tolerance
    || Math.abs(srgbToLinear(bOut) - linearB) > tolerance
    || r < 0
    || r > 255
    || g < 0
    || g > 255
    || bOut < 0
    || bOut > 255
  ) {
    return null
  }
  return formatHex(r, g, bOut)
}

/** Fit chroma down until the color is inside sRGB. */
export function hctToHex(hct: HctColor): string {
  const { hue, chroma, tone } = hct
  if (tone <= 0)
    return '#000000'
  if (tone >= 100)
    return '#FFFFFF'
  if (chroma < 0.5) {
    const gray = toneToGray(tone)
    return formatHex(gray, gray, gray)
  }

  let low = 0
  let high = chroma
  let best = '#000000'
  for (let step = 0; step < 16; step += 1) {
    const mid = (low + high) / 2
    const candidate = hctComponentToHex(hue, mid, tone)
    if (candidate != null) {
      best = candidate
      low = mid
    }
    else {
      high = mid
    }
  }
  return best
}

/** Hex stops at the standard tones for one hue and chroma. */
export function tonalPalette(hue: number, chroma: number): Record<number, string> {
  const palette: Record<number, string> = {}
  for (const tone of PALETTE_TONES)
    palette[tone] = hctToHex({ hue, chroma, tone })
  return palette
}

/** `#RRGGBB` plus an alpha byte, for example `0.1` becomes `1A`. */
export function hexWithAlpha(hex: string, alpha: number): string {
  const alphaHex = Math.round(alpha * 255).toString(16).padStart(2, '0').toUpperCase()
  return `${hex}${alphaHex}`
}
