import type { ComputedRef } from 'vue'
import type { AstryxMessages } from '../locale/messages.js'
import type { MultiSelectorOptionData, MultiSelectorProps } from './types.js'
import { computed } from 'vue'
import { useOverflow } from '../composables/useOverflow.js'

export interface MultiSelectorDisplayHost {
  props: MultiSelectorProps
  selectedOptions: ComputedRef<MultiSelectorOptionData[]>
  messages: ComputedRef<Pick<AstryxMessages, 'multiSelector'>>
}

export interface MultiSelectorDisplay {
  overflow: ReturnType<typeof useOverflow>
  visibleBadgeCount: ComputedRef<number>
  hiddenBadgeCount: ComputedRef<number>
  measureMoreLabel: ComputedRef<string>
  labelText: ComputedRef<string>
  formattedValue: ComputedRef<string | undefined>
}

/** 触发器上已选项的展示：徽标折叠成 +N、逗号拼起来的文字、调用方自己格式化的文字。 */
export function useMultiSelectorDisplay(host: MultiSelectorDisplayHost): MultiSelectorDisplay {
  const { props, selectedOptions, messages } = host
  const badgeCount = computed(() => selectedOptions.value.length)
  const overflow = useOverflow(badgeCount, { gap: 4 })
  const visibleBadgeCount = computed(() => Math.min(overflow.visibleCount.value, props.maxBadges ?? 3, badgeCount.value))
  const hiddenBadgeCount = computed(() => Math.max(0, badgeCount.value - visibleBadgeCount.value))
  const measureMoreLabel = computed(() => messages.value.multiSelector.more(Math.max(hiddenBadgeCount.value, 1)))
  const labelText = computed(() => {
    const labels = selectedOptions.value.map(option => option.label)
    const shown = labels.slice(0, props.maxBadges)
    const extra = labels.length - shown.length
    if (shown.length === 0)
      return ''
    return extra > 0 ? `${shown.join(', ')} ${messages.value.multiSelector.more(extra)}` : shown.join(', ')
  })
  const formattedValue = computed(() => {
    if (selectedOptions.value.length === 0 || props.formatValue == null || props.triggerDisplay === 'badges')
      return undefined
    return props.formatValue(selectedOptions.value.map(option => ({ value: option.value, label: option.label })))
  })
  return { overflow, visibleBadgeCount, hiddenBadgeCount, measureMoreLabel, labelText, formattedValue }
}
