import { resolveLightDark } from '../Theme/colorMode.js'
import { resolveTokenReferences } from '../Theme/tokenReferences.js'

/**
 * 调色板按它来量的那套默认颜色：没有主题时 Astryx 的颜色令牌，写成 `light-dark()`
 * 和 `var()` 引用，名字用不带前缀的写法。`themePalette()` 拿它当底，
 * 选出来的灰阶、状态色文字都以它为准。
 */
export const colorDefaults: Readonly<Record<string, string>> = {
  // Core semantic
  '--color-accent': 'light-dark(#0064E0, #0171E3)',
  '--color-accent-muted': 'light-dark(#0082FB33, #0082FB3F)',
  '--color-on-accent': 'light-dark(#FFFFFF, #FFFFFF)',
  '--color-neutral':
    'light-dark(rgba(5, 54, 89, 0.1), rgba(223, 226, 229, 0.2))',
  '--color-background-surface': 'light-dark(#FFFFFF, #1F1F22)',
  '--color-background-body': 'light-dark(#F1F4F7, #111112)',
  '--color-overlay': 'light-dark(#01122866, #11111299)',
  '--color-overlay-hover': 'light-dark(#0536590C, #FFFFFF0C)',
  '--color-overlay-pressed': 'light-dark(#05365919, #FFFFFF19)',
  '--color-background-muted': 'light-dark(#0536590C, #1111127F)',

  // Text
  '--color-text-primary': 'light-dark(#0A1317, #DFE2E5)',
  // Secondary text also sits on translucent fills: the stock palette tints
  // (Card's `gray` variant, for one) and the `--color-neutral` fill (a
  // SegmentedControl track, AvatarGroup's overflow). They lift the page under
  // them, and these stops keep the text at 4.5:1 there.
  '--color-text-secondary': 'light-dark(#445564, #B0B5BB)',
  '--color-text-disabled': 'light-dark(#A4B0BC, #6F747C)',
  '--color-text-accent': 'light-dark(#0064E0, #3E9EFB)',
  '--color-on-dark': 'light-dark(#FFFFFF, #FFFFFF)',
  '--color-on-light': 'light-dark(#000000, #000000)',

  // Icon
  '--color-icon-accent': 'light-dark(#0064E0, #2694FE)',
  '--color-icon-primary': 'light-dark(#0A1317, #DFE2E5)',
  '--color-icon-secondary': 'light-dark(#4E606F, #AAAFB5)',
  '--color-icon-disabled': 'light-dark(#A4B0BC, #6F747C)',

  // Surface variants
  '--color-background-card': 'light-dark(#FFFFFF, #1F1F22)',
  '--color-background-popover': 'light-dark(#FFFFFF, #28292C)',
  '--color-background-inverted': 'light-dark(#0A1317, #FFFFFF)',
  '--color-background-error-inverted': 'light-dark(#AA071E, #E3193B)',

  // Status fills (architecture:theme-tokens INV11). Each `--color-<status>` is
  // the strong status fill, and `--color-on-<status>` is content on it at
  // 4.5:1 or more. `-muted` is the pale fill, with `--color-on-<status>-muted`.
  // Info is independent of the accent.
  '--color-info': 'light-dark(#0064E0, #0064E0)',
  '--color-info-muted': 'light-dark(#0082FB33, #0082FB3F)',
  '--color-on-info': 'light-dark(#FFFFFF, #FFFFFF)',
  '--color-success': 'light-dark(#0D8626, #0D8626)',
  '--color-success-muted': 'light-dark(#0B991F33, #0B991F3F)',
  '--color-on-success': 'light-dark(#FFFFFF, #FFFFFF)',
  '--color-error': 'light-dark(#E3193B, #F5394F)',
  '--color-error-muted': 'light-dark(#E3193B33, #F5394F3F)',
  // Dark error is light enough that white misses 4.5:1, so its content is dark.
  '--color-on-error': 'light-dark(#FFFFFF, #0A1317)',
  '--color-warning': 'light-dark(#E9AF08, #F2C00B)',
  '--color-warning-muted': 'light-dark(#E2A40033, #E2A4003F)',
  '--color-on-warning': 'light-dark(#0A1317, #0A1317)',

  // Status text on the default page and card surfaces, 4.5:1 or more.
  '--color-text-info': 'var(--color-text-blue)',
  '--color-text-success': 'var(--color-text-green)',
  '--color-text-warning': 'var(--color-text-yellow)',
  '--color-text-error': 'var(--color-text-red)',

  // Status icons and borders on those surfaces follow the text role.
  '--color-icon-info': 'var(--color-text-info)',
  '--color-icon-success': 'var(--color-text-success)',
  '--color-icon-warning': 'var(--color-text-warning)',
  '--color-icon-error': 'var(--color-text-error)',
  '--color-border-info': 'var(--color-text-info)',
  '--color-border-success': 'var(--color-text-success)',
  '--color-border-warning': 'var(--color-text-warning)',
  '--color-border-error': 'var(--color-text-error)',

  // Content on pale status fills.
  '--color-on-info-muted': 'var(--color-text-blue)',
  '--color-on-success-muted': 'var(--color-text-green)',
  '--color-on-warning-muted': 'var(--color-text-yellow)',
  '--color-on-error-muted': 'var(--color-text-red)',

  // Border
  '--color-border': 'light-dark(#05365919, #F2F4F619)',
  '--color-border-emphasized': 'light-dark(#CCD3DB, #494D53)',

  // Effects
  '--color-skeleton': 'light-dark(#CCD3DB, #5A5E66)',
  // "Channel on body" — slim affordances that need to read against body
  // luminance (ProgressBar tracks, Slider rails, Switch off-state). Default
  // is the same low-contrast surface as --color-skeleton; themes can
  // override per their neutral ramp if 1-D channels need more weight.
  '--color-track': 'light-dark(#CCD3DB, #5A5E66)',
  '--color-shadow': 'light-dark(rgba(5, 54, 89, 0.1), rgba(0, 0, 0, 0.3))',
  // Hover tint: black in light mode, white in dark mode - used with color-mix for hover states
  '--color-tint-hover': 'light-dark(black, white)',

  // Blue
  '--color-background-blue': 'light-dark(#0171E333, #0171E333)',
  '--color-border-blue': 'light-dark(#0064E0, #2694FE)', // Blue 650 / 500
  '--color-icon-blue': 'light-dark(#0064E0, #2694FE)',
  '--color-text-blue': 'light-dark(#042F97, #AFD7FF)',

  // Cyan
  '--color-background-cyan': 'light-dark(#03A7D733, #03A7D733)',
  '--color-border-cyan': 'light-dark(#089DD0, #0171A4)', // Cyan 500 / 650
  '--color-icon-cyan': 'light-dark(#00ACC1, #26C6DA)',
  '--color-text-cyan': 'light-dark(#014975, #A1EEF9)',

  // Gray
  '--color-background-gray': 'light-dark(#0A131733, #666A724C)',
  '--color-border-gray': 'light-dark(#647685, #748695)', // Gray 600 / 550
  '--color-icon-gray': 'light-dark(#4E606F, #AAAFB5)',
  '--color-text-gray': 'light-dark(#0A1317, #E7EAED)',

  // Green
  '--color-background-green': 'light-dark(#24BB5E33, #24BB5E33)',
  '--color-border-green': 'light-dark(#0D8626, #0B991F)', // Green 600 / 550
  '--color-icon-green': 'light-dark(#0D8626, #26A756)',
  '--color-text-green': 'light-dark(#09441F, #A5F690)',

  // Orange
  '--color-background-orange': 'light-dark(#F2790233, #F2790233)',
  '--color-border-orange': 'light-dark(#EB6E00, #B34A01)', // Orange 500 / 650
  '--color-icon-orange': 'light-dark(#E9690B, #FB8C00)',
  '--color-text-orange': 'light-dark(#6B2203, #FDB876)',

  // Pink
  '--color-background-pink': 'light-dark(#E638B333, #E638B333)',
  '--color-border-pink': 'light-dark(#F351C0, #C02294)', // Pink 500 / 650
  '--color-icon-pink': 'light-dark(#C2185B, #EC407A)',
  '--color-text-pink': 'light-dark(#650053, #FEADE3)',

  // Purple
  '--color-background-purple': 'light-dark(#7952FF33, #7952FF33)',
  '--color-border-purple': 'light-dark(#9081FF, #7340FE)', // Purple 500 / 650
  '--color-icon-purple': 'light-dark(#5B08D8, #7952FF)',
  '--color-text-purple': 'light-dark(#3E0697, #B3B0FE)',

  // Red
  '--color-background-red': 'light-dark(#E3193B33, #E3193B33)',
  '--color-border-red': 'light-dark(#E3193B, #F5394F)',
  '--color-icon-red': 'light-dark(#D31130, #E3193B)',
  '--color-text-red': 'light-dark(#7B0210, #FFB2B8)',

  // Teal
  '--color-background-teal': 'light-dark(#0DB7AF33, #0DB7AF33)',
  '--color-border-teal': 'light-dark(#08A3A3, #08767D)', // Teal 500 / 650
  '--color-icon-teal': 'light-dark(#009688, #26A69A)',
  '--color-text-teal': 'light-dark(#083943, #40DCCD)',

  // Yellow
  '--color-background-yellow': 'light-dark(#E2A40033, #E2A40033)',
  '--color-border-yellow': 'light-dark(#C58600, #B47700)', // Yellow 500 / 550
  '--color-icon-yellow': 'light-dark(#FBC02D, #FFEE58)',
  '--color-text-yellow': 'light-dark(#753F07, #FBCE03)',

  '--focus-outline-color': 'var(--color-accent)',
}

/** 某个模式下每个默认颜色的具体值，`light-dark()` 和 `var()` 都已展开。 */
export function resolveDefaultColors(mode: 'light' | 'dark'): Record<string, string> {
  const picked: Record<string, string> = {}
  for (const [token, value] of Object.entries(colorDefaults))
    picked[token] = resolveLightDark(value, mode)
  return resolveTokenReferences(picked)
}
