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
}

export type AvatarStatusDotVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error'

export interface AvatarStatusDotProps {
  /**
   * The visual variant of the status dot.
   * @default 'neutral'
   */
  variant?: AvatarStatusDotVariant
}
