import { currentGesture } from '../composables/internal/gestureCounter.js'
import { didOutsideDismissInGesture } from './dismissStack.js'

export interface BackdropPress {
  /** 绑到模态宿主（原生 `<dialog>`）的 pointerdown 上。 */
  onPointerDown: (event: PointerEvent) => void
  /** 绑到同一个宿主的 click 上。该关时调用 `onDismiss`。 */
  onClick: (event: MouseEvent) => void
}

/**
 * 模态框「点遮罩关闭」的共用判断。Dialog（含 Drawer、CommandPalette）都走这里。
 *
 * 原生 `<dialog>` 的遮罩没有自己的元素，点在遮罩上的 click 目标就是 dialog 本身。
 * 只看 click 不够，两种情况要排除：
 *
 * - 按下在框里、松手在遮罩上（拖选文字、拖滑块拖出了边）。浏览器把这次 click
 *   发给两者共同的祖先，也就是 dialog，看起来像点了遮罩。只有按下和松手都在
 *   遮罩上才算。
 * - 这一下按压已经把框里打开的弹出框当作「点外面」关掉了。这一下是弹出框的，
 *   模态框留着；再点一次遮罩才关它，和连按两次 Escape 一样。
 */
export function useBackdropPress(getHost: () => HTMLElement | null, onDismiss: () => void): BackdropPress {
  let downOnBackdrop = false
  let downGesture: number | null = null

  function onPointerDown(event: PointerEvent): void {
    downOnBackdrop = event.target === getHost()
    downGesture = currentGesture()
  }

  function onClick(event: MouseEvent): void {
    const startedOnBackdrop = downOnBackdrop
    const gesture = downGesture
    downOnBackdrop = false
    downGesture = null
    if (event.target !== getHost() || !startedOnBackdrop)
      return
    if (gesture != null && didOutsideDismissInGesture(gesture))
      return
    onDismiss()
  }

  return { onPointerDown, onClick }
}
