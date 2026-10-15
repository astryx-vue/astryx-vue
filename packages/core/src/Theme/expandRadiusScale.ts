/**
 * Radius scale. `none` stays 0 and `full` stays 9999px.
 * The steps are inner ×1, element ×2, container ×3, page and chat ×7.
 */
export interface RadiusScaleConfig {
  /** Base unit in px. */
  base: number
  /** Multiplier for every step except none and full. 0 makes those corners square. */
  multiplier: number
}

export type RadiusScaleTokens = Record<string, string>

function assertRadius(config: RadiusScaleConfig): void {
  if (!Number.isFinite(config.base) || config.base < 0)
    throw new Error('Theme radius base must be a non-negative number of pixels.')
  if (!Number.isFinite(config.multiplier) || config.multiplier < 0)
    throw new Error('Theme radius multiplier must be a non-negative number.')
}

/** `--radius-*` tokens. Names are unprefixed; `defineTheme()` adds `--astryx-`. */
export function expandRadiusScale(config: RadiusScaleConfig): RadiusScaleTokens {
  assertRadius(config)
  const { base, multiplier } = config
  const step = (factor: number): string => `${Math.round(base * factor * multiplier)}px`
  return {
    '--radius-none': '0px',
    '--radius-inner': step(1),
    '--radius-element': step(2),
    '--radius-container': step(3),
    '--radius-page': step(7),
    '--radius-chat': step(7),
    '--radius-full': '9999px',
  }
}
