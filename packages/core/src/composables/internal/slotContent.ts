import type { VNodeChild } from 'vue'
import { isRenderable } from '../../Indicator/isRenderable.js'

type SlotFunction = (...args: never[]) => unknown

/**
 * 插槽这次渲染出来的东西算不算内容。
 *
 * 没传插槽、或者插槽只留下 `v-if` 的注释、空字符串、只有空白的文字、空 Fragment，都算没内容，
 * 包着插槽的那层元素也就不该画出来；文字 `0` 和任何元素都算内容。
 * 要在渲染时调用（模板里或渲染函数里），这样插槽里依赖的响应式数据变了会重新判断。
 */
export function hasSlotContent(slot: SlotFunction | undefined): boolean {
  return slot != null && isRenderable(slot() as VNodeChild)
}
