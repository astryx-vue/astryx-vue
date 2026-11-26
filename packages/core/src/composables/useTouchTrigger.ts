import type { MaybeRefOrGetter, Ref } from 'vue'
import { useTouchTriggerInternal } from './internal/useTouchTriggerInternal.js'

export { isActionTrigger } from './internal/touchTriggerRules.js'

/**
 * 悬停类浮层在触屏上怎么响应。
 *
 * - `auto`：点一下打开，除非触发器本身是个会做事的东西（按钮、链接、表单控件）。
 *   轻点落在禁用的控件上时总是打开，好让禁用原因在触屏上也看得到。
 * - `tap`：总是点一下打开，哪怕触发器自己也有动作。
 * - `none`：触屏上从不打开。
 */
export type LayerTouchTrigger = 'auto' | 'tap' | 'none'

export interface UseTouchTriggerOptions {
  /** 触屏上的触发方式。 */
  touchTrigger: MaybeRefOrGetter<LayerTouchTrigger>
  /** 触发器是不是还能用。 @default true */
  isEnabled?: MaybeRefOrGetter<boolean>
  /** 打开状态是不是由外面控制。受控的浮层不会被点击开关。 @default false */
  isControlled?: MaybeRefOrGetter<boolean>
  /** 浮层现在是否打开。 */
  isOpen: MaybeRefOrGetter<boolean>
  /** 浮层元素的 id，用来判断「点在浮层里面」。 */
  layerId: MaybeRefOrGetter<string>
  /** 触发器元素。 */
  triggerRef: Ref<HTMLElement | null>
  /** 立刻打开，不等悬停延时。 */
  show: () => void
  /** 立刻关闭。 */
  hide: () => void
}

export interface UseTouchTriggerReturn {
  /**
   * 当前这次交互是不是没有悬停能力的指针（手指，或者已经落下的笔）。
   * 悬停在屏幕上的笔是 false，因为它确实在悬停。
   */
  isTouchPointer: Ref<boolean>
  /**
   * 这一次交互是不是触屏。和上一条不同的是，用户一用键盘导航它就变回 false，
   * 这样点过一次之后焦点驱动的浮层还能用。在点过之后用软键盘往文本框里打字
   * 仍算触屏：打字不是换成键盘操作。
   */
  isTouchInteraction: () => boolean
  /** 绑到触发器的 pointerenter 上：在合成的悬停事件之前记下指针类型。 */
  handlePointerEnter: (event: PointerEvent) => void
  /**
   * 绑到触发器的 pointerdown 上。返回 true 表示这次按压是触屏、
   * 并且已经由这里接手，调用方自己的按下逻辑不要重复执行。
   * 触屏按压本身不开也不关：等同一次按压的轻点（手指抬起、没有滚动时浏览器派发的 click）。
   */
  handlePointerDown: (event: PointerEvent) => boolean
  /** 忘掉「是点开的」这件事。其它关闭路径（Escape、受控关闭）都要调。 */
  clearTapOpen: () => void
}

/**
 * 悬停类浮层（Tooltip、HoverCard）共用的触屏行为。
 *
 * 触屏上表达不了「悬停」：点一下会合成 `mouseenter`，不处理的悬停浮层要么
 * 每次点都弹出来、又没有东西能关掉它，要么把用户点控件的这一下吃掉。
 *
 * 一次触屏按压要等它成了轻点才算数。手指落在触发器上可能是开始滚动、缩放或长按，
 * 只有浏览器在手指挪动或抬起后才知道是哪个，它的 click 就是结论。所以从触发器上开始的
 * 滚动不会打开提示，停着不动的手指也不会。点开的浮层在外面轻点抬起时关，
 * 或在外面开始的滚动被浏览器接走时关，和 iOS 关闭弹出框的时机一样。
 */
export function useTouchTrigger(options: UseTouchTriggerOptions): UseTouchTriggerReturn {
  const touch = useTouchTriggerInternal(options)
  return {
    isTouchPointer: touch.isTouchPointer,
    isTouchInteraction: touch.isTouchInteraction,
    handlePointerEnter: touch.handlePointerEnter,
    handlePointerDown: touch.handlePointerDown,
    clearTapOpen: touch.clearTapOpen,
  }
}
