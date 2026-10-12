import type { VNodeChild } from 'vue'
import type { SizeValue } from '../layout/size.js'
import type { SpacingStep } from '../Stack/types.js'
import type { LayoutHeight } from './context.js'

export type { LayoutHeight } from './context.js'

export interface LayoutProps {
  /**
   * 对齐内容的最大宽度。分隔线仍然拉满。
   * 数字是像素，字符串原样使用。百分比和内在宽度走约束宽度。
   */
  contentWidth?: SizeValue
  /**
   * fill 撑满容器，内容在中间滚动。auto 随内容长高。
   * @default 'fill'
   */
  height?: LayoutHeight
  /**
   * 这一层自己的外缘间距。不会传给嵌套的 Layout。
   */
  padding?: SpacingStep
  /**
   * 页眉和页脚没写 hasDivider 时用的默认值。
   */
  defaultHasDividers?: boolean
}

export interface LayoutSlots {
  default?: () => VNodeChild
  header?: () => VNodeChild
  start?: () => VNodeChild
  end?: () => VNodeChild
  footer?: () => VNodeChild
}

export interface LayoutHeaderProps {
  /** 底边分隔线。不传时用 Layout 的 defaultHasDividers，再没有就是 false。 */
  hasDivider?: boolean
  /** 高度。数字是像素，字符串原样使用。 */
  height?: SizeValue
  /** 内边距。0 表示内容自己管边距。 */
  padding?: SpacingStep
  /** 只改底边内边距，方便标签下划线和分隔线贴住。 */
  paddingBlockEnd?: SpacingStep
  label?: string
  role?: string
}

export interface LayoutHeaderSlots {
  default?: () => VNodeChild
}

export interface LayoutFooterProps {
  /** 顶边分隔线。不传时用 Layout 的 defaultHasDividers，再没有就是 false。 */
  hasDivider?: boolean
  height?: SizeValue
  padding?: SpacingStep
  label?: string
  role?: string
}

export interface LayoutFooterSlots {
  default?: () => VNodeChild
}

export interface LayoutContentProps {
  padding?: SpacingStep
  /**
   * 内容超出时在这块里滚动。
   * @default true
   */
  isScrollable?: boolean
  label?: string
  role?: string
}

export interface LayoutContentSlots {
  default?: () => VNodeChild
}

export interface LayoutResizable {
  _size: number
}

export interface LayoutPanelProps {
  /** 朝向内容的那条边。和旁边的 ResizeHandle 分隔线不要同时开。 @default false */
  hasDivider?: boolean
  padding?: SpacingStep
  /** @default true */
  isScrollable?: boolean
  label?: string
  role?: string
  /** 宽度。数字是像素。传了 resizable 时以钩子的尺寸为准。 */
  width?: SizeValue
  resizable?: LayoutResizable
}

export interface LayoutPanelSlots {
  default?: () => VNodeChild
}
