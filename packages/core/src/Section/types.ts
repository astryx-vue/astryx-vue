import type { VNodeChild } from 'vue'
import type { PaddingInput, SizeValue } from '../Layout/size.js'

export type SectionVariant = 'section' | 'transparent' | 'muted'
export type SectionDivider = 'top' | 'bottom' | 'start' | 'end'

export interface SectionProps extends PaddingInput {
  /**
   * 背景。section 用表面色，muted 用弱化底，transparent 不铺底。
   * @default 'section'
   */
  variant?: SectionVariant
  /** 宽度。数字是像素，字符串原样使用。 */
  width?: SizeValue
  /** 高度。数字是像素，字符串原样使用。 */
  height?: SizeValue
  /** 最大宽度。数字是像素，字符串原样使用。 */
  maxWidth?: SizeValue
  /** 最小高度。数字是像素，字符串原样使用。 */
  minHeight?: SizeValue
  /** 哪些边画分隔线。start / end 随书写方向翻转。 */
  dividers?: SectionDivider[]
}

export interface SectionSlots {
  default?: () => VNodeChild
}
