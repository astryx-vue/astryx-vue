import type { ComputedRef, InjectionKey } from 'vue'
import type { DropdownMenuSize } from './types.js'
import type { MenuDrillIn } from './useMenuDrillIn.js'
import { inject } from 'vue'
import { defineLayerScopedKey, readLayerScoped } from '../layer/scopedProvide.js'

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
  /** Name a drilled view's Back row returns to. */
  menuLabel: ComputedRef<string | undefined>
  /** Whether a header or footer sits beside the menu. */
  hasRegions: ComputedRef<boolean>
  /** View stack for submenus that replace the rows in place. */
  drillIn: ComputedRef<MenuDrillIn>
  /** Move focus to the header or the footer. */
  focusRegion: (direction: 'previous' | 'next') => boolean
  /** Cycle Tab through the dialog around the menu. No-op without a header or footer. */
  moveDialogTab: (event: KeyboardEvent, isFromFlyout?: boolean) => void
}

// 菜单的关闭入口只在这一层菜单里成立。进了别的浮层要丢掉外层那份，所以登记成成员关系。
export const dropdownMenuContextKey = defineLayerScopedKey<DropdownMenuContextValue | undefined>(
  'astryx-dropdown-menu-context',
  undefined,
)

/** The surrounding menu, or `undefined` when a row stands alone. */
export function useDropdownMenuContext(): DropdownMenuContextValue | undefined {
  return readLayerScoped(dropdownMenuContextKey)
}

/** Single-select state owned by `DropdownMenuRadioGroup`. */
export interface DropdownMenuRadioGroupContext {
  value: ComputedRef<string | undefined>
  hasCloseOnSelect: ComputedRef<boolean>
  select: (value: string) => void
}

export const dropdownMenuRadioGroupKey: InjectionKey<DropdownMenuRadioGroupContext> = Symbol('astryx-dropdown-menu-radio-group')

/** The radio group around this row, or `undefined` when there is none. */
export function useDropdownMenuRadioGroup(): DropdownMenuRadioGroupContext | undefined {
  return inject(dropdownMenuRadioGroupKey, undefined)
}
