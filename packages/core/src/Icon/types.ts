import type { Component, VNodeChild } from 'vue'

/**
 * Icon sizes are expressed in `rem` so they scale with the root font-size.
 * Values are the px-equivalents at a 16px root: 12, 16, 20, and 24px.
 */
export type IconSize = 'xsm' | 'sm' | 'md' | 'lg'

export interface IconColorMap {
  accent: true
  blue: true
  cyan: true
  disabled: true
  error: true
  gray: true
  green: true
  inherit: true
  orange: true
  pink: true
  primary: true
  purple: true
  red: true
  secondary: true
  success: true
  teal: true
  tertiary: true
  warning: true
  yellow: true
}

export type IconColor = Extract<keyof IconColorMap, string>

/**
 * The semantic names of the artwork astryx-vue keeps for its own chrome.
 *
 * A name describes what the icon is for, not one particular drawing, so a theme
 * can replace the artwork with one declaration. Applications never pass these
 * names: the artwork is a library implementation detail, and a `icon` prop or
 * slot takes a CSS icon class or the application's own component instead.
 */
export type IconName
  = | 'chevronDown'
    | 'chevronLeft'
    | 'chevronRight'
    | 'check'
    | 'moreHorizontal'
    | 'copy'

/**
 * A built-in name, or any other string.
 *
 * The `(string & {})` intersection keeps the built-in names available for
 * autocomplete while allowing keys contributed by a component or application.
 */
export type ExtendedIconName = IconName | (string & {})

export interface IconProps {
  /**
   * The icon to render. Three forms are accepted:
   *
   * - a string, treated as a CSS icon class you provide — for example an
   *   UnoCSS icon such as `'i-carbon-search'`, or your own class;
   * - a name from the library's own chrome, which only the components use;
   * - a component, rendered as it is.
   *
   * Omit it when the default slot provides the artwork instead.
   */
  icon?: ExtendedIconName | Component
  /**
   * The color of the icon.
   *
   * `inherit` (the default) leaves the icon at the surrounding text color,
   * which is what you want for an icon next to a label. Use a semantic color
   * only when the color itself carries meaning.
   *
   * @default 'inherit'
   */
  color?: IconColor
  /**
   * The size of the icon.
   *
   * An explicit value wins. When omitted, Icon uses the nearest default
   * supplied by an owning astryx-vue component for its icon slot, then falls
   * back to `md`.
   */
  size?: IconSize
  /**
   * Accessible name for the icon.
   *
   * Set it only when the icon is meaningful on its own, such as a standalone
   * status glyph with no adjacent text. A non-empty `label` renders the icon as
   * `role="img"` with this string as `aria-label`; omitting it (or passing an
   * empty string) keeps the icon `aria-hidden="true"` as decoration.
   *
   * Do not set `label` when an interactive parent such as a button or a link
   * already names the control, or screen readers announce the name twice.
   */
  label?: string
}

export interface IconSlots {
  /**
   * The SVG markup to render. Use it instead of the `icon` prop when the
   * artwork is written inline.
   */
  default?: () => VNodeChild
}
