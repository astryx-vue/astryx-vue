import { focusForLastInput } from '../composables/internal/focusReturn.js'

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

/** 叠放登记表为什么把焦点送进面板：打开在最上面、上面那张关了露出来、或者接替了刚才那一步。 */
export type BottomSheetFocusReason = 'open' | 'reveal' | 'replace'

/**
 * 把焦点送进面板。
 *
 * 被盖住的面板（对话框 inert 或对读屏隐藏）不接焦点：人还留在最上面那张里。
 * `reveal`（上面那张关了露出这一张），以及 `replace` 时焦点已经在里面某个控件上，焦点都不动。
 * `open` 和 `replace` 时原生对话框已经按自己的规矩聚焦过（Chromium 落在面板上，Firefox 落在第一个控件上），
 * 那不是使用者的选择：只要有可聚焦的 `data-autofocus` 元素，它就盖过原生的落点。没有的话，
 * `open` 保留原生落点，焦点不在里面且这一层是模态的才落到面板上；`replace` 落到进场的面板上。
 * `reveal` 由面板自己接住焦点，焦点环只在上一次是键盘时才画。
 */
export function focusSheetPanel(panel: HTMLElement | null, reason: BottomSheetFocusReason, isModal: boolean): void {
  if (panel == null)
    return
  const host = panel.closest('dialog')
  if (host != null && (host.hasAttribute('inert') || host.getAttribute('aria-hidden') === 'true'))
    return
  // 焦点在这张面板自己的内容里才算在里面；在内容里另一张面板（正在关的嵌套面板）里不算。
  const active = panel.ownerDocument.activeElement
  const isInsidePanel = active != null
    && panel.contains(active)
    && active.closest('dialog') === host
  if (isInsidePanel && (reason === 'reveal' || (reason === 'replace' && active !== panel)))
    return
  if (reason === 'reveal') {
    focusForLastInput(panel, { preventScroll: true })
    return
  }
  if ((isInsidePanel && active.hasAttribute('data-autofocus')) || focusFirstEligibleAutofocus(panel))
    return
  if (!isInsidePanel && (isModal || reason === 'replace'))
    panel.focus({ preventScroll: true })
}
