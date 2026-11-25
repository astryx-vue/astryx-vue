/**
 * 「这个元素在不在滚动视图里」的唯一定义，和 UIKit 判断一次触摸时问的是同一个问题。
 *
 * 触屏按压模型靠它决定要不要等：滚动视图里的一次触摸可能变成滚动，所以先等 150ms 再亮；
 * 滚动视图外没有东西能把触摸变成滚动，手指落下的那一帧就亮，和原生控件一样。
 */

/** 能滚动的 overflow 取值。 */
const SCROLLABLE_OVERFLOW: ReadonlySet<string> = new Set(['auto', 'scroll', 'overlay'])

/** 内容至少要溢出这么多像素才算能滚。 */
const OVERFLOW_TOLERANCE_PX = 1

export interface AllowedPans {
  readonly x: boolean
  readonly y: boolean
}

/** 一个 `touch-action` 值允许浏览器在哪些方向上平移。 */
export function parseTouchAction(value: string): AllowedPans {
  const tokens = value.trim().split(/\s+/)
  if (tokens.includes('auto') || tokens.includes('manipulation'))
    return { x: true, y: true }
  if (tokens.includes('none'))
    return { x: false, y: false }
  return {
    x: tokens.some(token => token === 'pan-x' || token === 'pan-left' || token === 'pan-right'),
    y: tokens.some(token => token === 'pan-y' || token === 'pan-up' || token === 'pan-down'),
  }
}

/** 视口在某个方向上的 overflow：根元素或 body 被裁剪（比如滚动锁写了 `overflow: hidden`）就不滚。 */
function rootOverflow(doc: Document, axis: 'x' | 'y'): string {
  const view = doc.defaultView
  if (view == null)
    return 'hidden'
  for (const element of [doc.documentElement, doc.body]) {
    if (element == null)
      continue
    const style = view.getComputedStyle(element)
    const value = axis === 'x' ? style.overflowX : style.overflowY
    if (value === 'hidden' || value === 'clip')
      return 'hidden'
  }
  return 'auto'
}

function overflows(element: Element, axis: 'x' | 'y'): boolean {
  return axis === 'y'
    ? element.scrollHeight - element.clientHeight > OVERFLOW_TOLERANCE_PX
    : element.scrollWidth - element.clientWidth > OVERFLOW_TOLERANCE_PX
}

function scrollsOn(style: CSSStyleDeclaration, element: Element, pans: AllowedPans): boolean {
  return (pans.y && SCROLLABLE_OVERFLOW.has(style.overflowY) && overflows(element, 'y'))
    || (pans.x && SCROLLABLE_OVERFLOW.has(style.overflowX) && overflows(element, 'x'))
}

/** 父节点，穿过 shadow root 到它的宿主。 */
function parentAcrossShadow(node: Node): Node | null {
  const parent = node.parentNode
  if (parent != null && typeof ShadowRoot !== 'undefined' && parent instanceof ShadowRoot)
    return parent.host
  return parent
}

/**
 * 在 `element` 上的一次触摸是不是落在滚动视图里：它上面某个盒子（包括页面本身）在某个方向上溢出、
 * 能滚，而且一路上的 `touch-action` 把那个方向留给了浏览器。
 * `position: fixed` 的盒子不跟着上面的滚动容器动，遇到它就停。
 */
export function isInsideScrollView(element: Element): boolean {
  const doc = element.ownerDocument
  const view = doc.defaultView
  if (view == null)
    return false
  const root = doc.scrollingElement ?? doc.documentElement
  let pans: AllowedPans = { x: true, y: true }
  for (let node: Node | null = element; node != null; node = parentAcrossShadow(node)) {
    if (!(node instanceof Element))
      continue
    const style = view.getComputedStyle(node)
    const allowed = parseTouchAction(style.touchAction || 'auto')
    pans = { x: pans.x && allowed.x, y: pans.y && allowed.y }
    if (node === root || node === doc.documentElement)
      break
    if (scrollsOn(style, node, pans))
      return true
    if (style.position === 'fixed')
      return false
  }
  return (pans.y && SCROLLABLE_OVERFLOW.has(rootOverflow(doc, 'y')) && overflows(root, 'y'))
    || (pans.x && SCROLLABLE_OVERFLOW.has(rootOverflow(doc, 'x')) && overflows(root, 'x'))
}
