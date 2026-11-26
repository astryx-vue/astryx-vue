/**
 * @file controlKind.ts
 * @output isTextEntryControl、isDisabledControl：按元素本身判断它是哪类控件
 * @position Tooltip、HoverCard 的触屏规则和交互模态共用，不从包里导出
 */

/** 不能输入文字的 input 类型。 */
const NON_TEXT_INPUT_TYPES = new Set(['button', 'checkbox', 'color', 'file', 'hidden', 'image', 'radio', 'range', 'reset', 'submit'])

/**
 * 这个元素是不是能打字的控件：文本框、多行文本框、可编辑区。
 * 同时读属性：测试 DOM 不一定实现 `isContentEditable`。
 */
export function isTextEntryControl(element: Element | null | undefined): boolean {
  if (element == null)
    return false
  const tag = element.tagName
  if (tag === 'TEXTAREA')
    return true
  if (tag === 'INPUT')
    return !NON_TEXT_INPUT_TYPES.has((element.getAttribute('type') ?? 'text').toLowerCase())
  if ((element as HTMLElement).isContentEditable === true)
    return true
  const editable = element.getAttribute('contenteditable')
  return editable != null && editable !== 'false'
}

/**
 * 这个控件是不是禁用的：`aria-disabled="true"`（还能聚焦、能讲出禁用原因的那种），
 * 或原生 `:disabled`。
 */
export function isDisabledControl(element: Element): boolean {
  if (element.getAttribute('aria-disabled') === 'true')
    return true
  try {
    return element.matches(':disabled')
  }
  catch {
    return false
  }
}
