import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject } from 'vue'

export type FormLayoutDirection = 'vertical' | 'horizontal' | 'horizontal-labels'
export type FormOptionality = 'optional' | 'required'

export interface FormLayoutContextValue {
  direction: FormLayoutDirection
  defaultOptionality?: FormOptionality
}

export const formLayoutKey: InjectionKey<ComputedRef<FormLayoutContextValue>> = Symbol('astryx-form-layout')

export function useFormLayout(): ComputedRef<FormLayoutContextValue | null> {
  return inject(formLayoutKey, computed(() => null))
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
