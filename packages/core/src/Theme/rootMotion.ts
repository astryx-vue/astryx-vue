/**
 * @file rootMotion.ts
 * @input A theme's own `motion` and the theme it extends
 * @output resolveRootMotion: the motion config the theme generates its tokens
 *   from, and the base tokens that stand for the scale fields it inherits
 * @position Theme utility; consumed by defineTheme.ts. Pure.
 *
 * Motion inherits field by field: a duration-scale field or knob the child
 * leaves unset keeps its base's value, so the child's motion tokens come from
 * the merged configuration. They resolve base first, then generated: what the
 * child generates replaces the base's tokens, its explicit ones included. A
 * child's motion regenerates only what it sets: an inherited slow band and an
 * inherited easing keep the base's tokens.
 */

import type { MotionScaleConfig } from './expandMotionScale.js'
import type { ThemeMotionConfig } from './themeMotion.js'
import { normalizeTokenName } from './tokenName.js'

/** The slow band's duration tokens. */
const SLOW_BAND = ['--duration-slow-min', '--duration-slow', '--duration-slow-max'] as const

interface MotionBase {
  readonly tokens: Readonly<Record<string, string>>
  readonly axes?: { readonly motion?: ThemeMotionConfig }
}

/**
 * The base's tokens for the duration-scale fields a child leaves unset: a
 * child that sets no `slow` of its own regenerates only the fast and medium
 * bands, so an inherited slow band stays as the base's tokens hold it, at the
 * ratio it was made with; and a child that sets no `easing` keeps the base's
 * `--ease-standard`, an explicit one included.
 */
function inheritedScaleTokens(
  base: MotionBase,
  baseMotion: ThemeMotionConfig,
  own: ThemeMotionConfig,
): Record<string, string> | undefined {
  const names = [
    ...('slow' in baseMotion && !('slow' in own) ? SLOW_BAND : []),
    ...('easing' in baseMotion && !('easing' in own) ? ['--ease-standard'] : []),
  ]
  const tokens: Record<string, string> = {}
  for (const name of names) {
    const value = base.tokens[normalizeTokenName(name)]
    if (value !== undefined)
      tokens[name] = value
  }
  return Object.keys(tokens).length > 0 ? tokens : undefined
}

/**
 * Refuses a duration scale that is missing `fast`, `medium` or `ratio` after
 * inheritance. The scale applies only when all three are present, so a partial
 * one beside a knob (`{ fast: 100, tempo: 1.2 }`) would otherwise be dropped
 * silently, though its fields win over `tempo`. Adaptation rules refuse the
 * same in `completeMotion`.
 */
function assertCompleteMotionScale(motion: ThemeMotionConfig, themeName: string): void {
  const scale = motion as Partial<MotionScaleConfig>
  const writesScale = scale.fast !== undefined || scale.medium !== undefined || scale.ratio !== undefined
    || scale.slow !== undefined || scale.easing !== undefined
  if (writesScale && (scale.fast === undefined || scale.medium === undefined || scale.ratio === undefined))
    throw new Error(`defineTheme("${themeName}"): \`motion\` sets a duration scale field, so it must supply \`fast\`, \`medium\`, and \`ratio\` unless each missing field is inherited from \`extends\`.`)
}

/** The motion a theme generates from, and the base tokens its inherited scale fields keep. */
export function resolveRootMotion(
  themeName: string,
  own: ThemeMotionConfig | undefined,
  base: MotionBase | undefined,
): { motion?: ThemeMotionConfig, inheritedTokens?: Record<string, string> } {
  if (own == null)
    return {}
  const baseMotion = base?.axes?.motion
  const motion = baseMotion != null ? { ...baseMotion, ...own } : own
  assertCompleteMotionScale(motion, themeName)
  const inheritedTokens = base != null && baseMotion != null ? inheritedScaleTokens(base, baseMotion, own) : undefined
  return { motion, ...(inheritedTokens ? { inheritedTokens } : {}) }
}
