import type { ColorTriple, PaletteMappingContext, PaletteMode, StopRef } from './mappingTables'
import type { TonalPaletteCandidate } from './types'
import { hexToOklch, luminance, normalizeColor } from './color'
import { PALETTE_BLACK, PALETTE_WHITE } from './generatorBase'
import { perceptualDelta } from './generatorRamp'
import { generateTonalPalette } from './generatorRequest'
import { NEUTRAL_STOPS, ON_FILL, rampOf, TEXT } from './mappingTables'

/**
 * Below this OKLCH chroma a seed reads as gray: its family is generated as a
 * neutral, so no hue is invented for it in either mode.
 */
export const GRAY_CHROMA = 0.02

/** Whether a seed reads as gray. */
export function isGray(seed: string): boolean {
  return hexToOklch(seed).C < GRAY_CHROMA
}

/** Whether two values are one color. */
export function sameColor(a: unknown, b: unknown): boolean {
  try {
    return normalizeColor(String(a)) === normalizeColor(String(b))
  }
  catch {
    return false
  }
}

/** RGB channels (0–255) as a lowercase six-digit hex. */
export function hex(rgb: ReadonlyArray<number>): string {
  return `#${rgb
    .slice(0, 3)
    .map(x =>
      Math.round(Math.max(0, Math.min(255, x)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`
}

