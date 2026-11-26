import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import { readCompactTouch } from '../composables/internal/presentation.js'
import { useCompactDefinition } from '../Theme/compactDefinition.js'

/**
 * The view stack a menu root keeps so a submenu can replace the rows in place.
 *
 * Sampled once, when the menu opens, so the panel never changes shape under
 * the pointer. Closing forgets the stack and the next open starts at the root.
 */
export interface MenuDrillIn {
  isCompactTouch: boolean
  viewStack: readonly string[]
  host: HTMLElement | null
  push: (viewId: string) => void
  pop: () => void
}

export interface UseMenuDrillInReturn {
  drillIn: ComputedRef<MenuDrillIn>
  isDrilled: ComputedRef<boolean>
  host: Ref<HTMLElement | null>
}

const EMPTY_HOST: HTMLElement | null = null

/**
 * Drill-in state for one menu root.
 *
 * It reads the same compact-touch condition the root's `adaptive` presentation
 * uses (the active theme's compact definition: a coarse pointer, and a viewport
 * narrower than the theme's `md` point or shorter than 500px), so a submenu and
 * its menu agree on what "a phone" means.
 */
export function useMenuDrillIn(isOpen: Ref<boolean>): UseMenuDrillInReturn {
  const compact = useCompactDefinition()
  const isCompactTouch = ref(false)
  const viewStack = ref<string[]>([])
  const host = ref<HTMLElement | null>(EMPTY_HOST)

  watch(isOpen, (open) => {
    if (open) {
      isCompactTouch.value = readCompactTouch(compact.value)
      return
    }
    if (viewStack.value.length > 0)
      viewStack.value = []
  }, { immediate: true })

  function push(viewId: string): void {
    if (viewStack.value.includes(viewId))
      return
    viewStack.value = [...viewStack.value, viewId]
  }

  function pop(): void {
    if (viewStack.value.length === 0)
      return
    viewStack.value = viewStack.value.slice(0, -1)
  }

  const drillIn = computed<MenuDrillIn>(() => ({
    host: host.value,
    isCompactTouch: isCompactTouch.value,
    pop,
    push,
    viewStack: viewStack.value,
  }))

  const isDrilled = computed(() => viewStack.value.length > 0)

  return { drillIn, host, isDrilled }
}
