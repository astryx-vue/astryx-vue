import type { ComputedRef, Ref } from 'vue'
import type { DropdownMenuSize } from './types.js'
import { computed, useAttrs } from 'vue'
import { focusForLastInput } from '../composables/internal/focusReturn.js'
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
  /** 调用方放在行上的属性，去掉已经由行自己接管的 `onClick`。 */
  forwardedAttrs: ComputedRef<Record<string, unknown>>
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
  const attrs = useAttrs()
  const contextMenu = useContextMenu()

  const menuSize = computed<DropdownMenuSize>(() => contextMenu?.menuSize.value ?? dropdown?.menuSize.value ?? 'md')
  const controlSize = computed<'sm' | 'md'>(() => menuSize.value === 'sm' ? 'sm' : 'md')
  // 上游的勾选行和单选行不给 Item 传 density，小号菜单里也是默认的 balanced，只有控件缩成 sm。
  const density = computed<'compact' | 'balanced'>(() => 'balanced')
  const inContextMenu = computed(() => contextMenu != null)

  function closeHost(): void {
    if (!options.hasCloseOnSelect.value)
      return
    if (contextMenu != null)
      contextMenu.closeMenu()
    else
      dropdown?.closeMenu()
  }

  const forwardedAttrs = computed(() => Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'onClick')))

  /** 调用方的 `onClick` 排在行自己的选择和关闭之后；禁用的行在它之前就停下。 */
  function handleClick(event: MouseEvent): void {
    if (options.isDisabled.value) {
      event.preventDefault()
      return
    }
    options.onActivate()
    closeHost()
    const callerClick = attrs.onClick
    for (const handler of Array.isArray(callerClick) ? callerClick : [callerClick]) {
      if (typeof handler === 'function')
        handler(event)
    }
  }

  function handlePointerMove(event: PointerEvent): void {
    if (options.isDisabled.value || event.pointerType !== 'mouse')
      return
    const row = event.currentTarget
    if (row instanceof HTMLElement && row !== row.ownerDocument.activeElement)
      focusForLastInput(row, { preventScroll: true })
  }

  return { controlSize, density, forwardedAttrs, handleClick, handlePointerMove, inContextMenu, menuSize }
}
