import type { ComputedRef, InjectionKey } from 'vue'
import type { ButtonSize } from './types.js'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupContextValue {
  isDisabled: ComputedRef<boolean>
  orientation: ComputedRef<ButtonGroupOrientation>
  size: ComputedRef<ButtonSize>
}

export const buttonGroupContextKey: InjectionKey<ButtonGroupContextValue> = Symbol('astryx-button-group')
