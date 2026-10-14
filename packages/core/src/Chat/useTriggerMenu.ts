import type { ComputedRef, Ref } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { ChatComposerToken, ChatComposerTrigger } from './types.js'
import { computed, onScopeDispose, reactive, ref, useId } from 'vue'

export interface TriggerMenuState {
  isActive: boolean
  activeTrigger: ChatComposerTrigger | null
  query: string
  items: SearchableItem[]
  highlightedIndex: number
  isLoading: boolean
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

function textBeforeCursor(editable: HTMLElement): string | null {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0 || !selection.getRangeAt(0).collapsed)
    return null
  const range = selection.getRangeAt(0)
  if (!editable.contains(range.startContainer) || range.startContainer.nodeType !== Node.TEXT_NODE)
    return null
  return (range.startContainer.textContent ?? '').slice(0, range.startOffset)
}

function findActiveTrigger(text: string, triggers: readonly ChatComposerTrigger[]): {
  trigger: ChatComposerTrigger
  query: string
  triggerStart: number
} | null {
  for (let index = text.length - 1; index >= 0; index -= 1) {
    const char = text[index]
    if (char === ' ' || char === '\n')
      return null
    for (const trigger of triggers) {
      if (char !== trigger.character)
        continue
      const previous = index > 0 ? text[index - 1] : null
      if (previous === null || previous === ' ' || previous === '\n')
        return { trigger, query: text.slice(index + 1), triggerStart: index }
    }
  }
  return null
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
  })
  const anchor = ref<HTMLElement | null>(null)
  const keyboardMove = ref(false)
  let triggerStart = -1
  let timer: ReturnType<typeof setTimeout> | undefined
  let requestId = 0
  const asyncSources = new WeakSet<object>()

  function removeAnchor(): void {
    anchor.value?.remove()
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

  function applyItems(items: SearchableItem[], captured: number): void {
    if (captured !== requestId)
      return
    state.items = items
    state.highlightedIndex = items.length > 0 ? 0 : -1
    state.isLoading = false
  }

  function runSearch(trigger: ChatComposerTrigger, query: string): void {
    const source = trigger.searchSource
    source.cancel?.()
    const captured = ++requestId
    state.isLoading = true
    const result = source.search(query)
    if (isPromise(result)) {
      asyncSources.add(source)
      void result.then(
        items => applyItems(items, captured),
        () => applyItems([], captured),
      )
      return
    }
    applyItems(result, captured)
  }

  function searchItems(trigger: ChatComposerTrigger, query: string): void {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
    const delay = options.debounceMs?.value ?? 150
    if (asyncSources.has(trigger.searchSource) && delay > 0) {
      state.isLoading = true
      timer = setTimeout(() => {
        timer = undefined
        runSearch(trigger, query)
      }, delay)
      return
    }
    runSearch(trigger, query)
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
    state.isActive = false
    state.activeTrigger = null
    state.query = ''
    state.items = []
    state.highlightedIndex = 0
    state.isLoading = false
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
      if (state.isActive)
        reset()
      return
    }
    const found = findActiveTrigger(before, triggers)
    if (!found) {
      if (state.isActive)
        reset()
      return
    }
    if (!state.isActive || state.activeTrigger !== found.trigger) {
      triggerStart = found.triggerStart
      state.isActive = true
      state.activeTrigger = found.trigger
      state.query = found.query
      state.highlightedIndex = 0
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

  function handleKeyDown(event: KeyboardEvent): boolean {
    if (!state.isActive)
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
      const item = state.items[state.highlightedIndex]
      if (!item)
        return false
      event.preventDefault()
      selectItem(item)
      return true
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      reset()
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
    handleInput,
    handleKeyDown,
    selectItem,
    highlightOnHover,
    reset,
  }
}
