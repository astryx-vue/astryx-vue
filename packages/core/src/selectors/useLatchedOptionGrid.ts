import type { ComputedRef, Ref } from 'vue'
import type { OptionActionGrid } from './useOptionActionGrid.js'
import { computed, ref, watch } from 'vue'
import { isOptionAction } from './optionAction.js'
import { useOptionActionGrid } from './useOptionActionGrid.js'

export interface LatchedOption {
  action?: unknown
}

export interface LatchedOptionGrid {
  gridMode: ComputedRef<boolean>
  actionGrid: OptionActionGrid
  popupKind: ComputedRef<'grid' | 'listbox'>
  optionId: (index: number) => string
  actionId: (index: number) => string
}

/** 一旦出现过带操作的条目，这次挂载里的菜单就保持两列网格。 */
export function useLatchedOptionGrid(options: {
  entries: () => readonly LatchedOption[]
  isOpen: () => boolean
  activeIndex: Ref<number>
  getListbox: () => HTMLElement | null
  listboxId: () => string
}): LatchedOptionGrid {
  const gridLatched = ref(false)
  watch(options.entries, (list) => {
    if (list.some(entry => isOptionAction(entry.action)))
      gridLatched.value = true
  }, { immediate: true })
  const gridMode = computed(() => gridLatched.value)

  function optionId(index: number): string {
    return `${options.listboxId()}-option-${index}`
  }

  function actionId(index: number): string {
    return `${options.listboxId()}-action-${index}`
  }

  function rowHasAction(index: number): boolean {
    return isOptionAction(options.entries()[index]?.action)
  }

  const actionGrid = useOptionActionGrid({
    enabled: () => gridMode.value,
    isOpen: options.isOpen,
    activeIndex: options.activeIndex,
    rowHasAction,
    getListbox: options.getListbox,
    optionId,
    actionId,
  })

  const popupKind = computed(() => gridMode.value ? 'grid' as const : 'listbox' as const)

  return { gridMode, actionGrid, popupKind, optionId, actionId }
}
