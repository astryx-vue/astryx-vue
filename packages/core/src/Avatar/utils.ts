import type { AvatarSize } from './types.js'

export function resolveSize(size: AvatarSize): number {
  if (typeof size === 'number') {
    return size
  }
  switch (size) {
    case 'xsm':
      return 20
    case 'sm':
      return 24
    case 'md':
      return 36
    case 'lg':
      return 48
    case 'xl':
      return 128
  }
}
