/**
 * 对话框打开时第一个拿到焦点的元素。
 *
 * 先看明确要求初始焦点的元素（`data-autofocus`），再看标题的默认要求
 * （`data-dialog-default-focus`）。一个要求属于离它最近的那个对话框：嵌套的子对话框
 * 里的要求是子对话框的，哪怕它关着也可能还排着版，焦点落进去就没人看得见了。
 * 藏在 `hidden`、`inert` 里或者被禁用的要求不算数，顺延给下一个。
 */
export function findInitialFocusTarget(dialog: HTMLElement): HTMLElement | null {
  const requests = [
    ...dialog.querySelectorAll<HTMLElement>('[data-autofocus]'),
    ...dialog.querySelectorAll<HTMLElement>('[data-dialog-default-focus]'),
  ]
  return requests.find(request => isEligible(request, dialog)) ?? null
}

function isEligible(request: HTMLElement, dialog: HTMLElement): boolean {
  if (request.closest('dialog') !== dialog)
    return false
  if (request.matches(':disabled'))
    return false
  // 只有对话框里面藏起来才算不可用：模态对话框自己不在页面其余部分的 inert 之内。
  const hidden = request.closest('[hidden], [inert]')
  return hidden == null || !dialog.contains(hidden)
}
