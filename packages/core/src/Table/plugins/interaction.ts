const INTERACTIVE = 'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="menuitem"]'

/**
 * 这一下点在按钮、链接、表单或一段被选中的文字上，就不该再触发行展开。
 */
export function isInteractiveRowClick(event: MouseEvent): boolean {
  const row = event.currentTarget
  const target = event.target
  if (!(row instanceof HTMLElement) || !(target instanceof Element))
    return true
  if (target !== row && target.closest(INTERACTIVE) != null)
    return true
  if (target !== row && target.closest('[contenteditable]:not([contenteditable="false"])') != null)
    return true
  const selection = typeof window === 'undefined' ? null : window.getSelection()
  if (selection != null && !selection.isCollapsed && selection.anchorNode != null && row.contains(selection.anchorNode))
    return true
  return false
}
