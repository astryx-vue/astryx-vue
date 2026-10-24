import type { ComputedRef } from 'vue'
import type { AvatarShape, AvatarSize } from '../Avatar/types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

/**
 * Avatars read their sizing from the group, so these stay reactive refs
 * instead of plain values: a snapshot would freeze every avatar at the sizing
 * captured when the group was provided.
 */
export interface AvatarGroupContextValue {
  size: ComputedRef<AvatarSize>
  shape: ComputedRef<AvatarShape>
  overlap: ComputedRef<number>
}

export const AvatarGroupContext = defineLayerScopedKey<AvatarGroupContextValue | undefined>('AvatarGroupContext', undefined)
