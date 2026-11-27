/**
 * 菜单行（DropdownMenu、ContextMenu、MoreMenu）共用的点击判断和键盘激活。
 */

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

/**
 * 禁用行的 `mousedown` 处理：行有 `tabindex="-1"`，方向键能走到它，
 * 鼠标按下若不拦就会把它聚焦点亮。取消默认行为，焦点留在原处。
 */
export function keepDisabledRowUnfocused(event: { preventDefault: () => void }): void {
  event.preventDefault()
}
