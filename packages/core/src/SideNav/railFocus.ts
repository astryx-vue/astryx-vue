/**
 * @file railFocus.ts
 * @input SideNav 的 nav 元素和外层框架元素
 * @output 收起轨道时的焦点接力：`noteRailFocus`（变化前）和 `moveRailFocus`（变化后）
 * @position SideNav 内部
 *
 * 收起的轨道不画某些东西（没有图标的行、嵌套的行、行内的动作和展开按钮），焦点还在上面的话，
 * 收起时会掉到页面上。这里把它接住：
 * - 焦点在轨道保留的行上（链接换成了收起形态，展开按钮、动作消失）：留在这一行的控件上；
 * - 焦点在轨道丢掉的行上（没有图标，或是嵌套的）：交给轨道的收起按钮，没有按钮就交给最近的保留行；
 * - 焦点在页头或页脚的控件上：按无障碍名称在收起后的轨道里找回同名控件，找不到就交给收起按钮，再不行交给第一个保留行；
 * - 焦点在缩放手柄上：同样交给收起按钮或第一个保留行。
 * 行用 `data-astryx-side-nav-row` 标记，值是 `kept`（轨道收起后仍画它）或 `dropped`；
 * 收起前后同一行的元素不是同一个，所以按「第几个保留行」对应。焦点没丢就不动。
 */
import type { FocusWithin } from '../composables/internal/focusLeaving.js'
import { moveFocusLeftBehind, noteFocusWithin } from '../composables/internal/focusLeaving.js'
import { focusablesIn } from '../composables/internal/focusRegion.js'

export const SIDE_NAV_ROW_ATTRIBUTE = 'data-astryx-side-nav-row'

/** 变化之前记下的焦点位置，变化之后挪焦点要用。 */
export interface PendingRailFocus {
  focus: FocusWithin
  /** 带焦点的行是不是轨道保留的。 */
  isRowKept: boolean
  /** 带焦点的行之前有几个保留行。 */
  keptBefore: number
  /** 行之外带焦点的控件的无障碍名称。 */
  outside: { name: string } | null
  /** 焦点是不是在收起按钮上。 */
  wasOnToggle: boolean
}

/** nav 里所有行，按文档顺序；展开的子菜单浮层是独立的一层，不算。 */
function railRows(nav: HTMLElement): HTMLElement[] {
  return Array.from(nav.querySelectorAll<HTMLElement>(`[${SIDE_NAV_ROW_ATTRIBUTE}]`))
    .filter(row => row.closest('.astryx-side-nav-item__popover') == null)
}

function isKept(row: HTMLElement): boolean {
  return row.getAttribute(SIDE_NAV_ROW_ATTRIBUTE) === 'kept'
}

function toggleIn(nav: HTMLElement): HTMLElement | null {
  return nav.querySelector<HTMLElement>('.astryx-side-nav-collapse')
}

function controlOf(row: HTMLElement | undefined): HTMLElement | undefined {
  if (row == null)
    return undefined
  return row.matches('a[href], button, [tabindex]') ? row : focusablesIn(row)[0]
}

/** 行之外（页头、页脚）的可聚焦控件。 */
function controlsOutsideRows(nav: HTMLElement, rows: HTMLElement[]): HTMLElement[] {
  return focusablesIn(nav).filter(control => !rows.some(row => row.contains(control)))
}

function visibleText(element: Element): string {
  const copy = element.cloneNode(true) as Element
  for (const hidden of copy.querySelectorAll('[aria-hidden="true"]'))
    hidden.remove()
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** 控件的无障碍名称，用来在重新渲染之后认出同一个控件。 */
function controlName(control: HTMLElement): string {
  const labelledBy = control.getAttribute('aria-labelledby')?.trim()
  if (labelledBy) {
    const text = labelledBy
      .split(/\s+/)
      .map(id => control.ownerDocument.getElementById(id))
      .filter((node): node is HTMLElement => node != null)
      .map(visibleText)
      .join(' ')
      .trim()
    if (text !== '')
      return text
  }
  return control.getAttribute('aria-label')?.trim() || visibleText(control)
}

/** DOM 变化之前调用：记下焦点在 nav（或缩放手柄所在的外层框架）的哪里。 */
export function noteRailFocus(
  nav: HTMLElement | null,
  frame: HTMLElement | null,
  wasCollapsed: boolean,
): PendingRailFocus | null {
  const focus = wasCollapsed ? null : (noteFocusWithin(nav) ?? noteFocusWithin(frame))
  if (focus == null || nav == null)
    return null
  const rows = railRows(nav)
  // 最里面带焦点的行，也就是文档顺序里最后一个：嵌套行的父行同样包着焦点。
  let index = -1
  rows.forEach((row, at) => {
    if (row.contains(focus.element))
      index = at
  })
  let outside: PendingRailFocus['outside'] = null
  if (index < 0) {
    const controls = controlsOutsideRows(nav, rows)
    const at = controls.findIndex(control => control.contains(focus.element))
    outside = at < 0 ? null : { name: controlName(controls[at]!) }
  }
  const toggle = toggleIn(nav)
  return {
    focus,
    outside,
    wasOnToggle: toggle?.contains(focus.element) ?? false,
    isRowKept: index >= 0 && isKept(rows[index]!),
    keptBefore: rows.slice(0, Math.max(index, 0)).filter(isKept).length,
  }
}

/** DOM 变化之后调用：轨道收起了才挪；焦点没丢就不动。 */
export function moveRailFocus(
  pending: PendingRailFocus,
  nav: HTMLElement | null,
  isCollapsed: boolean,
): void {
  if (!isCollapsed || nav == null)
    return
  // 收起后，nav 里画出来的每一行都是轨道保留的，顺序不变。
  const kept = railRows(nav)
  const toggle = toggleIn(nav) ?? undefined
  let sameOutside: HTMLElement | undefined
  if (pending.wasOnToggle) {
    sameOutside = toggle
  }
  else if (pending.outside != null) {
    sameOutside = controlsOutsideRows(nav, kept)
      .find(control => controlName(control) === pending.outside?.name)
  }
  const target = pending.isRowKept
    ? controlOf(kept[pending.keptBefore])
    : (sameOutside ?? toggle ?? controlOf(kept[pending.keptBefore - 1]) ?? controlOf(kept[pending.keptBefore]))
  moveFocusLeftBehind(pending.focus, target)
}
