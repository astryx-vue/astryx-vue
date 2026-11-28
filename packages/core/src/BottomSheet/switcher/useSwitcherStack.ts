import type { Ref, ShallowRef } from 'vue'
import type { LayerFocusRecord } from '../../layer/layerFocusReturn.js'
import type { BottomSheetStackView } from '../stack/stackState.js'
import { onBeforeUnmount, shallowRef, watch } from 'vue'
import { isLayerFocusStranded, restoreLayerFocus, trackLayerFocus } from '../../layer/layerFocusReturn.js'
import { focusSheetPanel } from '../focusSheetPanel.js'
import {
  BOTTOM_SHEET_STACK_DEFAULT_VIEW,
  getBottomSheetBeneath,
  isClosingTogether,
  notifyBottomSheetHostChanged,
  registerBottomSheet,
  reportClosedTogether,
  setBottomSheetOpen,
} from '../stack/bottomSheetStack.js'
import { cancelScrimWrite, closeDialogKeepingFocus, presentStepModally, presentWithClearScrim, returnFocusTo, writeScrimOpacity } from '../stack/sheetHost.js'

export interface SwitcherStackOptions {
  hasScrim: () => boolean
  activeId: Readonly<Ref<string | null>>
  isFlowVisible: Readonly<Ref<boolean>>
  isFlowOpen: Readonly<Ref<boolean>>
  hostId: Readonly<Ref<string | null>>
  scrimOwnerId: Readonly<Ref<string | null>>
  dialogOf: (id: string) => HTMLDialogElement | null
  panelOf: (id: string) => HTMLElement | null
  stepIds: () => Iterable<string>
  getFlow: () => HTMLElement | null
}

export interface SwitcherStack {
  view: ShallowRef<BottomSheetStackView>
  beforePresent: (id: string) => void
  afterStepSync: () => void
  isCoveredInTopLayer: (id: string) => boolean
  forgetStep: (id: string) => void
  onScrimOpacity: (id: string, opacity: number) => void
}

/**
 * 不带过渡地把流程那层遮罩交给 `dialog`。遮罩的透明度过渡会从进场对话框呈现时的透明值慢慢升起，
 * 正好在上一个对话框的遮罩消失时让页面变亮一下。哪怕很短的时长也会先画一帧起始值，所以先关掉过渡、
 * 刷一次样式让新值在这条规则下生效，再把时长还给之后的拖动和退场。
 */
function takeOverScrim(dialog: HTMLDialogElement, opacity: number): void {
  dialog.style.setProperty('--_sheet-scrim-duration', '0s')
  dialog.style.setProperty('--_sheet-scrim-opacity', String(opacity))
  if (typeof getComputedStyle === 'function')
    void getComputedStyle(dialog, '::backdrop').opacity
  dialog.style.removeProperty('--_sheet-scrim-duration')
}

/**
 * 带遮罩的整段流程在底部面板叠放里算一层：步骤自己呈现对话框，登记表只在要恢复打开顺序时重新呈现
 * 这一层的宿主对话框。这里还管流程唯一的那层遮罩、流程的打开者，以及流程结束时焦点去哪。
 */
