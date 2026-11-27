import type { MenuClickModifiers } from '../composables/internal/menuActivation.js'
import { activateMenuItem } from '../composables/internal/menuActivation.js'

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

/**
 * Every row, disabled rows included. The arrow keys, Home, End and type-ahead
 * visit a disabled row so a keyboard user finds it; the row stays inert.
 */
export const MENU_ROW_SELECTOR: string = [...MENU_ITEM_ROLES]
  .map(role => `[role="${role}"]`)
  .join(',')

/** Scopes item collection and key handling to one menu level. */
export const MENU_BOUNDARY_SELECTOR = '[role="menu"]'

/** Keyboard-activate the focused element when it is a menu row. */
export function activateFocusedMenuItem(key: MenuClickModifiers): void {
  const focused = typeof document !== 'undefined' ? document.activeElement : null
  if (focused instanceof HTMLElement && MENU_ITEM_ROLES.has(focused.getAttribute('role') ?? ''))
    activateMenuItem(focused, key)
}
