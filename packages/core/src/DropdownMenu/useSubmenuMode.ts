import type { ComputedRef } from 'vue'
import type { DropdownMenuSubMenuPresentation } from './types.js'
import type { MenuDrillIn } from './useMenuDrillIn.js'
import { computed } from 'vue'

export interface UseSubmenuModeOptions {
  presentation: ComputedRef<DropdownMenuSubMenuPresentation>
  drillIn: ComputedRef<MenuDrillIn | undefined>
  /** Stable id for this view on the root stack. */
  viewId: string
}

/**
 * Whether a submenu flies out beside its row or replaces the menu's rows.
 *
 * `adaptive` drills in only when the menu opened on a compact touch surface.
 * That choice is sampled by the root when the menu opens, so the panel does
 * not change shape while it is open.
 */
export function useSubmenuMode(options: UseSubmenuModeOptions): {
  isDrill: ComputedRef<boolean>
  isOnStack: ComputedRef<boolean>
  isTop: ComputedRef<boolean>
  openDrill: () => void
  closeDrill: () => boolean
} {
  const isDrill = computed(() => {
    const drill = options.drillIn.value
    if (drill == null || options.presentation.value === 'flyout')
      return false
    if (options.presentation.value === 'drill-in')
      return true
    return drill.isCompactTouch
  })

  const isOnStack = computed(() => options.drillIn.value?.viewStack.includes(options.viewId) === true)
  const isTop = computed(() => isOnStack.value && options.drillIn.value?.viewStack.at(-1) === options.viewId)

  function openDrill(): void {
    options.drillIn.value?.push(options.viewId)
  }

  /** Pop this view when it is the top of the stack. Returns whether it popped. */
  function closeDrill(): boolean {
    if (!isTop.value)
      return false
    options.drillIn.value?.pop()
    return true
  }

  return { closeDrill, isDrill, isOnStack, isTop, openDrill }
}