export function useSwitcherStack(options: SwitcherStackOptions): SwitcherStack {
  const key = {}
  const view = shallowRef<BottomSheetStackView>(BOTTOM_SHEET_STACK_DEFAULT_VIEW)
  const scrimWrite = { frame: null as number | null }
  let leaveStack: (() => void) | null = null
  let registeredScrim = false
  let notifiedHost: HTMLDialogElement | null = null
  let leftStack: { depth: number, revealed: ReturnType<typeof getBottomSheetBeneath>, closingTogether: boolean } | null = null
  let trigger: HTMLElement | null = null
  let focusRecord: LayerFocusRecord | null = null
  let isModalFlow = false
  let hadFocusAtClose = false
  let isFocusReturnPending = false
  let scrimOpacity = 1
  let scrimOwner: string | null = null
  let presentationCounter = 0
  const presentationOrder = new Map<string, number>()

  const hostDialog = (): HTMLDialogElement | null => options.hostId.value == null ? null : options.dialogOf(options.hostId.value)
  const ownsStackScrim = (stackView: BottomSheetStackView): boolean => !stackView.isStacked || stackView.ownsScrim

  /** 焦点在流程里：在流程的外层或任何一步的对话框里。 */
  function holdsFocus(active: Element | null): boolean {
    if (active == null)
      return false
    if (options.getFlow()?.contains(active))
      return true
    for (const id of options.stepIds()) {
      if (options.dialogOf(id)?.contains(active))
        return true
    }
    return false
  }

  function beforePresent(id: string): void {
    if (trigger == null && typeof document !== 'undefined') {
      trigger = document.activeElement as HTMLElement | null
      focusRecord?.stop()
      focusRecord = trackLayerFocus({ getLayer: options.getFlow, opener: trigger })
    }
    if (!options.hasScrim())
      return
    isModalFlow = true
    presentationCounter += 1
    presentationOrder.set(id, presentationCounter)
  }

  function isCoveredInTopLayer(id: string): boolean {
    const own = presentationOrder.get(id)
    if (own == null)
      return false
    for (const [other, stamp] of presentationOrder) {
      if (other !== id && stamp > own && options.dialogOf(other)?.open)
        return true
    }
    return false
  }

  function forgetStep(id: string): void {
    presentationOrder.delete(id)
  }

  /** 一叠只有一层可见遮罩：只有遮罩主人的 `::backdrop` 带当前透明度，其它步骤的遮罩一直透明。 */
  function applyScrim(): void {
    const ownerId = options.scrimOwnerId.value
    const owner = ownerId == null ? null : options.dialogOf(ownerId)
    const value = ownsStackScrim(view.value) ? scrimOpacity : 0
    // 新开的流程保留遮罩自己的淡入；只有从一个呈现着的对话框交到另一个时不带过渡。
    const ownerChanged = scrimOwner != null && scrimOwner !== ownerId
    scrimOwner = ownerId
    for (const id of options.stepIds()) {
      const dialog = options.dialogOf(id)
      if (dialog == null)
        continue
      if (dialog === owner) {
        if (ownerChanged && dialog.open)
          takeOverScrim(dialog, value)
        else
          dialog.style.setProperty('--_sheet-scrim-opacity', String(value))
      }
      else if (id !== ownerId) {
        dialog.style.setProperty('--_sheet-scrim-opacity', '0')
      }
    }
  }

  /** 拖动当前那步时遮罩跟手变淡；交接后还在给上一步发的拖动事件不算。 */
  function onScrimOpacity(id: string, opacity: number): void {
    if (id !== options.activeId.value)
      return
    scrimOpacity = opacity
    applyScrim()
  }

  function register(): void {
    registeredScrim = options.hasScrim()
    leaveStack = registerBottomSheet({
      key,
      getElement: hostDialog,
      // 流程外层包着每一步的对话框，同一次更新里和别的面板按树序排时不管当前是哪一步都用它。
      getTreeAnchor: options.getFlow,
      show: () => {
        const dialog = hostDialog()
        const id = options.hostId.value
        if (dialog == null || id == null || dialog.open)
          return
        beforePresent(id)
        if (id === scrimOwner && ownsStackScrim(view.value)) {
          dialog.style.setProperty('--_sheet-scrim-opacity', String(scrimOpacity))
          presentStepModally(dialog)
        }
        else {
          presentWithClearScrim(dialog)
        }
        notifiedHost = dialog
      },
      hide: () => closeDialogKeepingFocus(hostDialog()),
      getReturnTarget: () => trigger,
      focus: (reason) => {
        const active = options.activeId.value
        focusSheetPanel(active == null ? null : options.panelOf(active), reason, true)
      },
      onView: (next) => {
        const previous = view.value
        view.value = next
        // 叠放的遮罩换了主人，落到流程自己的遮罩主人上，不带过渡。
        const owner = scrimOwner == null ? null : options.dialogOf(scrimOwner)
        if (owner == null)
          return
        const ownsNow = ownsStackScrim(next)
        if (options.isFlowOpen.value && ownsNow !== ownsStackScrim(previous))
          writeScrimOpacity(owner, ownsNow && scrimOpacity > 0 ? '1' : '0', scrimWrite)
        else if (!options.isFlowOpen.value && next.isScrimTakenOver)
          writeScrimOpacity(owner, '0', scrimWrite)
      },
    }, options.isFlowOpen.value, true)
  }

  function leave(): void {
    const stop = leaveStack
    if (stop == null)
      return
    // 离开之前记下：之后还焦点要用，那时登记表已经不认识这一层了。
    leftStack = { depth: view.value.depth, revealed: getBottomSheetBeneath(key), closingTogether: isClosingTogether(key) }
    leaveStack = null
    notifiedHost = null
    stop()
    view.value = BOTTOM_SHEET_STACK_DEFAULT_VIEW
  }

  function syncStack(): void {
    const shouldRegister = options.isFlowVisible.value && options.hasScrim()
    if (leaveStack != null && (!shouldRegister || registeredScrim !== options.hasScrim()))
      leave()
    if (!shouldRegister)
      return
    if (leaveStack == null)
      register()
    else
      setBottomSheetOpen(key, options.isFlowOpen.value)
  }

  /** 这一层换了实现它的对话框（交接到了自带对话框的下一步）：呈现之后让登记表把该在它上面的面板放回上面。 */
  function syncHostDialog(): void {
    const dialog = hostDialog()
    if (leaveStack == null || dialog == null || !dialog.open || dialog === notifiedHost)
      return
    notifiedHost = dialog
    notifyBottomSheetHostChanged(key)
  }

  function returnFocus(): void {
    const left = leftStack
    leftStack = null
    if (isModalFlow) {
      const depth = left?.depth ?? view.value.depth
      if (depth > 0) {
        // 上面还开着面板时从代码关掉的流程：焦点留在最上面那张里。
      }
      else if (left?.closingTogether) {
        reportClosedTogether(key)
      }
      else {
        const revealed = left?.revealed ?? getBottomSheetBeneath(key)
        if (revealed != null && (trigger == null || !revealed.element.contains(trigger)))
          revealed.focus()
        else
          returnFocusTo(trigger)
      }
    }
    else if (!options.hasScrim()) {
      // 没有遮罩的流程照原生对话框的规矩：焦点还在流程里时才回到打开者。
      const active = document.activeElement
      const isFocusLeftInFlow = active == null || active === document.body || holdsFocus(active)
      if (hadFocusAtClose && isFocusLeftInFlow)
        returnFocusTo(trigger)
    }
    hadFocusAtClose = false
    trigger = null
    focusRecord?.stop()
    focusRecord = null
    isModalFlow = false
    presentationOrder.clear()
  }

  /** 流程不再可见、而且每一步的对话框都关了，才还焦点：开着的模态对话框会挡住页面上的打开者。 */
  function tryReturnFocus(): void {
    if (!isFocusReturnPending)
      return
    for (const id of options.stepIds()) {
      if (options.dialogOf(id)?.open)
        return
    }
    isFocusReturnPending = false
    returnFocus()
  }

  function afterStepSync(): void {
    syncHostDialog()
    tryReturnFocus()
  }

  watch(options.isFlowOpen, (open, wasOpen) => {
    if (wasOpen && !open && typeof document !== 'undefined')
      hadFocusAtClose = holdsFocus(document.activeElement)
  }, { flush: 'post' })
  // 选定的一步把流程的遮罩值重置：有当前那步时是 1，退场时是 0；之后拖动再调。
  // 排在登记之前：登记表呈现宿主时要知道它是不是遮罩主人。
  watch([options.scrimOwnerId, () => ownsStackScrim(view.value), options.activeId, options.hasScrim, options.isFlowVisible], () => {
    scrimOpacity = options.activeId.value == null ? 0 : 1
    applyScrim()
  }, { flush: 'post' })
  watch([options.isFlowVisible, options.isFlowOpen, options.hasScrim], syncStack, { flush: 'post' })
  watch(options.hostId, syncHostDialog, { flush: 'post' })
  watch(options.isFlowVisible, (visible) => {
    if (visible) {
      isFocusReturnPending = false
      return
    }
    isFocusReturnPending = true
    tryReturnFocus()
  }, { flush: 'post' })

  onBeforeUnmount(() => {
    cancelScrimWrite(scrimWrite)
    // 流程开着就被移除：没有关闭动作，焦点会掉到页面上。离开文档后焦点被困住的话按共用的候选链送出去。
    const record = focusRecord
    focusRecord = null
    const wasStranded = record != null && options.isFlowVisible.value && isLayerFocusStranded(record, options.getFlow())
    leaveStack?.()
    leaveStack = null
    if (record != null) {
      queueMicrotask(() => {
        if (wasStranded)
          restoreLayerFocus(record, { layer: null, name: 'BottomSheetSwitcher' })
        record.stop()
      })
    }
  })

  return { view, beforePresent, afterStepSync, isCoveredInTopLayer, forgetStep, onScrimOpacity }
}
