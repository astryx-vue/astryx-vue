/** The 28px avatar column every comment row, reply, and event aligns to. */
export const AVATAR_SIZE = 'calc(var(--astryx-spacing-6, 24px) + var(--astryx-spacing-1, 4px))'

/**
 * A resolved thread's words step down to the secondary text color by remapping
 * the primary text token on their own elements (never on the actions).
 */
export const RESOLVED_TEXT_STYLE = {
  '--astryx-color-text-primary': 'var(--astryx-color-text-secondary)',
} as const
