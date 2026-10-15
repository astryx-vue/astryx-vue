import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export interface FieldControlStateInput {
  disabled?: MaybeRefOrGetter<boolean | undefined>
  readOnly?: MaybeRefOrGetter<boolean | undefined>
  loading?: MaybeRefOrGetter<boolean | undefined>
}

export interface FieldControlState {
  /** 禁用优先于只读。禁用时控件变暗，并且不能聚焦到可操作的状态。 */
  isDisabled: ComputedRef<boolean>
  /** 只读保留当前值、焦点和表单提交，但不打开选择面，也不变暗。 */
  isReadOnly: ComputedRef<boolean>
  isLoading: ComputedRef<boolean>
  /** 可以打开选择面或切换选项。 */
  canActivate: ComputedRef<boolean>
}

/**
 * 选择器和复选列表共用的三种互斥状态。
 * 同时标成禁用和只读时，按禁用处理。
 */
export function useFieldControlState(input: FieldControlStateInput): FieldControlState {
  const isDisabled = computed(() => toValue(input.disabled) === true)
  const isReadOnly = computed(() => toValue(input.readOnly) === true && !isDisabled.value)
  const isLoading = computed(() => toValue(input.loading) === true)
  const canActivate = computed(() => !isDisabled.value && !isReadOnly.value)
  return { isDisabled, isReadOnly, isLoading, canActivate }
}
