import type { ChatComposerTrigger } from './types.js'

/** A multi-word query longer than this stops being a query. */
export const MAX_MULTI_WORD_QUERY_LENGTH = 64

export interface ActiveTriggerQuery {
  trigger: ChatComposerTrigger
  query: string
  triggerStart: number
}

export function textBeforeCursor(editable: HTMLElement): string | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !selection.getRangeAt(0).collapsed)
    return null
  const range = selection.getRangeAt(0)
  if (!editable.contains(range.startContainer) || range.startContainer.nodeType !== Node.TEXT_NODE)
    return null
  return (range.startContainer.textContent ?? '').slice(0, range.startOffset)
}

export function caretTextNode(editable: HTMLElement): Node | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return null
  const node = selection.getRangeAt(0).startContainer
  return node.nodeType === Node.TEXT_NODE && editable.contains(node) ? node : null
}

function isTriggerBoundary(char: string | null): boolean {
  return char === null || char === ' ' || char === '\t' || char === '\n'
}

/**
 * The caret's trigger query.
 * A trigger character starts the text or follows a space, a tab, or a line break.
 * A single-token query ends at a space, a tab, or a line break.
 * A multi-word query ends at a line break, past the length bound, or where the
 * same trigger character starts again. Another trigger's character stays text.
 */
export function findActiveTrigger(
  textBefore: string,
  triggers: readonly ChatComposerTrigger[],
): ActiveTriggerQuery | null {
  let active: { trigger: ChatComposerTrigger, triggerStart: number } | null = null

  for (let index = 0; index < textBefore.length; index += 1) {
    const char = textBefore[index]
    if (char === '\n') {
      active = null
      continue
    }
    if (active && !active.trigger.hasMultiWordQuery) {
      if (char === ' ' || char === '\t')
        active = null
      continue
    }
    if (active && index - active.triggerStart > MAX_MULTI_WORD_QUERY_LENGTH)
      active = null

    if (!isTriggerBoundary(index > 0 ? textBefore[index - 1] : null))
      continue
    const trigger = triggers.find(item => item.character === char)
    if (!trigger)
      continue
    if (active && trigger.character !== active.trigger.character)
      continue
    active = { trigger, triggerStart: index }
  }

  if (!active)
    return null
  const query = textBefore.slice(active.triggerStart + 1)
  if (active.trigger.hasMultiWordQuery && query.length > MAX_MULTI_WORD_QUERY_LENGTH)
    return null
  return { trigger: active.trigger, query, triggerStart: active.triggerStart }
}

/** An unmatched multi-word query hides the menu unless the caller wrote an empty message. */
export function isUnmatchedMultiWordQuery(
  trigger: ChatComposerTrigger | null,
  items: readonly unknown[],
  isLoading: boolean,
): boolean {
  return trigger?.hasMultiWordQuery === true
    && trigger.emptySearchText == null
    && items.length === 0
    && !isLoading
}
