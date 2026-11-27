import type { TonalPaletteNormalizedRequest as NormalizedRequest, TonalPaletteAnchor, TonalPaletteCoordinationDiagnostics, TonalPaletteRampDiagnostics } from './types'
import { hexToOklch, normalizeColor } from './color'
import { smoothstep } from './generatorRamp'

export type ColorTriple = [number, number, number]
export type PaletteMode = 'light' | 'dark'
export interface PolarColor { lightness: number, chroma: number, hue: number }
export type AnchorResult = TonalPaletteAnchor & {
  color: string
  generatedColor: string
  deltaE: number
}
export interface GeneratedRamp {
  colors: Record<number, string>
  diagnostics: TonalPaletteRampDiagnostics
}
export interface NormalizedFamily {
  id: string
  name: string
  seed: string
  kind: 'chromatic' | 'neutral'
  anchors: TonalPaletteAnchor[]
}
export interface GeneratedFamily {
  id: string
  name: string
  seed: string
  light?: GeneratedRamp
  dark?: GeneratedRamp
}
export interface PaletteGenerationResult {
  recipe: PaletteRecipe
  status: 'candidate'
  request: NormalizedRequest
  families: GeneratedFamily[]
  coordination: TonalPaletteCoordinationDiagnostics[]
  errors: { familyId: string, message: string }[]
}

export type PaletteRecipe = 'astryx-oklch-v1' | 'astryx-oklch-v2'

/** The recipe a request that names none runs: the first one. */
export const PALETTE_RECIPE = 'astryx-oklch-v1'
/**
 * The recipe whose pale stops follow the vibrancy and the seed's own
 * chroma: a stop whose gamut cannot hold the most vivid request gives every
 * request the same share of it, and coordination never raises a seed's
 * chroma. A request runs it by naming it.
 */
export const PALETTE_RECIPE_V2 = 'astryx-oklch-v2'
/** Every recipe the generator runs. */
export const PALETTE_RECIPES = Object.freeze([
  PALETTE_RECIPE,
  PALETTE_RECIPE_V2,
])
/**
 * Identity of this generator implementation. `PALETTE_RECIPE` names the
 * normative algorithm; this names the code that ran it, so a receipt can tell
 * two implementations of one recipe apart.
 */
export const PALETTE_GENERATOR_VERSION = 'palette-generator-v1'
export const PALETTE_BLACK = '#000000'
export const PALETTE_WHITE = '#ffffff'
export const DEFAULT_21_STOPS = Object.freeze([
  0,
  5,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  45,
  50,
  55,
  60,
  65,
  70,
  75,
  80,
  85,
  90,
  95,
  100,
])
export const COMPACT_11_STOPS = Object.freeze([
  0,
  10,
  20,
  30,
  40,
  50,
  60,
  70,
  80,
  90,
  100,
])

export const DARK_CHROMA_FACTOR = 0.85
export const RESERVED_FAMILY_IDS: ReadonlyArray<string> = Object.freeze([
  'black',
  'white',
])
export const NEUTRAL_PROFILES = ['neutral-v1', 'warm-v1', 'cool-v1', 'custom']

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

export function normalizeHue(hue: number) {
  return ((hue % 360) + 360) % 360
}

export function hueDistance(a: number, b: number) {
  const difference = Math.abs(normalizeHue(a) - normalizeHue(b))
  return Math.min(difference, 360 - difference)
}

export function signedHueDelta(from: number, to: number) {
  return ((normalizeHue(to) - normalizeHue(from) + 540) % 360) - 180
}

export function interpolateHue(a: number, b: number, amount: number) {
  const delta = ((b - a + 540) % 360) - 180
  return normalizeHue(a + delta * amount)
}

export function validateStops(stops: ReadonlyArray<number>): number[] {
  if (!Array.isArray(stops) || stops.length === 0) {
    throw new Error('A palette requires at least one stop.')
  }
  for (const stop of stops) {
    if (!Number.isFinite(stop) || stop < 0 || stop > 100) {
      throw new Error(`Stop ${stop} must be a finite number from 0 to 100.`)
    }
  }
  for (let index = 1; index < stops.length; index++) {
    if (stops[index] <= stops[index - 1]) {
      throw new Error('Stops must be unique and strictly increasing.')
    }
  }
  return [...stops]
}

export function parseStopList(input: unknown): number[] {
  const values = String(input)
    .split(',')
    .map(value => value.trim())
  if (values.some(value => value === '' || !Number.isFinite(Number(value)))) {
    throw new Error('Every custom stop must be a number from 0 to 100.')
  }
  return validateStops(values.map(Number))
}

/**
 * The fields the generator reads from a request, a family and an anchor
 * (see TonalPaletteGenerationInput); any other field changes nothing.
 */
export const GENERATION_INPUT_KEYS = Object.freeze([
  'recipe',
  'vibrancy',
  'neutralProfile',
  'modeStrategy',
  'darkChromaTaper',
  'stops',
  'families',
])
export const DARK_CHROMA_TAPER_KEYS = Object.freeze([
  'edgeMultiplier',
  'throughStop',
  'recoverAtStop',
  'familyMultipliers',
])
export const FAMILY_INPUT_KEYS = Object.freeze([
  'id',
  'name',
  'seed',
  'kind',
  'anchors',
])
export const ANCHOR_INPUT_KEYS = Object.freeze([
  'mode',
  'stop',
  'color',
  'policy',
  'maxDeltaE',
])

/**
 * The modes a mode strategy generates.
 */
export function modesForStrategy(strategy: string): PaletteMode[] {
  if (strategy === 'light-only') {
    return ['light']
  }
  if (strategy === 'dark-only') {
    return ['dark']
  }
  if (strategy === 'light-and-dark') {
    return ['light', 'dark']
  }
  throw new Error(`Unknown mode strategy: ${strategy}`)
}

