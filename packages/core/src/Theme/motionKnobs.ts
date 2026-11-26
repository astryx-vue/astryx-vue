/**
 * @file motionKnobs.ts
 * @input A theme's motion knobs (`tempo`, `character`)
 * @output Their types and `resolveKnobs`, which fills in the defaults and
 *   clamps `tempo`. `reducedMotion` is not a public knob: every theme
 *   resolves to `'system'`
 * @position Theme utility with no imports: themeMotion.ts builds the motion
 *   tokens on it, and the motion foundation reads a theme's knobs through it.
 *   Pure; safe on the server.
 */

/** How lively a theme's motion feels. */
export type MotionCharacter = 'crisp' | 'standard' | 'expressive'

/**
 * Whose Reduce Motion setting a theme follows: `'system'`, each person's own,
 * or `'always'`, reduced for everyone. Internal: `resolveKnobs` resolves
 * every theme to `'system'`.
 */
export type ThemeReducedMotion = 'system' | 'always'

/** The motion knobs a theme sets. */
export interface ThemeMotionKnobs {
  /**
   * Scales every motion duration: 1 is the theme's own, 0.75 the quickest and
   * 1.5 the slowest (values outside are clamped). Default 1.
   */
  tempo?: number
  /**
   * `'crisp'` decelerates without overshoot, `'standard'` is the default,
   * `'expressive'` overshoots slightly on entrances and moves. Exits and
   * fades never overshoot. Default `'standard'`.
   */
  character?: MotionCharacter
}

/** The knobs with their defaults filled in and `tempo` clamped. */
export interface ResolvedMotionKnobs {
  readonly tempo: number
  readonly character: MotionCharacter
  readonly reducedMotion: ThemeReducedMotion
  /**
   * Whether the theme sets `tempo` itself. A duration scale alone implies a
   * tempo for its CSS durations only; the animator's springs stay at tempo 1
   * unless this is true.
   */
  readonly tempoIsSet: boolean
}

/** The range `tempo` is clamped to. */
export const TEMPO_RANGE = { min: 0.75, max: 1.5 } as const

const CHARACTERS: ReadonlyArray<MotionCharacter> = ['crisp', 'standard', 'expressive']

/** The knobs of `config`, defaults filled in, `tempo` clamped. */
export function resolveKnobs(config: ThemeMotionKnobs | undefined): ResolvedMotionKnobs {
  const given = config?.tempo
  const tempoIsSet = typeof given === 'number' && Number.isFinite(given)
  const tempo = tempoIsSet ? Math.min(TEMPO_RANGE.max, Math.max(TEMPO_RANGE.min, given)) : 1
  const character = config?.character != null && CHARACTERS.includes(config.character)
    ? config.character
    : 'standard'
  return { tempo, character, reducedMotion: 'system', tempoIsSet }
}
