import { FOCUSABLE_SELECTOR } from '../../layer/focus.js'
import { isScrollCapableOverflow } from './scrollGeometry.js'
import { getRegisteredScrollOwnerState } from './scrollOwnerRegistry.js'

/**
 * 焦点进入时的滚动键盘委托。
 *
 * 一块能滚动、自己又是 Tab 停靠点的视口，里面第一个就是普通的按钮或链接时，
 * 用 Tab 进来会先停在视口上，再按一次才到那个按钮。这里在视口被 Tab 选中的那一刻，
 * 直接把焦点交给里面第一个按钮或链接；方向键、翻页键的滚动仍然完全交给浏览器。
 * Shift+Tab 从那个按钮往回走时，临时把视口移出 Tab 顺序，免得又停回视口上。
 *
 * 只有很保守的情况才委托：第一个可聚焦的必须是 tabindex 为 0 的 `a[href]` 或 `button`，
 * 没有弹出菜单、没被禁用、没藏起来；从它到视口之间不能有交互角色、活动后代、
 * 可编辑区域，也不能夹着另一个滚动容器。不满足就什么都不做，焦点照常停在视口上。
 */

// 结构性角色里可以放普通链接、按钮。交互角色和不认识的角色一律不委托。
const PASSIVE_ROLES = new Set([
  'article',
  'banner',
  'complementary',
  'contentinfo',
  'definition',
  'directory',
  'document',
  'figure',
  'form',
  'generic',
  'group',
  'heading',
  'list',
  'listitem',
  'main',
  'navigation',
  'none',
  'note',
  'paragraph',
  'presentation',
  'region',
  'section',
  'status',
  'table',
  'term',
])

function isSequential(element: HTMLElement): boolean {
  if (element.tabIndex < 0 || element.matches(':disabled') || element.closest('[inert], [hidden]') != null)
    return false
  if (element.getClientRects().length === 0)
    return false
  const visibility = getComputedStyle(element).visibility
  return visibility !== 'hidden' && visibility !== 'collapse'
}

function firstSequential(content: HTMLElement): HTMLElement | null {
  let first = content.matches(FOCUSABLE_SELECTOR) && isSequential(content) ? content : null
  for (const candidate of content.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)) {
    // 找到第一个之后，只有正的 tabindex 能排到它前面，普通的后续控件不用再量。
    if (first != null && candidate.tabIndex <= 0)
      continue
    if (!isSequential(candidate))
      continue
    // 正 tabindex 排在 tabindex 为 0 的视口前面，不能越过它的顺序去委托。
    if (candidate.tabIndex > 0)
      return null
    first ??= candidate
  }
  return first
}

function isPlainAction(element: HTMLElement): boolean {
  return element.tabIndex === 0
    && element.matches('a[href], button')
    && element.closest('[aria-hidden="true"]') == null
    && !element.matches('[aria-disabled="true"], [aria-haspopup]:not([aria-haspopup="false"])')
}

function blocksDelegation(ancestor: HTMLElement, first: HTMLElement): boolean {
  const role = ancestor.getAttribute('role')?.trim().toLowerCase()
  const isOwnNativeRole = ancestor === first
    && ((role === 'button' && first.localName === 'button') || (role === 'link' && first.localName === 'a'))
  if (role != null && role !== '' && !isOwnNativeRole && (ancestor === first || !PASSIVE_ROLES.has(role)))
    return true
  if (ancestor.hasAttribute('aria-activedescendant') || ancestor.isContentEditable)
    return true
  if (ancestor.matches('[contenteditable]:not([contenteditable="false"])'))
    return true
  if (getRegisteredScrollOwnerState(ancestor) != null)
    return true
  // 也尊重还没接入共享 composable 的原生滚动容器。
  const style = getComputedStyle(ancestor)
  return (isScrollCapableOverflow(style.overflowX) && ancestor.scrollWidth > ancestor.clientWidth + 1)
    || (isScrollCapableOverflow(style.overflowY) && ancestor.scrollHeight > ancestor.clientHeight + 1)
}

function delegationTarget(viewport: HTMLElement, content: HTMLElement): HTMLElement | null {
  const first = firstSequential(content)
  if (first == null || !isPlainAction(first))
    return null
  let ancestor: HTMLElement | null = first
  while (ancestor != null && ancestor !== viewport) {
    if (blocksDelegation(ancestor, first))
      return null
    ancestor = ancestor.parentElement
  }
  return ancestor === viewport ? first : null
}

/** 只在视口真有一条能滚的轴时挂上。返回拆掉的函数。 */
export function attachScrollKeyboardDelegation(viewport: HTMLElement, content: HTMLElement): () => void {
  const doc = viewport.ownerDocument
  const view = doc.defaultView
  if (view == null)
    return () => {}

  let entry: KeyboardEvent | null = null
  let origin: EventTarget | null = null
  let delegated: HTMLElement | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let restoreTabStop: (() => void) | undefined

  const reset = (): void => {
    entry = null
    origin = null
    clearTimeout(timer)
    restoreTabStop?.()
    restoreTabStop = undefined
  }

  const onKeyDown = (event: KeyboardEvent): void => {
    reset()
    if (event.key !== 'Tab' || event.ctrlKey || event.metaKey)
      return
    // 留着事件本身：在 keydown 里 focus() 是程序聚焦（eventPhase 不为 0），原生 Tab 的聚焦在事件派发结束之后。
    entry = event
    origin = event.target
    if (event.shiftKey && delegated != null && doc.activeElement === delegated && viewport.contains(delegated)) {
      const tabIndex = viewport.getAttribute('tabindex')
      viewport.tabIndex = -1
      restoreTabStop = () => {
        if (viewport.getAttribute('tabindex') !== '-1')
          return
        if (tabIndex == null)
          viewport.removeAttribute('tabindex')
        else
          viewport.setAttribute('tabindex', tabIndex)
      }
    }
    // 被取消的 Tab、焦点离开文档、按住不放的键，都不能把过期的键盘意图留给之后的指针或程序聚焦。
    timer = setTimeout(reset, 0)
  }

  const onFocusIn = (event: FocusEvent): void => {
    const keyboardEntry = entry
    const previous = origin
    reset()
    if (event.target !== viewport) {
      if (!viewport.contains(event.target as Node | null))
        delegated = null
      return
    }
    delegated = null
    if (
      keyboardEntry == null
      || keyboardEntry.shiftKey
      || keyboardEntry.defaultPrevented
      || keyboardEntry.eventPhase !== 0
      || (event.relatedTarget != null && event.relatedTarget !== previous)
    ) {
      return
    }
    const target = delegationTarget(viewport, content)
    if (target == null)
      return
    delegated = target
    target.focus()
    if (doc.activeElement !== target)
      delegated = null
  }

  doc.addEventListener('keydown', onKeyDown, true)
  doc.addEventListener('keyup', reset, true)
  doc.addEventListener('pointerdown', reset, true)
  doc.addEventListener('focusin', onFocusIn, true)
  view.addEventListener('blur', reset)
  return () => {
    reset()
    doc.removeEventListener('keydown', onKeyDown, true)
    doc.removeEventListener('keyup', reset, true)
    doc.removeEventListener('pointerdown', reset, true)
    doc.removeEventListener('focusin', onFocusIn, true)
    view.removeEventListener('blur', reset)
  }
}
