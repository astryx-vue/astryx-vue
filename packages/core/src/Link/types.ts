import type { Component } from 'vue'
import type { TextSize, TextWeight } from '../Text/types.js'

export type LinkColor = 'primary' | 'secondary' | 'accent' | 'inherit'
export type LinkSize = TextSize
export type LinkWeight = TextWeight

/** Custom root used instead of `<a>` when `href` is set. Pass `RouterLink` or another component that accepts `href` and `to`. */
export type LinkRoot = string | Component

export interface LinkProps {
  /**
   * Custom root used instead of `<a>` when `href` is set and the link is enabled.
   * The component receives `href` and `to`. Disabled links stay a plain anchor.
   */
  as?: LinkRoot
  /**
   * Accessible name. Set this when the visible content is not the name,
   * for example an icon-only link. It replaces the link text for assistive technology.
   */
  label?: string
  /**
   * Link destination URL.
   */
  href?: string
  /**
   * Whether the link opens in a new tab and shows an external indicator.
   * @default false
   */
  isExternalLink?: boolean
  /**
   * Screen-reader text after an external link. Defaults to the current locale.
   */
  newTabLabel?: string
  /**
   * Whether the link always shows an underline.
   * @default false
   */
  hasUnderline?: boolean
  /**
   * Text color.
   * @default 'accent'
   */
  color?: LinkColor
  /**
   * Whether the link is disabled.
   * @default false
   */
  isDisabled?: boolean
  /**
   * HTML target attribute.
   */
  target?: string
  /**
   * HTML rel attribute.
   */
  rel?: string
  /**
   * Causes the browser to download the linked URL.
   */
  download?: string | boolean
  /**
   * 链接的 referrer 策略，原样转成 `referrerpolicy` 属性。
   */
  referrerPolicy?: string
  /**
   * Tooltip text shown on hover and keyboard focus.
   */
  tooltip?: string
  /**
   * Whether the link stands alone, rather than sitting inside body text.
   * Applies body font size and line height.
   * @default false
   */
  isStandalone?: boolean
  /**
   * Font size. Uses the same steps as Text.
   */
  size?: LinkSize
  /**
   * Font weight. `normal` is the same as `regular`.
   */
  weight?: LinkWeight
  /**
   * Maximum lines before the label truncates. `0` does not truncate.
   * @default 0
   */
  maxLines?: number
}
