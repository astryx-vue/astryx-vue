/**
 * Color math for status roles: OKLCH conversion and a lightness solver.
 *
 * Contrast follows WCAG 2.x (see contrast.ts). A derived role moves along
 * OKLCH lightness at the status's own hue, losing chroma only as far as it
 * must to stay inside sRGB, so it still reads as that status.
 */
import type { RgbColor } from './contrast.js'
import { compositeOver, contrastRatio, relativeLuminance } from './contrast.js'
import { formatHex } from './hct.js'

interface Oklch {
  l: number
  c: number
  h: number
}

const WHITE: RgbColor = { r: 255, g: 255, b: 255, a: 1 }

function toLinear(value: number): number {
  const c = value / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function fromLinear(value: number): number {
  const c = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
  return c * 255
}

function toOklch({ r, g, b }: RgbColor): Oklch {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { l: L, c: Math.hypot(A, B), h: Math.atan2(B, A) }
}

function oklchToLinear({ l: L, c, h }: Oklch): [number, number, number] {
  const A = c * Math.cos(h)
  const B = c * Math.sin(h)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

function linearToRgb(channels: readonly number[]): RgbColor {
  const [r = 0, g = 0, b = 0] = channels.map(v => fromLinear(Math.min(1, Math.max(0, v))))
  return { r, g, b, a: 1 }
}

/** OKLCH to sRGB, lowering chroma at the same lightness and hue until it fits. */
function fromOklch(color: Oklch): RgbColor {
  let c = color.c
  for (let i = 0; i < 40; i++) {
    const rgb = oklchToLinear({ ...color, c })
    if (rgb.every(v => v >= -1e-4 && v <= 1 + 1e-4))
      return linearToRgb(rgb)
    c *= 0.9
  }
  return linearToRgb(oklchToLinear({ ...color, c: 0 }))
}

/** Lowest chroma, and the lightness band, at which a color still reads as a hue. */
const CHROMA_FLOOR = 0.03
const LIGHTNESS_RANGE: readonly [number, number] = [0.2, 0.95]

/** Whether a color reads as a hue rather than grey, near-black, or near-white. */
export function isChromatic(color: RgbColor): boolean {
  const { l, c } = toOklch(color)
  return c >= CHROMA_FLOOR && l >= LIGHTNESS_RANGE[0] && l <= LIGHTNESS_RANGE[1]
}

/** Paint a possibly translucent color over an opaque backdrop. */
export function opaqueOver(color: RgbColor, backdrop: RgbColor = WHITE): RgbColor {
  return color.a < 1 ? compositeOver(color, backdrop) : color
}

/**
 * Move `color` along OKLCH lightness, at its own hue, until it reaches
 * `ratio` against every backdrop. It moves away from the backdrops: darker on
 * light ones, lighter on dark ones. The color comes back unchanged when it
 * already passes, and `null` means no lightness at that hue gets there.
 */
export function solveLightness(color: RgbColor, backdrops: readonly RgbColor[], ratio: number): RgbColor | null {
  const passes = (candidate: RgbColor): boolean =>
    backdrops.every(backdrop => contrastRatio(candidate, backdrop) >= ratio)
  const opaque = { ...color, a: 1 }
  if (passes(opaque))
    return opaque
  const meanLuminance = backdrops.reduce((sum, b) => sum + relativeLuminance(b), 0) / backdrops.length
  const base = toOklch(opaque)
  const darker = meanLuminance > 0.18
  const at = (l: number): RgbColor => fromOklch({ ...base, l })
  const target = at(darker ? 0 : 1)
  if (!passes(target))
    return null
  // Binary search for the passing lightness closest to the original.
  let lo = darker ? 0 : base.l
  let hi = darker ? base.l : 1
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2
    const ok = passes(at(mid))
    if (darker === ok)
      lo = mid
    else
      hi = mid
  }
  const solved = at(darker ? lo : hi)
  return passes(solved) ? solved : target
}

/** `#RRGGBB` for an opaque color. */
export function toHex(color: RgbColor): string {
  return formatHex(Math.round(color.r), Math.round(color.g), Math.round(color.b))
}
