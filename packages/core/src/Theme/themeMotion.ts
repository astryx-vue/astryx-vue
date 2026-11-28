/**
 * @file themeMotion.ts
 * @input A theme's motion configuration: the knobs (`tempo`, `character`),
 *   a `MotionScaleConfig`, or both
 * @output The resolved knobs, the motion tokens they generate, and
 *   `resolveThemeMotion`, the internal resolver the motion foundation and
 *   server code read
 * @position Theme utility; consumed by resolveThemeValues.ts and
 *   adaptations.ts. Pure: no DOM, no import-time work, safe on the server.
 *
 * `tempo` scales every motion duration token, clamped to 0.75–1.5.
 * `character` picks the entrance and move curves. Every theme follows each
 * person's Reduce Motion setting (`reducedMotion` resolves to `'system'`).
 * The animator's springs follow `tempo` (motion/themeTempo.ts), but not
 * `character`. With the defaults (tempo 1, `'standard'`) every token keeps
 * the value `@astryx-vue/themes` declares (motionTokenDefaults.ts).
 *
 * A `MotionScaleConfig` keeps generating its duration tokens, and its fields
 * win over `tempo`; explicit `tokens` win over both in resolveThemeValues.
 * Generated names are the unprefixed vocabulary (`--duration-fast`), which
 * resolveThemeValues writes with the `--astryx-` prefix; the private
 * properties (`--_astryx-*`) are written as named.
 */

import type { MotionScaleConfig } from './expandMotionScale.js'
import type { MotionCharacter, ResolvedMotionKnobs, ThemeMotionKnobs } from './motionKnobs.js'
import { expandMotionScale } from './expandMotionScale.js'
import { resolveKnobs } from './motionKnobs.js'
import { durationDefaults, easeDefaults } from './motionTokenDefaults.js'
import { normalizeTokenName, prefixTokenReferences } from './tokenName.js'
import { resolveTokenReferences } from './tokenReferences.js'

export { TEMPO_RANGE } from './motionKnobs.js'
export type { MotionCharacter, ResolvedMotionKnobs, ThemeMotionKnobs, ThemeReducedMotion } from './motionKnobs.js'

/**
 * A theme's `motion`: the knobs, a `MotionScaleConfig`, or both. A
 * `MotionScaleConfig`'s fields win over `tempo` for the durations they set.
 */
export type ThemeMotionConfig = ThemeMotionKnobs | (MotionScaleConfig & ThemeMotionKnobs)

/**
 * The entrance and move curve at each character. `'standard'` is the theme's
 * `--ease-standard`, so a theme that overrides that easing keeps its entrances
 * on it.
 */
export const CHARACTER_EASE = {
  crisp: 'cubic-bezier(0, 0, 0.2, 1)',
  standard: null,
  expressive: 'cubic-bezier(0.3, 1.2, 0.5, 1)',
} as const satisfies Record<MotionCharacter, string | null>

/** The knobs of `config`, defaults filled in, `tempo` clamped. */
export function resolveMotionKnobs(config: ThemeMotionConfig | undefined): ResolvedMotionKnobs {
  return resolveKnobs(config)
}

export function isScaleConfig(config: ThemeMotionConfig): config is MotionScaleConfig & ThemeMotionKnobs {
  return 'fast' in config && 'medium' in config && 'ratio' in config
}

/**
 * The private custom property a theme with a `tempo` writes beside its
 * duration tokens. A layer whose durations come from a duration scale alone
 * writes 1. The animator's springs read it (motion/themeTempo.ts), and so can
 * a style that scales a clock of its own.
 */
export const MOTION_TEMPO_PROPERTY = '--_astryx-motion-tempo'

/**
 * A reference such as `--duration-exit` follows the token it names, so tempo
 * writes no value for it.
 */
const TIMED_DURATION_DEFAULTS = Object.entries(durationDefaults).filter(([, value]) => !value.startsWith('var('))

/** The duration tokens at `tempo`: the declared values times it, to the ms. */
export function durationTokensAt(tempo: number): Record<string, string> {
  const tokens: Record<string, string> = {}
  for (const [name, value] of TIMED_DURATION_DEFAULTS)
    tokens[name] = `${Math.round(Number.parseFloat(value) * tempo)}ms`
  return tokens
}

/**
 * The private custom property holding a duration token's value before
 * `tempo` scaled it (`--duration-slow` → `--_astryx-pre-tempo-duration-slow`).
 * Busy loops read it, falling back to the token, so their timing follows a
 * duration scale or an explicit token but never `tempo`. A name that is not a
 * duration token comes back unchanged.
 */
export function preTempoName(token: string): string {
  return token.replace(/^--(?:astryx-)?duration-/, '--_astryx-pre-tempo-duration-')
}

