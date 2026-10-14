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
   * The number of hidden avatars to display as "+N".
   */
  count: number
}
