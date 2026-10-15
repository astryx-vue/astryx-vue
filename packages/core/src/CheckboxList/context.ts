import type { ComputedRef, InjectionKey, Ref } from 'vue'

export interface CheckboxListContext {
  values: Ref<string[] | undefined>
  toggle: (value: string, checked: boolean) => void
  isDisabled: ComputedRef<boolean>
  disabledReason: ComputedRef<string | undefined>
  isReadOnly: ComputedRef<boolean>
  loadingValues: ComputedRef<readonly string[]>
  size: ComputedRef<'sm' | 'md'>
}

export const checkboxListKey: InjectionKey<CheckboxListContext> = Symbol('astryx-checkbox-list')
