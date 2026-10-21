import type { Component, VNode } from 'vue'
import { isVNode } from 'vue'

/** 调用方自己画的选项操作。宿主只把它放进格子。 */
export type OptionActionNode = VNode | Component

export function isOptionAction(value: unknown): value is OptionActionNode {
  if (value == null || value === false)
    return false
  return isVNode(value) || typeof value === 'object' || typeof value === 'function'
}
