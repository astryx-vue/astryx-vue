export type LinkColor = 'primary' | 'secondary' | 'accent' | 'inherit'

export interface LinkProps {
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
   * Tooltip text shown on hover and keyboard focus.
   */
  tooltip?: string
  /**
   * Whether the link stands alone, rather than sitting inside body text.
   * Applies body font size and line height.
   * @default false
   */
  isStandalone?: boolean
}
