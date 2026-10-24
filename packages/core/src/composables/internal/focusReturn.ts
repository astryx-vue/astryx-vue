import { getInteractionModality, trackInteractionModality } from './interactionModality.js'

/**
 * 焦点归还的两个小工具。浮层关闭、把焦点还给触发器时用。
 */

/**
 * 焦点现在是不是「哪儿都不在」：没有活动元素，或者落在 body / 根元素上。
 *
 * 浮层关闭时只在这种情况下把焦点还给触发器。`popover="auto"` 的点外关闭和指针事件同步发生，
 * 关闭回调跑的时候焦点已经落在用户点的那个地方了，再抢回来就和那一下点击打架。
 * 只有按 Escape、或者点在不可聚焦的空白处，焦点才会掉到 body，这时触发器才该接回来。
 */
export function isFocusDetached(doc: Document = document): boolean {
  const active = doc.activeElement
  return active == null || active === doc.body || active === doc.documentElement
}

function isTextEntry(element: HTMLElement): boolean {
  return element instanceof HTMLInputElement
    || element instanceof HTMLTextAreaElement
    || element instanceof HTMLSelectElement
    || element.isContentEditable
}

/**
 * 程序移动焦点，焦点环跟着上一次的输入走：
 * 上一次是键盘就照常画环，上一次是鼠标或手指就不画。
 *
 * 用鼠标或手指关掉浮层后，焦点回到触发器上，但触发器不会突然亮起一圈焦点环。
 * 文本输入类元素例外：它们本来就要画出「打字会落在这里」，多一次 blur 还可能触发校验，
 * 所以一律直接聚焦。`options` 原样交给 `focus()`，例如 `preventScroll`。
 */
export function focusForLastInput(element: HTMLElement, options?: FocusOptions): void {
  trackInteractionModality()
  if (isTextEntry(element) || getInteractionModality() !== 'pointer') {
    element.focus(options)
    return
  }
  // 已经有焦点的元素再 focus 一次什么都不变，浏览器自己画上的环会留着。
  // WebKit 在对话框关闭、popover 隐藏、自己还原焦点时会画一圈，所以先把它清掉。
  if (element.matches(':focus-visible'))
    element.blur()
  element.focus({ ...options, focusVisible: false } as FocusOptions)
}
