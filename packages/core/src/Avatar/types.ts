import type { LinkRoot } from '../Link/types.js'

export type AvatarNamedSize = 'xsm' | 'sm' | 'md' | 'lg' | 'xl'
export type AvatarNumericSize = 16 | 20 | 24 | 32 | 36 | 40 | 48 | 60 | 64 | 72 | 96 | 128 | 144 | 180
export type AvatarSize = AvatarNamedSize | AvatarNumericSize

export type AvatarShape = 'circle' | 'rounded' | 'square'

export interface AvatarProps {
  /**
   * Accessible label for the avatar.
   * Falls back to `name` when not provided.
   */
  alt?: string
  /**
   * Fallback image source used when the primary `src` fails to load.
   */
  fallbackSrc?: string
  /**
   * The user's name. Used for the accessible label and for generating initials
   * when no image is available.
   */
  name?: string
  /**
   * The size of the avatar. Can be a named size or a pixel value.
   * @default 'md'
   */
  size?: AvatarSize
  /**
   * The shape of the avatar.
   * @default 'circle'
   */
  shape?: AvatarShape
  /**
   * The primary image source for the avatar.
   */
  src?: string
  /**
   * When set, the avatar renders as a link.
   */
  href?: string
  /**
   * Custom link component used when `href` is set. Receives `href` and `to`.
   * Without `href`, the avatar stays a button or a span.
   */
  as?: LinkRoot
  /**
   * HTML target for the link. Only applies when `href` is set.
   */
  target?: string
  /**
   * HTML rel for the link. `noopener noreferrer` is added when `target` is `_blank`.
   */
  rel?: string
  /**
   * Hover and focus tooltip.
   *
   * `true` (default) shows `name`. A string shows that text instead. `false` turns the tooltip off.
   * @default true
   */
  tooltip?: boolean | string
}

/**
 * 状态点的语义变体。每个变体把颜色和形状绑在一起，不只靠颜色区分状态：
 * `success` 实心圆、`neutral` 空心环、`error` 圆点加一道减号。
 */
export type AvatarStatusDotVariantName = 'success' | 'neutral' | 'error'

/**
 * 状态点接受的变体名。`info` 和 `warning` 是旧名字，保留兼容：
 * `info` 按 `success` 画，`warning` 按 `error` 画。
 */
export type AvatarStatusDotVariant = AvatarStatusDotVariantName | 'info' | 'warning'

export interface AvatarStatusDotProps {
  /**
   * 状态点的语义变体。`success` 是实心圆，`neutral` 是空心环，`error` 是圆点加一道减号。
   * @default 'success'
   */
  variant?: AvatarStatusDotVariant
  /**
   * 状态的读屏名称，例如 `Online`。放进头像里时会并进头像自己的无障碍名称
   * （`Jane Doe, Online`）；单独使用时圆点自己带这个名字。
   */
  label?: string
}

export interface AvatarStatusDotSlots {
  /**
   * 圆点中间的图标。传了就顶掉自带的形状（实心 / 空心环 / 减号），
   * 小尺寸头像上放不下图标，此时不显示。
   */
  icon?: () => unknown
}
