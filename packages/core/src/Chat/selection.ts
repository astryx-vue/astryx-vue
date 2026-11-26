/**
 * Caret helpers for the contenteditable composer.
 *
 * A programmatic focus is not a click on the padding: Chromium drops the caret
 * at the start of the draft, which is exactly where ArrowUp means "recall the
 * previous message". Callers that care where the caret lands place it themselves.
 */

export function getSelectionRangeInside(editable: HTMLElement): Range | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return null
  const range = selection.getRangeAt(0)
  if (!editable.contains(range.startContainer) || !editable.contains(range.endContainer))
    return null
  return range.cloneRange()
}

export function restoreSelectionRange(range: Range): void {
  const selection = window.getSelection()
  if (!selection)
    return
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * 折叠的范围落在元素边界上时，走进它前面的文本节点。
 * Chromium 把输入法组字锚在开始组字的 DOM 边界上：从元素边界起笔，
 * 第一个拼音字母会被当成普通字母直接上屏，不进组字。
 * 前面是可编辑元素时，落到它最后一个文本节点的末尾；否则范围保持原位。
 */
export function landInsideTrailingTextNode(editable: HTMLElement, range: Range): void {
  if (range.startContainer !== editable)
    return
  const offset = range.startOffset
  const before = offset > 0 ? editable.childNodes[offset - 1] : null
  if (before == null)
    return
  if (before.nodeType === Node.TEXT_NODE) {
    range.setStart(before, before.nodeValue?.length ?? 0)
    range.collapse(true)
    return
  }
  if (before instanceof HTMLElement && before.isContentEditable) {
    for (let current: Node = before; current.lastChild;) {
      current = current.lastChild
      if (current.nodeType === Node.TEXT_NODE) {
        range.setStart(current, current.nodeValue?.length ?? 0)
        range.collapse(true)
        return
      }
    }
  }
}

/** 把光标折叠到 `node` 之后（`node` 为 null 时在开头），并落进它前面的文本里。 */
export function placeCaretAfterNode(editable: HTMLElement, node: Node | null): void {
  const selection = window.getSelection()
  if (!selection)
    return
  const range = document.createRange()
  if (node)
    range.setStartAfter(node)
  else
    range.setStart(editable, 0)
  range.collapse(true)
  landInsideTrailingTextNode(editable, range)
  selection.removeAllRanges()
  selection.addRange(range)
}

/** 到 `node` 为止的内容是否以换行收尾：最后一个非空节点是 `<br>`，或以 `\n` 结尾的文本。 */
function endsLine(node: Node | null): boolean {
  let current = node
  while (current != null && current.nodeType === Node.TEXT_NODE && current.textContent === '')
    current = current.previousSibling
  if (current == null)
    return false
  if (current.nodeName === 'BR')
    return true
  return current.nodeType === Node.TEXT_NODE && (current.textContent ?? '').endsWith('\n')
}

/** `node` 或它后面的兄弟里有没有内容；空文本节点不算。 */
function hasContentFrom(node: Node | null): boolean {
  for (let current = node; current != null; current = current.nextSibling) {
    if (current.nodeType !== Node.TEXT_NODE || current.textContent !== '')
      return true
  }
  return false
}

/**
 * 令牌被删掉之后把光标放回原处。`before` 和 `after` 是令牌及其尾随空格两侧的节点。
 * 删除让最后一行变空时，这一行留一个 `<br>` 占位（浏览器自己的删除也会留），
 * 光标落在它前面的空文本节点里，接着输入或组字都停在这一行；否则落到 `before` 之后。
 */
export function placeCaretAfterRemovedToken(editable: HTMLElement, before: Node | null, after: Node | null): void {
  if (!hasContentFrom(after) && endsLine(before)) {
    const selection = window.getSelection()
    if (!selection)
      return
    const text = document.createTextNode('')
    editable.append(text, document.createElement('br'))
    const range = document.createRange()
    range.setStart(text, 0)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    return
  }
  placeCaretAfterNode(editable, before)
}

export function placeCaretAtEnd(editable: HTMLElement): boolean {
  const selection = window.getSelection()
  if (!selection)
    return false
  const range = document.createRange()
  range.selectNodeContents(editable)
  range.collapse(false)
  landInsideTrailingTextNode(editable, range)
  selection.removeAllRanges()
  selection.addRange(range)
  return true
}

export function selectAllContents(editable: HTMLElement): void {
  const selection = window.getSelection()
  if (!selection)
    return
  const range = document.createRange()
  range.selectNodeContents(editable)
  selection.removeAllRanges()
  selection.addRange(range)
}

/**
 * Keep an existing caret inside `editable`. Otherwise place one at the end.
 * A caret that focus() already left at offset 0 is left alone.
 */
export function ensureCaretInside(editable: HTMLElement): Selection | null {
  const selection = window.getSelection()
  if (!selection)
    return null
  if (selection.rangeCount > 0 && editable.contains(selection.getRangeAt(0).startContainer))
    return selection
  const range = document.createRange()
  range.selectNodeContents(editable)
  range.collapse(false)
  landInsideTrailingTextNode(editable, range)
  selection.removeAllRanges()
  selection.addRange(range)
  return selection
}

export function isSelectionAtStart(editable: HTMLElement): boolean {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return false
  const range = selection.getRangeAt(0)
  return isBoundaryAtEdge(editable, range.startContainer, range.startOffset, 'start')
}

export function isSelectionAtEnd(editable: HTMLElement): boolean {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return false
  const range = selection.getRangeAt(0)
  return isBoundaryAtEdge(editable, range.endContainer, range.endOffset, 'end')
}

export function insertTextAtCursor(editable: HTMLElement, text: string): boolean {
  const selection = ensureCaretInside(editable)
  if (!selection || selection.rangeCount === 0)
    return false
  const range = selection.getRangeAt(0)
  range.deleteContents()
  const textNode = document.createTextNode(text)
  range.insertNode(textNode)
  // Stay inside the new text node. A caret on the parent element hides the
  // trigger menu, which only reads the text node in front of the caret.
  range.setStart(textNode, textNode.textContent?.length ?? 0)
  range.collapse(true)
  selection.removeAllRanges()
  selection.addRange(range)
  return true
}

function isBoundaryAtEdge(
  editable: HTMLElement,
  container: Node,
  offset: number,
  edge: 'start' | 'end',
): boolean {
  if (!editable.contains(container) || !isAtNodeEdge(container, offset, edge))
    return false
  for (let node: Node | null = container; node && node !== editable;) {
    if (hasContentSibling(node, edge))
      return false
    node = node.parentNode
  }
  return true
}

function isAtNodeEdge(node: Node, offset: number, edge: 'start' | 'end'): boolean {
  if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
    return edge === 'start'
      ? offset === 0
      : offset === (node.nodeValue?.length ?? 0)
  }
  return edge === 'start' ? offset === 0 : offset === node.childNodes.length
}

function hasContentSibling(node: Node, edge: 'start' | 'end'): boolean {
  for (
    let sibling = edge === 'start' ? node.previousSibling : node.nextSibling;
    sibling;
    sibling = edge === 'start' ? sibling.previousSibling : sibling.nextSibling
  ) {
    if (sibling.nodeType === Node.ELEMENT_NODE || (sibling.nodeType === Node.TEXT_NODE && sibling.nodeValue !== ''))
      return true
  }
  return false
}
