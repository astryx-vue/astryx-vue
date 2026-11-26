import type { VNodeChild } from 'vue'
import type { TableColumn } from './types.js'
import { isVNode } from 'vue'

/**
 * 从渲染结果里收集能直接读到的文字：字符串、数字、元素的文本子节点和数组。
 * 组件节点要渲染后才知道内容，这里读不到，返回空串。
 */
export function vnodeText(node: VNodeChild): string {
  if (node == null || typeof node === 'boolean')
    return ''
  if (typeof node === 'string' || typeof node === 'number')
    return String(node)
  if (Array.isArray(node))
    return node.map(child => vnodeText(child as VNodeChild)).join('')
  if (isVNode(node)) {
    if (typeof node.type !== 'string' && typeof node.type !== 'symbol')
      return ''
    const children = node.children
    if (typeof children === 'string')
      return children
    if (Array.isArray(children))
      return children.map(child => vnodeText(child as VNodeChild)).join('')
  }
  return ''
}

/**
 * 列头的可见文字，拼无障碍名称用。函数式列头读它渲染出的文字；读不到文字时才退回列 key。
 */
export function columnHeaderText(column: TableColumn): string {
  const header = column.header
  const text = typeof header === 'function' ? vnodeText(header()) : header ?? ''
  const trimmed = text.replace(/\s+/g, ' ').trim()
  return trimmed === '' ? column.key : trimmed
}
