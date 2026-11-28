/**
 * Aliases declared on `:root` are substituted there. A later override of the
 * semantic token does not flow through that already-substituted value, so the
 * alias has to be written again on the element that sets the semantic token.
 *
 * Card background and border are not aliases: Neutral paints them with its own
 * stops, and they follow the semantic token only when a theme sets one.
 */
const STATUSES = ['info', 'success', 'warning', 'error'] as const
const FIELD_STATUSES = ['success', 'warning', 'error'] as const

/**
 * Component tokens that Neutral points at a status role, so a theme that sets
 * or derives the role (see statusRoleDerivation.ts) recolors them too.
 */
function statusBridges(): Record<string, readonly string[]> {
  const bridges: Record<string, string[]> = {}
  const add = (source: string, ...targets: string[]): void => {
    (bridges[source] ??= []).push(...targets)
  }
  for (const s of STATUSES) {
    add(`--astryx-color-${s}`, `--astryx-badge-${s}-background`, `--astryx-avatar-status-dot-${s}-background`, `--astryx-progress-bar-${s}-fill`, `--astryx-status-dot-${s}-background`)
    add(`--astryx-color-on-${s}`, `--astryx-badge-${s}-foreground`)
    add(`--astryx-color-icon-${s}`, `--astryx-icon-${s}-foreground`)
  }
  for (const s of FIELD_STATUSES) {
    add(`--astryx-color-border-${s}`, `--astryx-input-${s}`)
    add(`--astryx-color-${s}-muted`, `--astryx-input-${s}-background`)
    add(`--astryx-color-on-${s}-muted`, `--astryx-input-${s}-foreground`)
  }
  add('--astryx-color-error-muted', '--astryx-button-destructive-background')
  add('--astryx-color-on-error-muted', '--astryx-button-destructive-foreground')
  add('--astryx-color-text-error', '--astryx-dropdown-menu-destructive-foreground', '--astryx-more-menu-destructive-foreground')
  return bridges
}

const COMPONENT_BRIDGES: Record<string, readonly string[]> = {
  ...statusBridges(),
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
