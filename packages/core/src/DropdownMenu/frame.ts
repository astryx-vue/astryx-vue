import type { InjectionKey, StyleValue } from 'vue'
import type { DropdownMenuContextValue } from './context.js'
import type { DropdownMenuOption } from './types.js'
import type { MenuRegions } from './useMenuRegions.js'

/** Values the menu frame reads. Root refs are unwrapped by `reactive`. */
export interface DropdownMenuFrameState {
  isSheet: boolean
  sheetOpen: boolean
  sheetLabel: string
  hasRegions: boolean
  isOpen: boolean
  isDrilled: boolean
  hasOverflow: boolean
  regionFocus: boolean
  surfaceId: string
  dialogId: string
  dialogLabel: string
  menuAriaLabel: string | undefined
  menuAriaLabelledBy: string | undefined
  forwardedAttrs: Record<string, unknown>
  menuBindings: Record<string, any>
  surfaceClass: any
  surfaceStyle: StyleValue
  placement: string
  teleportTarget: string | HTMLElement
  items: readonly DropdownMenuOption[] | undefined
  menuContext: DropdownMenuContextValue
  regions: MenuRegions
  setSurface: (element: unknown) => void
  setPopover: (element: unknown) => void
  setHeader: (element: unknown) => void
  setFooter: (element: unknown) => void
  setHost: (element: unknown) => void
  onSurfaceKeydown: (event: KeyboardEvent) => void
  onSurfaceFocus: (event: FocusEvent) => void
}

export const dropdownMenuFrameKey: InjectionKey<DropdownMenuFrameState> = Symbol('astryx-dropdown-menu-frame')
