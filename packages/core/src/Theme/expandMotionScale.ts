/**
 * Duration scale. `min` is `base × ratio`, `max` is `base / ratio`,
 * both rounded to 5ms. `slow` is optional. `easing` sets `--ease-standard`.
 */
export interface MotionScaleConfig {
  /** Micro-interactions, in ms. */
  fast: number
  /** Enter and exit, in ms. */
  medium: number
  /** Continuous motion, in ms. */
  slow?: number
  /**
   * Neighbor ratio. Typical range is 0.65–0.85.
   * Neutral uses 0.75.
   */
  ratio: number
  /** Optional `--ease-standard` curve. */
  easing?: string
}

export type MotionScaleTokens = Record<string, string>

function assertMotion(config: MotionScaleConfig): void {
  for (const [label, value] of [
    ['fast', config.fast],
    ['medium', config.medium],
    ['slow', config.slow],
  ] as const) {
    if (value == null)
      continue
    if (!Number.isFinite(value) || value < 0)
      throw new Error(`Theme motion ${label} must be a non-negative number of milliseconds.`)
  }
  if (!Number.isFinite(config.ratio) || config.ratio <= 0 || config.ratio > 1)
    throw new Error('Theme motion ratio must be greater than 0 and at most 1.')
  if (config.easing != null && /[;{}<>\n\r]/.test(config.easing))
    throw new Error('Theme motion easing has an unsupported value.')
}

function roundMs(ms: number): number {
  return Math.round(ms / 5) * 5
}

/** `--duration-*` and an optional `--ease-standard`. */
export function expandMotionScale(config: MotionScaleConfig): MotionScaleTokens {
  assertMotion(config)
  const { fast, medium, slow, ratio, easing } = config
  const tokens: MotionScaleTokens = {
    '--duration-fast-min': `${roundMs(fast * ratio)}ms`,
    '--duration-fast': `${roundMs(fast)}ms`,
    '--duration-fast-max': `${roundMs(fast / ratio)}ms`,
    '--duration-medium-min': `${roundMs(medium * ratio)}ms`,
    '--duration-medium': `${roundMs(medium)}ms`,
    '--duration-medium-max': `${roundMs(medium / ratio)}ms`,
  }
  if (slow != null) {
    tokens['--duration-slow-min'] = `${roundMs(slow * ratio)}ms`
    tokens['--duration-slow'] = `${roundMs(slow)}ms`
    tokens['--duration-slow-max'] = `${roundMs(slow / ratio)}ms`
  }
  if (easing)
    tokens['--ease-standard'] = easing
  return tokens
}
