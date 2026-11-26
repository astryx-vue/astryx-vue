import { inDocumentOrder } from '../composables/internal/focusRegion.js'
import { getFocusables } from '../layer/focus.js'

/** `element` 或它到 `container` 之间的某个祖先带着 `aria-disabled="true"`。 */
export function isDisabledWithin(element: Element, container: Element): boolean {
  const disabled = element.closest('[aria-disabled="true"]')
  return disabled != null && container.contains(disabled)
}

/**
 * 把 Tab 停靠点排在前面，各组内保持文档顺序。带漫游 tabindex 的复合控件（网格、工具栏）里，
 * 拿着 `tabindex="0"` 的那个成员排在 `-1` 的成员前面。
 */
export function preferTabStops<T extends Element>(elements: readonly T[]): T[] {
  const isTabStop = (element: T): boolean => element.getAttribute('tabindex') !== '-1'
  return [...elements.filter(isTabStop), ...elements.filter(element => !isTabStop(element))]
}

/**
 * 弹层打开时初始焦点可以落的元素，按优先顺序排。
 * 跳过组件自带的后备关闭按钮和禁用（`aria-disabled`）的控件：禁用的控件仍能用 Tab 走到，
 * 但不该一打开就停在它上面。
 */
export function initialFocusCandidates(surface: HTMLElement, skipSelector?: string): HTMLElement[] {
  return preferTabStops(inDocumentOrder(getFocusables(surface)).filter(element =>
    (skipSelector == null || element.closest(skipSelector) == null)
    && !isDisabledWithin(element, surface),
  ))
}
