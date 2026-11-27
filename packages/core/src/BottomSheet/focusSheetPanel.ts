/**
 * 抽屉里第一个可以接住焦点的 `data-autofocus` 元素拿到焦点。
 *
 * 抽屉里再开的抽屉或对话框，它的元素属于那一层；inert 的、看不见的、聚焦不上的都跳过。
 * 返回有没有找到。
 */
function focusFirstEligibleAutofocus(panel: HTMLElement): boolean {
  const dialog = panel.closest('dialog')
  for (const candidate of panel.querySelectorAll<HTMLElement>('[data-autofocus]')) {
    if (
      candidate.closest('dialog') !== dialog
      || candidate.closest('[inert]') != null
      || (typeof candidate.checkVisibility === 'function' && !candidate.checkVisibility())
    ) {
      continue
    }
    // 打开抽屉不该为了露出刚聚焦的元素去滚页面：手机键盘弹出时那一下会把文档推到固定的抽屉下面。
    candidate.focus({ preventScroll: true })
    if (candidate.ownerDocument.activeElement === candidate)
      return true
  }
  return false
}

/**
 * 抽屉打开时把焦点放到该去的地方。
 *
 * 原生对话框打开时会按自己的规矩聚焦（Chromium 落在面板上，Firefox 落在第一个控件上），
 * 那不是使用者的选择：只要有可聚焦的 `data-autofocus` 元素，它就盖过原生的落点，所有浏览器一致。
 * 没有的话，焦点已经在抽屉里就不动；不在里面且这一层要接管焦点（模态的），就落在面板上。
 */
export function focusSheetOnOpen(panel: HTMLElement | null, takesPanelFocus: boolean): void {
  if (panel == null)
    return
  const active = panel.ownerDocument.activeElement
  const isInsidePanel = active != null
    && panel.contains(active)
    && active.closest('dialog') === panel.closest('dialog')
  if (isInsidePanel && active.hasAttribute('data-autofocus'))
    return
  if (focusFirstEligibleAutofocus(panel))
    return
  if (!isInsidePanel && takesPanelFocus)
    panel.focus({ preventScroll: true })
}