/**
 * The motion tokens `config` generates: `--duration-*` times `tempo`, with a
 * `MotionScaleConfig`'s own durations winning, and the job-named
 * `--ease-entrance` and `--ease-move` at the theme's character. A knob the
 * config leaves out writes nothing, so a theme extending another keeps the
 * base's value for it; a knob it sets is written even at its default, so a
 * child can set a base's tempo back to 1.
 */
export function expandThemeMotion(config: ThemeMotionConfig): Record<string, string> {
  const knobs = resolveMotionKnobs(config)
  const tokens: Record<string, string> = {}
  if (knobs.tempoIsSet) {
    Object.assign(tokens, durationTokensAt(knobs.tempo))
    for (const [name, value] of TIMED_DURATION_DEFAULTS)
      tokens[preTempoName(name)] = value
    tokens[MOTION_TEMPO_PROPERTY] = String(knobs.tempo)
  }
  const scaleEasing = isScaleConfig(config) && config.easing != null ? config.easing : null
  if (isScaleConfig(config)) {
    const scale = expandMotionScale(config)
    Object.assign(tokens, scale)
    if (knobs.tempoIsSet) {
      for (const [name, value] of Object.entries(scale)) {
        if (name.startsWith('--duration-'))
          tokens[preTempoName(name)] = value
      }
    }
  }
  const ease = CHARACTER_EASE[knobs.character]
    ?? (config.character != null ? (scaleEasing ?? easeDefaults['--ease-standard']) : scaleEasing)
  if (ease != null) {
    tokens['--ease-entrance'] = ease
    tokens['--ease-move'] = ease
  }
  return tokens
}

/** What `resolveThemeMotion` returns for a theme. */
export interface ThemeMotion {
  /** The knobs, defaults filled in. */
  readonly knobs: ResolvedMotionKnobs
  /** Every `--duration-*` token's value, by its unprefixed name. */
  readonly durations: Readonly<Record<string, string>>
  /** `--ease-standard`, `--ease-entrance` and `--ease-move`. */
  readonly easings: Readonly<Record<string, string>>
}

/**
 * A theme's motion values, for the motion foundation and for server code:
 * the knobs, and the duration and easing tokens they resolve to with the
 * theme's explicit tokens applied. A token written as a reference
 * (`var(--name)`) resolves through the theme's tokens. Pure: it reads only
 * `theme`, whose token names may carry the `--astryx-` prefix or not.
 */
export function resolveThemeMotion(theme: {
  readonly motion?: ThemeMotionConfig
  readonly axes?: { readonly motion?: ThemeMotionConfig }
  readonly tokens?: Readonly<Record<string, unknown>>
  readonly localTokens?: Readonly<Record<string, unknown>>
}): ThemeMotion {
  // A defined theme's motion is its axes': its own merged with its base's.
  const config = theme.axes?.motion ?? theme.motion
  const knobs = resolveMotionKnobs(config)
  const generated: Record<string, string> = {}
  for (const [name, value] of Object.entries(config ? expandThemeMotion(config) : {}))
    generated[normalizeTokenName(name)] = value
  // The graph the references resolve through, in prefixed names: the
  // defaults, the knobs' tokens, then the theme's own (a light/dark pair is
  // not a motion value, so only plain strings take part).
  const graph: Record<string, string> = {}
  for (const [name, value] of Object.entries({ ...durationDefaults, ...easeDefaults }))
    graph[normalizeTokenName(name)] = prefixTokenReferences(value)
  Object.assign(graph, generated)
  // A theme-local token keeps its exact name.
  for (const [name, value] of Object.entries(theme.localTokens ?? {})) {
    if (typeof value === 'string')
      graph[name] = prefixTokenReferences(value)
  }
  const own = new Set<string>()
  for (const [name, value] of Object.entries(theme.tokens ?? {})) {
    if (typeof value === 'string') {
      graph[normalizeTokenName(name)] = prefixTokenReferences(value)
      own.add(normalizeTokenName(name))
    }
  }
  const explicit = (name: string): boolean => own.has(normalizeTokenName(name)) || normalizeTokenName(name) in generated
  const resolved = resolveTokenReferences(graph)
  const read = (name: string): string => resolved[normalizeTokenName(name)] ?? ''
  const durations: Record<string, string> = {}
  for (const name of Object.keys(durationDefaults))
    durations[name] = read(name)
  const standard = read('--ease-standard')
  return {
    knobs,
    durations,
    easings: {
      '--ease-standard': standard,
      '--ease-entrance': explicit('--ease-entrance') ? read('--ease-entrance') : standard,
      '--ease-move': explicit('--ease-move') ? read('--ease-move') : standard,
    },
  }
}
