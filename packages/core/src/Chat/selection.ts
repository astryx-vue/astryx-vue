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

export function placeCaretAtEnd(editable: HTMLElement): boolean {
  const selection = window.getSelection()
  if (!selection)
    return false
  const range = document.createRange()
  range.selectNodeContents(editable)
  range.collapse(false)
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
  range.setStartAfter(textNode)
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
