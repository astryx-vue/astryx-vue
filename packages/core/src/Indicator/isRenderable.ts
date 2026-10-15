import type { VNode, VNodeChild } from 'vue'
import { Comment, Fragment, Text } from 'vue'

/**
 * Whether a slot or vnode should replace an indicator's own mark.
 *
 * Null, undefined, booleans, and the empty string do not count. An element
 * does, even when that element later renders nothing. A host writes
 * `v-if="busy"` around a spinner, and `false` must not delete the mark.
 */
export function isRenderable(value: VNodeChild | VNodeChild[] | undefined): boolean {
  if (value == null || typeof value === 'boolean' || value === '')
    return false
  if (Array.isArray(value))
    return value.some(item => isRenderable(item))
  if (typeof value !== 'object')
    return true

  const node = value as VNode
  if (node.type === Comment)
    return false
  if (node.type === Text)
    return String(node.children ?? '').trim() !== ''
  if (node.type === Fragment)
    return isRenderable(node.children as VNodeChild)
  return true
}
