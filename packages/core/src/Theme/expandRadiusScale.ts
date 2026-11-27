/**
 * Radius scale. `none` stays 0 and `full` stays 9999px.
 * The steps are inner ×1, element ×2, container ×3, page ×7. `--radius-chat`
 * is not on the scale: it follows `--radius-container`.
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
    '--radius-full': '9999px',
  }
}

/**
 * The chat radius a theme that sets `--astryx-radius-container` declares in
 * its own scope: `--astryx-radius-chat` follows the container radius, so a
 * nested theme with a different container reads its own. A theme that sets or
 * inherits a chat radius keeps it, and a theme with no container sets nothing.
 */
export function deriveChatRadius(tokens: Readonly<Record<string, string>>): Record<string, string> {
  if (tokens['--astryx-radius-container'] === undefined || tokens['--astryx-radius-chat'] !== undefined)
    return {}
  return { '--astryx-radius-chat': 'var(--astryx-radius-container)' }
}