/** The WCAG contrast ratio of two RGB colors, each rounded to a hex first. */
export function ratio(
  a: ReadonlyArray<number>,
  b: ReadonlyArray<number>,
): number {
  const [x, y] = [luminance(hex(a)), luminance(hex(b))].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

/** A color drawn at `alpha` over `under`, as the opaque color the eye sees. */
export function compositeOver(
  over: ReadonlyArray<number>,
  alpha: number,
  under: ReadonlyArray<number>,
): ColorTriple {
  return over.map((c, i) => c * alpha + under[i] * (1 - alpha)) as ColorTriple
}

/** A ratio to two decimals. */
export const round = (r: number): number => Math.round(r * 100) / 100

/** A stop as text: a layout may hold 16.666666666666668. */
export const shade = (s: number): string => String(round(s))

/**
 * The stop of a ramp whose shade is nearest a color, as the eye compares
 * them; never an end stop (pure black or white, which every ramp shares).
 * Null for a ramp with no inner stop.
 */
export function nearestShade(
  ramp: Record<string | number, string>,
  color: string,
): string | null {
  const inner = Object.keys(ramp).filter(s => Number(s) > 0 && Number(s) < 100)
  if (!inner.length) {
    return null
  }
  return inner.reduce((best, s) =>
    perceptualDelta(ramp[s], color) < perceptualDelta(ramp[best], color)
      ? s
      : best,
  )
}

/** The stop of a layout nearest `n`; on a tie, the one nearer the middle. */
export function nearestStop(stops: ReadonlyArray<number>, n: number): number {
  return stops.reduce((best, s) => {
    const d = Math.abs(s - n) - Math.abs(best - n)
    return d < 0 || (d === 0 && Math.abs(s - 50) < Math.abs(best - 50))
      ? s
      : best
  })
}

/**
 * The light stop nearest a seed color in the ramp the generator grows from
 * it. The official themes anchor a brand color there, exactly, so the fill
 * keeps the color as given. The end stops are pure black and white and
 * never hold an anchor.
 */
export function seedStop(
  seed: string,
  config: { stops?: number[], vibrancy?: number },
  kind: 'chromatic' | 'neutral' = 'chromatic',
): number {
  const { palette } = generateTonalPalette({
    ...(config.stops ? { stops: config.stops } : {}),
    ...(config.vibrancy != null ? { vibrancy: config.vibrancy } : {}),
    ...(kind === 'neutral' ? { neutralProfile: 'custom' } : {}),
    modeStrategy: 'light-only',
    families: [{ id: 'seed', seed, kind }],
  })
  const ramp = palette.seed.light as Record<number, string>
  return Number(nearestShade(ramp, seed))
}

/**
 * A gray ramp the generator grows from a gray of the theme (its secondary
 * text), for a mode: the grays of a theme whose palette has no neutral
 * family. Null when the seed does not grow.
 */
export function grownGrays(
  seed: string,
  m: PaletteMode,
): Record<string, string> | null {
  try {
    const g = generateTonalPalette({
      modeStrategy: m === 'light' ? 'light-only' : 'dark-only',
      neutralProfile: 'custom',
      families: [{ id: 'gray', seed, kind: 'neutral' }],
    })
    return g.palette.gray[m] ?? null
  }
  catch {
    return null
  }
}

/** A text shade, named for a sentence. */
export function textName(r: StopRef): string {
  return r.family === 'white' || (r.family === 'neutral' && r.stop >= 95)
    ? 'white'
    : r.family === 'black' || (r.family === 'neutral' && r.stop <= 10)
      ? 'near-black'
      : `shade ${r.stop}`
}

/**
 * Look-ups shared by the request planner and the mapping, on one
 * candidate: the nearest stop, a stop's color, the surfaces text and fills
 * sit on, the text that reads on a fill, and the theme's exact colors.
 */
export function paletteTools(
  candidate: TonalPaletteCandidate,
  context: PaletteMappingContext,
) {
  const { base, reader } = context
  const { stops } = candidate
  const parseColor = reader.rgb
  const alphaOf = reader.alpha
  const contrast = (a: string, b: string): number => {
    const x = parseColor(a)
    const y = parseColor(b)
    if (!x || !y) {
      throw new Error(`No contrast between "${a}" and "${b}".`)
    }
    return ratio(x, y)
  }
  const at = (n: number): number => nearestStop(stops, n)
  /** The stop nearest `n` off the white and black ends. */
  const atInside = (n: number): number =>
    nearestStop(
      stops.filter(s => s > 0 && s < 100),
      n,
    )
  const ref = (
    id: string,
    m: PaletteMode,
    stop: number,
    alpha?: string,
  ): StopRef => {
    const color = rampOf(candidate, id, m)[stop]
    return alpha ? { stop, color: `${color}${alpha}`, alpha } : { stop, color }
  }
  const neutral = Boolean(candidate.palette.neutral)
  /** The value a token is set to exactly in a mode, as written, or undefined. */
  const settingOf = (token: string, m: PaletteMode): string | undefined =>
    context.settingOf?.(token, m)
  const colorIn = (
    value: string | undefined,
    m: PaletteMode,
  ): string | null => {
    if (value == null) {
      return null
    }
    if (context.colorIn) {
      return context.colorIn(value, m)
    }
    // (Without a reader of its own, a value is a color when it is one.)
    const v = value.trim()
    return parseColor(v) ? v : null
  }
  /** The exact opaque color a token is set to in a mode, or null. */
  const exactOf = (token: string, m: PaletteMode): string | null => {
    const v = colorIn(settingOf(token, m), m)
    const rgb = v == null ? null : parseColor(v)
    return rgb && v != null && alphaOf(v) >= 1 ? hex(rgb) : null
  }
  /**
   * The exact color a token is set to in a mode, see-through or not, as
   * written; null when there is none or it is not a fixed color.
   */
  const rawOf = (token: string, m: PaletteMode): string | null =>
    colorIn(settingOf(token, m), m)
  /**
   * Which column of a `[light, dark]` mapping a mode takes: the light one
   * on a light page and the dark one on a dark page, by the base theme's
   * page, the one its surfaces were made for.
   */
  const side = (m: PaletteMode): 0 | 1 => {
    const page = base?.[m]?.['--color-background-body']
    const rgb = page ? parseColor(page) : null
    if (!rgb || alphaOf(page) < 1) {
      return m === 'light' ? 0 : 1
    }
    return ratio(rgb, [255, 255, 255]) > ratio(rgb, [0, 0, 0]) ? 1 : 0
  }
  /**
   * What text and fills sit on in a mode: the theme's exact surface
   * colors, else the neutral color's surfaces, else the base theme's; the
   * family's own surface stop when nothing else is known.
   */
  const surfaces = (m: PaletteMode, id: string): [string, string][] => {
    const out: [string, string][] = []
    for (const n of [
      '--color-background-surface',
      '--color-background-body',
      '--color-background-card',
    ]) {
      const own
        = neutral && NEUTRAL_STOPS[n]
          ? ref('neutral', m, at(NEUTRAL_STOPS[n][side(m)])).color
          : null
      const v = exactOf(n, m) ?? own ?? base?.[m]?.[n]
      const rgb = v ? parseColor(v) : null
      if (v && rgb && alphaOf(v) >= 1) {
        out.push([n, hex(rgb)])
      }
    }
    if (!out.length) {
      const s = at(NEUTRAL_STOPS['--color-background-surface'][side(m)])
      out.push([`${id} shade ${s}`, ref(id, m, s).color])
    }
    return out
  }
  /** The text shades for a fill, preferred first. */
  const onChoices = (id: string, m: PaletteMode): StopRef[] =>
    (id === 'warning' ? [5, 100] : ON_FILL[m]).map(s =>
      neutral
        ? { ...ref('neutral', m, at(s)), family: 'neutral' }
        : s >= 50
          ? { stop: 100, color: PALETTE_WHITE, family: 'white' }
          : { stop: 0, color: PALETTE_BLACK, family: 'black' },
    )
  /**
   * The text on a fill: the preferred shade when it reads at 4.5:1, else
   * the one that reads better.
   */
  const onFor = (id: string, m: PaletteMode, fill: string) => {
    const [a, b] = onChoices(id, m).map(on => ({
      on,
      r: contrast(on.color, fill),
    }))
    let best = a.r >= TEXT || a.r >= b.r ? a : b
    const other = best === a ? b : a
    // Neither reads: the end of the gray ramp on the better side (black
    // past near-black, white past near-white) when it reads better, so the
    // text picked is never one a darker or lighter gray would beat.
    if (best.r < TEXT) {
      const dark
        = contrast(best.on.color, PALETTE_WHITE) > contrast(fill, PALETTE_WHITE)
      const end: StopRef = neutral
        ? { ...ref('neutral', m, at(dark ? 0 : 100)), family: 'neutral' }
        : dark
          ? { stop: 0, color: PALETTE_BLACK, family: 'black' }
          : { stop: 100, color: PALETTE_WHITE, family: 'white' }
      const r = contrast(end.color, fill)
      if (r > best.r) {
        best = { on: end, r }
      }
    }
    return {
      on: best.on,
      r: best.r,
      other: other.on,
      otherR: other.r,
      first: a.on,
    }
  }
  /** The lowest contrast of a color on the surfaces. */
  const page = (color: string, m: PaletteMode, id: string): number =>
    Math.min(...surfaces(m, id).map(([, bg]) => contrast(color, bg)))
  /** A color as the eye sees it on the surface in a mode. */
  const solid = (color: string, m: PaletteMode, id: string): string => {
    const rgb = parseColor(color) as ColorTriple
    const a = alphaOf(color)
    if (a >= 1) {
      return hex(rgb)
    }
    const under = parseColor(surfaces(m, id)[0][1]) as ColorTriple
    return hex(compositeOver(rgb, a, under))
  }
  /** A translucent stop drawn over each surface; an opaque stop as it is. */
  const over = (
    name: string,
    r: StopRef,
    under: [string, string][],
  ): [string, string][] => {
    if (!r.alpha) {
      return [[name, r.color]]
    }
    const top = parseColor(r.color.slice(0, 7)) as ColorTriple
    const a = Number.parseInt(r.alpha, 16) / 255
    return under.map(([n, bg]) => [
      `${name} over ${n}`,
      hex(compositeOver(top, a, parseColor(bg) as ColorTriple)),
    ])
  }
  return {
    stops,
    at,
    atInside,
    ref,
    exactOf,
    settingOf,
    rawOf,
    side,
    solid,
    surfaces,
    onFor,
    page,
    neutral,
    contrast,
    over,
    parseColor,
    alphaOf,
  }
}

export type PaletteTools = ReturnType<typeof paletteTools>

/**
 * A part-style value's light and dark halves: a `[light, dark]` pair, a
 * `light-dark()` value split at its top-level comma, or one value for
 * both; null for anything else.
 */
export function sides(v: unknown): string[] | null {
  if (Array.isArray(v)) {
    return v as string[]
  }
  if (typeof v !== 'string') {
    return null
  }
  const inner = /^light-dark\((.*)\)$/s.exec(v.trim())?.[1]
  return inner ? splitTopComma(inner) : [v, v]
}

/** Splits a CSS value at its top-level commas (outside brackets). */
export function splitTopComma(value: string): string[] {
  const out: string[] = []
  let depth = 0
  let cur = ''
  for (const c of value) {
    if (c === '(') {
      depth++
    }
    if (c === ')') {
      depth--
    }
    if (depth === 0 && c === ',') {
      out.push(cur)
      cur = ''
    }
    else {
      cur += c
    }
  }
  out.push(cur)
  return out
}
