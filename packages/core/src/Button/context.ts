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

/**
 * 按钮是否画自己的触控热区。ButtonGroup、ToggleButtonGroup 提供 false：成员的热区由组统一画。
 * 输入框的清除按钮也提供 false，它用输入框自己的那一小圈。浮层里的按钮读到默认值 true，照样画自己的。
 */
export const buttonHitAreaContextKey = defineLayerScopedKey<boolean>('astryx-button-hit-area', true)
