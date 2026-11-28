/**
 * @file tapStop.ts
 * @output createTapStop：手指或笔轻点时取消浏览器由它合成的那次鼠标事件
 * @position 触屏轻点只想开浮层、不想让周围的可编辑区拿到焦点时用，不从包里导出
 */
import { TOUCH_POINTER_TYPES } from './tapRecognizer.js'

export interface TapStop {
  /** 绑到 `pointerdown`：记下这次按压是不是手指或笔。 */
  onPointerdown: (event: PointerEvent) => void
  /** 绑到要取消的那个鼠标事件（`mousedown` 或 `click`）：手指或笔的那一次被取消，鼠标的不动。 */
  onCancel: (event: Event) => void
}

/**
 * 手指或笔的一次轻点，浏览器会补发一次鼠标按下，它让外层可编辑区拿到焦点和光标，
 * 手机上还会弹出键盘盖住刚打开的浮层。取消那次合成的鼠标事件即可，
 * 取消 `pointerdown` 本身会让 WebKit 丢掉随后的 click。鼠标的按压照旧。
 */
export function createTapStop(): TapStop {
  let isTap = false
  return {
    onPointerdown(event) {
      isTap = TOUCH_POINTER_TYPES.has(event.pointerType)
    },
    onCancel(event) {
      if (!isTap)
        return
      isTap = false
      event.preventDefault()
    },
  }
}
