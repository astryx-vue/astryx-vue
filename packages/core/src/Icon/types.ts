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
 * Semantic names shared by the components.
 *
 * A name is the job, not one drawing. `defineTheme({ icons })` points the name
 * at an Iconify id, and every component that asks for that name follows.
 * `name` on Icon is still a direct Iconify id. `icon` accepts one of these
 * names, a CSS class, or a component.
 */
export type IconName
  = | 'close'
    | 'chevronDown'
    | 'chevronLeft'
    | 'chevronRight'
    | 'chevronsLeft'
    | 'chevronsRight'
    | 'check'
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'calendar'
    | 'clock'
    | 'externalLink'
    | 'menu'
    | 'moreHorizontal'
    | 'search'
    | 'upload'
    | 'arrowUp'
    | 'arrowDown'
    | 'arrowsUpDown'
    | 'funnel'
    | 'eyeSlash'
    | 'viewColumns'
    | 'copy'
    | 'checkDouble'
    | 'wrench'
    | 'stop'
    | 'microphone'
    | 'image'

/**
 * A built-in name, or any other string.
 *
 * The `(string & {})` intersection keeps the built-in names available for
 * autocomplete while allowing keys contributed by a component or application.
 */
export type ExtendedIconName = IconName | (string & {})

export interface IconProps {
  /**
   * Iconify icon to draw, as `collection:icon`.
   *
   * `carbon:settings` reads the `settings` icon from the Carbon collection.
   * `carbon-settings` is the same icon when that collection is registered.
   * The component does not ship the artwork: install `@iconify-json/carbon`
   * (or another collection) and register it with the `astryxIcons` Vite
   * plugin, or call `addIcon` / `addCollection`.
   *
   * With no `size`, the icon is `1em` square and uses `currentColor`, so it
   * follows the surrounding text and the sized slots on Button, IconButton,
   * and fields.
   */
  name?: string
  /**
   * The icon to render. Three forms are accepted:
   *
   * - a semantic name such as `search` or `close`. The nearest theme decides
   *   which Iconify icon that name draws. Until that icon is registered, the
   *   built-in glyph is used;
   * - a CSS icon class you provide, such as an UnoCSS class. The class paints
   *   the inside of the sized box, so a utility that sets `width`/`height:
   *   100%` fills the icon instead of replacing its size;
   * - a component, rendered as it is.
   *
   * Omit it when `name` or the default slot provides the artwork instead.
   * `name` wins when both are set.
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
   * An explicit value wins. When omitted, a `name` icon stays `1em` so it
   * scales with the text around it. Any other icon uses the nearest default
   * supplied by an owning astryx-vue component, then falls back to `md`.
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
