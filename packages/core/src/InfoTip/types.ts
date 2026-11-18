import type { IconSize } from '../Icon/types.js'

/**
 * 信息图标大小，和 Icon 的尺寸一一对应（xsm 12px、sm 16px、md 20px、lg 24px）。
 */
export type InfoTipSize = IconSize

export interface InfoTipProps {
  /** 按钮展开的帮助内容。简短的非交互文字；要放链接或按钮请用 HoverCard。需要富文本时改用 `content` 插槽。 */
  content?: string
  /**
   * 按钮的无障碍名称。
   * @default 译文 "More information"
   */
  label?: string
  /**
   * 信息图标大小。
   * @default 'sm'
   */
  size?: InfoTipSize
}
