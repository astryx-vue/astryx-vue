import type { ComputedRef, Ref } from 'vue'
import type { DropdownMenuSize } from './types.js'
import { computed } from 'vue'
import { useContextMenu } from '../ContextMenu/context.js'
import { useDropdownMenuContext } from './context.js'

export interface UseMenuSelectableRowOptions {
  isDisabled: Ref<boolean>
  hasCloseOnSelect: Ref<boolean>
  onActivate: () => void
}

export interface MenuSelectableRow {
  menuSize: ComputedRef<DropdownMenuSize>
  controlSize: ComputedRef<'sm' | 'md'>
  density: ComputedRef<'compact' | 'balanced'>
  inContextMenu: ComputedRef<boolean>
  handleClick: (event: MouseEvent) => void
  handlePointerMove: (event: PointerEvent) => void
}

/**
 * Activation shared by a checkbox row and a radio row.
 *
 * The row owns the role and the checked state. The marker is decorative, so
 * the click always lands on the row. A disabled row stays in the tree and
 * refuses the toggle.
 */
export function useMenuSelectableRow(options: UseMenuSelectableRowOptions): MenuSelectableRow {
  const dropdown = useDropdownMenuContext()
  const contextMenu = useContextMenu()

  const menuSize = computed<DropdownMenuSize>(() => contextMenu?.menuSize.value ?? dropdown?.menuSize.value ?? 'md')
  const controlSize = computed<'sm' | 'md'>(() => menuSize.value === 'sm' ? 'sm' : 'md')
  const density = computed<'compact' | 'balanced'>(() => menuSize.value === 'sm' ? 'compact' : 'balanced')
  const inContextMenu = computed(() => contextMenu != null)

  function closeHost(): void {
    if (!options.hasCloseOnSelect.value)
      return
    if (contextMenu != null)
      contextMenu.closeMenu()
    else
      dropdown?.closeMenu()
  }

  function handleClick(event: MouseEvent): void {
    if (options.isDisabled.value) {
      event.preventDefault()
      return
    }
    options.onActivate()
    closeHost()
  }

  function handlePointerMove(event: PointerEvent): void {
    if (options.isDisabled.value || event.pointerType !== 'mouse')
      return
    const row = event.currentTarget
    if (row instanceof HTMLElement && row !== row.ownerDocument.activeElement)
      row.focus({ preventScroll: true })
  }

  return { controlSize, density, handleClick, handlePointerMove, inContextMenu, menuSize }
}
