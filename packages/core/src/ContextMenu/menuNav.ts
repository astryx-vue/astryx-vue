import type { Ref } from 'vue'

/**
 * Roles a menu row can carry. The selectable roles sit alongside the plain
 * one so every row is reachable by arrow keys, typeahead, and Enter/Space.
 */
export const MENU_ITEM_ROLES: ReadonlySet<string> = new Set(['menuitem', 'menuitemradio', 'menuitemcheckbox'])

/** Selector for the activatable rows of one menu level. */
export const MENU_ITEM_SELECTOR: string = [...MENU_ITEM_ROLES]
  .map(role => `[role="${role}"]:not([aria-disabled="true"])`)
  .join(',')

/** Selector for any menu level, used to scope a level's rows and key events. */
export const MENU_BOUNDARY_SELECTOR = '[role="menu"]'

/** Marks the element whose text typeahead matches against. */
export const MENU_ITEM_LABEL_ATTRIBUTE = 'data-menu-item-label'

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

function isDisabledRow(row: HTMLElement): boolean {
  return row.getAttribute('aria-disabled') === 'true' || row.hasAttribute('disabled')
}

function isHiddenWithin(row: HTMLElement, container: HTMLElement): boolean {
  let current: HTMLElement | null = row
  while (current != null && current !== container) {
    if (current.hidden || current.getAttribute('aria-hidden') === 'true')
      return true
    current = current.parentElement
  }
  return false
}

export interface MenuNavOptions {
  /** The element carrying `role="menu"` for this level. */
  menuRef: Ref<HTMLElement | null>
  /** Close this level. `tab` and `escape` are the two keyboard routes out. */
  onClose: (reason: 'escape' | 'tab') => void
}

export interface MenuNav {
  /** Focus the first activatable row. Returns whether it found one. */
  focusFirst: () => boolean
  /** Forget the pending typeahead buffer. */
  resetTypeahead: () => void
  /** The level's key handler. */
  handleKeyDown: (event: KeyboardEvent) => void
}

const TYPEAHEAD_RESET_MS = 750

/**
 * Roving focus, typeahead, and activation for one menu level.
 *
 * Both the menu panel and every submenu flyout own one of these, so a nested
 * level keeps its own highlight, its own typeahead buffer, and its own keys
 * without coordinating with its parent.
 */
