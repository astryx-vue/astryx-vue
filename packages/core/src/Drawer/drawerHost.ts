/**
 * 抽屉的原生宿主：模态时是 `showModal()` 打开的对话框，非模态时是 `popover="manual"`
 * 的顶层元素。两种都在浏览器顶层里，画在页面最上面，不用管 z-index。
 *
 * 不支持 Popover API 的引擎退回 `show()`：不在顶层，但页面照样能用。
 */

import { notifyTopLayerEntry } from '../layer/modalOutlet.js'

function isPopoverOpen(dialog: HTMLDialogElement): boolean {
  try {
    return dialog.matches(':popover-open')
  }
  catch {
    // 不认识 `:popover-open` 的引擎当作没打开。
    return false
  }
}

/** 宿主此刻是否开着。 */
export function isDrawerHostOpen(dialog: HTMLDialogElement, isModal: boolean): boolean {
  return isModal ? dialog.open : isPopoverOpen(dialog) || dialog.open
}

/** 进入宿主。非模态抽屉进入顶层后通知全局常驻的层（toast 视口）重新排到它上面。 */
export function showDrawerHost(dialog: HTMLDialogElement, isModal: boolean): void {
  if (isModal) {
    dialog.showModal()
    return
  }
  if (typeof dialog.showPopover === 'function') {
    dialog.showPopover()
    notifyTopLayerEntry()
    return
  }
  dialog.show()
}

/**
 * 离开宿主。返回调用方是否还欠一个 `close` 事件：popover 关闭时不发 `close`，
 * 但监听抽屉 `close` 事件的调用方要和模态时一样收到它。
 */
export function hideDrawerHost(dialog: HTMLDialogElement, isModal: boolean): boolean {
  if (!isModal && typeof dialog.hidePopover === 'function') {
    if (isPopoverOpen(dialog))
      dialog.hidePopover()
    return true
  }
  if (dialog.open)
    dialog.close()
  return false
}

/** 补发 popover 宿主欠下的 `close` 事件。 */
export function dispatchDrawerClose(dialog: HTMLDialogElement): void {
  const EventConstructor = dialog.ownerDocument.defaultView?.Event ?? Event
  dialog.dispatchEvent(new EventConstructor('close'))
}

/** 抽屉是否被后开的模态层盖住：那时页面上的 Escape 归那个模态层，不归它。 */
export function isBehindModal(dialog: HTMLElement): boolean {
  try {
    const modal = dialog.ownerDocument.querySelector(':modal')
    return modal != null && modal !== dialog && !dialog.contains(modal)
  }
  catch {
    return false
  }
}
