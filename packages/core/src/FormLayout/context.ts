import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

export type FormLayoutDirection = 'vertical' | 'horizontal' | 'horizontal-labels'
export type FormOptionality = 'optional' | 'required'
/**
 * 打字被拒时什么时候亮出来。`complete`：打成一个完整的日期就亮（读不懂的文字仍等 Enter 或失焦）；
 * `blur-or-enter`：打字时什么都不亮，Enter 或失焦时才亮。
 */
export type EntryErrorBehavior = 'complete' | 'blur-or-enter'

export interface FormLayoutContextValue {
  direction: FormLayoutDirection
  defaultOptionality?: FormOptionality
  /** 表单里日期字段默认的 `entryErrorBehavior`。 */
  defaultEntryErrorBehavior?: EntryErrorBehavior
}

const NO_FORM_LAYOUT = computed<FormLayoutContextValue | null>(() => null)

export const formLayoutKey = defineLayerScopedKey('astryx-form-layout', NO_FORM_LAYOUT)

export function useFormLayout(): ComputedRef<FormLayoutContextValue | null> {
  return readLayerScoped(formLayoutKey)
}

/**
 * 没有 FormLayout 时保持原来的 aria-required。
 * 有默认必填时，没标 optional 的字段也要报必填，但不写原生 required。
 * 两个标记同时出现时，optional 优先。
 */
export function ariaRequired(
  isRequired: boolean | undefined,
  isOptional: boolean | undefined,
  optionality: FormOptionality | undefined,
): true | undefined {
  if (isOptional)
    return undefined
  if (optionality == null)
    return isRequired ? true : undefined
  if (optionality === 'required' || isRequired)
    return true
  return undefined
}

/** 字段自己的设置优先，其次最近的 FormLayout 默认值，都没有时是 `complete`。 */
export function useEntryErrorBehavior(own: () => EntryErrorBehavior | undefined): ComputedRef<EntryErrorBehavior> {
  const layout = useFormLayout()
  return computed(() => own() ?? layout.value?.defaultEntryErrorBehavior ?? 'complete')
}

export function useAriaRequired(props: { isRequired?: boolean, isOptional?: boolean }): ComputedRef<true | undefined> {
  const layout = useFormLayout()
  return computed(() => ariaRequired(props.isRequired, props.isOptional, layout.value?.defaultOptionality))
}

export function showsOptionalIndicator(
  isOptional: boolean | undefined,
  _isRequired: boolean | undefined,
  optionality: FormOptionality | undefined,
): boolean {
  return Boolean(isOptional) && optionality !== 'optional'
}

export function showsRequiredIndicator(
  isRequired: boolean | undefined,
  isOptional: boolean | undefined,
  optionality: FormOptionality | undefined,
): boolean {
  if (isOptional)
    return false
  return Boolean(isRequired) && optionality !== 'required'
}
