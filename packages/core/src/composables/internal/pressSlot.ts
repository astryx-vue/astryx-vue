import type { PressGesture, PressPaint, PressStep, PressTimer } from './pressGesture.js'
import { endAfterRelease, pressFadeMs } from './pressFade.js'
import {
  idlePressGesture,
  PRESS_FADE_MS,
  PRESS_FLASH_MS,
  PRESS_ONSET_MS,
  pressGestureStep,
} from './pressGesture.js'

/**
 * 按压控制器的跟踪槽位和「把状态机的答案画到元素上」。
 * 控制器（pressFeedback.ts）和鼠标键、空格键的按压（pressButton.ts）共用这里。
 */

/** 按压成立且手指还在时为 `on`，抬手淡出时为 `fading`，其余时候不存在。 */
export const PRESSED_ATTRIBUTE = 'data-astryx-press'

export interface LiveGesture {
  element: HTMLElement
  gesture: PressGesture
  /** 这次手势属于哪根手指。第二根手指不算。 */
  pointerId: number | null
  /** 取消当前阶段欠下的计时，或释放正在等的那段动画。 */
  timer: (() => void) | null
}

/**
 * 一个跟踪槽位。手指的按压跑完整台状态机（等待、容差、被滚动抢走）。
 * 鼠标键或空格键的按压立刻成立、只等松开，单独占一个槽位：手指落下不会结束它，它也不会吞掉手指的按压。
 */
export interface Slot {
  live: LiveGesture | null
  /** 这个槽位的手势被擦掉时要做的收尾。 */
  onFinish?: () => void
}

export const finger: Slot = { live: null }
export const button: Slot = { live: null }

const TIMER_MS: Record<PressTimer, number> = {
  fade: PRESS_FADE_MS,
  flash: PRESS_FLASH_MS,
  onset: PRESS_ONSET_MS,
}

const TIMER_EVENT = {
  fade: 'fadeEnd',
  flash: 'flashEnd',
  onset: 'onset',
} as const

function paintElement(element: HTMLElement, paint: PressPaint): void {
  if (paint === 'none')
    element.removeAttribute(PRESSED_ATTRIBUTE)
  // 画的东西没变就不写，元素每次换样子只看到一次变化。
  else if (element.getAttribute(PRESSED_ATTRIBUTE) !== paint)
    element.setAttribute(PRESSED_ATTRIBUTE, paint)
}

export function clearTimer(slot: Slot): void {
  if (slot.live?.timer != null) {
    slot.live.timer()
    slot.live.timer = null
  }
}

/**
 * 把一个事件交给状态机，再让 DOM 照答案画。
 *
 * 计时器规则：阶段没变、又没要新计时器的一步是路过，原来那个计时器必须留着。
 * 如果每步都先清掉，会有三种手势最后停在「没人碰却亮着」：
 * 等待期内手指在容差内抖了一下（真手指都会抖），onset 被清掉，按压永远不亮；
 * 轻点的 100ms 闪亮期内来了 pointercancel 或滚动，flashEnd 被清掉，一直亮着；
 * 淡出期内同样，`fading` 留在元素上。
 */
export function apply(slot: Slot, step: PressStep, sinceEventMs = 0): void {
  const live = slot.live
  if (live == null)
    return
  const phaseMoved = step.gesture.phase !== live.gesture.phase
  if (step.timer != null || phaseMoved)
    clearTimer(slot)
  live.gesture = step.gesture
  paintElement(live.element, step.paint)
  if (step.gesture.phase === 'idle') {
    slot.live = null
    return
  }
  if (step.timer != null) {
    const kind = step.timer
    const fire = (): void => {
      if (slot.live != null)
        slot.live.timer = null
      apply(slot, pressGestureStep(slot.live?.gesture ?? idlePressGesture(), { kind: TIMER_EVENT[kind] }))
    }
    if (kind === 'fade') {
      // 淡出的钟读主题的退出时长；主线程再忙，淡出也等它自己的动画播完才结束。
      live.timer = endAfterRelease(live.element, pressFadeMs(live.element), fire)
    }
    else {
      // 用定时器，不用 requestAnimationFrame：iOS 滚动时会压低帧回调，按帧算的延时会在滚动结束后才到，
      // 那时去亮一个已经没人按的控件。onset 从触摸算起，监听函数等掉的时间要扣掉。
      const delay = kind === 'onset' ? Math.max(0, TIMER_MS.onset - sinceEventMs) : TIMER_MS[kind]
      const timer = setTimeout(fire, delay)
      live.timer = () => clearTimeout(timer)
    }
  }
}

/** 手势一死就让出槽位。变成滚动的手势以 pointercancel 结束，没有 pointerup。 */
export function releaseIfDead(slot: Slot): void {
  if (slot.live?.gesture.phase === 'dead') {
    clearTimer(slot)
    slot.live = null
  }
}

/** 擦掉颜色、忘掉手势，不经过状态机。 */
export function finish(slot: Slot): void {
  const live = slot.live
  if (live == null)
    return
  clearTimer(slot)
  live.element.removeAttribute(PRESSED_ATTRIBUTE)
  slot.live = null
  slot.onFinish?.()
}

/** 新的一次按压拥有这个元素的画面：另一个槽位在它上面的手势结束。 */
export function takeOver(other: Slot, element: HTMLElement): void {
  if (other.live?.element === element)
    finish(other)
}
