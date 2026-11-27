import type { Ref } from 'vue'
import type { LayerFocusRecord } from '../layer/layerFocusReturn.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { waitForTransition } from '../BottomSheet/sheetTransition.js'
import { holdEntranceInput } from '../layer/holdEntranceInput.js'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../layer/layerFocusReturn.js'
import { createModalOutletHandle } from '../layer/modalOutlet.js'
import { dispatchDrawerClose, hideDrawerHost, isDrawerHostOpen, showDrawerHost } from './drawerHost.js'

export interface DrawerPresenceOptions {
  dialog: Readonly<Ref<HTMLDialogElement | null>>
  isOpen: () => boolean
  isModal: () => boolean
  /** 打开时该拿到焦点的元素。 */
  initialFocus: () => HTMLElement | null
}

export interface DrawerPresence {
  /** 面板是否在画：打开期间，加上整段退场。 */
  isRendered: Ref<boolean>
  /** 是否在原生宿主（顶层）里。退场播完才离开。 */
  isHostOpen: Ref<boolean>
}

/**
 * 抽屉的出现与消失。
 *
 * 打开：记下打开者，进入宿主（模态对话框或 popover），把焦点放进去，手指在进场播完前点不到东西。
 * 关闭：等面板的 `transform` 退场过渡播完，再离开宿主、同一轮里停止绘制，然后把被困住的焦点还给打开者。
 * 先离开宿主再还焦点：模态对话框开着时页面其余部分不可交互，早还会落空。
 * 打开着就被卸载时同样离开宿主，等它离开文档后再还焦点。
 */
export function useDrawerPresence(options: DrawerPresenceOptions): DrawerPresence {
  const isRendered = ref(options.isOpen())
  const isHostOpen = ref(false)
  // 打开那一刻的形态。关闭时按它离开宿主，中途改了 hasScrim 也不会走错路。
  let shownModal = false
  let focusRecord: LayerFocusRecord | null = null
  let releaseEntrance: (() => void) | null = null
  let cancelExit: (() => void) | null = null
  // 模态抽屉打开期间充当全局 toast 的挂载点，toast 才不会被盖住、点不到。退场一开始就交还。
  const modalOutlet = createModalOutletHandle()

  function releaseEntranceHold(): void {
    releaseEntrance?.()
    releaseEntrance = null
  }

  function stopExit(): void {
    cancelExit?.()
    cancelExit = null
  }

  function openDrawer(): void {
    const dialog = options.dialog.value
    if (dialog == null)
      return
    stopExit()
    isRendered.value = true
    if (!isHostOpen.value || !isDrawerHostOpen(dialog, shownModal)) {
      // 抽屉所在文档拿着焦点时，打开者在那个文档里（iframe、画中画窗口里的控件）。
      const focusDocument = dialog.ownerDocument.hasFocus() ? dialog.ownerDocument : document
      const opener = focusDocument.activeElement
      focusRecord?.stop()
      focusRecord = trackLayerFocus({
        getLayer: () => options.dialog.value,
        opener: opener instanceof HTMLElement ? opener : null,
      })
      shownModal = options.isModal()
      showDrawerHost(dialog, shownModal)
      isHostOpen.value = true
      if (shownModal)
        modalOutlet.attach(dialog)
    }
    options.initialFocus()?.focus({ preventScroll: true })
    releaseEntranceHold()
    // 主指针是手指时，进场播完之前的轻点和拖动落空。非模态抽屉只挡面板自己，页面照常。
    releaseEntrance = holdEntranceInput(dialog, { isModal: shownModal })
  }

  function finishExit(dialog: HTMLDialogElement): void {
    const record = focusRecord
    focusRecord = null
    const wasStranded = record != null && isLayerFocusStranded(record, dialog)
    const owesClose = hideDrawerHost(dialog, shownModal)
    isHostOpen.value = false
    isRendered.value = false
    if (record != null) {
      if (wasStranded)
        restoreLayerFocus(record, { layer: dialog, name: 'Drawer' })
      record.stop()
    }
    // 补发的 close 排在还焦点之后，和原生事件的时机一样：监听它挪焦点的调用方说了算。
    if (owesClose)
      dispatchDrawerClose(dialog)
  }

  function closeDrawer(): void {
    releaseEntranceHold()
    modalOutlet.detach()
    const dialog = options.dialog.value
    if (dialog == null || !isHostOpen.value) {
      isRendered.value = false
      return
    }
    stopExit()
    cancelExit = waitForTransition(dialog, 'transform', () => {
      cancelExit = null
      finishExit(dialog)
    })
  }

  // 面板要在指向打开位置的同一次渲染里开始绘制，`@starting-style` 才有起点可滑。
  watch(options.isOpen, (open) => {
    if (open)
      isRendered.value = true
  }, { flush: 'sync' })

  watch(options.isOpen, (open) => {
    if (open)
      openDrawer()
    else
      closeDrawer()
  }, { flush: 'post' })

  onMounted(() => {
    if (options.isOpen())
      openDrawer()
  })

  onBeforeUnmount(() => {
    releaseEntranceHold()
    stopExit()
    modalOutlet.detach()
    const dialog = options.dialog.value
    const record = focusRecord
    focusRecord = null
    const wasStranded = record != null && isLayerFocusStranded(record, dialog)
    if (dialog != null && isHostOpen.value && hideDrawerHost(dialog, shownModal))
      dispatchDrawerClose(dialog)
    isHostOpen.value = false
    if (record == null)
      return
    // 移除本身就会关掉 popover 宿主，所以还焦点不看宿主开没开，等它离开文档后再做。
    queueMicrotask(() => {
      if (wasStranded)
        restoreLayerFocus(record, { layer: null, name: 'Drawer' })
      record.stop()
    })
  })

  return { isRendered, isHostOpen }
}
