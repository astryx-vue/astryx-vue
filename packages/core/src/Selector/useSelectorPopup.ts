import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { OptionActionGrid } from '../selectors/useOptionActionGrid.js'
import type { SelectorOption } from './types.js'
import { computed, ref, watch } from 'vue'
import { isOptionAction } from '../selectors/optionAction.js'
import { useOptionActionGrid } from '../selectors/useOptionActionGrid.js'
import { isImeKeyEvent } from '../utils/ime.js'

export interface UseSelectorPopupOptions {
  flatOptions: ComputedRef<readonly SelectorOption[]>
  filteredValues: ComputedRef<readonly { value: string | number }[]>
  listboxId: ComputedRef<string>
  listboxRef: Readonly<ShallowRef<HTMLElement | null>>
  isOpen: Ref<boolean>
  activeIndex: Ref<number>
  onListKeyDown: (event: KeyboardEvent) => void
  isReadOnly: () => boolean
  isSheet: () => boolean
  emitKeydown: (event: KeyboardEvent) => void
}

export interface SelectorPopup {
  gridMode: ComputedRef<boolean>
  actionGrid: OptionActionGrid
  popupKind: ComputedRef<'dialog' | 'grid' | 'listbox' | undefined>
  onTriggerKeyDown: (event: KeyboardEvent) => void
  onSearchKeyDown: (event: KeyboardEvent) => void
}

/** 选项操作把弹出层锁成网格，并拦下行末方向键。 */
export function useSelectorPopup(options: UseSelectorPopupOptions): SelectorPopup {
  const gridLatched = ref(false)
  watch(options.flatOptions, (list) => {
    if (list.some(option => isOptionAction(option.action)))
      gridLatched.value = true
  }, { immediate: true })
  const gridMode = computed(() => gridLatched.value)

  function optionDomId(index: number): string {
    return `${options.listboxId.value}-option-${index}`
  }

  function actionDomId(index: number): string {
    return `${options.listboxId.value}-action-${index}`
  }

  function rowHasAction(index: number): boolean {
    const value = options.filteredValues.value[index]?.value
    return isOptionAction(options.flatOptions.value.find(option => option.value === value)?.action)
  }

  const actionGrid = useOptionActionGrid({
    enabled: () => gridMode.value,
    isOpen: () => options.isOpen.value,
    activeIndex: options.activeIndex,
    rowHasAction,
    getListbox: () => options.listboxRef.value,
    optionId: optionDomId,
    actionId: actionDomId,
  })

  const popupKind = computed(() => {
    if (options.isReadOnly())
      return undefined
    if (options.isSheet())
      return 'dialog' as const
    return gridMode.value ? 'grid' as const : 'listbox' as const
  })

  function onTriggerKeyDown(event: KeyboardEvent): void {
    if (isImeKeyEvent(event)) {
      if (!event.defaultPrevented)
        options.emitKeydown(event)
      return
    }
    if (!actionGrid.onKeyDown(event))
      options.onListKeyDown(event)
    if (!event.defaultPrevented)
      options.emitKeydown(event)
  }

  function onSearchKeyDown(event: KeyboardEvent): void {
    if (isImeKeyEvent(event))
      return
    if (!actionGrid.onKeyDown(event))
      options.onListKeyDown(event)
  }

  return { gridMode, actionGrid, popupKind, onTriggerKeyDown, onSearchKeyDown }
}
