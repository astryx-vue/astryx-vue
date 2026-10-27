import type { IconSize } from '@astryx-vue/core'

/**
 * Size of the info icon. Maps 1:1 to core `Icon` sizes
 * (xsm: 12px, sm: 16px, md: 20px, lg: 24px).
 */
export type InfoTipSize = IconSize

export interface InfoTipProps {
  /**
   * Tooltip content as plain text. Use the `content` slot for rich content.
   */
  content?: string
  /**
   * Accessible name for the trigger button.
   * @default 'More information'
   */
  label?: string
  /**
   * Size of the info icon.
   * @default 'sm'
   */
  size?: InfoTipSize
}
