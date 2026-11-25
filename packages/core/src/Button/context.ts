import type { ComputedRef } from 'vue'
import type { ButtonSize } from './types.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export type ButtonGroupOrientation = 'horizontal' | 'vertical'

export interface ButtonGroupContextValue {
  isDisabled: ComputedRef<boolean>
  orientation: ComputedRef<ButtonGroupOrientation>
  size: ComputedRef<ButtonSize>
  /** 组在跟踪手指和笔的滑动（触屏为主的设备上）。为真时成员按钮带上组标记，由组来画高亮、松手执行。 */
  tracksPress?: ComputedRef<boolean>
}

export const buttonGroupContextKey = defineLayerScopedKey<ButtonGroupContextValue | null>('astryx-button-group', null)
