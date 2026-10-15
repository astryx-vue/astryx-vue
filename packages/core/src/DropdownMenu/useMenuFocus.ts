import type { Ref } from 'vue'
import { MENU_BOUNDARY_SELECTOR, MENU_ITEM_SELECTOR } from './menuItemRoles.js'

export interface UseMenuFocusOptions {
  /** The menu's scrollable surface. */
  list: Ref<HTMLElement | null>
}

export interface MenuFocus {
  /** This level's enabled rows, in DOM order. */
  getItems: () => HTMLElement[]
  focusItem: (index: number) => void
  focusFirst: () => boolean
  focusLast: () => boolean
  /** Whether the event started in this menu level, not a nested one. */
  ownsEvent: (event: KeyboardEvent) => boolean
  /** Moves the highlight for the arrow, Home/End, and Page keys. */
  handleKeyDown: (event: KeyboardEvent) => void
}

function isDisabled(el: HTMLElement): boolean {
  return el.getAttribute('aria-disabled') === 'true' || el.hasAttribute('disabled')
}

/** A row inside a drilled-away view stays mounted and must not take focus. */
function isHiddenRow(el: HTMLElement, listEl: HTMLElement): boolean {
  let current: HTMLElement | null = el
  while (current != null && current !== listEl) {
    if (current.hidden || current.getAttribute('aria-hidden') === 'true')
      return true
    current = current.parentElement
  }
  return false
}

/**
 * Roving focus over a menu's rows.
 *
 * Rows are `tabindex="-1"`, so the menu keeps the single tab stop and the arrow
 * keys move DOM focus from row to row; DOM focus is also the only highlight
 * source, so hover and the keyboard can never light two rows at once.
 */
export function useMenuFocus(options: UseMenuFocusOptions): MenuFocus {
  const { list } = options

  function belongsHere(el: HTMLElement, listEl: HTMLElement): boolean {
    return el.closest(MENU_BOUNDARY_SELECTOR) === listEl
  }

  function getItems(): HTMLElement[] {
    const listEl = list.value
    if (listEl == null)
      return []

    return Array.from(listEl.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
      .filter(el => belongsHere(el, listEl) && !isDisabled(el) && !isHiddenRow(el, listEl))
  }

  function getCurrentIndex(): number {
    const active = document.activeElement
    return getItems().findIndex(el => el === active || el.contains(active))
  }

  function focusIndex(items: HTMLElement[], index: number): void {
    items[index]?.focus({ preventScroll: true })
  }

  /** The next enabled row from `start`, wrapping. -1 when there is none. */
  function findEnabledIndex(items: HTMLElement[], start: number, step: 1 | -1): number {
    const count = items.length
    if (count === 0)
      return -1

    let index = start
    for (let i = 0; i < count; i++) {
      index = ((index % count) + count) % count
      const item = items[index]
      if (item != null && !isDisabled(item))
        return index
      index += step
    }
    return -1
  }

  function focusItem(index: number): void {
    const items = getItems()
    if (items.length === 0)
      return
    focusIndex(items, Math.max(0, Math.min(index, items.length - 1)))
  }

  function focusFirst(): boolean {
    const items = getItems()
    const index = findEnabledIndex(items, 0, 1)
    if (index === -1)
      return false
    focusIndex(items, index)
    return true
  }

  function focusLast(): boolean {
    const items = getItems()
    const index = findEnabledIndex(items, items.length - 1, -1)
    if (index === -1)
      return false
    focusIndex(items, index)
    return true
  }

  /**
   * PageDown/PageUp: the last/first row fully visible in the surface, and one
   * viewport further when pressed again there. A menu whose rows all fit pages
   * straight to its last/first row. Never wraps.
   */
  function focusPage(direction: 1 | -1): void {
    const container = list.value
    const items = getItems()
    if (container == null || items.length === 0)
      return

    const currentIndex = getCurrentIndex()
    if (currentIndex === -1 && direction === -1) {
      focusFirst()
      return
    }

    function visibleIndices(): number[] {
      const bounds = container!.getBoundingClientRect()
      return items
        .map((item, index) => ({ index, rect: item.getBoundingClientRect() }))
        .filter(({ rect }) => rect.height > 0 && rect.top >= bounds.top - 1 && rect.bottom <= bounds.bottom + 1)
        .map(({ index }) => index)
    }

    function isAhead(index: number): boolean {
      return currentIndex === -1 || (direction === 1 ? index > currentIndex : index < currentIndex)
    }

    function edgeOf(visible: number[]): number {
      if (visible.length === 0)
        return -1
      return direction === 1 ? visible[visible.length - 1]! : visible[0]!
    }

    let visible = visibleIndices()
    let target = edgeOf(visible)

    if (target === -1 || !isAhead(target)) {
      container.scrollTop += direction * container.clientHeight
      visible = visibleIndices()
      target = edgeOf(visible)
    }

    if (target === -1 || !isAhead(target)) {
      const pageSize = Math.max(1, visible.length)
      const from = currentIndex === -1 ? (direction === 1 ? -1 : items.length) : currentIndex
      target = Math.max(0, Math.min(items.length - 1, from + direction * pageSize))
    }

    if (target !== -1 && target !== currentIndex)
      focusIndex(items, target)
  }

  function ownsEvent(event: KeyboardEvent): boolean {
    const listEl = list.value
    const target = event.target
    if (listEl == null || !(target instanceof HTMLElement))
      return true
    return belongsHere(target, listEl)
  }

  function handleKeyDown(event: KeyboardEvent): void {
    // Browser and OS chords are not navigation.
    if (event.ctrlKey || event.metaKey || event.altKey)
      return
    // A nested menu's own handler already moved focus; re-handling here would
    // move it twice.
    if (!ownsEvent(event))
      return

    const items = getItems()
    const currentIndex = getCurrentIndex()

    if (event.key === 'ArrowDown') {
      const next = findEnabledIndex(items, currentIndex === -1 ? 0 : currentIndex + 1, 1)
      if (next !== -1)
        focusIndex(items, next)
    }
    else if (event.key === 'ArrowUp') {
      const prev = findEnabledIndex(items, currentIndex === -1 ? items.length - 1 : currentIndex - 1, -1)
      if (prev !== -1)
        focusIndex(items, prev)
    }
    else if (event.key === 'Home') {
      focusFirst()
    }
    else if (event.key === 'End') {
      focusLast()
    }
    else if (event.key === 'PageDown') {
      focusPage(1)
    }
    else if (event.key === 'PageUp') {
      focusPage(-1)
    }
    else {
      return
    }

    event.preventDefault()
  }

  return { focusFirst, focusItem, focusLast, getItems, handleKeyDown, ownsEvent }
}
