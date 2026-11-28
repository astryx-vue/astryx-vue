import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { LayerFocusRecord } from '../../layer/layerFocusReturn.js'
import type { ScrimFade } from '../sheetDragExit.js'
import type { BottomSheetReplaceMotion, BottomSheetStackView } from './bottomSheetStack.js'
import type { BottomSheetScrimWrite } from './sheetHost.js'
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../../layer/layerFocusReturn.js'
import { focusSheetPanel } from '../focusSheetPanel.js'
import {
  BOTTOM_SHEET_STACK_DEFAULT_VIEW,
  getBottomSheetBeneath,
  isClosingTogether,
  registerBottomSheet,
  reportBottomSheetMotion,
  reportClosedTogether,
  setBottomSheetOpen,
} from './bottomSheetStack.js'
import { cancelScrimWrite, closeDialogKeepingFocus, hideSheetHost, isSheetHostPresented, returnFocusTo, writeScrimOpacity } from './sheetHost.js'
import { scrimOpacityForView, writeScrimFade } from './stackPresentation.js'

export interface StandaloneSheetStackOptions {
  /** 实际的打开状态：自己的 `isOpen`，而且外面的宿主（如果有）也开着。 */
  isOpen: Readonly<Ref<boolean>>
  hasScrim: () => boolean
  /** 行内面板和服务端不参加叠放。 */
  isEnabled: () => boolean
  getDialog: () => HTMLDialogElement | null
  getPanel: () => HTMLElement | null
  getFinalFocus: () => HTMLElement | null
}

export interface StandaloneSheetStack {
  view: ShallowRef<BottomSheetStackView>
  /** 对话框在原生宿主里：打开着，或者正在退场、正被替换。 */
  isPresented: Ref<boolean>
  shouldPresent: ComputedRef<boolean>
  /** 这次关闭已经确定不是替换，可以开始退场。 */
  isCloseSettled: Ref<boolean>
  isModalShown: Ref<boolean>
  isReplaced: ComputedRef<boolean>
  onScrimOpacity: (opacity: number) => void
  onScrimFade: (fade: ScrimFade | null) => void
  onMotionStart: (motion: BottomSheetReplaceMotion) => void
  onMotionComplete: (motion: BottomSheetReplaceMotion) => void
}

/**
 * 独立面板加入叠放登记表的那一整套：呈现期间登记、报告开关、接收视图、遮罩写入、
 * 替换交接、退场结束时的焦点去向，以及打开着被卸载时把困住的焦点送出去。
 */
