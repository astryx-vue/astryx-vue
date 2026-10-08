import type { ComputedRef, InjectionKey, Ref } from 'vue'
import type { ButtonSize } from '../Button/types.js'
import { computed, inject } from 'vue'

/**
 * What the menu tells every row and flyout inside it.
 *
 * Every member is a ref, a computed, or a function that reads live state, so a
 * row keeps following the menu's own props after mount instead of freezing at
 * the values present when the menu was created.
 */
export interface MoreMenuContextValue {
  /**
   * Close the whole menu, at whatever depth the call is made. `restoreFocus`
   * puts focus back on the trigger; keyboard dismissal asks for it, and a
   * pointer-driven dismissal that already moved focus elsewhere does not.
   */
  closeMenu: (options?: { restoreFocus?: boolean }) => void
  /** Density of the rows. */
  menuSize: ComputedRef<ButtonSize>
}

export const moreMenuContextKey: InjectionKey<MoreMenuContextValue> = Symbol('astryx-more-menu')

/** The surrounding menu, or `undefined` when a row stands alone. */
export function useMoreMenuContext(): MoreMenuContextValue | undefined {
  return inject(moreMenuContextKey, undefined)
}

/** The row density of the surrounding menu, or the menu default. */
export function useMoreMenuSize(): ComputedRef<ButtonSize> {
  const menu = useMoreMenuContext()

  return computed(() => menu?.menuSize.value ?? 'md')
}

/**
 * What one menu level tells the rows it renders.
 *
 * The open flyout belongs to the level rather than to the row that opened it,
 * so a level never shows two flyouts at once and the level itself can anchor
 * the flyout to the row that owns it.
 */
export interface MoreMenuLevelContextValue {
  /** Key of the row whose flyout is open, or `null` when none is. */
  openRowKey: Ref<string | null>
  /** Registers a row's root element, so the level can anchor that row's flyout. */
  registerRow: (key: string, element: HTMLElement | null) => void
  /** Open a row's flyout. `focusFirst` moves focus into it, for a keyboard open. */
  openFlyout: (key: string, options?: { focusFirst?: boolean }) => void
  /** Close the open flyout, optionally returning focus to its row. */
  closeFlyout: (options?: { restoreFocus?: boolean }) => void
  /** Hold the flyout open, for example while the pointer is over it. */
  holdFlyout: () => void
  /** Close the flyout after a hover pause, unless the pointer comes back. */
  releaseFlyout: () => void
}

export const moreMenuLevelKey: InjectionKey<MoreMenuLevelContextValue> = Symbol('astryx-more-menu-level')

/** The level a row is rendered in, or `undefined` when a row stands alone. */
export function useMoreMenuLevel(): MoreMenuLevelContextValue | undefined {
  return inject(moreMenuLevelKey, undefined)
}
