/**
 * Rows a menu's roving focus, typeahead, and keyboard activation all agree on.
 */
export const MENU_ITEM_ROLES: ReadonlySet<string> = new Set([
  'menuitem',
  'menuitemradio',
  'menuitemcheckbox',
])

/** Rows the arrow keys may land on: enabled menu items, in DOM order. */
export const MENU_ITEM_SELECTOR: string = [...MENU_ITEM_ROLES]
  .map(role => `[role="${role}"]:not([aria-disabled="true"])`)
  .join(',')

/** Scopes item collection and key handling to one menu level. */
export const MENU_BOUNDARY_SELECTOR = '[role="menu"]'

/**
 * Whether a click carries a modifier or a non-primary button: on a row that is
 * a link the browser gives it a meaning of its own, which the row leaves alone.
 */
export function isModifiedClick(event: {
  altKey: boolean
  button: number
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
}): boolean {
  return (
    event.metaKey
    || event.ctrlKey
    || event.shiftKey
    || event.altKey
    || event.button !== 0
  )
}

/**
 * Activate a row from the keyboard: a synthesized click that carries the key's
 * modifiers, so a ⌘-Enter on a link row opens it the way a ⌘-click would.
 * `detail` stays 0, the mark of a non-pointer activation.
 */
export function activateMenuItem(
  row: HTMLElement,
  key: { altKey: boolean, ctrlKey: boolean, metaKey: boolean, shiftKey: boolean },
): void {
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
