import { PRESS_FADE_MS } from './pressGesture.js'
import { PRESSABLE_ATTRIBUTE } from './pressSurface.js'

/**
 * 抬手淡出的时长，以及「淡出什么时候真的结束」。
 * 时长读元素上主题的 `--astryx-duration-exit`；结束则等释放动画自己播完。
 */

/** 读出一个 CSS 时间值，单位毫秒。不是时间就返回 null。 */
function parseTimeMs(value: string): number | null {
  const match = /^\s*(-?(?:\d+(?:\.\d+)?|\.\d+))(ms|s)\s*$/.exec(value)
  if (match == null)
    return null
  const amount = Number.parseFloat(match[1]!)
  return match[2] === 's' ? amount * 1000 : amount
}

/** 减少动态效果时，抬手淡出最多这么长，和样式里的上限一致。 */
export const PRESS_FADE_REDUCED_MAX_MS = 200

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 自定义属性读出来是原文，`calc(100ms + 75ms)` 这类写法不是纯时间。
 * 让一个不显示的探针元素把这段原文当作 transition-duration，由浏览器算出实际长度，
 * 和释放动画（用同一个 token 当时长）算出的结果一致。
 */
function resolveTimeMs(element: HTMLElement, raw: string): number | null {
  const plain = parseTimeMs(raw)
  if (plain != null || raw.trim() === '')
    return plain
  const probe = element.ownerDocument.createElement('span')
  probe.style.setProperty('display', 'none', 'important')
  probe.style.setProperty('transition-duration', raw, 'important')
  if (probe.style.getPropertyValue('transition-duration') === '')
    return null
  element.appendChild(probe)
  try {
    return parseTimeMs(getComputedStyle(probe).transitionDuration.split(',')[0] ?? '')
  }
  finally {
    probe.remove()
  }
}

/**
 * 抬手后淡出的时长：元素上主题的 `--astryx-duration-exit`，抬手时读一次，
 * `calc()` 之类的写法按浏览器算出的长度算。
 * 读不出时间（没主题、或不是时间值）就用默认的 PRESS_FADE_MS。
 * 减少动态效果时不超过 {@link PRESS_FADE_REDUCED_MAX_MS}。
 */
export function pressFadeMs(element: HTMLElement): number {
  if (typeof getComputedStyle !== 'function')
    return PRESS_FADE_MS
  const ms = resolveTimeMs(element, getComputedStyle(element).getPropertyValue('--astryx-duration-exit'))
  const exit = ms != null && ms >= 0 ? ms : PRESS_FADE_MS
  return prefersReducedMotion() ? Math.min(exit, PRESS_FADE_REDUCED_MAX_MS) : exit
}

/**
 * 这个元素的按压释放里还在播的动画：有限时长、没播完的 CSS 动画。
 * 动画可以在元素本身、它的 `::before` 或 `::after`，也可以在它里面的某个部位上
 * （最近的可按祖先得是这个元素）。嵌套的可按元素放自己那一次释放，不拖长这一次。
 * 没有 Web Animations 的环境返回空数组。
 */
function releaseAnimationsOf(element: Element): Animation[] {
  if (typeof element.getAnimations !== 'function')
    return []
  return element.getAnimations({ subtree: true }).filter((animation) => {
    // CSS 动画的 effect 是 KeyframeEffect，作用在伪元素上时 target 也是它所属的元素。
    const effect = animation.effect as KeyframeEffect | null
    const target = effect?.target ?? null
    if (
      effect == null
      || target == null
      || !('animationName' in animation)
      || (target !== element && target.closest(`[${PRESSABLE_ATTRIBUTE}]`) !== element)
    ) {
      return false
    }
    if (!Number.isFinite(Number(effect.getComputedTiming().endTime)))
      return false
    return animation.playState !== 'finished'
  })
}

/**
 * 释放结束时调 `end`。主线程忙时释放动画的第一帧会晚到，从抬手起算的钟会把淡出剪在半路。
 * 所以钟到点后，若还有释放动画在播或在等第一帧，就等它们播完或被取消（元素卸载、换了样式）。
 * 没有释放动画（瞬时释放、没有动画的表面、没有 Web Animations 的环境）就在钟到点时结束。
 * 返回取消函数。
 */
export function endAfterRelease(element: Element, clockMs: number, end: () => void): () => void {
  let waiting = true
  const timer = setTimeout(() => {
    const running = releaseAnimationsOf(element)
    if (running.length === 0) {
      end()
      return
    }
    void Promise.allSettled(running.map(async animation => animation.finished)).then(() => {
      if (waiting)
        end()
    })
  }, clockMs)
  return () => {
    waiting = false
    clearTimeout(timer)
  }
}
