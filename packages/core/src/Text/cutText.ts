/**
 * 量一个组件自己的文字（按钮标签、表头标题）有没有被截短，以及看得见的那段文字是什么。
 * 隐藏的、只给读屏用的、以及输入框里的值都不算这段文字。
 */

// 输入框和显示选中值的控件（下拉框的 combobox 等）：它们的值在自己盒子里裁切，不是组件的文字。
const FIELD_SELECTOR = 'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="searchbox"], [role="spinbutton"], [role="slider"], [role="textbox"]'

/** 盒子是否裁掉了自己的内容。 */
function overflows(element: Element): boolean {
  const box = element.clientWidth || (element instanceof HTMLElement ? element.offsetWidth : 0)
  return box > 0 && element.scrollWidth > box
}

/** 只给读屏看的隐藏写法（VisuallyHidden）。 */
function isVisuallyHidden(element: Element): boolean {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  return style != null
    && style.position === 'absolute'
    && ((style.clip !== '' && style.clip !== 'auto') || (style.clipPath !== '' && style.clipPath !== 'none'))
}

/** 不算进文字的元素：隐藏的、隐藏副本（ToggleButton 预留粗体宽度用的）、只给读屏的，或输入控件。 */
function isLeftOut(element: Element): boolean {
  return element.closest(`[hidden], [aria-hidden="true"], ${FIELD_SELECTOR}`) != null || isVisuallyHidden(element)
}

/** 文字是否被截短：它自己的盒子，或里面一个看得见的盒子，裁掉了内容。 */
export function isTextCut(element: HTMLElement): boolean {
  return overflows(element) || [...element.querySelectorAll('*')].some(child => !isLeftOut(child) && overflows(child))
}

/** 明眼读者看到的文字：去掉隐藏的、只给读屏的和输入框里的文字，空白合并成一个空格。 */
export function visibleText(root: HTMLElement): string {
  let text = ''
  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE)
      text += node.textContent ?? ''
    else if (node instanceof Element && !isLeftOut(node))
      node.childNodes.forEach(walk)
  }
  walk(root)
  return text.replace(/\s+/g, ' ').trim()
}

/** 调用方自己的 Tooltip 已经在描述这个元素：截断提示让给它，同一处只出现一个提示。 */
export function hasCallerTooltip(element: HTMLElement): boolean {
  const ids = element.getAttribute('aria-describedby')?.split(/\s+/) ?? []
  return ids.some(id => id !== '' && element.ownerDocument.getElementById(id)?.getAttribute('role') === 'tooltip')
}
