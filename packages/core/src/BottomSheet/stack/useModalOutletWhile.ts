import { onBeforeUnmount, watch } from 'vue'
import { addModalOutlet, removeModalOutlet } from '../../layer/modalOutlet.js'

/**
 * 条件成立期间把对话框登记成全局浮层（toast）的挂载点。条件跟着叠放走：只有最上面那层是挂载点，
 * 上面那张关掉后下面露出来的那张重新登记，排到清单最后。
 *
 * 不靠对话框的 `close` 事件撤销：叠放为了保顺序会关了再重新呈现，那次 `close` 事件晚到，会把刚登记的撤掉。
 */
export function useModalOutletWhile(getDialog: () => HTMLDialogElement | null, isOn: () => boolean): void {
  let current: HTMLDialogElement | null = null

  function sync(): void {
    const next = isOn() ? getDialog() : null
    if (next === current)
      return
    if (current != null)
      removeModalOutlet(current)
    current = next
    if (next != null)
      addModalOutlet(next)
  }

  watch(() => [isOn(), getDialog()], sync, { flush: 'post' })
  onBeforeUnmount(() => {
    if (current != null)
      removeModalOutlet(current)
    current = null
  })
}