export function hueBalanceFactor(hue: number) {
  const normalized = normalizeHue(hue)
  if (normalized >= 70 && normalized < 115) {
    return 0.94
  }
  if (normalized >= 115 && normalized < 175) {
    return 0.78
  }
  if (normalized >= 175 && normalized < 230) {
    return 0.82
  }
  if (normalized >= 285 && normalized < 340) {
    return 0.9
  }
  return 1
}

export function highToneChromaFactor(hue: number, tone: number) {
  if (tone <= 60) {
    return 1
  }
  const taper = smoothstep((tone - 60) / 35)
  const normalized = normalizeHue(hue)
  if (normalized >= 115 && normalized < 175) {
    return 1 - 0.28 * taper
  }
  if (normalized >= 175 && normalized < 200) {
    return 1 - 0.4 * taper
  }
  return 1
}

export function toneAdjustedHue(hue: number, tone: number) {
  const normalized = normalizeHue(hue)
  if (normalized < 40 || normalized >= 70 || tone >= 50) {
    return normalized
  }
  const darkening = clamp((50 - tone) / 40, 0, 1)
  return normalizeHue(normalized - 8 * Math.sqrt(darkening))
}

export function toneChromaEnvelope(tone: number) {
  const normalized = clamp(tone / 100, 0, 1)
  return 0.18 + 0.82 * Math.sqrt(Math.max(0, Math.sin(Math.PI * normalized)))
}

export function vibrancyMultiplier(vibrancy: number) {
  if (!Number.isFinite(vibrancy) || vibrancy < 0 || vibrancy > 100) {
    throw new Error('Vibrancy must be a number from 0 to 100.')
  }
  if (vibrancy <= 25) {
    return (vibrancy / 25) * 0.72
  }
  if (vibrancy <= 50) {
    return 0.72 + ((vibrancy - 25) / 25) * 0.28
  }
  return 1 + (vibrancy - 50) * 0.0096
}

/**
 * A family's chroma drawn toward the shared one, so its families sit
 * together. As v2 shares a narrow stop's gamut it is never raised above the
 * seed's own, so a dusty seed stays dusty in its pale stops.
 */
export function coordinatedChroma(
  sourceChroma: number,
  recipe: PaletteRecipe = PALETTE_RECIPE,
) {
  const drawn = sourceChroma * 0.35 + 0.18 * 0.65
  return recipe === PALETTE_RECIPE_V2 ? Math.min(sourceChroma, drawn) : drawn
}

/**
 * How narrow a stop's gamut is for v2 to share it: the most vivid seed at
 * the default vibrancy asks this many times what the stop holds. From the
 * first the stop starts to share its gamut in proportion; from the second
 * it shares it wholly.
 */
export const V2_SHARED_FROM = 1.3
/** v2 shares only stops lighter than this tone: the pale side of a ramp. */
export const V2_SHARED_ABOVE = 50
export const V2_SHARED_FULL = 2

/**
 * The share of its chroma a v2 gray family keeps at a lightness. It keeps
 * all of it up to GRAY_FADE_FROM. Above that the share falls linearly to
 * GRAY_FADE_LEAST at GRAY_FADE_TO, as gray scales fade their tint toward
 * white: a slate's palest grays keep about a sixth of its color.
 * @param lightness OKLab lightness
 */
export function grayFade(lightness: number) {
  const t = clamp(
    (lightness - GRAY_FADE_FROM) / (GRAY_FADE_TO - GRAY_FADE_FROM),
    0,
    1,
  )
  return 1 - (1 - GRAY_FADE_LEAST) * t
}
export const GRAY_FADE_FROM = 0.7
export const GRAY_FADE_TO = 0.97
export const GRAY_FADE_LEAST = 0.28

/** The chroma of the most vivid seed sRGB holds, as v2 coordinates it. */
export const MOST_VIVID_CHROMA = coordinatedChroma(0.32, PALETTE_RECIPE_V2)

export function colorToPolar(color: string): PolarColor {
  const value = hexToOklch(color)
  return { lightness: value.L, chroma: value.C, hue: value.H }
}

export function neutralPolar(profile: string, seed: string): PolarColor {
  if (profile === 'custom') {
    return colorToPolar(seed)
  }
  const hue = profile === 'warm-v1' ? 75 : profile === 'cool-v1' ? 250 : 0
  if (!['neutral-v1', 'warm-v1', 'cool-v1'].includes(profile)) {
    throw new Error(`Unknown neutral profile: ${profile}`)
  }
  return {
    lightness: 0.5,
    chroma: profile === 'neutral-v1' ? 0 : 0.018,
    hue,
  }
}

export function anchorPolarAtStop(
  seed: PolarColor,
  anchors: TonalPaletteAnchor[],
  stop: number,
): PolarColor {
  if (anchors.length === 0) {
    return seed
  }
  const sorted = [...anchors].sort((a, b) => a.stop - b.stop)
  const lower = [...sorted].reverse().find(anchor => anchor.stop <= stop)
  const upper = sorted.find(anchor => anchor.stop >= stop)
  if (!lower || !upper || lower.stop === upper.stop) {
    return colorToPolar(normalizeColor((lower ?? upper ?? sorted[0]).color))
  }
  const start = colorToPolar(normalizeColor(lower.color))
  const end = colorToPolar(normalizeColor(upper.color))
  const amount = (stop - lower.stop) / (upper.stop - lower.stop)
  return {
    lightness: start.lightness + (end.lightness - start.lightness) * amount,
    chroma: start.chroma + (end.chroma - start.chroma) * amount,
    hue: interpolateHue(start.hue, end.hue, amount),
  }
}
