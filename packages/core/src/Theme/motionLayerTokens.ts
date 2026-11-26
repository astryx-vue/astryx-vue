/**
 * @file motionLayerTokens.ts
 * @input One theme layer's `motion` config and its explicit tokens (a root
 *   theme, or one adaptation rule's value)
 * @output completeMotion: an adaptation rule's motion completed from the
 *   theme's; motionLayerTokens: the motion tokens the layer generates, split into
 *   shared names and private properties; settleMotionTokens: the writes that
 *   follow the layer's explicit tokens
 * @position Theme utility; resolveThemeValues.ts calls both around the
 *   explicit tokens. Pure; safe on the server.
 */

import type { MotionScaleConfig } from './expandMotionScale.js'
import type { MotionCharacter, ThemeMotionKnobs } from './motionKnobs.js'
import type { ThemeMotionConfig } from './themeMotion.js'
import { easeDefaults } from './motionTokenDefaults.js'
import { expandThemeMotion, MOTION_TEMPO_PROPERTY, preTempoName } from './themeMotion.js'
import { normalizeTokenName } from './tokenName.js'

/** What lies beneath a layer that its motion writes depend on. */
export interface MotionLayerContext {
  /**
   * The motion character in effect beneath this layer, from a base theme or
   * the theme an adaptation rule belongs to, for a layer that sets none.
   */
  inheritedCharacter?: MotionCharacter
  /** The `--astryx-ease-standard` beneath the layer: a base theme's, or a rule's theme's. */
  standardBeneath?: string
}

function assertFinite(value: number, path: string): void {
  if (!Number.isFinite(value))
    throw new Error(`${path} must be a finite number.`)
}

/**
 * An adaptation rule's motion, completed from the theme's: the knobs it
 * leaves out are the theme's, and a rule that writes a duration scale, or
 * whose theme has one, completes `fast`, `medium` and `ratio` from it. A
 * rule with knobs only, over a theme with no scale, keeps knobs only.
 */
export function completeMotion(
  root: ThemeMotionConfig | undefined,
  rule: Partial<MotionScaleConfig> & ThemeMotionKnobs,
  path: string,
): ThemeMotionConfig {
  // Not a public field, but a plain-JS caller may still pass it.
  if ((rule as { reducedMotion?: unknown }).reducedMotion !== undefined)
    throw new Error(`${path}.reducedMotion is a theme-wide setting: set it on the theme's own motion, not in an adaptation rule.`)
  const tempo = rule.tempo ?? root?.tempo
  const character = rule.character ?? root?.character
  const knobs: ThemeMotionKnobs = {
    ...(tempo !== undefined ? { tempo } : {}),
    ...(character !== undefined ? { character } : {}),
  }
  if (knobs.tempo !== undefined)
    assertFinite(knobs.tempo, `${path}.tempo`)
  const rootScale: Partial<MotionScaleConfig> = root != null && 'fast' in root ? root : {}
  const writesScale = rule.fast !== undefined || rule.medium !== undefined || rule.ratio !== undefined
    || rule.slow !== undefined || rule.easing !== undefined
  if (!writesScale && rootScale.fast === undefined)
    return knobs
  const fast = rule.fast ?? rootScale.fast
  const medium = rule.medium ?? rootScale.medium
  const ratio = rule.ratio ?? rootScale.ratio
  if (fast === undefined || medium === undefined || ratio === undefined)
    throw new Error(`${path} must supply \`fast\`, \`medium\`, and \`ratio\` unless each missing field exists on the root theme's motion.`)
  assertFinite(fast, `${path}.fast`)
  assertFinite(medium, `${path}.medium`)
  assertFinite(ratio, `${path}.ratio`)
  const slow = rule.slow ?? rootScale.slow
  if (slow !== undefined)
    assertFinite(slow, `${path}.slow`)
  const easing = rule.easing ?? rootScale.easing
  return {
    fast,
    medium,
    ratio,
    ...(slow !== undefined ? { slow } : {}),
    ...(easing !== undefined ? { easing } : {}),
    ...knobs,
  }
}

const isPrivate = (name: string): boolean => name.startsWith('--_')

/**
 * The motion tokens one layer generates. Shared names are unprefixed
 * (`--duration-fast`), for the token map to prefix; private properties
 * (`--_astryx-*`) are written as named. A layer that writes durations also
 * writes the pre-tempo copies busy loops read, so an enclosing theme's tempo
 * copies never stand in for its own: without a tempo of its own, they are its
 * durations. Such a layer also writes a tempo of 1, so its springs keep the
 * pace of its durations inside a theme with a tempo.
 */
export function motionLayerTokens(config: ThemeMotionConfig | undefined): {
  shared: Record<string, string>
  private: Record<string, string>
} {
  const shared: Record<string, string> = {}
  const own: Record<string, string> = {}
  if (config == null)
    return { shared, private: own }
  const motion = expandThemeMotion(config)
  let writesDurations = false
  for (const [name, value] of Object.entries(motion)) {
    if (isPrivate(name)) {
      own[name] = value
      continue
    }
    shared[name] = value
    const preTempo = preTempoName(name)
    if (preTempo !== name) {
      writesDurations = true
      if (!(preTempo in motion))
        own[preTempo] = value
    }
  }
  if (writesDurations && !(MOTION_TEMPO_PROPERTY in motion))
    own[MOTION_TEMPO_PROPERTY] = '1'
  return { shared, private: own }
}

/**
 * The motion writes that follow a layer's explicit tokens, made on `tokens`
 * (the layer's prefixed token map). An explicit duration beats tempo, so a
 * busy loop reading the pre-tempo value reads it too. At `'standard'`,
 * `--ease-entrance` and `--ease-move` equal the resolved `--ease-standard`:
 * the layer's own, else the one beneath it. A layer that sets them itself, or
 * whose character, its own or the one it inherits, picks its own curve,
 * keeps them.
 */
export function settleMotionTokens(
  tokens: Record<string, string>,
  input: { readonly motion?: ThemeMotionConfig, readonly tokens?: Readonly<Record<string, unknown>> },
  context: MotionLayerContext = {},
): void {
  const explicit = new Set(Object.keys(input.tokens ?? {}).filter(name => input.tokens?.[name] != null).map(normalizeTokenName))
  for (const name of explicit) {
    const preTempo = preTempoName(name)
    if (preTempo !== name && tokens[name] !== undefined)
      tokens[preTempo] = tokens[name]
  }
  const ownCharacter = input.motion != null && 'character' in input.motion ? input.motion.character : undefined
  const character = ownCharacter ?? context.inheritedCharacter
  const standardName = normalizeTokenName('--ease-standard')
  if (
    ownCharacter === 'standard'
    || (explicit.has(standardName) && (character === undefined || character === 'standard'))
  ) {
    const standard = tokens[standardName] ?? context.standardBeneath ?? easeDefaults['--ease-standard']
    for (const name of ['--ease-entrance', '--ease-move'].map(normalizeTokenName)) {
      if (!explicit.has(name))
        tokens[name] = standard
    }
  }
}
