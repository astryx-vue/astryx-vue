/** 把 caret 放到元素文本的字符偏移处。 */
export function setCaretAtTextOffset(element: HTMLElement, offset: number): void {
  const selection = element.ownerDocument.defaultView?.getSelection()
  if (!selection)
    return
  const range = element.ownerDocument.createRange()
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  let remaining = Math.max(0, offset)
  while (node) {
    const length = node.textContent?.length ?? 0
    if (remaining <= length) {
      range.setStart(node, remaining)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
      return
    }
    remaining -= length
    node = walker.nextNode()
  }
  range.selectNodeContents(element)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

/** 当前 caret 在元素纯文本里的偏移。 */
export function caretTextOffset(element: HTMLElement): number | null {
  const selection = element.ownerDocument.defaultView?.getSelection()
  if (!selection || selection.rangeCount === 0)
    return null
  const range = selection.getRangeAt(0)
  const before = range.cloneRange()
  before.selectNodeContents(element)
  before.setEnd(range.startContainer, range.startOffset)
  return before.toString().length
}

/** 用一段文本替换当前选区，并把 caret 放在新文本后面。 */
export function insertAtCaret(element: HTMLElement, text: string): void {
  const selection = element.ownerDocument.defaultView?.getSelection()
  if (!selection || selection.rangeCount === 0)
    return
  const range = selection.getRangeAt(0)
  range.deleteContents()
  const node = element.ownerDocument.createTextNode(text)
  range.insertNode(node)
  range.setStartAfter(node)
  range.setEndAfter(node)
  selection.removeAllRanges()
  selection.addRange(range)
}

/** 去掉当前行开头最多两个空格，返回新文本和 caret 应到的位置。 */
export function outdentCurrentLine(element: HTMLElement): { value: string, caret: number } | null {
  const offset = caretTextOffset(element)
  if (offset == null)
    return null
  const value = element.textContent ?? ''
  const lineStart = value.lastIndexOf('\n', offset - 1) + 1
  const line = value.slice(lineStart)
  const removeCount = line.startsWith('  ') ? 2 : line.startsWith(' ') ? 1 : 0
  if (removeCount === 0)
    return null
  return {
    value: `${value.slice(0, lineStart)}${value.slice(lineStart + removeCount)}`,
    caret: offset - Math.min(removeCount, Math.max(0, offset - lineStart)),
  }
}
