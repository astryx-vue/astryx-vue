import type { ComputedRef } from 'vue'
import type { ListWindowKey } from './listWindow.js'
import { computed, shallowRef, watch } from 'vue'
import { isFocusDetached } from '../focusReturn.js'

export interface UseListFocusIslandOptions {
  /** 能留作焦点岛的项：键到位置。 */
  keyIndices: () => ReadonlyMap<ListWindowKey, number>
  /** 正在窗口化时才记焦点。 */
  isActive: () => boolean
  /** 滚动视口：有焦点的项被删掉时，焦点落回这里。 */
  viewport: () => HTMLElement | null
}

export interface ListFocusIsland {
  /** 有焦点的那一项的位置，滚出窗口也继续挂载。 */
  focusIndex: ComputedRef<number | undefined>
  onItemFocus: (key: ListWindowKey) => void
  /** 焦点真正离开这一项时才调用。 */
  onItemBlur: () => void
}

/**
 * 窗口化共用的焦点岛：有焦点的那一项滚出窗口时仍然挂着，焦点不丢。
 * 这一项从数据里删掉了，焦点没处落，就交给滚动视口，不掉到页面最前面。
 */
export function useListFocusIsland(options: UseListFocusIslandOptions): ListFocusIsland {
  const focusedKey = shallowRef<ListWindowKey | undefined>()
  const focusIndex = computed(() => {
    if (!options.isActive() || focusedKey.value === undefined)
      return undefined
    return options.keyIndices().get(focusedKey.value)
  })

  watch(focusIndex, (index) => {
    if (focusedKey.value === undefined || index !== undefined || !options.isActive())
      return
    focusedKey.value = undefined
    const viewport = options.viewport()
    if (viewport != null && isFocusDetached(viewport.ownerDocument))
      viewport.focus({ preventScroll: true })
  }, { flush: 'post' })

  return {
    focusIndex,
    onItemFocus(key) {
      focusedKey.value = key
    },
    onItemBlur() {
      focusedKey.value = undefined
    },
  }
}
