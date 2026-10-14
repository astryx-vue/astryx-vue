import type { ComputedRef, InjectionKey } from 'vue'
import type { DropdownMenuSize } from './types.js'
import { inject } from 'vue'

/**
 * What a `DropdownMenu` tells the rows inside it.
 *
 * `menuSize` is a computed ref rather than a plain value: a row reads it after
 * mount, so a snapshot would leave every row stuck at the size the trigger had
 * when the menu was created.
 */
export interface DropdownMenuContextValue {
  /** Closes the menu and returns focus to the trigger. */
  closeMenu: () => void
  /** Whether the root menu is open. Nested flyouts close with it. */
  isOpen: ComputedRef<boolean>
  /** Size of the menu, derived from the trigger button's size. */
  menuSize: ComputedRef<DropdownMenuSize>
}

export const dropdownMenuContextKey: InjectionKey<DropdownMenuContextValue> = Symbol('astryx-dropdown-menu-context')

/** The surrounding menu, or `undefined` when a row stands alone. */
export function useDropdownMenuContext(): DropdownMenuContextValue | undefined {
  return inject(dropdownMenuContextKey, undefined)
}
