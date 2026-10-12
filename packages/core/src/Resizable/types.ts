import type { VNodeChild } from 'vue'
import type { ResizableProps } from '../composables/useResizable.js'

export type ResizeDirection = 'horizontal' | 'vertical'
export type ResizePosition = 'inline' | 'overlay'
export type ResizePillPlacement = 'auto' | 'start' | 'end' | 'center'

export interface ResizeHandleProps {
  /** 拖拽方向。horizontal 改宽度，vertical 改高度。 @default 'horizontal' */
  direction?: ResizeDirection
  /** inline 占一格，overlay 贴在父级边缘。 @default 'inline' */
  position?: ResizePosition
  /** 面板在结束边时把拖拽方向反过来。 @default false */
  isReversed?: boolean
  /** @default false */
  isDisabled?: boolean
  /** 画出 1px 分隔线。线本身就是把手。 @default false */
  hasDivider?: boolean
  /** 静止时也显示握把。 @default true */
  isAlwaysVisible?: boolean
  /**
   * 握把相对分隔线的位置。auto 靠面板一侧，面板收到 0 时翻到另一侧。
   * @default 'auto'
   */
  pillPlacement?: ResizePillPlacement
  /** 分隔条的无障碍名称。不传时用当前语言的默认文案。 */
  label?: string
  resizable?: ResizableProps
}

export interface ResizeHandleSlots {
  default?: () => VNodeChild
}
