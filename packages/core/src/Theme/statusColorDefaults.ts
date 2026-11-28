/**
 * Status color defaults, by upstream name.
 *
 * The CSS lives in `@astryx-vue/themes/neutral/base.css`, the default theme.
 * This is the same group for code that measures colors instead of painting
 * them: status-role derivation reads a fill or surface a custom theme leaves
 * unset from here. `statusColorDefaults.test.ts` keeps the two in sync.
 *
 * The table covers every color the derivation measures (surfaces, the light
 * and dark content colors, each status fill and pale fill) and the roles it
 * derives (content on the fill, status text, content on the pale fill).
 */
export const STATUS_COLOR_DEFAULTS = {
  '--color-background-surface': 'light-dark(#ffffff, #262626)',
  '--color-background-card': 'light-dark(#ffffff, #1b1b1b)',
  '--color-on-dark': '#ffffff',
  '--color-on-light': '#111111',

  '--color-info': 'light-dark(#0074e2, #6d9cfe)',
  '--color-info-muted': 'light-dark(#b9d7ff, #88bcff3D)',
  '--color-on-info': 'light-dark(#ffffff, #111111)',
  '--color-text-info': 'light-dark(#0067ce, #a1caff)',
  '--color-on-info-muted': 'light-dark(#003978, #a1caff)',

  '--color-success': 'light-dark(#198100, #64af4c)',
  '--color-success-muted': 'light-dark(#bce0bb, #90ca903d)',
  '--color-on-success': 'light-dark(#ffffff, #111111)',
  '--color-text-success': 'light-dark(#2f7d33, #90ca90)',
  '--color-on-success-muted': 'light-dark(#00490b, #90ca90)',

  '--color-warning': '#ffce2f',
  '--color-warning-muted': 'light-dark(#fae19e, #e2b6233d)',
  '--color-on-warning': '#111111',
  '--color-text-warning': 'light-dark(#836700, #eec448)',
  '--color-on-warning-muted': 'light-dark(#4b3900, #eec448)',

  '--color-error': 'light-dark(#c9303a, #ff705d)',
  '--color-error-muted': 'light-dark(#ffc4be, #ff98903d)',
  '--color-on-error': 'light-dark(#ffffff, #111111)',
  '--color-text-error': 'light-dark(#c0262c, #ffaea7)',
  '--color-on-error-muted': 'light-dark(#76000c, #ffaea7)',
} as const

export type StatusColorDefaultName = keyof typeof STATUS_COLOR_DEFAULTS
