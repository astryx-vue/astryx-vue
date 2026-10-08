import type { Ref } from 'vue'
import { focusElement } from '../layer/focus.js'

/**
 * Roles a menu row can carry. The selectable roles sit alongside the plain one
 * so every row is reachable by arrow keys, typeahead, and Enter/Space.
 */
export const MENU_ITEM_ROLES: ReadonlySet<string> = new Set(['menuitem', 'menuitemradio', 'menuitemcheckbox'])

/** Selector for the activatable rows of one menu level. */
export const MENU_ITEM_SELECTOR: string = [...MENU_ITEM_ROLES]
  .map(role => `[role="${role}"]:not([aria-disabled="true"])`)
  .join(',')

/** Marks the element whose text typeahead matches against. */
export const MENU_LABEL_ATTRIBUTE = 'data-astryx-menu-label'

/** The keyboard modifier shape a click can carry. */
export interface MenuClickModifiers {
  metaKey: boolean
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  button?: number
}

/**
 * Whether a click carries a modifier or a non-primary button. On a row that is
 * a link the browser gives such a click a meaning of its own, which the row
 * must leave alone.
 */
export function isModifiedClick(event: MenuClickModifiers): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (event.button ?? 0) !== 0
}

/**
 * Activate a row from the keyboard: a synthesized click that carries the key's
 * modifiers, so a modified Enter on a link row opens the way a modified click
 * would. `detail` stays 0, the mark of a non-pointer activation.
 */
export function activateMenuItem(row: HTMLElement, key: MenuClickModifiers): void {
  row.dispatchEvent(new MouseEvent('click', {
    altKey: key.altKey,
    bubbles: true,
    cancelable: true,
    composed: true,
    ctrlKey: key.ctrlKey,
    metaKey: key.metaKey,
    shiftKey: key.shiftKey,
  }))
}

/** Whether the element or one of its ancestors flows right to left. */
export function isRtl(element: HTMLElement | null): boolean {
  if (element == null)
    return false

  return element.ownerDocument.defaultView?.getComputedStyle(element).direction === 'rtl'
}

export interface MenuNavOptions {
  /** The element carrying `role="menu"` for this level. */
  menuRef: Ref<HTMLElement | null>
  /** Leaves this level. Escape returns focus to the row that opened it. */
  onClose: (reason: 'escape' | 'tab') => void
}

export interface MenuNav {
  /** The activatable rows of this level, in DOM order. */
  getItems: () => HTMLElement[]
  /** Focus the first activatable row, falling back to the container. */
  focusFirst: () => boolean
  /** Focus the last activatable row. */
  focusLast: () => boolean
  /** Focus the level's container, which keeps arrows and Escape owned by it. */
  focusContainer: () => void
  /** Forget the pending typeahead buffer. */
  resetTypeahead: () => void
  /** The level's key handler. */
  handleKeyDown: (event: KeyboardEvent) => void
}

const TYPEAHEAD_RESET_MS = 750

/**
 * Roving focus, typeahead, and activation for one menu level.
 *
 * Every level of a menu owns one of these, so a nested flyout keeps its own
 * highlight, its own typeahead buffer, and its own keys without coordinating
 * with the level that opened it.
 */
export function useMenuNav(options: MenuNavOptions): MenuNav {
  const { menuRef, onClose } = options

  let typeaheadBuffer = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  function getItems(): HTMLElement[] {
    const menu = menuRef.value
    if (menu == null)
      return []

    return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
  }

  function focusedIndex(items: HTMLElement[]): number {
    const active = menuRef.value?.ownerDocument.activeElement

    return items.findIndex(row => row === active)
  }

  function focusItem(index: number): boolean {
    const items = getItems()
    if (items.length === 0)
      return false

    const row = items[(index + items.length) % items.length]

    return row != null && focusElement(row)
  }

  function focusFirst(): boolean {
    return focusItem(0)
  }

  function focusLast(): boolean {
    return focusItem(-1)
  }

  function focusContainer(): void {
    const menu = menuRef.value
    if (menu != null)
      focusElement(menu)
  }

  function resetTypeahead(): void {
    typeaheadBuffer = ''
    if (typeaheadTimer != null) {
      clearTimeout(typeaheadTimer)
      typeaheadTimer = undefined
    }
  }

  function step(direction: 1 | -1): void {
    const items = getItems()
    const index = focusedIndex(items)

    if (index === -1) {
      // A pointer opened the menu and focus sits on the container, or the row
      // that held focus is gone: walk in from the matching end.
      if (direction === 1)
        focusFirst()
      else
        focusLast()
      return
    }

    focusItem(index + direction)
  }

  /** Focus the next row whose label starts with the typed text. */
  function typeahead(event: KeyboardEvent): void {
    const match = (needle: string): boolean => {
      const items = getItems()
      if (items.length === 0)
        return false

      const index = focusedIndex(items)
      for (let offset = 1; offset <= items.length; offset++) {
        const row = items[(index + offset + items.length) % items.length]
        const label = row?.querySelector<HTMLElement>(`[${MENU_LABEL_ATTRIBUTE}]`)?.textContent
          ?? row?.textContent
          ?? ''
        if (label.trim().toLowerCase().startsWith(needle)) {
          focusElement(row as HTMLElement)
          return true
        }
      }

      return false
    }

    typeaheadBuffer += event.key.toLowerCase()
    if (typeaheadTimer != null)
      clearTimeout(typeaheadTimer)
    typeaheadTimer = setTimeout(resetTypeahead, TYPEAHEAD_RESET_MS)

    if (match(typeaheadBuffer))
      return

    // A longer buffer that matches nothing starts a fresh search on this key.
    typeaheadBuffer = event.key.toLowerCase()
    match(typeaheadBuffer)
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey)
      return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        step(1)
        return
      case 'ArrowUp':
        event.preventDefault()
        step(-1)
        return
      case 'Home':
        event.preventDefault()
        focusFirst()
        return
      case 'End':
        event.preventDefault()
        focusLast()
        return
      case 'Enter':
      case ' ': {
        event.preventDefault()
        // The key that opened the menu, held down, auto-repeats into the menu
        // once focus has moved there; a repeat is never an activation.
        if (event.repeat)
          return

        const items = getItems()
        const index = focusedIndex(items)
        const row = index === -1 ? null : items[index]
        if (row != null)
          activateMenuItem(row, event)
        return
      }
      case 'Escape':
        event.preventDefault()
        onClose('escape')
        return
      case 'Tab':
        // Menu rows leave the tab order, so the browser has nothing to move to
        // while the menu is open. Leaving the key to its default action moves
        // focus on from the trigger the close restores focus to.
        onClose('tab')
        return
      default:
        break
    }

    if (event.key.length === 1)
      typeahead(event)
  }

  return {
    focusContainer,
    focusFirst,
    focusLast,
    getItems,
    handleKeyDown,
    resetTypeahead,
  }
}
