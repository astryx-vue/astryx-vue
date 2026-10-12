import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'

const NAVIGATION_KEYS = new Set(['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '])

export interface UseTreeFocusOptions {
  onToggleExpand?: (id: string) => void
  onActivate?: (current: HTMLElement) => boolean
}

function isRtl(element: HTMLElement | null): boolean {
  return element != null && getComputedStyle(element).direction === 'rtl'
}

export function useTreeFocus(options: UseTreeFocusOptions): {
  treeRef: Ref<HTMLElement | null>
  handleKeyDown: (event: KeyboardEvent) => void
  handleFocus: () => void
} {
  const treeRef = ref<HTMLElement | null>(null)
  const typeahead = { buffer: '', timer: undefined as ReturnType<typeof setTimeout> | undefined }

  function items(): HTMLElement[] {
    const root = treeRef.value
    if (root == null)
      return []
    return [...root.querySelectorAll<HTMLElement>('[role="treeitem"]')]
  }

  function disabled(item: HTMLElement): boolean {
    return item.dataset.treeDisabled === 'true' || item.getAttribute('aria-disabled') === 'true'
  }

  function levelOf(item: HTMLElement): number {
    return Number(item.getAttribute('aria-level') ?? '1')
  }

  function focusItem(item: HTMLElement): void {
    for (const candidate of items())
      candidate.tabIndex = candidate === item ? 0 : -1
    item.focus()
  }

  function focusEnabledFrom(list: HTMLElement[], start: number, step: 1 | -1): void {
    for (let index = start; index >= 0 && index < list.length; index += step) {
      const item = list[index]
      if (item != null && !disabled(item)) {
        focusItem(item)
        return
      }
    }
  }

  function syncTabStops(): void {
    const list = items()
    const active = document.activeElement
    const current = active instanceof Element ? active.closest<HTMLElement>('[role="treeitem"]') : null
    const owned = current != null && list.includes(current) ? current : list.find(item => item.tabIndex === 0) ?? list.find(item => !disabled(item))
    for (const item of list)
      item.tabIndex = item === owned ? 0 : -1
  }

  onMounted(syncTabStops)

  function handleKeyDown(event: KeyboardEvent): void {
    const list = items()
    if (list.length === 0)
      return
    const active = document.activeElement
    const activeItem = active instanceof Element ? active.closest<HTMLElement>('[role="treeitem"]') : null
    const currentIndex = list.findIndex(item => item === activeItem)
    const current = currentIndex >= 0 ? list[currentIndex] : undefined

    if (
      event.key.length === 1
      && !event.ctrlKey
      && !event.metaKey
      && !event.altKey
      && !NAVIGATION_KEYS.has(event.key)
    ) {
      typeahead.buffer += event.key.toLowerCase()
      clearTimeout(typeahead.timer)
      typeahead.timer = setTimeout(() => {
        typeahead.buffer = ''
      }, 500)
      const query = typeahead.buffer
      const ordered = [...list.slice(currentIndex + 1), ...list.slice(0, currentIndex + 1)]
      const match = ordered.find(item => !disabled(item) && (item.textContent ?? '').trim().toLowerCase().startsWith(query))
      if (match != null) {
        event.preventDefault()
        focusItem(match)
      }
      return
    }

    if (!NAVIGATION_KEYS.has(event.key))
      return

    let key = event.key
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && isRtl(treeRef.value))
      key = key === 'ArrowLeft' ? 'ArrowRight' : 'ArrowLeft'

    switch (key) {
      case 'ArrowDown':
        event.preventDefault()
        focusEnabledFrom(list, currentIndex < 0 ? 0 : currentIndex + 1, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        focusEnabledFrom(list, currentIndex < 0 ? list.length - 1 : currentIndex - 1, -1)
        break
      case 'ArrowRight': {
        if (current == null)
          break
        event.preventDefault()
        const expanded = current.getAttribute('aria-expanded')
        if (expanded === 'false') {
          options.onToggleExpand?.(current.dataset.treeId ?? '')
        }
        else if (expanded === 'true') {
          const next = list[currentIndex + 1]
          if (next != null && levelOf(next) > levelOf(current))
            focusItem(next)
        }
        break
      }
      case 'ArrowLeft': {
        if (current == null)
          break
        event.preventDefault()
        if (current.getAttribute('aria-expanded') === 'true') {
          options.onToggleExpand?.(current.dataset.treeId ?? '')
        }
        else {
          const currentLevel = levelOf(current)
          for (let index = currentIndex - 1; index >= 0; index -= 1) {
            const candidate = list[index]
            if (candidate != null && levelOf(candidate) < currentLevel) {
              focusItem(candidate)
              break
            }
          }
        }
        break
      }
      case 'Home':
        event.preventDefault()
        focusEnabledFrom(list, 0, 1)
        break
      case 'End':
        event.preventDefault()
        focusEnabledFrom(list, list.length - 1, -1)
        break
      case 'Enter':
      case ' ': {
        if (current == null || disabled(current))
          break
        event.preventDefault()
        const handled = options.onActivate?.(current) === true
        if (!handled && current.getAttribute('aria-expanded') != null)
          options.onToggleExpand?.(current.dataset.treeId ?? '')
        break
      }
      default:
        break
    }
  }

  function handleFocus(): void {
    syncTabStops()
  }

  return { treeRef: treeRef as Ref<HTMLElement | null>, handleKeyDown, handleFocus }
}
