import type { Ref } from 'vue'
import { ensureCaretInside, isSelectionAtEnd, isSelectionAtStart, selectAllContents } from './selection.js'
import { serializeComposer } from './serialize.js'

export interface UseComposerHistoryOptions {
  enabled: Ref<boolean>
  editable: Ref<HTMLElement | null>
  onRecall: () => void
}

export interface UseComposerHistoryReturn {
  remember: (text: string) => void
  onKeyDown: (event: KeyboardEvent) => boolean
}

/**
 * ArrowUp at the start of the draft recalls the previous submission.
 * ArrowDown at the end steps forward. Anywhere else, the caret moves a line.
 */
export function useComposerHistory(options: UseComposerHistoryOptions): UseComposerHistoryReturn {
  const history: string[] = []
  let index = -1
  let draft = ''

  function remember(text: string): void {
    if (!options.enabled.value)
      return
    history.push(text)
    index = -1
    draft = ''
  }

  function onKeyDown(event: KeyboardEvent): boolean {
    if (!options.enabled.value || (event.key !== 'ArrowUp' && event.key !== 'ArrowDown'))
      return false
    const editable = options.editable.value
    if (!editable || history.length === 0)
      return false

    ensureCaretInside(editable)
    const collapsed = window.getSelection()?.isCollapsed ?? true
    const atStart = isSelectionAtStart(editable)
    const atEnd = isSelectionAtEnd(editable)
    const canRecallPrevious = atStart && (collapsed || atEnd)
    const canRecallNext = atEnd && (collapsed || atStart)
    if (event.key === 'ArrowUp' ? !canRecallPrevious : !canRecallNext)
      return false

    if (event.key === 'ArrowUp') {
      if (index === -1)
        draft = serializeComposer(editable)
      index = index === -1 ? history.length - 1 : Math.max(0, index - 1)
      editable.textContent = history[index] ?? ''
      selectAllContents(editable)
      options.onRecall()
      event.preventDefault()
      return true
    }

    if (index === -1)
      return false
    const next = index + 1
    if (next >= history.length) {
      index = -1
      editable.textContent = draft
      if (draft)
        selectAllContents(editable)
    }
    else {
      index = next
      editable.textContent = history[next] ?? ''
      selectAllContents(editable)
    }
    options.onRecall()
    event.preventDefault()
    return true
  }

  return { remember, onKeyDown }
}
