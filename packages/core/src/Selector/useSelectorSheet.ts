import type { ComputedRef, WritableComputedRef } from 'vue'
import type { AdaptivePresentation } from '../composables/internal/presentation.js'
import { computed } from 'vue'
import { useHeldPresentation } from '../layer/useHeldPresentation.js'

export interface SelectorSheet {
  /** 列表现在在底部弹层里：打开时选定，保持到弹层退场播完。 */
  isSheet: ComputedRef<boolean>
  /** 底部弹层的开关，关掉时收起列表。 */
  sheetOpen: WritableComputedRef<boolean>
  /** 锚定浮层是否打开。 */
  popoverOpen: ComputedRef<boolean>
  /** 接到 BottomSheet 的 `motionComplete` 上。 */
  onSheetMotionComplete: (motion: 'entering' | 'exiting') => void
}

/** Selector 和 MultiSelector 共用的呈现控制：浮层还是底部弹层（上游 useSelectorPresentation）。 */
export function useSelectorSheet(
  presentation: () => AdaptivePresentation,
  combobox: { isOpen: { value: boolean }, close: () => void },
): SelectorSheet {
  const { isSheet, settle } = useHeldPresentation(presentation, () => combobox.isOpen.value)
  const sheetOpen = computed({
    get: () => isSheet.value && combobox.isOpen.value,
    set: (open: boolean) => {
      if (!open && combobox.isOpen.value)
        combobox.close()
    },
  })
  return {
    isSheet,
    sheetOpen,
    popoverOpen: computed(() => combobox.isOpen.value && !isSheet.value),
    onSheetMotionComplete: (motion) => {
      if (motion === 'exiting')
        settle()
    },
  }
}
