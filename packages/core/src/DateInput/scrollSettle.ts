/**
 * 吸附滚动容器停稳的信号。
 *
 * 有 `scrollend` 的浏览器用它；iOS Safari 26 以前没有，就退回「安静一段时间」的计时器。
 * 计时器有两样不能当成停稳：手指按着不动（滚动事件停了，但手还在屏上），
 * 以及惯性（iOS 的惯性在手指离开后还会跑一秒多，尾段事件间隔很不均匀）。
 * 所以要等手指抬起，再从最后一次滚动事件起算安静期，这样多长的惯性都能等过去。
 *
 * 调用方自己发起的一次滚动叫「引导」（steer）：它记下要去的那一排，停稳后的校正把它送到目的地，
 * 而不是四舍五入回最近的一排。人的输入（手指、滚轮或触控板、按下、按键）一到，引导就结束，
 * 从这以后滚动归人。
 */

/** 停稳前必须安静这么久。要盖过浏览器自己手指离开后约 150 到 300ms 的吸附动画。 */
export const SCROLL_QUIET_MS = 220

/** 所有监听都是被动的，共用一个选项对象。 */
export const PASSIVE: AddEventListenerOptions = { passive: true }

/**
 * 按键在捕获阶段结束引导：方向键先到格子自己的处理，那里会为键盘挪到的月份开一次新的引导，
 * 冒泡上来再结束就把它也结束了。
 */
const PASSIVE_CAPTURE: AddEventListenerOptions = { passive: true, capture: true }

/** 调用方自己发起的、朝某一排去的滚动。 */
export interface ScrollSteer {
  /** 记下这次滚动要去的排。 */
  start: (row: number) => void
  /** 还在路上的那次滚动要去的排，没有就是 null。 */
  current: () => number | null
  /** 结束引导。 */
  end: () => void
}

export function createScrollSteer(): ScrollSteer {
  let row: number | null = null
  return {
    start: (next) => {
      row = next
    },
    current: () => row,
    end: () => {
      row = null
    },
  }
}

/**
 * `element` 停止滚动（含惯性）后调用一次 `onSettle`。返回解除监听的函数；解除时引导也一并结束，
 * 再显示时滚动器重新摆放，不会被拉回旧的一排。
 */
export function attachScrollSettle(
  element: HTMLElement,
  onSettle: (element: HTMLElement) => void,
  steer?: ScrollSteer,
): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined
  let hasSettled = false
  let isTouching = false

  const settle = (): void => {
    if (hasSettled || isTouching)
      return
    hasSettled = true
    clearTimeout(timer)
    onSettle(element)
  }

  const arm = (): void => {
    clearTimeout(timer)
    timer = setTimeout(settle, SCROLL_QUIET_MS)
  }

  // 新的滚动让之前的停稳作废，安静期从最后一次滚动起算。
  const onScroll = (): void => {
    hasSettled = false
    arm()
  }

  const onTouchStart = (): void => {
    isTouching = true
    hasSettled = false
    clearTimeout(timer)
    steer?.end()
  }

  // 惯性会自己再触发滚动；没有甩动直接抬手时没有后续事件，靠这里的计时器收尾。
  const onTouchEnd = (): void => {
    isTouching = false
    arm()
  }

  const endSteer = (): void => steer?.end()

  element.addEventListener('scroll', onScroll, PASSIVE)
  element.addEventListener('scrollend', settle, PASSIVE)
  element.addEventListener('touchstart', onTouchStart, PASSIVE)
  element.addEventListener('touchend', onTouchEnd, PASSIVE)
  element.addEventListener('touchcancel', onTouchEnd, PASSIVE)
  element.addEventListener('wheel', endSteer, PASSIVE)
  element.addEventListener('pointerdown', endSteer, PASSIVE)
  element.addEventListener('keydown', endSteer, PASSIVE_CAPTURE)

  return () => {
    clearTimeout(timer)
    steer?.end()
    element.removeEventListener('scroll', onScroll, PASSIVE)
    element.removeEventListener('scrollend', settle, PASSIVE)
    element.removeEventListener('touchstart', onTouchStart, PASSIVE)
    element.removeEventListener('touchend', onTouchEnd, PASSIVE)
    element.removeEventListener('touchcancel', onTouchEnd, PASSIVE)
    element.removeEventListener('wheel', endSteer, PASSIVE)
    element.removeEventListener('pointerdown', endSteer, PASSIVE)
    element.removeEventListener('keydown', endSteer, PASSIVE_CAPTURE)
  }
}
