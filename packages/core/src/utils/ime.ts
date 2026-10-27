/**
 * 输入法（IME）正在拼字时的按键判断，全库只用这一个。
 *
 * 中文、日文、韩文用户拼字时，按 Enter 是把候选词上屏，按 Escape 是取消拼字，
 * 方向键是在候选框里挑词。浏览器会先发这个 keydown，随后才发 `compositionend`，
 * 不判断的话，菜单、对话框、快捷键会把它当成命令：提交、关闭、跳转。
 *
 * 三个信号任一成立就算拼字中：
 * - `isComposing === true`：标准信号，现在的浏览器都可靠；
 * - `keyCode === 229`：浏览器表示「这个键交给输入法处理了」的老信号，部分输入法和老版 Safari
 *   发拼字的 keydown 时还没把 `isComposing` 设上，只有这个；
 * - `key === 'Process'`：同一件事在 `key` 上的写法。
 */
const IME_PROCESSING_KEY_CODE = 229

export interface ImeKeyEventLike {
  isComposing?: boolean
  keyCode?: number
  key?: string
}

/** 这个按键属于输入法正在进行的拼字，不能当命令处理。 */
export function isImeKeyEvent(event: ImeKeyEventLike): boolean {
  return event.isComposing === true
    || event.keyCode === IME_PROCESSING_KEY_CODE
    || event.key === 'Process'
}
