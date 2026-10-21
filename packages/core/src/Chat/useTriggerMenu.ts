import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { ChatComposerToken, ChatComposerTrigger } from './types.js'
import { computed, onScopeDispose, reactive, ref, useId } from 'vue'
import { isImeKeyEvent } from '../composables/internal/ime.js'
import { flattenSearchItems } from './groupSearchItems.js'
import { caretTextNode, findActiveTrigger, isUnmatchedMultiWordQuery, textBeforeCursor } from './triggerQuery.js'

export interface TriggerMenuState {
  isActive: boolean
  activeTrigger: ChatComposerTrigger | null
  query: string
  items: SearchableItem[]
  highlightedIndex: number
  isLoading: boolean
  /** The query is still active, but an unmatched multi-word phrase hides the menu. */
  isHidden: boolean
}

export interface UseTriggerMenuOptions {
  triggers: Ref<ChatComposerTrigger[] | undefined>
  editable: Ref<HTMLElement | null>
  onInsertToken: (token: ChatComposerToken) => void
  onInsertText: (text: string) => void
  onEmitChange: () => void
  /** Delay before an async search. Sync sources run immediately. @default 150 */
  debounceMs?: Ref<number>
}

interface DismissedQuery {
  character: string
  triggerStart: number
  dismissedQuery: string
  textNode: Node | null
}

function deleteTriggerText(triggerStart: number): void {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0)
    return
  const range = selection.getRangeAt(0)
  const node = range.startContainer
  if (node.nodeType !== Node.TEXT_NODE)
    return
  const text = node.textContent ?? ''
  node.textContent = text.slice(0, triggerStart) + text.slice(range.startOffset)
  const next = document.createRange()
  next.setStart(node, triggerStart)
  next.collapse(true)
  selection.removeAllRanges()
  selection.addRange(next)
}

export interface UseTriggerMenuReturn {
  state: TriggerMenuState
  listboxId: string
  anchor: Ref<HTMLElement | null>
  keyboardMove: Ref<boolean>
  hasTriggers: ComputedRef<boolean>
  isMenuVisible: ComputedRef<boolean>
  handleInput: () => void
  handleKeyDown: (event: KeyboardEvent) => boolean
  selectItem: (item: SearchableItem) => void
  highlightOnHover: (index: number) => void
  reset: () => void
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === 'function'
}

/**
 * Opens a suggestion list when a trigger character is typed at a word boundary.
 * A trigger may opt into a multi-word query. Results apply only while that
 * query is still the one at the caret.
 */
