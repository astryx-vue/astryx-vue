import type { ComputedRef } from 'vue'
import type { ButtonSize } from './types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupContextValue {
  isDisabled: ComputedRef<boolean>
  orientation: ComputedRef<ButtonGroupOrientation>
  size: ComputedRef<ButtonSize>
}

export const buttonGroupContextKey = defineLayerScopedKey<ButtonGroupContextValue | null>('astryx-button-group', null)
