/**
 * @file autoSide.ts
 * @input 抽屉的 dialog 元素和它的 id
 * @output `side="auto"` 时抽屉从哪条边滑入
 * @position MobileNav 内部
 *
 * 抽屉从打开它的那个控件所在的一侧滑入，按文字方向算：控件落在行内起始半边，
 * 抽屉就从行内起始边出来（LTR 是左边，RTL 是右边）；正中间的控件算行内结束半边。
 * 打开者是当前有焦点的元素；触屏点按不一定让按钮拿到焦点，焦点在页面上没有、
 * 或已经在抽屉里（服务端就已打开的抽屉水合后，原生模态会先把焦点挪进去）时，
 * 改找 `aria-controls` 指向这个抽屉的元素。都找不到就从行内结束边出来。
 */

function openerOf(dialog: HTMLElement | null, dialogId: string): HTMLElement | null {
  const doc = dialog?.ownerDocument ?? document
  const focused = doc.activeElement
  if (focused instanceof HTMLElement && focused !== doc.body && !dialog?.contains(focused))
    return focused
  for (const candidate of doc.querySelectorAll<HTMLElement>('[aria-controls]')) {
    if (candidate.getAttribute('aria-controls')?.split(/\s+/).includes(dialogId))
      return candidate
  }
  return null
}

export function resolveAutoSide(dialog: HTMLElement | null, dialogId: string): 'start' | 'end' {
  const opener = openerOf(dialog, dialogId)
  if (opener == null)
    return 'end'
  const view = opener.ownerDocument.defaultView ?? window
  const rect = opener.getBoundingClientRect()
  const center = rect.left + rect.width / 2
  const half = view.innerWidth / 2
  const isRtl = view.getComputedStyle(opener).direction === 'rtl'
  const isInStartHalf = isRtl ? center > half : center < half
  return isInStartHalf ? 'start' : 'end'
}