export function useMenuNav(options: MenuNavOptions): MenuNav {
  const { menuRef, onClose } = options

  let typeaheadBuffer = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  function resetTypeahead(): void {
    typeaheadBuffer = ''
    if (typeaheadTimer != null) {
      clearTimeout(typeaheadTimer)
      typeaheadTimer = undefined
    }
  }

  function getItems(): HTMLElement[] {
    const menu = menuRef.value
    if (menu == null)
      return []
    return Array.from(menu.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR))
      .filter(row => !isHiddenWithin(row, menu))
      .filter(row => row.closest(MENU_BOUNDARY_SELECTOR) === menu)
  }

  function ownsEvent(event: Event): boolean {
    const menu = menuRef.value
    const target = event.target
    if (menu == null || !(target instanceof Element))
      return true
    return target.closest(MENU_BOUNDARY_SELECTOR) === menu
  }

  function getCurrentIndex(items: HTMLElement[]): number {
    const active = menuRef.value?.ownerDocument.activeElement ?? null
    return items.findIndex(row => row === active || row.contains(active))
  }

  function findEnabledIndex(items: HTMLElement[], start: number, step: 1 | -1, wrap: boolean): number {
    const count = items.length
    if (count === 0)
      return -1
    let index = start
    for (let i = 0; i < count; i++) {
      if (index < 0 || index >= count) {
        if (!wrap)
          return -1
        index = (index + count) % count
      }
      const row = items[index]
      if (row != null && !isDisabledRow(row))
        return index
      index += step
    }
    return -1
  }

  function focusIndex(items: HTMLElement[], index: number): boolean {
    const row = items[index]
    if (row == null)
      return false
    row.focus()
    return true
  }

  function focusFirst(): boolean {
    const items = getItems()
    return focusIndex(items, findEnabledIndex(items, 0, 1, false))
  }

  function focusLast(): boolean {
    const items = getItems()
    return focusIndex(items, findEnabledIndex(items, items.length - 1, -1, false))
  }

  function moveBy(direction: 1 | -1): boolean {
    const items = getItems()
    if (items.length === 0)
      return false
    const current = getCurrentIndex(items)
    const next = findEnabledIndex(
      items,
      current === -1 ? (direction === 1 ? 0 : items.length - 1) : current + direction,
      direction,
      true,
    )
    return focusIndex(items, next)
  }

  /**
   * PageDown / PageUp move by the rows a viewport shows, never wrapping; in a
   * menu that does not scroll they act as End and Home.
   */
  function focusPage(direction: 1 | -1): boolean {
    const menu = menuRef.value
    const all = getItems()
    const active = all.map((row, index) => (isDisabledRow(row) ? -1 : index)).filter(index => index !== -1)
    if (menu == null || active.length === 0)
      return false
    if (menu.clientHeight === 0 || menu.scrollHeight <= menu.clientHeight)
      return direction === 1 ? focusLast() : focusFirst()

    const rowHeight = all[active[0] as number]?.getBoundingClientRect().height ?? 0
    const perPage = rowHeight > 0 ? Math.max(1, Math.floor(menu.clientHeight / rowHeight)) : active.length
    const position = active.indexOf(getCurrentIndex(all))
    const from = position === -1 ? (direction === 1 ? -1 : active.length) : position
    const next = Math.max(0, Math.min(active.length - 1, from + direction * perPage))
    return focusIndex(all, active[next] as number)
  }

  /**
   * Typeahead over the rows' label elements. Repeated presses of the same
   * character cycle through the matches instead of filtering deeper.
   */
  function handleTypeahead(event: KeyboardEvent): boolean {
    const isSpaceMidType = event.key === ' ' && typeaheadBuffer.length > 0
    const isPrintable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== ' '
    if (!isPrintable && !isSpaceMidType)
      return false

    const items = getItems()
    const labels = items.map(row => row.querySelector(`[${MENU_ITEM_LABEL_ATTRIBUTE}]`)?.textContent ?? row.textContent)
    if (labels.length === 0)
      return false

    const char = event.key.toLowerCase()
    const isRepeatSameChar = typeaheadBuffer.length > 0 && [...typeaheadBuffer].every(entry => entry === char)
    const nextBuffer = isRepeatSameChar ? char : typeaheadBuffer + char
    typeaheadBuffer = nextBuffer
    if (typeaheadTimer != null)
      clearTimeout(typeaheadTimer)
    typeaheadTimer = setTimeout(resetTypeahead, TYPEAHEAD_RESET_MS)

    const current = getCurrentIndex(items)
    const hasCurrent = current >= 0
    const start = hasCurrent ? current : 0
    const offset = hasCurrent && nextBuffer.length === 1 ? 1 : 0

    for (let i = 0; i < labels.length; i++) {
      const index = (start + offset + i + labels.length) % labels.length
      if (isDisabledRow(items[index] as HTMLElement))
        continue
      const label = labels[index]
      if (label != null && label.trim().toLowerCase().startsWith(nextBuffer)) {
        focusIndex(items, index)
        return true
      }
    }
    return true
  }

  function handleKeyDown(event: KeyboardEvent): void {
    // An IME's own keys are the IME's; a composition's Escape must not close
    // the menu and its letters must not run typeahead.
    if (event.defaultPrevented || event.isComposing || event.ctrlKey || event.metaKey || event.altKey)
      return
    if (!ownsEvent(event))
      return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (event.repeat)
        return
      const active = menuRef.value?.ownerDocument.activeElement
      if (active instanceof HTMLElement && MENU_ITEM_ROLES.has(active.getAttribute('role') ?? ''))
        activateMenuItem(active, event)
      return
    }

    // Tab closes the menu without being consumed: focus returns to where it
    // was before, and the browser's default Tab then continues from there.
    if (event.key === 'Tab') {
      onClose('tab')
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      onClose('escape')
      return
    }

    if (handleTypeahead(event)) {
      event.preventDefault()
      return
    }

    if (event.key === 'ArrowDown' && moveBy(1)) {
      event.preventDefault()
      return
    }

    if (event.key === 'ArrowUp' && moveBy(-1)) {
      event.preventDefault()
      return
    }

    if (event.key === 'Home' && focusFirst()) {
      event.preventDefault()
      return
    }

    if (event.key === 'End' && focusLast()) {
      event.preventDefault()
      return
    }

    if (event.key === 'PageDown' && focusPage(1)) {
      event.preventDefault()
      return
    }

    if (event.key === 'PageUp' && focusPage(-1)) {
      event.preventDefault()
    }
  }

  return { focusFirst, handleKeyDown, resetTypeahead }
}
