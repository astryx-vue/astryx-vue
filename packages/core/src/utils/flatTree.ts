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
