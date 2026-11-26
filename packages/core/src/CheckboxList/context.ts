import type { ComputedRef, Ref } from 'vue'
import type { RequiredGroup } from './requiredGroup.js'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export interface CheckboxListContext {
  values: Ref<string[] | undefined>
  toggle: (value: string, checked: boolean) => void
  isDisabled: ComputedRef<boolean>
  disabledReason: ComputedRef<string | undefined>
  isReadOnly: ComputedRef<boolean>
  loadingValues: ComputedRef<readonly string[]>
  size: ComputedRef<'sm' | 'md'>
  /** 必填的组：登记复选框，让第一个可用的框在没有勾选时带原生 required。 */
  requiredGroup: ComputedRef<RequiredGroup | undefined>
}

export const checkboxListKey = defineLayerScopedKey<CheckboxListContext | undefined>('astryx-checkbox-list', undefined)
