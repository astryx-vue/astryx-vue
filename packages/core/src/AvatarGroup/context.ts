import type { InjectionKey } from 'vue'
import type { AvatarShape, AvatarSize } from '../Avatar/types.js'

export interface AvatarGroupContextValue {
  size: AvatarSize
  shape: AvatarShape
  overlap: number
}

export const AvatarGroupContext: InjectionKey<AvatarGroupContextValue> = Symbol('AvatarGroupContext')
