import { focusForLastInput } from '../../composables/internal/focusReturn.js'
import { state } from './stackState.js'

/**
 * 面板宿主对话框的原生呈现、收起和遮罩写入。叠放登记表和切换器共用。
 */

/** 对话框现在是否被浏览器呈现着：模态打开、`show()` 打开或者作为手动 popover 打开。 */
export function isSheetHostPresented(dialog: HTMLDialogElement | null): boolean {
  if (dialog == null)
    return false
  if (dialog.open)
    return true
  try {
    return dialog.matches(':popover-open')
  }
  catch {
    // 不认识 :popover-open 的环境（测试环境、老浏览器）。
    return false
  }
}

/**
 * 以模态呈现切换器某一步的对话框，而且不留「关闭时要还焦点」的记录。
 *
 * `showModal()` 会记下当时有焦点的元素，`close()` 时把焦点送回去，哪怕焦点那时已在别的对话框里。
 * 对一步来说那个元素是推动流程的按钮（继续、返回）或者流程的打开者，而这个对话框要在人进到下一步
 * 之后才关：送回去会把焦点从当前面板上拽走。所以先让焦点离开，什么都不记；进场的那一步自己聚焦，
 * 流程结束时切换器自己把焦点还给打开者。
 */
export function presentStepModally(dialog: HTMLDialogElement): void {
  const doc = dialog.ownerDocument
  const focused = doc.activeElement
  if (focused instanceof HTMLElement && focused !== doc.body) {
    // 焦点在流程上面另一张打开的面板里（人正在那里打字，代码推进了流程）：焦点是他的。
    // 登记表随后把那张面板放回最上面，再把焦点落回这个元素。
    const focusedDialog = focused.closest('dialog')
    if (
      focusedDialog != null
      && focusedDialog !== dialog
      && !focusedDialog.contains(dialog)
      && !dialog.contains(focusedDialog)
      && isSheetHostPresented(focusedDialog)
    ) {
      state.focusToKeep.set(doc, focused)
    }
    focused.blur()
  }
  dialog.showModal()
}

/** 呈现一个遮罩必须一开始就透明、并且保持透明的对话框：先钉住 0s 过渡写好透明度，样式生效后再放开。 */
export function presentWithClearScrim(dialog: HTMLDialogElement): void {
  dialog.style.setProperty('--_sheet-scrim-duration', '0s')
  dialog.style.setProperty('--_sheet-scrim-opacity', '0')
  presentStepModally(dialog)
  if (typeof getComputedStyle === 'function')
    void getComputedStyle(dialog, '::backdrop').opacity
  dialog.style.removeProperty('--_sheet-scrim-duration')
}

/** 一个宿主待恢复的遮罩过渡。 */
export interface BottomSheetScrimWrite {
  frame: number | null
}

/**
 * 写对话框的遮罩透明度。对话框开着时改透明度就是换了遮罩的主人，要完全不带过渡：
 * 哪怕 `0.01s` 也会先画一帧旧值，看起来就是闪一下或者两层叠暗。`0s` 钉两帧（第一帧画出新值，
 * 第二帧确认已经上屏）再还给样式表的时长。宿主卸载时用 `cancelScrimWrite` 取消。
 */
export function writeScrimOpacity(
  dialog: HTMLDialogElement | null,
  opacity: '0' | '1',
  pending: BottomSheetScrimWrite,
): void {
  if (dialog == null)
    return
  if (!dialog.open || dialog.style.getPropertyValue('--_sheet-scrim-opacity') === opacity) {
    dialog.style.setProperty('--_sheet-scrim-opacity', opacity)
    return
  }
  dialog.style.setProperty('--_sheet-scrim-duration', '0s')
  dialog.style.setProperty('--_sheet-scrim-opacity', opacity)
  cancelScrimWrite(pending)
  if (typeof requestAnimationFrame !== 'function') {
    dialog.style.removeProperty('--_sheet-scrim-duration')
    return
  }
  pending.frame = requestAnimationFrame(() => {
    pending.frame = requestAnimationFrame(() => {
      pending.frame = null
      dialog.style.removeProperty('--_sheet-scrim-duration')
    })
  })
}

export function cancelScrimWrite(pending: BottomSheetScrimWrite): void {
  if (pending.frame != null) {
    cancelAnimationFrame(pending.frame)
    pending.frame = null
  }
}

/** 离开原生宿主。 */
export function hideSheetHost(dialog: HTMLDialogElement): void {
  if (dialog.open)
    dialog.close()
}

/**
 * 关掉对话框但不让浏览器挪焦点。`close()` 会把焦点还给 `showModal()` 时有焦点的元素；
 * 上面还有别的面板开着时，那会把焦点从人正在用的面板里拽走。焦点原地不动，接下来去哪由调用方决定。
 */
export function closeDialogKeepingFocus(dialog: HTMLDialogElement | null): void {
  if (dialog == null || !isSheetHostPresented(dialog))
    return
  const doc = dialog.ownerDocument
  const activeElement = doc.activeElement
  hideSheetHost(dialog)
  if (doc.activeElement !== activeElement && activeElement instanceof HTMLElement && activeElement.isConnected)
    activeElement.focus({ preventScroll: true })
}

/** 像关闭时浏览器自己还焦点那样还给 `target`，不滚页面；焦点环跟着上一次的输入走。 */
export function returnFocusTo(target: HTMLElement | null | undefined): void {
  if (target != null && target.isConnected)
    focusForLastInput(target, { preventScroll: true })
}
