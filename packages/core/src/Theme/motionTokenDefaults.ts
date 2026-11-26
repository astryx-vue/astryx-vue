/**
 * @file motionTokenDefaults.ts
 * @input Nothing: the values `@astryx-vue/themes` declares on `:root`
 * @output durationDefaults and easeDefaults, keyed by the theme vocabulary's
 *   unprefixed names, and their name types
 * @position Theme utility with no imports. The neutral theme stylesheet
 *   (`packages/themes/neutral/base.css`) declares these values as
 *   `--astryx-duration-*` and `--astryx-ease-*`; motionTokenDefaults.test.ts
 *   keeps the two equal. Motion tokens a theme generates (`tempo`,
 *   `character`) start from these values, and the motion foundation falls
 *   back to them where no stylesheet applies. Pure; safe on the server.
 */

export const durationDefaults = {
  '--duration-fast-min': '95ms',
  '--duration-fast': '125ms',
  '--duration-fast-max': '165ms',
  '--duration-medium-min': '225ms',
  '--duration-medium': '300ms',
  '--duration-medium-max': '400ms',
  '--duration-slow-min': '525ms',
  '--duration-slow': '700ms',
  '--duration-slow-max': '935ms',
  /** The standard dismissal duration. */
  '--duration-exit': 'var(--duration-fast)',
} as const

export type DurationVarName = keyof typeof durationDefaults

export const easeDefaults = {
  /** Decelerates: state changes. */
  '--ease-standard': 'cubic-bezier(0.24, 1, 0.4, 1)',
  /** Entrances. A theme's `character` sets it; at `'standard'` it equals `--ease-standard`. */
  '--ease-entrance': 'cubic-bezier(0.24, 1, 0.4, 1)',
  /** Moves on screen. A theme's `character` sets it; at `'standard'` it equals `--ease-standard`. */
  '--ease-move': 'cubic-bezier(0.24, 1, 0.4, 1)',
  /** Accelerates: things leaving. */
  '--ease-exit': 'cubic-bezier(0.3, 0, 0.6, 0.6)',
} as const

export type EaseVarName = keyof typeof easeDefaults