export function useStandaloneSheetStack(options: StandaloneSheetStackOptions): StandaloneSheetStack {
  const key = {}
  // 呈现比受控的打开状态活得久：关闭中的面板退场期间还在原生宿主里，只有退场结束（或替换结束）才清掉。
  const isPresented = ref(options.isOpen.value)
  const shouldPresent = computed(() => options.isOpen.value || isPresented.value)
  const view = shallowRef<BottomSheetStackView>(BOTTOM_SHEET_STACK_DEFAULT_VIEW)
  // 关闭是否配成了替换，要等这一批所有面板都报完才知道。答复之前面板保持打开的姿态：
  // 先画退场姿态会开始退场过渡，反悔时面板会一下子跳回原位。
  const isCloseSettled = ref(false)
  // 真的以模态呈现过才对外说自己是模态：服务端渲染出来、还没水合的面板不能带 aria-modal。
  const isModalShown = ref(false)
  const isReplaced = computed(() => !options.isOpen.value && isPresented.value && view.value.replacedMotion != null)
  let trigger: HTMLElement | null = null
  let hadFocusAtClose = false
  let leaveStack: (() => void) | null = null
  let registeredScrim = options.hasScrim()
  let focusRecord: LayerFocusRecord | null = null
  const scrimWrite: BottomSheetScrimWrite = { frame: null }
  const scrimFadeWritten = { current: null as string | null }

  function writeScrim(opacity: '0' | '1'): void {
    writeScrimOpacity(options.getDialog(), opacity, scrimWrite)
  }

  function show(): void {
    const dialog = options.getDialog()
    if (dialog == null || isSheetHostPresented(dialog))
      return
    trigger ??= dialog.ownerDocument.activeElement as HTMLElement | null
    focusRecord?.stop()
    focusRecord = trackLayerFocus({ getLayer: options.getDialog, opener: trigger })
    if (!options.hasScrim()) {
      dialog.show()
      return
    }
    dialog.style.setProperty('--_sheet-scrim-opacity', scrimOpacityForView(view.value))
    dialog.showModal()
    isModalShown.value = true
  }

  function register(): void {
    registeredScrim = options.hasScrim()
    leaveStack = registerBottomSheet({
      key,
      getElement: options.getDialog,
      show,
      hide: () => closeDialogKeepingFocus(options.getDialog()),
      focus: reason => focusSheetPanel(options.getPanel(), reason, options.hasScrim()),
      getReturnTarget: () => options.getFinalFocus() ?? trigger,
      onView: (next) => {
        view.value = next
        // 谁拿遮罩由登记表定，换主人时不带淡入淡出。被替换的面板拿着遮罩直到替换者接过去；
        // 遮罩被上面打开的面板接走的关闭中面板也立刻撤掉；独自拥有遮罩的关闭中面板照常淡出。
        if (options.isOpen.value || next.replacedMotion != null)
          writeScrim(scrimOpacityForView(next))
        else if (next.isScrimTakenOver)
          writeScrim('0')
      },
      replaceable: {
        getPanel: options.getPanel,
        getOpener: () => trigger,
        setOpener: (opener) => {
          trigger = opener
        },
        finish: () => {
          // 登记表已经关掉对话框；焦点和流程的打开者都留在替换它的那张里。
          trigger = null
          stopFocusRecord()
          isPresented.value = false
        },
      },
    }, options.isOpen.value, registeredScrim)
  }

  function leave(): void {
    const stop = leaveStack
    leaveStack = null
    stop?.()
  }

  function stopFocusRecord(): void {
    focusRecord?.stop()
    focusRecord = null
  }

  function sync(): void {
    if (!options.isEnabled())
      return
    const open = options.isOpen.value
    if (!open) {
      // 人关掉面板时焦点在哪：关闭中的面板还没变 inert，焦点还没动。
      const dialog = options.getDialog()
      hadFocusAtClose = dialog != null && dialog.contains(dialog.ownerDocument.activeElement)
    }
    if (shouldPresent.value && leaveStack != null && registeredScrim !== options.hasScrim())
      leave()
    if (shouldPresent.value) {
      if (leaveStack == null)
        register()
      else
        setBottomSheetOpen(key, open)
    }
    else if (leaveStack != null) {
      leave()
    }
    // 这一批每张面板都报过了：没配成替换的关闭从这里开始就是退场。
    if (!open)
      isCloseSettled.value = true
  }

  watch(options.isOpen, (open) => {
    isCloseSettled.value = false
    if (open)
      isPresented.value = true
  }, { flush: 'sync' })
  watch([shouldPresent, options.isOpen, options.hasScrim], sync, { flush: 'post' })
  onMounted(sync)

  // 遮罩的静止值：打开时一叠一层可见遮罩，退场时淡出。被替换的面板拿着遮罩直到替换者接过去。
  watch([options.isOpen, isPresented, isReplaced], () => {
    const dialog = options.getDialog()
    if (dialog == null || !options.hasScrim() || !options.isEnabled())
      return
    if (options.isOpen.value || isReplaced.value)
      dialog.style.setProperty('--_sheet-scrim-opacity', scrimOpacityForView(view.value))
    else if (isPresented.value)
      dialog.style.setProperty('--_sheet-scrim-opacity', '0')
  }, { flush: 'post' })

  /** 拖动时遮罩跟手变淡；叠在遮罩主人上面的面板遮罩是透明的，拖动不能把它露出来。 */
  function onScrimOpacity(opacity: number): void {
    if (view.value.isStacked && !view.value.ownsScrim)
      return
    options.getDialog()?.style.setProperty('--_sheet-scrim-opacity', String(opacity))
  }

  function onScrimFade(fade: ScrimFade | null): void {
    if (view.value.isStacked && !view.value.ownsScrim)
      return
    writeScrimFade(options.getDialog(), fade, scrimFadeWritten)
  }

  // 进场在面板那边每次打开都会走，可这次打开是不是替换，要等同一批的面板都报完才知道：
  // 面板先开始进场、后被配成替换者时，等配上了再把进场报给登记表（已经走完的连结束一起报）。
  let entering: 'idle' | 'running' | 'done' = 'idle'
  let isEnteringReported = false

  function reportEnteringIfReplacing(): void {
    if (isEnteringReported || entering === 'idle' || !view.value.isReplacing)
      return
    isEnteringReported = true
    reportBottomSheetMotion(key, 'start', 'entering')
    if (entering === 'done')
      reportBottomSheetMotion(key, 'complete', 'entering')
  }

  watch(() => view.value.isReplacing, reportEnteringIfReplacing, { flush: 'post' })

  function onMotionStart(motion: BottomSheetReplaceMotion): void {
    if (motion !== 'entering') {
      reportBottomSheetMotion(key, 'start', motion)
      return
    }
    entering = 'running'
    isEnteringReported = false
    reportEnteringIfReplacing()
  }

  function onMotionComplete(motion: BottomSheetReplaceMotion): void {
    // 替换交接的动作（替换者进场，被替换者对齐、淡出）由登记表排先后。
    if (motion === 'entering') {
      entering = 'done'
      if (isEnteringReported)
        reportBottomSheetMotion(key, 'complete', 'entering')
      return
    }
    if (motion === 'exiting')
      entering = 'idle'
    reportBottomSheetMotion(key, 'complete', motion)
    if (motion === 'exiting' && !options.isOpen.value)
      finishExit()
  }

  function settleClosed(): void {
    isPresented.value = false
    trigger = null
    stopFocusRecord()
  }

  function finishExit(): void {
    const dialog = options.getDialog()
    const hasScrim = options.hasScrim()
    // 上面还开着面板时从代码关掉的面板：焦点留在最上面那张里，自己的关闭不能把焦点拽回去。
    if (hasScrim && view.value.depth > 0) {
      closeDialogKeepingFocus(dialog)
      settleClosed()
      return
    }
    // 和同一叠其它面板一起关（「全部关闭」）：最后一个对话框离开后登记表统一还一次焦点。
    if (hasScrim && isClosingTogether(key)) {
      closeDialogKeepingFocus(dialog)
      settleClosed()
      reportClosedTogether(key)
      return
    }
    // 下面还开着面板：打开者在那张里就回打开者，否则落到那张的面板上。
    // 非模态面板只有焦点还在里面时才还给打开者：页面一直能用，人可能已经把焦点挪走了。
    const revealed = hasScrim ? getBottomSheetBeneath(key) : null
    const returnTarget = options.getFinalFocus() ?? (hasScrim || hadFocusAtClose ? trigger : null)
    if (dialog != null)
      hideSheetHost(dialog)
    settleClosed()
    if (revealed != null && (returnTarget == null || !revealed.element.contains(returnTarget)))
      revealed.focus()
    else
      returnFocusTo(returnTarget)
  }

  onBeforeUnmount(() => {
    cancelScrimWrite(scrimWrite)
    // 打开着就被卸载：等它离开文档后，焦点被困住的话送到下面那张面板或打开者。
    const record = focusRecord
    focusRecord = null
    const dialog = options.getDialog()
    if (record != null && leaveStack != null && isSheetHostPresented(dialog)) {
      const wasStranded = isLayerFocusStranded(record, dialog)
      const returnTarget = options.getFinalFocus() ?? trigger
      const revealed = options.hasScrim() ? getBottomSheetBeneath(key) : null
      queueMicrotask(() => {
        if (wasStranded) {
          if (revealed != null && revealed.element.isConnected && (returnTarget == null || !revealed.element.contains(returnTarget)))
            revealed.focus()
          else if (revealed == null || revealed.element.isConnected)
            restoreLayerFocus(record, { layer: null, name: 'BottomSheet' })
        }
        record.stop()
      })
    }
    else {
      record?.stop()
    }
    leave()
  })

  return {
    view,
    isPresented,
    shouldPresent,
    isCloseSettled,
    isModalShown,
    isReplaced,
    onScrimOpacity,
    onScrimFade,
    onMotionStart,
    onMotionComplete,
  }
}
