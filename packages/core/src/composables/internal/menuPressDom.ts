import type { MenuPressPointerType } from './menuPressGesture.js'
import { runAsMenuPressActivation } from './strayClick.js'

/** 带这个标记的菜单根用的是按压模型。嵌套的飞出层靠它分清一次按压归哪一层。 */
export const MENU_PRESS_MARKER = 'data-astryx-menu-press'
export const MENU_PRESS_ROOT_SELECTOR = `[${MENU_PRESS_MARKER}]`

/** 菜单里可用的行：三种菜单项角色，且没有 `aria-disabled="true"`。 */
export const MENU_PRESS_ITEM_SELECTOR = ['menuitem', 'menuitemradio', 'menuitemcheckbox']
  .map(role => `[role="${role}"]:not([aria-disabled="true"])`)
  .join(',')

const FOCUSABLE_ROW_SELECTOR = '[tabindex], a[href], button, input, select, textarea, [contenteditable]'
const INNER_CONTROL_SELECTOR = 'a[href], button, [tabindex]'

export interface ResolvedPoint {
  row: HTMLElement | null
  isInMenu: boolean
  isOnTrigger: boolean
}

export interface ResolvePointInput {
  menu: HTMLElement | null
  trigger: HTMLElement | null
  itemSelector: string
  hitTest?: (x: number, y: number) => Element | null
}

export function normalizePointerType(type: string): MenuPressPointerType | null {
  return type === 'mouse' || type === 'touch' || type === 'pen' ? type : null
}

/** 最外层带标记的根。飞出层如果是父菜单的 DOM 后代，算同一个菜单。 */
export function getOutermostRoot(menu: HTMLElement): HTMLElement {
  let root = menu
  for (;;) {
    const parent = root.parentElement?.closest<HTMLElement>(MENU_PRESS_ROOT_SELECTOR)
    if (parent == null)
      return root
    root = parent
  }
}

/**
 * 指针所在位置下的元素。
 *
 * 手指的指针事件一直发给它落下的那个元素，所以要按坐标找当前在它下面的是谁。
 * 测试环境的 `elementFromPoint` 没有布局，答不出来时退回事件目标。
 */
function elementUnder(event: PointerEvent, doc: Document, hitTest?: ResolvePointInput['hitTest']): Element | null {
  const hit = hitTest != null
    ? hitTest(event.clientX, event.clientY)
    : (typeof doc.elementFromPoint === 'function' ? doc.elementFromPoint(event.clientX, event.clientY) : null)
  if (hit != null)
    return hit
  return event.target instanceof Element ? event.target : null
}

/** 指针下面是哪一行、在不在菜单里、在不在触发器上。 */
export function resolvePoint(event: PointerEvent, doc: Document, input: ResolvePointInput): ResolvedPoint {
  const element = elementUnder(event, doc, input.hitTest)
  const root = input.menu == null ? null : getOutermostRoot(input.menu)
  const isInMenu = root != null && element != null && root.contains(element)
  const isOnTrigger = input.trigger != null && element != null && input.trigger.contains(element)
  let row: HTMLElement | null = null
  if (isInMenu && element != null) {
    row = element.closest<HTMLElement>(input.itemSelector)
    if (row != null && !root!.contains(row))
      row = null
  }
  return { row, isInMenu, isOnTrigger }
}

/**
 * 默认的高亮：菜单里高亮就是 DOM 焦点（`preventScroll`）。
 * 行本身不可聚焦时聚焦里面的控件；指针下没有行时把焦点放在菜单根上，这样没有一行亮着。
 */
export function focusHighlight(row: HTMLElement | null, menu: HTMLElement | null, doc: Document): void {
  const target = row == null
    ? menu
    : (row.matches(FOCUSABLE_ROW_SELECTOR) ? row : row.querySelector<HTMLElement>(INNER_CONTROL_SELECTOR))
  if (target != null && target !== doc.activeElement)
    target.focus({ preventScroll: true })
}

/**
 * 默认的执行：像这一行自己被点了一样，派发一次 click，带上松开时的按键和修饰键。
 * `detail: 0` 表示这是派发出来的激活（键盘的也是 0），吞 click 的口子会放它过去。
 */
export function dispatchRowClick(row: HTMLElement, release: PointerEvent): void {
  runAsMenuPressActivation(() => {
    row.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: 0,
      button: release.button ?? 0,
      clientX: release.clientX,
      clientY: release.clientY,
      screenX: release.screenX,
      screenY: release.screenY,
      ctrlKey: release.ctrlKey,
      shiftKey: release.shiftKey,
      altKey: release.altKey,
      metaKey: release.metaKey,
    }))
  })
}

/** 手指按住触发器打开菜单之后，页面不能再在这根手指下面滚动。返回撤掉的函数。 */
export function preventTouchScroll(doc: Document): () => void {
  const prevent = (event: TouchEvent): void => {
    if (event.cancelable)
      event.preventDefault()
  }
  doc.addEventListener('touchmove', prevent, { passive: false, capture: true })
  return () => doc.removeEventListener('touchmove', prevent, true)
}
