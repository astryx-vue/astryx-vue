import type { ComputedRef } from 'vue'
import type { SelectorMessages } from '../locale/messages/selector.js'
import type { SelectorProps } from './types.js'
import { computed } from 'vue'

/** 调用方没给文案时，各处用内置文案补上。 */
export function useSelectorTexts(
  props: SelectorProps,
  messages: ComputedRef<{ selector: SelectorMessages }>,
): Record<'resolvedPlaceholder' | 'resolvedSearchPlaceholder' | 'resolvedClearLabel' | 'valueClearLabel' | 'resolvedEmptyText' | 'resolvedEmptySearchText', ComputedRef<string>> {
  const resolvedPlaceholder = computed(() => props.placeholder ?? messages.value.selector.placeholder)
  const resolvedSearchPlaceholder = computed(() => props.searchPlaceholder ?? messages.value.selector.search)
  const resolvedClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clear)
  /** 值上的清除按钮带着字段名，读屏能听出清的是哪一项。 */
  const valueClearLabel = computed(() => props.clearLabel ?? messages.value.selector.clearField(props.label))
  const resolvedEmptyText = computed(() => props.emptyText ?? messages.value.selector.empty)
  const resolvedEmptySearchText = computed(() => props.emptySearchText ?? messages.value.selector.emptySearch)
  return { resolvedPlaceholder, resolvedSearchPlaceholder, resolvedClearLabel, valueClearLabel, resolvedEmptyText, resolvedEmptySearchText }
}
