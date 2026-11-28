import type { MaybeRefOrGetter } from 'vue'
import type { AnimatorHandle } from './internal/attachableAnimator.js'
import { getCurrentScope, onScopeDispose, toValue, watch } from 'vue'
import { createAttachableAnimator } from './internal/attachableAnimator.js'

/**
 * 用组件库自己的动效驱动 `target` 指向的元素。`target` 可以是模板 ref、
 * getter 或元素本身。在事件处理和侦听器里调用返回值的 `animate`、`decay`、
 * `set`、`get`、`getVelocity`、`stop`。
 *
 * 返回值只创建一次，动画不触发组件重新渲染。animator 跟着 `target`
 * 当前指向的元素走，换成新元素时新元素从静止状态开始。作用域销毁时停下
 * 正在跑的动画并放开元素。没有元素时每个调用都不做事，`animate` 和
 * `decay` 立刻 resolve。服务端渲染时不碰 DOM。
 *
 * @example
 * ```ts
 * const card = useTemplateRef<HTMLElement>('card')
 * const animator = useAnimator(card)
 * function pop(): void {
 *   void animator.animate({ scale: 1.2 })
 * }
 * ```
 */
export function useAnimator(target: MaybeRefOrGetter<HTMLElement | null | undefined>): AnimatorHandle {
  const { animator, attach } = createAttachableAnimator()
  // The handle without `destroy`: the composable owns the element's lifetime.
  const { destroy: _destroy, ...handle } = animator
  // Synchronous, so the element a template ref receives is attached before
  // the component's `onMounted` runs.
  watch(() => toValue(target) ?? null, element => attach(element), { immediate: true, flush: 'sync' })
  if (getCurrentScope())
    onScopeDispose(() => attach(null))
  return handle
}
