/**
 * 对应原版 Astryx 的 `utils/flatTree`。
 *
 * 沿“扁平树”往上走：浏览器滚动和派发事件走的就是这棵树。
 * 被分配进 slot 的节点上一层是它的 slot，shadow root 上一层是它的宿主。
 */

import { isShadowRoot } from './nodeType'

/** 节点在扁平树里的父节点，穿过 shadow root 到宿主。 */
export function parentAcrossShadow(node: Node): Node | null {
  const slot = (node as Partial<Slottable>).assignedSlot
  if (slot != null)
    return slot
  if (node.parentNode != null)
    return isShadowRoot(node.parentNode) ? node.parentNode.host : node.parentNode
  return null
}

/**
 * Whether `node` is `ancestor` or below it along the flat tree: across an open
 * shadow root to its host, which `Node.contains` does not follow.
 */
export function containsAlongFlatTree(ancestor: Node, node: Node): boolean {
  for (let at: Node | null = node; at != null; at = parentAcrossShadow(at)) {
    if (at === ancestor) {
      return true
    }
  }
  return false
}

/** The focused element of `doc`, inside open shadow roots too. */
export function deepActiveElement(
  doc: Document | null | undefined,
): Element | null {
  let active = doc?.activeElement ?? null
  while (active?.shadowRoot?.activeElement != null) {
    active = active.shadowRoot.activeElement
  }
  return active
}

/**
 * The host of a shadow root, open or closed and from any window, and null for
 * any other node.
 */
export function shadowHostOf(node: Node): Element | null {
  return isShadowRoot(node) ? node.host : null
}

/**
 * The shadow roots from `node` out to its document, innermost first, each with
 * its host. Empty when `node` is not a shadow root.
 */
export function shadowRootsOutward(
  node: Node,
): { readonly root: ShadowRoot, readonly host: Element }[] {
  const roots: { readonly root: ShadowRoot, readonly host: Element }[] = []
  for (
    let at: Node = node, host = shadowHostOf(at);
    host != null;
    at = host.getRootNode(), host = shadowHostOf(at)
  ) {
    roots.push({ root: at as ShadowRoot, host })
  }
  return roots
}
