/**
 * @file hitAreaGate.ts
 * @input 页面的滚动事件，以及页面上正在播放的动画
 * @output 热区测量的两道闸：页面在滚动时不测量；祖先在播会挪动盒子的有限动画时先不测，等它播完
 * @position 内部工具，`hitAreaWatch.ts` 用。
 *
 * 测量要读每个可点元素的矩形。在手指的滚动里、或者一层界面滑进来的动画里读，
 * 每一帧都会强制布局，读到的又是马上过期的位置。所以滚动时一律不读，
 * 到 `scrollend` 或者 150ms 没有滚动事件才放行；祖先在播挪盒子的动画时，等它播完再量。
 */

/** 滚动停下多久没有新的滚动事件就算停稳，ms；不支持 `scrollend` 的浏览器靠它。 */
export const SCROLL_QUIET_MS = 150

const PASSIVE_CAPTURE = { capture: true, passive: true } as const

let scrolling = false
let quietTimer: ReturnType<typeof setTimeout> | null = null
let scrollRoot: Document | null = null
const idleCallbacks = new Set<() => void>()

/** 页面此刻在滚动。 */
export function isPageScrolling(): boolean {
  return scrolling
}

function settle(): void {
  if (quietTimer != null)
    clearTimeout(quietTimer)
  quietTimer = null
  if (!scrolling)
    return
  scrolling = false
  idleCallbacks.forEach(callback => callback())
}

function onScroll(): void {
  scrolling = true
  if (quietTimer != null)
    clearTimeout(quietTimer)
  quietTimer = setTimeout(settle, SCROLL_QUIET_MS)
}

/**
 * 页面（含里面任何可滚动的元素）停止滚动时调用 `onIdle`。页面上所有控件共用一个监听，
 * 第一个来的挂上，最后一个走的拿掉。返回停止的函数。
 */
export function whenScrollIdle(doc: Document, onIdle: () => void): () => void {
  idleCallbacks.add(onIdle)
  if (scrollRoot == null) {
    scrollRoot = doc
    doc.addEventListener('scroll', onScroll, PASSIVE_CAPTURE)
    doc.addEventListener('scrollend', settle, PASSIVE_CAPTURE)
  }
  return () => {
    idleCallbacks.delete(onIdle)
    if (idleCallbacks.size > 0 || scrollRoot == null)
      return
    scrollRoot.removeEventListener('scroll', onScroll, PASSIVE_CAPTURE)
    scrollRoot.removeEventListener('scrollend', settle, PASSIVE_CAPTURE)
    scrollRoot = null
    scrolling = false
    if (quietTimer != null)
      clearTimeout(quietTimer)
    quietTimer = null
  }
}

/** 动画改了这些属性，盒子就挪了位置或尺寸；淡入淡出、变色不挪。 */
const BOX_PROPERTY = /^(?:transform|translate|scale|rotate|offset|position|display|float|flex|grid|gap|inset|top|right|bottom|left|margin|padding|width|height|min|max|border|font-size|line-height|aspect-ratio|order|zoom)/

function kebab(property: string): string {
  return property.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
}

/** 一个元素上正在播、会挪盒子、而且会结束的动画。 */
export interface MovingScope {
  readonly target: Element
  readonly animation: Animation
}

function movesBoxes(animation: Animation): boolean {
  if (animation.playState !== 'running')
    return false
  const effect = animation.effect
  if (effect == null || !('getKeyframes' in effect))
    return false
  const end = effect.getComputedTiming().endTime
  if (typeof end !== 'number' || !Number.isFinite(end))
    return false
  return (effect as KeyframeEffect).getKeyframes().some(frame =>
    Object.keys(frame).some(property => !['offset', 'easing', 'composite', 'computedOffset'].includes(property) && BOX_PROPERTY.test(kebab(property))),
  )
}

/** 页面上此刻正在挪盒子的有限动画，整页只问一次。 */
export function movingScopes(doc: Document): MovingScope[] {
  if (typeof doc.getAnimations !== 'function')
    return []
  const scopes: MovingScope[] = []
  for (const animation of doc.getAnimations()) {
    const target = (animation.effect as KeyframeEffect | null)?.target
    if (target instanceof Element && movesBoxes(animation))
      scopes.push({ target, animation })
  }
  return scopes
}

/** 这个元素的某个祖先正在播挪盒子的动画（元素自己的不算）。 */
export function motionAbove(scopes: readonly MovingScope[], element: Element): MovingScope[] {
  return scopes.filter(({ target }) => target !== element && target.contains(element))
}

/** 等这些动画都结束（播完或取消）再调用 `then`。 */
export function afterMotion(scopes: readonly MovingScope[], then: () => void): void {
  void Promise.allSettled(scopes.map(({ animation }) => animation.finished)).then(then)
}
