import type { Ref } from 'vue'
import { nextTick, onScopeDispose, ref, watch } from 'vue'
import { observeResize } from '../utils/sharedResizeObserver.js'

interface SelectedOverlayOptions {
  fieldRef: Readonly<Ref<HTMLElement | null>>
  listboxRef: Readonly<Ref<HTMLElement | null>>
  isOpen: Readonly<Ref<boolean>>
  position: Readonly<Ref<{ placement: string }>>
  value: () => unknown
  /** 没有搜索框、不是底部弹层、没指定位置时才生效。 */
  isEnabled: () => boolean
}

/**
 * 原版的下拉列表（没有搜索框、没指定位置时）把选中项盖在触发器上：
 * 列表上移，使选中项的顶边和字段顶边对齐；还没选值时贴着字段下沿、不留空隙。
 * 只在朝下展开时生效；空间不够翻到上方时按普通位置走。
 * 列表自己的尺寸变了（选项增减、异步加载）也重新量一次，选中项始终留在触发器上。
 */
export function useListboxOverlay(options: SelectedOverlayOptions): { overlayTop: Ref<number | null> } {
  const overlayTop = ref<number | null>(null)

  function syncOverlay(): void {
    const list = options.listboxRef.value
    const field = options.fieldRef.value
    if (!options.isEnabled() || !options.isOpen.value || !list || !field || options.position.value.placement !== 'below') {
      overlayTop.value = null
      return
    }
    const fieldRect = field.getBoundingClientRect()
    const selected = list.querySelector<HTMLElement>('.astryx-selector-option.is-selected')
    const raw = selected
      ? fieldRect.top - list.clientTop - (selected.offsetTop - list.scrollTop)
      : fieldRect.bottom
    const maxTop = window.innerHeight - list.offsetHeight - 8
    overlayTop.value = Math.max(8, Math.min(raw, Math.max(8, maxTop)))
  }

  watch([options.isOpen, options.position, options.value], () => {
    void nextTick(syncOverlay)
  }, { flush: 'post' })

  let stopObserving: (() => void) | undefined
  watch([options.isOpen, options.listboxRef], ([open, list]) => {
    stopObserving?.()
    stopObserving = undefined
    if (!open || !list)
      return
    // 注册时的第一次回调是合成的，打开时的测量已经在上面做过。
    let isInitial = true
    stopObserving = observeResize(list, () => {
      if (isInitial) {
        isInitial = false
        return
      }
      syncOverlay()
    })
  }, { flush: 'post' })
  onScopeDispose(() => stopObserving?.())

  return { overlayTop }
}
