import type { Animator } from './internal/attachableAnimator.js'
import { createAttachableAnimator } from './internal/attachableAnimator.js'

export type {
  Animator,
  AnimatorAnimateOptions,
  AnimatorChannel,
  AnimatorDecayVelocity,
  AnimatorHandle,
  AnimatorSnapshot,
  AnimatorValues,
} from './internal/attachableAnimator.js'

/**
 * 用组件库自己的动效驱动 `element`。`animate` 用状态切换弹簧把通道带到目标值，
 * `decay` 从松手速度开始惯性滑行，`set` 直接跳到某个值，`get` 和
 * `getVelocity` 读当前值和速度，`stop` 原地停下，`destroy` 放开元素。
 * 系统开启「减弱动态效果」时，每次调用都会改走替代方案：触屏上位移变成短淡入淡出，
 * 鼠标环境下直接落到终点。
 *
 * 一个元素只配一个 animator，两个会互相覆盖。在组件里优先用 `useAnimator`。
 *
 * @example
 * ```ts
 * const animator = createAnimator(card)
 * await animator.animate({ x: 0, rotate: 0 }, { velocity: { x: -900 } })
 * void animator.decay({ x: 2400 })
 * animator.destroy()
 * ```
 */
export function createAnimator(element: HTMLElement): Animator {
  const { animator, attach } = createAttachableAnimator()
  attach(element)
  return animator
}
