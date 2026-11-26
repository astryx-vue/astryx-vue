/**
 * @file inputHoldInert.ts
 * @output 退场暂挡（`scope: 'layer'`）的内容处理：把浮层内容变成 inert、把焦点移出去，
 *   放开时恢复；判断一个节点是不是在浮层里面的另一个浮层里
 * @position 输入暂挡的退场部分（对应上游 Layer/inputHold 的 makeContentInert）
 */

import { deepActiveElement, parentAcrossShadow } from '../utils/flatTree'
import { isElement, isHTMLElement } from '../utils/nodeType'
import { FOCUSABLE_SELECTOR } from './focus'

/** 浮层根：每个浮层（对话框、弹出框、toast 区域）都带的类，以及原生的顶层元素。 */
const LAYER_ROOT_SELECTOR = '.astryx-layer, [popover], dialog'

function isLayerRoot(element: Element): boolean {
  return element.matches(LAYER_ROOT_SELECTOR)
}

/** `target` 是否在 `layer` 里面的另一个浮层里（模态框托管的 toast 区域）。 */
export function isInNestedLayer(target: Node, layer: Node): boolean {
  for (let node: Node | null = target; node != null && node !== layer; node = parentAcrossShadow(node)) {
    if (isElement(node) && isLayerRoot(node))
      return true
  }
  return false
}

/** 里面什么可聚焦的都没有的实时区域：它不接输入，inert 会吞掉写进去的话。 */
function isTextLiveRegion(element: Element): boolean {
  const live = element.getAttribute('aria-live')
  const isLive = live != null
    ? live !== 'off'
    : ['status', 'alert', 'log'].includes(element.getAttribute('role') ?? '')
  return isLive && !element.matches(FOCUSABLE_SELECTOR) && element.querySelector(FOCUSABLE_SELECTOR) == null
}

/**
 * 把浮层内容变成 inert，焦点移出去。挡板、没有可聚焦内容的直接子实时区域、浮层
 * 里面的另一个浮层保持可用；装着另一个浮层的元素自己保持可用，它的其它子元素变成
 * inert（inert 内容里不会有可用的后代）。浮层元素本身保持可用：inert 子树不接命中，
 * 浮层里的挡板照样接住每一下。返回变成 inert 的元素和它们原来的状态。
 */
export function makeContentInert(layer: Element, shield: Element): Map<Element, boolean> {
  const content = new Map<Element, boolean>()
  const makeInertAround = (parent: Element, isLayer: boolean): void => {
    for (const child of parent.children) {
      if (child === shield || isLayerRoot(child) || (isLayer && isTextLiveRegion(child)))
        continue
      if (child.querySelector(LAYER_ROOT_SELECTOR) != null) {
        makeInertAround(child, false)
        continue
      }
      content.set(child, child.hasAttribute('inert'))
      child.setAttribute('inert', '')
    }
  }
  makeInertAround(layer, true)
  // 变成 inert 时还拿着焦点的按钮，Enter 和空格照样能按下去：移走焦点，像浏览器的焦点修正那样落到文档上。
  const focused = deepActiveElement(layer.ownerDocument)
  if (isHTMLElement(focused) && [...content.keys()].some(element => element.contains(focused)))
    focused.blur()
  return content
}

/** 放开退场暂挡：内容恢复原来的 inert 状态。 */
export function restoreContent(content: Map<Element, boolean>): void {
  for (const [element, wasInert] of content) {
    if (!wasInert)
      element.removeAttribute('inert')
  }
}
