import type { ComputedRef, InjectionKey } from 'vue'
import type { MenuDrillIn } from '../DropdownMenu/useMenuDrillIn.js'
import type { ContextMenuSize } from './types.js'
import { computed, inject } from 'vue'

/**
 * What a `ContextMenu` tells the rows and submenus inside it.
 *
 * Every member is a ref or a computed, so a row that reads the context keeps
 * following the menu's own props after mount instead of freezing at the
 * values present when the menu was created. `closeMenu` reads the menu's live
 * open state each time it runs, so it stays correct as well.
 */
export interface ContextMenuContextValue {
  /**
   * Close the menu. `restoreFocus` puts focus back on the element that was
   * focused before the menu opened; keyboard dismissal asks for it, a
   * pointer-driven dismissal does not.
   */
  closeMenu: (options?: { restoreFocus?: boolean }) => void
  /** Whether the menu is currently open. */
  isOpen: ComputedRef<boolean>
  /** The menu's accessible name, used by a submenu flyout's rows. */
  menuLabel: ComputedRef<string>
  /** Density of the rows inside this menu. */
  menuSize: ComputedRef<ContextMenuSize>
  /** View stack for submenus that replace the rows in place. */
  drillIn: ComputedRef<MenuDrillIn>
}

export const contextMenuContextKey: InjectionKey<ContextMenuContextValue> = Symbol('astryx-context-menu')

/**
 * Whether the submenu flyout that contains this one is showing.
 *
 * Nested flyouts are teleported to `body`, so hiding an ancestor's DOM does
 * not hide them. Each submenu provides its own `showsFlyout` for the next
 * level; a row with no ancestor submenu reads as open.
 */
export const submenuAncestorOpenKey: InjectionKey<ComputedRef<boolean>> = Symbol('astryx-submenu-ancestor-open')

/** The surrounding menu, or `undefined` when the row stands alone. */
export function useContextMenu(): ContextMenuContextValue | undefined {
  return inject(contextMenuContextKey, undefined)
}

/** The row density of the surrounding menu, or the menu default. */
export function useContextMenuSize(): ComputedRef<ContextMenuSize> {
  const menu = useContextMenu()
  return computed(() => menu?.menuSize.value ?? 'md')
}
