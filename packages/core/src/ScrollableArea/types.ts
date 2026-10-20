import type { VNodeChild } from 'vue'
import type { ScrollAxis, ScrollOverscroll, ScrollRole, ScrollStickyContainment } from '../composables/useScrollableArea.js'
import type { PaddingInput, SizeValue } from '../Layout/size.js'

export interface ScrollableAreaProps extends PaddingInput {
  /** 允许滚动的逻辑轴。 @default 'block' */
  axis?: ScrollAxis
  /** 这块区域的无障碍名称。能滚动时它会进入 Tab 顺序。 */
  label: string
  /** @default 'group' */
  role?: ScrollRole
  /** 滚到边缘后手势要不要交给外层。 @default 'allow' */
  overscroll?: ScrollOverscroll
  width?: SizeValue
  height?: SizeValue
  maxWidth?: SizeValue
  minHeight?: SizeValue
  /** 内容没溢出时，要不要仍然挡住里面的 sticky。 @default 'whenScrollable' */
  stickyContainment?: ScrollStickyContainment
  /** 视口本身逃出父级内边距。内容的内边距不变。 @default false */
  isFullBleed?: boolean
  /**
   * 外层有 `ScrollbarsProvider` 时是否换成自绘滚动条。
   * 设为 `false` 时这块区域保留原生滚动条。
   * @default true
   */
  scrollbars?: boolean
}

export interface ScrollableAreaSlots {
  default?: () => VNodeChild
}
