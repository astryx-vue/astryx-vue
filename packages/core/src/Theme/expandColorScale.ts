import { contrastRatio, parseColor } from './contrast.js'
import { hctToHex, hexToHct, hexWithAlpha, isHexColor, tonalPalette } from './hct.js'

/**
 * Palette seed for `defineTheme({ color })`.
 *
 * `accent` is one hex, or a light stop then a dark stop. Omit it to recolor
 * only the neutrals. `neutralStyle` is how much of the seed hue stays in
 * those neutrals. `high` contrast pulls text and borders further apart.
 */
export interface ColorScaleConfig {
  accent?: string | readonly [light: string, dark: string]
  /** @default 'cool' */
  neutralStyle?: 'warm' | 'cool' | 'neutral'
  /** @default 'standard' */
  contrast?: 'standard' | 'high'
}

export type ColorScaleTokens = Record<string, string>

const NEUTRAL_CHROMA: Record<string, number> = {
  warm: 7,
  cool: 5,
  neutral: 3,
}

const NEUTRAL_VARIANT_CHROMA: Record<string, number> = {
  warm: 10,
  cool: 8,
  neutral: 6,
}

/** Hue source when `accent` is omitted. Accent tokens themselves stay unset. */
const DEFAULT_ACCENT_SEED = '#0064E0'
const NON_TEXT_MIN_CONTRAST = 3

function lightDark(light: string, dark: string): string {
  return `light-dark(${light}, ${dark})`
}

function accentWithAlpha(alpha: number): string {
  return `color-mix(in srgb, var(--color-accent) ${alpha * 100}%, transparent)`
}

function ratio(foreground: string, background: string): number {
  const fg = parseColor(foreground)
  const bg = parseColor(background)
  if (!fg || !bg)
    return 1
  return contrastRatio(fg, bg)
}

/**
 * Walk tone until the color reaches `minRatio` against `background`.
 * Tone is Lab lightness, so each step moves luminance in one direction.
 */
export function ensureContrastTone(
  hue: number,
  chroma: number,
  startTone: number,
  step: -1 | 1,
  background: string,
  minRatio: number,
): string {
  let tone = startTone
  let hex = hctToHex({ hue, chroma, tone })
  while (ratio(hex, background) < minRatio && tone + step >= 0 && tone + step <= 100) {
    tone += step
    hex = hctToHex({ hue, chroma, tone })
  }
  return hex
}

function assertAccent(value: string, which: string): void {
  if (!isHexColor(value))
    throw new Error(`Theme color ${which} must be a hex color such as #0064E0.`)
}

function seedPair(accent: ColorScaleConfig['accent']): readonly [string, string] {
  if (accent == null)
    return [DEFAULT_ACCENT_SEED, DEFAULT_ACCENT_SEED]
  if (typeof accent === 'string') {
    assertAccent(accent, 'accent')
    return [accent, accent]
  }
  const [light, dark] = accent
  assertAccent(light, 'accent light stop')
  assertAccent(dark, 'accent dark stop')
  return [light, dark]
}

/**
 * Semantic color tokens derived from an accent.
 *
 * Status colors, chart colors, and on-dark / on-light stay out of this map.
 * `--color-accent-muted`, `--color-text-accent`, and `--color-icon-accent`
 * point at `var(--color-accent)`. `--color-on-accent` is baked from the seed,
 * because the contrast pick cannot be expressed as a CSS reference.
 *
 * Names are the upstream names. `defineTheme()` adds the `--astryx-` prefix.
 */