export function useTriggerMenu(options: UseTriggerMenuOptions): UseTriggerMenuReturn {
  const listboxId = useId()
  const state = reactive<TriggerMenuState>({
    isActive: false,
    activeTrigger: null,
    query: '',
    items: [],
    highlightedIndex: 0,
    isLoading: false,
    isHidden: false,
  })
  const anchor = ref<HTMLElement | null>(null)
  const keyboardMove = ref(false)
  let triggerStart = -1
  let timer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0
  let dismissed: DismissedQuery | null = null
  const asyncSources = new WeakSet<object>()

  function removeAnchor(): void {
    if (anchor.value?.getAttribute('data-astryx-trigger-anchor') != null)
      anchor.value.remove()
    anchor.value = null
  }

  function placeAnchor(): void {
    const editable = options.editable.value
    if (!editable) {
      removeAnchor()
      return
    }
    const selection = window.getSelection()
    removeAnchor()
    if (!selection || selection.rangeCount === 0) {
      anchor.value = editable
      return
    }
    const range = selection.getRangeAt(0).cloneRange()
    range.collapse(true)
    const rect = typeof range.getBoundingClientRect === 'function' ? range.getBoundingClientRect() : null
    if (!rect || (rect.width === 0 && rect.height === 0 && rect.top === 0 && rect.left === 0)) {
      anchor.value = editable
      return
    }
    const span = document.createElement('span')
    span.setAttribute('aria-hidden', 'true')
    span.setAttribute('data-astryx-trigger-anchor', '')
    span.style.position = 'fixed'
    span.style.left = `${rect.left}px`
    span.style.top = `${rect.top}px`
    span.style.width = `${Math.max(rect.width, 1)}px`
    span.style.height = `${rect.height}px`
    span.style.pointerEvents = 'none'
    span.style.opacity = '0'
    document.body.append(span)
    anchor.value = span
  }

  function queryStillCurrent(captured: number, trigger: ChatComposerTrigger): boolean {
    if (captured !== requestId)
      return false
    const editable = options.editable.value
    const before = editable ? textBeforeCursor(editable) : null
    const triggers = options.triggers.value
    const found = before == null || !triggers ? null : findActiveTrigger(before, triggers)
    if (found?.trigger.character !== trigger.character || found.triggerStart !== triggerStart) {
      reset()
      return false
    }
    return true
  }

  function applyItems(items: SearchableItem[], captured: number, trigger: ChatComposerTrigger): void {
    if (!queryStillCurrent(captured, trigger))
      return
    state.items = items
    state.highlightedIndex = items.length > 0 ? 0 : -1
    state.isLoading = false
    state.isHidden = isUnmatchedMultiWordQuery(trigger, items, false)
  }

  function runSearch(trigger: ChatComposerTrigger, query: string, captured: number): void {
    const source = trigger.searchSource
    state.isLoading = true
    const result = source.search(query)
    if (isPromise(result)) {
      asyncSources.add(source)
      void result.then(
        items => applyItems(items, captured, trigger),
        () => applyItems([], captured, trigger),
      )
      return
    }
    applyItems(result, captured, trigger)
  }

  function searchItems(trigger: ChatComposerTrigger, query: string): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
    const captured = ++requestId
    trigger.searchSource.cancel?.()
    const delay = options.debounceMs?.value ?? 150
    if (asyncSources.has(trigger.searchSource) && delay > 0) {
      state.isLoading = true
      timer = setTimeout(() => {
        timer = undefined
        runSearch(trigger, query, captured)
      }, delay)
      return
    }
    runSearch(trigger, query, captured)
  }

  function reset(): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
    state.activeTrigger?.searchSource.cancel?.()
    requestId += 1
    removeAnchor()
    triggerStart = -1
    dismissed = null
    state.isActive = false
    state.activeTrigger = null
    state.query = ''
    state.items = []
    state.highlightedIndex = 0
    state.isLoading = false
    state.isHidden = false
  }

  function selectItem(item: SearchableItem): void {
    const trigger = state.activeTrigger
    const editable = options.editable.value
    if (!trigger || !editable)
      return
    removeAnchor()
    deleteTriggerText(triggerStart)
    const result = trigger.onSelect(item)
    if (typeof result === 'string')
      options.onInsertText(result)
    else
      options.onInsertToken(result)
    options.onEmitChange()
    reset()
  }

  function handleInput(): void {
    const triggers = options.triggers.value
    const editable = options.editable.value
    if (!triggers || triggers.length === 0 || !editable)
      return
    const before = textBeforeCursor(editable)
    if (before === null) {
      dismissed = null
      if (state.isActive)
        reset()
      return
    }
    const found = findActiveTrigger(before, triggers)
    if (!found) {
      dismissed = null
      if (state.isActive)
        reset()
      return
    }
    const remembered = dismissed
    if (
      remembered
      && remembered.character === found.trigger.character
      && remembered.triggerStart === found.triggerStart
      && remembered.textNode !== null
      && remembered.textNode.isConnected
      && remembered.textNode === caretTextNode(editable)
    ) {
      if (found.query.startsWith(remembered.dismissedQuery))
        return
      dismissed = null
    }
    else {
      dismissed = null
    }
    if (!state.isActive || state.activeTrigger?.character !== found.trigger.character || triggerStart !== found.triggerStart) {
      triggerStart = found.triggerStart
      state.isActive = true
      state.activeTrigger = found.trigger
      state.query = found.query
      state.highlightedIndex = 0
      state.isHidden = false
      placeAnchor()
      searchItems(found.trigger, found.query)
      return
    }
    if (state.query !== found.query) {
      state.query = found.query
      searchItems(found.trigger, found.query)
    }
  }

  function moveHighlight(next: number): void {
    keyboardMove.value = true
    state.highlightedIndex = next
  }

  function highlightedItem(): SearchableItem | undefined {
    return flattenSearchItems(state.items)[state.highlightedIndex]
  }

  const isMenuVisible = computed(() => state.isActive && !state.isHidden)

  function handleKeyDown(event: KeyboardEvent): boolean {
    if (isImeKeyEvent(event))
      return false
    if (!isMenuVisible.value)
      return false
    if (event.key === 'Escape') {
      event.preventDefault()
      const editable = options.editable.value
      const nextDismissed = state.activeTrigger
        ? {
            character: state.activeTrigger.character,
            triggerStart,
            dismissedQuery: state.query,
            textNode: editable ? caretTextNode(editable) : null,
          }
        : null
      reset()
      dismissed = nextDismissed
      return true
    }
    const hasPickableRows = !state.isLoading && state.items.length > 0
    if (!hasPickableRows && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault()
      return true
    }
    if (!hasPickableRows)
      return false
    if (event.key === 'Enter' && event.shiftKey)
      return false
    const last = state.items.length - 1
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      moveHighlight(state.highlightedIndex < last ? state.highlightedIndex + 1 : 0)
      return true
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      moveHighlight(state.highlightedIndex > 0 ? state.highlightedIndex - 1 : last)
      return true
    }
    if (event.key === 'Enter' || event.key === 'Tab') {
      const item = highlightedItem()
      if (!item)
        return false
      event.preventDefault()
      selectItem(item)
      return true
    }
    return false
  }

  function highlightOnHover(index: number): void {
    keyboardMove.value = false
    state.highlightedIndex = index
  }

  const hasTriggers = computed(() => (options.triggers.value?.length ?? 0) > 0)

  onScopeDispose(() => {
    if (timer !== undefined)
      clearTimeout(timer)
    removeAnchor()
  })

  return {
    state,
    listboxId,
    anchor,
    keyboardMove,
    hasTriggers,
    isMenuVisible,
    handleInput,
    handleKeyDown,
    selectItem,
    highlightOnHover,
    reset,
  }
}
