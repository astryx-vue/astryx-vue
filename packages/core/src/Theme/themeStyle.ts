/**
 * Aliases declared on `:root` are substituted there. A later override of the
 * semantic token does not flow through that already-substituted value, so the
 * alias has to be written again on the element that sets the semantic token.
 *
 * Card background and border are not aliases: Neutral paints them with its own
 * stops, and they follow the semantic token only when a theme sets one.
 */
const COMPONENT_BRIDGES: Record<string, readonly string[]> = {
  '--astryx-color-text-primary': [
    '--astryx-text-foreground',
    '--astryx-heading-foreground',
    '--astryx-button-secondary-foreground',
    '--astryx-button-ghost-foreground',
  ],
  '--astryx-color-text-secondary': ['--astryx-text-supporting-foreground'],
  '--astryx-color-accent': ['--astryx-button-primary-background', '--astryx-button-focus'],
  '--astryx-color-on-accent': ['--astryx-button-primary-foreground'],
  '--astryx-color-neutral': ['--astryx-button-secondary-background'],
  '--astryx-color-icon-primary': ['--astryx-icon-primary-foreground'],
  '--astryx-color-background-card': ['--astryx-card-background'],
  '--astryx-color-background-muted': ['--astryx-card-muted-background'],
  '--astryx-color-border': ['--astryx-card-border'],
}

/** Surfaces keep their own button treatment. Text aliases still follow onDark and onLight. */
const SURFACE_BRIDGES: Record<string, readonly string[]> = {
  '--astryx-color-text-primary': ['--astryx-text-foreground', '--astryx-heading-foreground'],
  '--astryx-color-text-secondary': ['--astryx-text-supporting-foreground'],
  '--astryx-color-background-card': ['--astryx-card-background'],
  '--astryx-color-background-muted': ['--astryx-card-muted-background'],
  '--astryx-color-border': ['--astryx-card-border'],
}

export function bridgeComponentTokens(
  tokens: Readonly<Record<string, string>>,
  bridges: Readonly<Record<string, readonly string[]>> = COMPONENT_BRIDGES,
): Record<string, string> {
  const style: Record<string, string> = { ...tokens }
  for (const [source, targets] of Object.entries(bridges)) {
    const value = tokens[source]
    if (!value)
      continue
    for (const target of targets)
      style[target] = value
  }
  return style
}

/**
 * Inline custom properties for an inverted media surface: the surface's
 * semantic tokens with their component aliases.
 */
export function bridgeSurfaceTokens(tokens: Readonly<Record<string, string>>): Record<string, string> {
  return bridgeComponentTokens(tokens, SURFACE_BRIDGES)
}
