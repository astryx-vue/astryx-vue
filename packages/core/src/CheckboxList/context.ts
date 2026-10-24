import type { ComputedRef, Ref } from 'vue'
import { defineLayerScopedKey } from '../layer/scopedProvide.js'

export interface CheckboxListContext {
  values: Ref<string[] | undefined>
  toggle: (value: string, checked: boolean) => void
  isDisabled: ComputedRef<boolean>
  disabledReason: ComputedRef<string | undefined>
  isReadOnly: ComputedRef<boolean>
  loadingValues: ComputedRef<readonly string[]>
  size: ComputedRef<'sm' | 'md'>
}

export const checkboxListKey = defineLayerScopedKey<CheckboxListContext | undefined>('astryx-checkbox-list', undefined)
