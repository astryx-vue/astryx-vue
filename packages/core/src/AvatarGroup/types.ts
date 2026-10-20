import type { AvatarShape, AvatarSize } from '../Avatar/types.js'

export interface AvatarGroupProps {
  /**
   * Size applied to all avatars in the group.
   * @default 'md'
   */
  size?: AvatarSize
  /**
   * Shape applied to all avatars in the group.
   * @default 'circle'
   */
  shape?: AvatarShape
  /**
   * Accessible name for the group.
   * @default 'Avatar group'
   */
  label?: string
}

export interface AvatarGroupOverflowProps {
  /**
   * 藏起来的头像数量。显示成 `+N`（传负数时按 0 算），读屏名也用它拼。
   */
  count: number
}

export interface AvatarGroupOverflowEmits {
  /** 点这个溢出标记时触发。 */
  click: [event: MouseEvent]
}

export interface AvatarGroupOverflowSlots {
  /**
   * 自定义的计数文字，例如 `12+`。不写就用 `+N`。
   *
   * 文字短时标记是个圆，文字变长会长成胶囊：宽度会长，高度不变。
   */
  default?: () => unknown
}
