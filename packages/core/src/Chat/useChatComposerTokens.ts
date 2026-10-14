import type { Ref } from 'vue'
import type { ChatComposerToken } from './types.js'
import { ref } from 'vue'
import { ensureCaretInside, insertTextAtCursor } from './selection.js'

export interface TokenPortal {
  id: string
  span: HTMLSpanElement
  token: ChatComposerToken
}

export interface UseChatComposerTokensOptions {
  editable: Ref<HTMLElement | null>
  onEmitChange: () => void
}

export interface UseChatComposerTokensReturn {
  portals: Ref<TokenPortal[]>
  insertToken: (token: ChatComposerToken) => string | undefined
  expandToken: (id: string) => void
  handleKeyDown: (event: KeyboardEvent) => boolean
  handlePaste: (event: ClipboardEvent) => boolean
  cleanupPortals: () => void
  clearPortals: () => void
}

const TRAILING_SPACE = '\u00A0'

function isTokenElement(node: Node | null): node is HTMLElement {
  return node instanceof HTMLElement && node.hasAttribute('data-astryx-token')
}

function tokenAncestor(node: Node | null): HTMLElement | null {
  let current: Node | null = node
  while (current) {
    if (isTokenElement(current))
      return current
    current = current.parentNode
  }
  return null
}

/**
 * Inline chips inside the composer. The DOM span is the source of truth for
 * serialization; Vue teleports the visible badge into it.
 */
export function useChatComposerTokens(options: UseChatComposerTokensOptions): UseChatComposerTokensReturn {
  const portals = ref<TokenPortal[]>([])

  function insertToken(token: ChatComposerToken): string | undefined {
    const editable = options.editable.value
    if (!editable)
      return undefined
    const selection = ensureCaretInside(editable)
    if (!selection || selection.rangeCount === 0)
      return undefined

    const range = selection.getRangeAt(0)
    const span = document.createElement('span')
    const id = `token-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    span.setAttribute('data-astryx-token', '')
    span.setAttribute('data-astryx-token-value', token.value)
    span.setAttribute('data-astryx-token-id', id)
    span.contentEditable = 'false'
    span.style.display = 'inline-flex'
    span.style.alignItems = 'center'
    span.style.height = '1lh'
    span.style.verticalAlign = 'top'

    range.deleteContents()
    range.insertNode(span)
    const space = document.createTextNode(TRAILING_SPACE)
    span.after(space)

    const next = document.createRange()
    next.setStartAfter(space)
    next.collapse(true)
    selection.removeAllRanges()
    selection.addRange(next)

    portals.value = [...portals.value, { id, span, token }]
    return id
  }

  function handleKeyDown(event: KeyboardEvent): boolean {
    if (event.key !== 'Backspace')
      return false
    const selection = window.getSelection()
    if (!selection || !selection.isCollapsed || selection.rangeCount === 0)
      return false
    const range = selection.getRangeAt(0)
    const { startContainer, startOffset } = range
    if (startContainer.nodeType !== Node.TEXT_NODE)
      return false
    const previous = startContainer.previousSibling
    if (!isTokenElement(previous))
      return false
    if (startOffset === 0)
      return false
    if (startContainer.textContent === TRAILING_SPACE && startOffset <= 1) {
      event.preventDefault()
      const parent = startContainer.parentNode
      parent?.removeChild(startContainer)
      parent?.removeChild(previous)
      options.onEmitChange()
      return true
    }
    return false
  }

  function handlePaste(event: ClipboardEvent): boolean {
    const editable = options.editable.value
    if (!editable)
      return false
    const selection = ensureCaretInside(editable)
    if (!selection || selection.rangeCount === 0)
      return false
    const token = tokenAncestor(selection.getRangeAt(0).startContainer)
    if (!token)
      return false
    event.preventDefault()
    const text = event.clipboardData?.getData('text/plain') ?? ''
    const space = token.nextSibling
    const next = document.createRange()
    if (space && space.nodeType === Node.TEXT_NODE)
      next.setStartAfter(space)
    else
      next.setStartAfter(token)
    next.collapse(true)
    selection.removeAllRanges()
    selection.addRange(next)
    insertTextAtCursor(editable, text)
    options.onEmitChange()
    return true
  }

  function expandToken(id: string): void {
    const editable = options.editable.value
    const portal = portals.value.find(item => item.id === id)
    if (!editable || !portal)
      return
    const { span } = portal
    const value = span.getAttribute('data-astryx-token-value') ?? ''
    const textNode = document.createTextNode(value)
    const next = span.nextSibling
    if (next?.nodeType === Node.TEXT_NODE && next.textContent === TRAILING_SPACE)
      next.remove()
    span.replaceWith(textNode)
    const selection = window.getSelection()
    if (selection) {
      const range = document.createRange()
      range.setStartAfter(textNode)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    portals.value = portals.value.filter(item => item.id !== id)
    options.onEmitChange()
  }

  function cleanupPortals(): void {
    const editable = options.editable.value
    portals.value = portals.value.filter(item => editable?.contains(item.span))
  }

  function clearPortals(): void {
    portals.value = []
  }

  return {
    portals,
    insertToken,
    expandToken,
    handleKeyDown,
    handlePaste,
    cleanupPortals,
    clearPortals,
  }
}