export function expandColorScale(config: ColorScaleConfig = {}): ColorScaleTokens {
  const { accent, neutralStyle = 'cool', contrast = 'standard' } = config
  const [lightAccent, darkAccent] = seedPair(accent)
  const lightSeed = hexToHct(lightAccent)
  const sameSeed = darkAccent.toLowerCase() === lightAccent.toLowerCase()
  const darkSeed = sameSeed ? lightSeed : hexToHct(darkAccent)
  const neutralChroma = NEUTRAL_CHROMA[neutralStyle] ?? 5
  const neutralVariantChroma = NEUTRAL_VARIANT_CHROMA[neutralStyle] ?? 8

  const accentLight = tonalPalette(lightSeed.hue, Math.max(lightSeed.chroma, 48))
  const neutralLight = tonalPalette(lightSeed.hue, neutralChroma)
  const neutralVariantLight = tonalPalette(lightSeed.hue, neutralVariantChroma)
  const accentDark = sameSeed ? accentLight : tonalPalette(darkSeed.hue, Math.max(darkSeed.chroma, 48))
  const neutralDark = sameSeed ? neutralLight : tonalPalette(darkSeed.hue, neutralChroma)
  const neutralVariantDark = sameSeed ? neutralVariantLight : tonalPalette(darkSeed.hue, neutralVariantChroma)

  const high = contrast === 'high'
  const textPrimaryLight = high ? 0 : 10
  const textPrimaryDark = high ? 99 : 90
  const textSecondaryLight = high ? 20 : 30
  const textSecondaryDark = high ? 80 : 70
  const borderAlpha = high ? 0.2 : 0.1
  const borderEmphasized = lightDark(
    ensureContrastTone(
      lightSeed.hue,
      neutralVariantChroma,
      high ? 50 : 70,
      -1,
      neutralLight[99] ?? '#FFFFFF',
      NON_TEXT_MIN_CONTRAST,
    ),
    ensureContrastTone(
      darkSeed.hue,
      neutralVariantChroma,
      high ? 50 : 30,
      1,
      neutralDark[10] ?? '#000000',
      NON_TEXT_MIN_CONTRAST,
    ),
  )

  return {
    ...(accent != null
      ? {
          '--color-accent': lightDark(accentLight[40] ?? '#000000', accentDark[80] ?? '#FFFFFF'),
          '--color-accent-muted': lightDark(accentWithAlpha(0.2), accentWithAlpha(0.25)),
          '--color-on-accent': lightDark(accentLight[100] ?? '#FFFFFF', accentDark[20] ?? '#000000'),
        }
      : {}),
    '--color-neutral': lightDark(hexWithAlpha(neutralLight[10] ?? '#000000', 0.1), hexWithAlpha(neutralDark[90] ?? '#FFFFFF', 0.2)),
    '--color-background-surface': lightDark(neutralLight[99] ?? '#FFFFFF', neutralDark[10] ?? '#000000'),
    '--color-background-body': lightDark(neutralLight[95] ?? '#FFFFFF', neutralDark[5] ?? '#000000'),
    '--color-overlay': lightDark(hexWithAlpha(neutralLight[10] ?? '#000000', 0.4), hexWithAlpha(neutralDark[10] ?? '#000000', 0.6)),
    '--color-overlay-hover': lightDark(hexWithAlpha(neutralLight[10] ?? '#000000', 0.05), hexWithAlpha(neutralDark[100] ?? '#FFFFFF', 0.05)),
    '--color-overlay-pressed': lightDark(hexWithAlpha(neutralLight[10] ?? '#000000', 0.1), hexWithAlpha(neutralDark[100] ?? '#FFFFFF', 0.1)),
    '--color-background-muted': lightDark(hexWithAlpha(neutralLight[10] ?? '#000000', 0.05), hexWithAlpha(neutralDark[10] ?? '#000000', 0.5)),
    '--color-text-primary': lightDark(neutralLight[textPrimaryLight] ?? '#000000', neutralDark[textPrimaryDark] ?? '#FFFFFF'),
    '--color-text-secondary': lightDark(neutralVariantLight[textSecondaryLight] ?? '#000000', neutralVariantDark[textSecondaryDark] ?? '#FFFFFF'),
    '--color-text-disabled': lightDark(neutralVariantLight[60] ?? '#000000', neutralVariantDark[40] ?? '#FFFFFF'),
    '--color-text-accent': 'var(--color-accent)',
    '--color-icon-accent': 'var(--color-accent)',
    '--color-icon-primary': lightDark(neutralLight[textPrimaryLight] ?? '#000000', neutralDark[textPrimaryDark] ?? '#FFFFFF'),
    '--color-icon-secondary': lightDark(neutralVariantLight[textSecondaryLight] ?? '#000000', neutralVariantDark[textSecondaryDark] ?? '#FFFFFF'),
    '--color-icon-disabled': lightDark(neutralVariantLight[60] ?? '#000000', neutralVariantDark[40] ?? '#FFFFFF'),
    '--color-background-card': lightDark(neutralLight[99] ?? '#FFFFFF', neutralDark[10] ?? '#000000'),
    '--color-background-popover': lightDark(neutralLight[99] ?? '#FFFFFF', neutralDark[20] ?? '#000000'),
    '--color-background-inverted': lightDark(neutralLight[10] ?? '#000000', neutralDark[99] ?? '#FFFFFF'),
    '--color-border': lightDark(hexWithAlpha(neutralLight[10] ?? '#000000', borderAlpha), hexWithAlpha(neutralDark[95] ?? '#FFFFFF', borderAlpha)),
    '--color-border-emphasized': borderEmphasized,
    '--color-skeleton': lightDark(neutralVariantLight[70] ?? '#000000', neutralVariantDark[30] ?? '#FFFFFF'),
    '--color-track': lightDark(neutralVariantLight[70] ?? '#000000', neutralVariantDark[30] ?? '#FFFFFF'),
    '--color-shadow': lightDark(hexWithAlpha(neutralLight[0] ?? '#000000', 0.1), hexWithAlpha(neutralDark[0] ?? '#000000', 0.3)),
    '--color-tint-hover': lightDark('black', 'white'),
  }
}
