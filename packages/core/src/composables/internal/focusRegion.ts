import { getFocusables } from '../../layer/focus.js'

/**
 * 焦点区域（useFocusTrap）找 Tab 落脚点、判断谁来接这次 Tab 用的几个小工具。
 * 对应原版 Astryx `hooks/useFocusTrap` 和 `hooks/focusableSelector` 里的同名逻辑。
 */

/** `a` 在文档顺序上是否排在 `b` 前面。 */
export function precedes(a: Node, b: Node): boolean {
  return (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0
}

/** 按文档顺序排好。浏览器的 querySelectorAll 本来就是文档顺序，jsdom 可能按选择器分组返回。 */
export function inDocumentOrder<T extends Node>(nodes: readonly T[]): T[] {
  return [...nodes].sort((a, b) => (precedes(a, b) ? -1 : 1))
}

function isShownAsPopover(element: Element): boolean {
  try {
    return element.matches(':popover-open')
  }
  catch {
    return false
  }
}

/** 对话框在顶层里：打开了，或者作为 popover 显示着。 */
function isDialogShown(dialog: HTMLDialogElement): boolean {
  return dialog.open || isShownAsPopover(dialog)
}

/**
 * 元素是否在一个页面不显示的、关着的 `<dialog>` 里。这样的对话框什么都不画，里面也不能聚焦。
 * 关着但页面把它按普通流显示出来的对话框有盒子，里面的控件照样是 Tab 落脚点。
 */
export function isInHiddenClosedDialog(element: Element): boolean {
  for (let dialog = element.closest('dialog'); dialog != null; dialog = dialog.parentElement?.closest('dialog') ?? null) {
    if (!isDialogShown(dialog) && dialog.ownerDocument.defaultView?.getComputedStyle(dialog).display === 'none')
      return true
  }
  return false
}

function radioNameOf(element: Element): string | null {
  if (!element.matches('input[type="radio"][name]'))
    return null
  return (element as HTMLInputElement).name || null
}

function isSameRadioGroup(a: Element, b: Element): boolean {
  const name = radioNameOf(a)
  return name != null && name === radioNameOf(b) && (a as HTMLInputElement).form === (b as HTMLInputElement).form
}

/**
 * 去掉浏览器按 Tab 时会跳过的单选框，其余元素原样保留。
 * 同名单选组只停一站：有焦点的那个，否则选中的那个；一个都没选时整组都留着，
 * 正向进入落在第一个，反向进入落在最后一个。
 */
export function collapseRadioGroups(elements: HTMLElement[], active: Element | null): HTMLElement[] {
  return elements.filter((element) => {
    if (radioNameOf(element) == null)
      return true
    if (active != null && isSameRadioGroup(element, active))
      return element === active
    return (element as HTMLInputElement).checked
      || !elements.some(other => isSameRadioGroup(element, other) && (other as HTMLInputElement).checked)
  })
}

/** 容器里能被 Tab 走到的元素，按文档顺序，不含藏在关着的对话框里的。 */
export function focusablesIn(container: HTMLElement): HTMLElement[] {
  return inDocumentOrder(getFocusables(container)).filter(element => !isInHiddenClosedDialog(element))
}

/** 试着聚焦，返回焦点是否真的过去了。被模态层盖住（inert）的元素会拒绝。 */
export function attemptFocus(element: HTMLElement): boolean {
  try {
    element.focus()
  }
  catch {
    return false
  }
  return element.ownerDocument.activeElement === element
}

/** 当前启用的焦点区域容器。区域嵌套时，握着焦点的最里层那个接 Tab。 */
const activeRegions = new Set<HTMLElement>()

export function registerRegion(container: HTMLElement): () => void {
  activeRegions.add(container)
  return () => activeRegions.delete(container)
}

/** 焦点是否握在嵌套在 `container` 里的另一个区域（或另一个打开的 `<dialog>`）手里。那时由它接 Tab。 */
export function hasInnerRegionHolding(container: HTMLElement, active: Element): boolean {
  const dialog = active.closest('dialog[open]')
  if (dialog != null && dialog !== container && container.contains(dialog))
    return true
  for (const other of activeRegions) {
    if (other !== container && container.contains(other) && other.contains(active))
      return true
  }
  return false
}

/** `element` 自己或它在 `container` 里的某个祖先带 `aria-disabled="true"`。挑初始焦点时跳过它，Tab 仍能走到。 */
export function isDisabledWithin(element: Element, container: Element): boolean {
  const disabled = element.closest('[aria-disabled="true"]')
  return disabled != null && container.contains(disabled)
}

/** 先放 Tab 落脚点，再放 `tabindex="-1"` 的成员，各自按文档顺序。复合控件里握着 `tabindex="0"` 的成员排在前面。 */
export function preferTabStops<T extends Element>(elements: readonly T[]): T[] {
  const ordered = inDocumentOrder(elements)
  const isTabStop = (element: T): boolean => element.getAttribute('tabindex') !== '-1'
  return [...ordered.filter(isTabStop), ...ordered.filter(element => !isTabStop(element))]
}
