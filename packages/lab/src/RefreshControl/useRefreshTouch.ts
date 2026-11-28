/**
 * @file useRefreshTouch.ts
 * @input 下拉刷新的状态和派发（refreshModel.ts）、下拉的映射（refreshPull.ts）、滚动拥有者
 *   （useRefreshEdge.ts）和 core 的手势、动效引擎
 * @output useRefreshTouch：下拉刷新的触摸层（下拉、刷新时的内边距、指示器的位置和所有动效）
 *   和两个模板 ref 函数
 * @position useRefreshControl 内部用，只有 useRefreshControl.ts 引入它
 */

// 在顶部下拉时，内容按 UIKit 对这段行程显示的越界距离平移：每次移动写一次，Vue 不重新渲染。
// 手指还按着时就触发、开始刷新。松手按滚动视图的回弹落到刷新时的内边距上，或者回到顶部。
// 结束时内容往上滑掉内边距；内容在视野外时，内边距和对应的滚动偏移在同一个任务里一起去掉。
// 代码发起的开始直接加上内边距，没有可见的移动。
//
// 指示器是 app 的。触摸层把它钉在滚动视图顶部，写下拉露出它多少，回落把内容带回去时让它淡掉。
// 回落把表里的弹簧交给动效引擎；结束在开始时读主题的时长变量、按 UIKit 的曲线播，所以主题的
// 节奏会缩放它。跟手在主线程上（浏览器没有下拉刷新可以借），松手、回落和结束都在合成线程上。

import type { PointerKind } from '@astryx-vue/core/internal/touch'
import type { Ref } from 'vue'
import type { RefreshEvent, RefreshState } from './refreshModel'
import type { PullMode } from './refreshPull'
import { mapProgress, scroll, useGestureRecognizer } from '@astryx-vue/core/internal/touch'
import { nextTick, onScopeDispose, shallowRef, watch } from 'vue'
import { useMotionEngine } from '../internal/useMotionEngine'
import { bezierCurve } from './refreshCurve'
import { REFRESH_REVEAL_VAR } from './refreshIndicator'
import {
  endMotion,
  endTiming,
  modeAfterTrigger,
  pullOverscroll,
  pullSlope,
  pullTravel,
  REFRESH_HEIGHT,
  releaseTarget,
  revealProgress,
  triggerDistance,
} from './refreshPull'
import { RefreshPullRecognizer, RefreshScrollPullRecognizer } from './RefreshPullRecognizer'
import { heightOf, scrollOwnerBy, scrollTopOf, useRefreshEdge } from './useRefreshEdge'

export interface RefreshTouchOptions {
  /** 下拉是否开着。 */
  readonly isPullEnabled: () => boolean
  /** 状态机的状态，和接线层共用。 */
  readonly model: { readonly current: RefreshState }
  /** 下拉的事件交给状态机。 */
  readonly dispatch: (event: RefreshEvent) => void
}

export interface RefreshTouch {
  readonly contentRef: (element: unknown) => void
  readonly indicatorRef: (element: unknown) => void
  /** 下拉触发了：指示器完整显示，松手落到内边距上。 */
  trigger: () => void
  /** 没有下拉就开始了刷新：内边距出现，没有可见的移动。 */
  begin: () => void
  /** 松手落到内边距上，或者回到顶部。 */
  settle: (to: 'inset' | 'top') => void
  /** 刷新结束了。 */
  end: () => void
}

interface PullGeometry {
  travel0: number
  scrollTop0: number
  dimension: number
  floor: number
  trigger: number
  mode: PullMode
}

function elementOf(value: unknown): HTMLElement | null {
  if (value == null || typeof value !== 'object')
    return null
  const node = '$el' in value ? (value as { $el: unknown }).$el : value
  return node != null && typeof node === 'object' && (node as Node).nodeType === 1 ? node as HTMLElement : null
}

export function useRefreshTouch({ isPullEnabled, model, dispatch }: RefreshTouchOptions): RefreshTouch {
  const content = useMotionEngine()
  const indicator = useMotionEngine()
  const contentElement: Ref<HTMLElement | null> = shallowRef(null)
  let indicatorElement: HTMLElement | null = null
  const edge = useRefreshEdge(() => contentElement.value, isPullEnabled)
  // 内容是否带着刷新时的内边距。
  let hasInset = false
  // 等着在结束渲染之后的帧里播的结束，和那一帧。
  let pendingEnd: (() => void) | null = null
  let endFrame: number | null = null
  function cancelPendingEnd(): void {
    pendingEnd = null
    if (endFrame != null) {
      cancelAnimationFrame(endFrame)
      endFrame = null
    }
  }

  let pull: PullGeometry = { travel0: 0, scrollTop0: 0, dimension: 1, floor: 0, trigger: triggerDistance(1), mode: 'reveal' }
  // 最后一次移动时越界距离跟手的快慢。
  let fingerSlope = 0
  // 手指抬起时内容的速度，px/s，交给它开始的回落。
  let releaseVelocity = 0
  // 最近一次下拉的指针。减少动态效果下手指的松手交叉淡化（和粗指针下任何松手一样），触控板的直接落位。
  let pullPointer: PointerKind = 'touch'

  // -- 指示器 ------------------------------------------------------------------

  const setReveal = (value: number): void => {
    indicatorElement?.style.setProperty(REFRESH_REVEAL_VAR, String(value))
  }

  /** 把内容放在 `y`，指示器钉在滚动视图顶部：它骑在内容的上沿，所以挪动「内边距减 y」。 */
  function place(y: number): void {
    content.animator.set({ y })
    indicator.animator.set({ y: REFRESH_HEIGHT - y })
  }
  function stopPlacing(): void {
    content.animator.stop(['y'])
    indicator.animator.stop(['y'])
  }

  /** 指示器回到不透明，只在变了时写：引擎每写一次都会把它的层提升一阵子。 */
  function restoreIndicator(): void {
    if (indicator.animator.get('opacity') !== 1)
      indicator.animator.set({ opacity: 1 })
  }
  function resetIndicator(): void {
    setReveal(0)
    restoreIndicator()
  }
  /** 停下指示器的淡出、留住它此刻显示的样子：接住回落的手指从屏幕上的样子接着拉或接着落。 */
  function keepShownIndicator(): void {
    const opacity = indicator.animator.get('opacity')
    if (opacity === 1)
      return
    const shown = Number(indicatorElement?.style.getPropertyValue(REFRESH_REVEAL_VAR) || 0)
    setReveal(shown * opacity)
    restoreIndicator()
  }
  /** 指示器完整显示：触发了，或者没有下拉就开始了刷新。 */
  function showIndicator(): void {
    setReveal(1)
    restoreIndicator()
  }

  // -- 状态机效果的动效 ----------------------------------------------------------

  function startSettle(to: 'inset' | 'top'): void {
    const target = releaseTarget(to === 'inset')
    const from = content.animator.get('y')
    // 回落从手指抬起时内容的速度开始；被接住后接着落的从静止开始。
    const velocity = releaseVelocity
    releaseVelocity = 0
    // 不给开始时刻：引擎在合成线程开始时开始，第一帧就是曲线的起点。手指的松手按触摸松手开始，
    // 所以减少动态效果下引擎把它交叉淡化。
    const touchRelease = pullPointer === 'touch'
    const contentSettle = content.animator.animate({ y: target }, { spring: scroll.bounce, velocity: { y: velocity } }, { touchRelease })
    indicator.animator.animate({ y: REFRESH_HEIGHT - target }, { spring: scroll.bounce, velocity: { y: -velocity } }, { touchRelease })
    if (to !== 'top' || model.current.isRefreshing || from <= 0)
      return
    // 内容盖住指示器时它沿着内容自己的回落曲线淡掉；在同一个任务里开始，两者从同一帧起。
    // 减少动态效果下回落没有曲线，回落结束后指示器复位。
    const curve = contentSettle.curve('y')
    const { dimension } = pull
    const start = revealProgress(from, dimension) || 1
    const finished = curve == null
      ? contentSettle.finished
      : indicator.animator.play({ opacity: mapProgress(curve, y => revealProgress(y, dimension) / start) }, { touchRelease }).finished
    void finished.then((done) => {
      if (done && !model.current.isRefreshing)
        resetIndicator()
    })
  }

  function settle(to: 'inset' | 'top'): void {
    if (to === 'inset')
      hasInset = true
    // 在抬起的这个任务里开始：长任务之后的那一帧带着它本该到的时刻，在那里开始的动画会从过去开始。
    startSettle(to)
  }

  function end(): void {
    const hadInset = hasInset
    hasInset = false
    if (model.current.isPulling) {
      // 手指还按着：松手回到顶部，指示器跟着收回。
      pull.floor = 0
      return
    }
    if (!hadInset) {
      // 从没显示过的刷新（没有手指开始的）：没什么要动。
      resetIndicator()
      return
    }
    // 从静止开始：还在落向内边距的回落停在显示的位置。
    stopPlacing()
    const current = edge.resolveOwner()
    const { animateTo, scrollBy } = endMotion(scrollTopOf(current))
    if (animateTo == null) {
      place(0)
      scrollOwnerBy(current, scrollBy)
      resetIndicator()
      return
    }
    // 滑动在结束渲染（app 的更新和忙碌状态）之后两帧开始：长任务前刚建的动画，WebKit 会从那个
    // 任务前一帧开始；长任务后第一帧带着它本该到的时刻。两种情况下滑动的开头都看不到。
    pendingEnd = () => {
      // 内容滑上来盖住空隙时指示器保持不透明（UIKit 几乎整个结束都让它是 1）。
      const from = content.animator.get('y')
      const element = contentElement.value
      const finish = (): void => {
        place(0)
        scrollOwnerBy(current, scrollBy)
        if (!model.current.isRefreshing)
          resetIndicator()
      }
      // 结束开始时、在这里生效的主题时长变量。没有它，或者是读不了的写法，结束没有滑动。
      const timing = element == null ? null : endTiming(getComputedStyle(element))
      if (timing == null || timing.ms <= 0) {
        finish()
        return
      }
      const { ms, points } = timing
      indicator.animator.play({ y: bezierCurve(REFRESH_HEIGHT - from, REFRESH_HEIGHT - animateTo, ms, points) })
      void content.animator.play({ y: bezierCurve(from, animateTo, ms, points) }).finished.then((done) => {
        if (done)
          finish()
      })
    }
    // 结束的渲染在这个任务的微任务里，之后再等两帧。
    void nextTick(() => {
      if (pendingEnd == null || endFrame != null)
        return
      endFrame = requestAnimationFrame(() => {
        endFrame = requestAnimationFrame(() => {
          endFrame = null
          const play = pendingEnd
          pendingEnd = null
          play?.()
        })
      })
    })
  }

  // -- 下拉 --------------------------------------------------------------------

  // 下拉开始处拖动的竖向位移：内容到顶、手指往下之前是 null。
  let anchor: number | null = null
  let lastTranslation = 0
  // 手指接住的回落（落下时停在原处），没有下拉跟上就接着落。
  function resumeSettle(): void {
    if (model.current.isPulling)
      return
    const target = releaseTarget(model.current.isRefreshing)
    if (Math.abs(content.animator.get('y') - target) > 0.05)
      settle(model.current.isRefreshing ? 'inset' : 'top')
  }

  /** 拖动还没变成下拉：内容到顶、手指往下时从这里开始，返回是否开始了。 */
  function startPull(pan: RefreshPullRecognizer, translation: number): boolean {
    // 浏览器可能正在滚内容（拖动从滚动开始）。内容到顶、手指往下时，同一次触摸里开始下拉；
    // 手指一直是浏览器的，拖动只是在看，所以什么都不换手。
    const current = pan.state === 'began' ? edge.resolveOwner() : edge.owner()
    // `began` 时整段移动都算，门槛的那段也算（慢慢拖时 began 的位移是 0）。
    const isMovingDown = pan.state === 'began' ? translation + pan.travelAtBegan.y > 0 : translation > lastTranslation
    lastTranslation = translation
    if (!isMovingDown || current == null || scrollTopOf(current) > 0)
      return false
    // 从静止开始时行程是拖动的（不含它的门槛，和 UIKit 一样）；滚过来的从内容用完的地方开始。
    anchor = pan.state === 'began' ? 0 : translation
    pullPointer = pan.pointerType
    const shown = content.animator.get('y')
    stopPlacing()
    const dimension = heightOf(current)
    const mode: PullMode = model.current.isRefreshing ? 'band' : 'reveal'
    pull = {
      dimension,
      mode,
      trigger: triggerDistance(dimension),
      floor: model.current.isRefreshing ? REFRESH_HEIGHT : 0,
      travel0: pullTravel(shown, dimension, mode),
      scrollTop0: scrollTopOf(current),
    }
    dispatch({ type: 'pullStart' })
    return true
  }

  function track(translation: number): void {
    lastTranslation = translation
    const geometry = pull
    // 手指往回时自己把内容滚回去的浏览器（Chromium）从下拉手里接过去。
    const scrolledBack = scrollTopOf(edge.owner()) - geometry.scrollTop0 > 0.5
    const travel = scrolledBack ? 0 : geometry.travel0 + (translation - anchor!)
    const pulled = pullOverscroll(travel, geometry.dimension, geometry.mode)
    const overscroll = Math.max(geometry.floor, pulled)
    // 内容按下拉的斜率跟着手指，除非刷新时的内边距托着它。
    fingerSlope = pulled > geometry.floor ? pullSlope(travel, geometry.dimension, geometry.mode) : 0
    const hadTriggered = model.current.hasTriggered
    dispatch({ type: 'pullMove', overscroll, trigger: geometry.trigger })
    // 触发后的下一帧回到手指下（在一比一的那段里）。
    if (!hadTriggered && model.current.hasTriggered)
      geometry.mode = geometry.mode === 'band' ? 'band' : modeAfterTrigger(travel)
    place(overscroll)
    if (!model.current.isRefreshing)
      setReveal(revealProgress(overscroll, geometry.dimension))
  }

  function onPull(pan: RefreshPullRecognizer): void {
    if (pan.state === 'began' || pan.state === 'changed') {
      const translation = pan.translation().y
      if (anchor == null && !startPull(pan, translation))
        return
      track(translation)
      return
    }
    if (pan.state !== 'ended' && pan.state !== 'cancelled')
      return
    const wasPulling = anchor != null
    anchor = null
    if (!wasPulling) {
      // 一直没到顶的滚动：手指接住的回落接着落。
      resumeSettle()
      return
    }
    // 抬起把内容的速度交给回落：滚动视图的松手速度乘下拉的斜率。取消的下拉手指没抬，从静止开始。
    releaseVelocity = pan.state === 'ended' ? pan.scrollVelocity().y * fingerSlope : 0
    dispatch({ type: pan.state === 'ended' ? 'pullEnd' : 'pullCancel' })
    releaseVelocity = 0
  }

  // 手指的下拉不接滚动：它从拖动一开始就看着触点，会在页面中间接走滚动。
  const recognizer = useGestureRecognizer(contentElement, () => new RefreshPullRecognizer(), onPull)
  // 触控板的双指滚动走第二个拖动，它只接这种滚动、从不接鼠标滚轮的一格格。只在指针下什么都滚不了
  // 的地方开始：拥有者到顶、内容往下。它占下接的滚动，所以它阻塞的 `wheel` 监听是占有者的。
  const scrollRecognizer = useGestureRecognizer(contentElement, () => new RefreshScrollPullRecognizer(), onPull)
  // 下拉中途关掉时识别器报 `cancelled`，上面的监听把内容落回去、结束这次下拉。
  watch(isPullEnabled, (enabled) => {
    recognizer.setEnabled(enabled)
    scrollRecognizer.setEnabled(enabled)
  }, { immediate: true })

  // 手指落在进行中的回落上就停下它（UIScrollView 会刹住），触控板滚动开始也一样；没有下拉跟上就接着落。
  const pans = [recognizer, scrollRecognizer]
  const stopListening = pans.map((pan) => {
    pan.onTouchDown = () => {
      edge.resolveOwner()
      edge.applyEdge()
      cancelPendingEnd()
      stopPlacing()
      keepShownIndicator()
    }
    return pan.addTransitionListener((current) => {
      if (current.state === 'failed')
        resumeSettle()
    })
  })
  onScopeDispose(() => {
    for (const pan of pans)
      pan.onTouchDown = null
    for (const stop of stopListening)
      stop()
    if (endFrame != null)
      cancelAnimationFrame(endFrame)
  })

  return {
    contentRef: (value) => {
      const element = elementOf(value)
      if (element === contentElement.value)
        return
      contentElement.value = element
      content.ref(element)
      edge.contentChanged()
    },
    indicatorRef: (value) => {
      const element = elementOf(value)
      indicatorElement = element
      indicator.ref(element)
    },
    trigger: () => {
      // 只有下拉会触发：它落到内边距上。
      hasInset = true
      showIndicator()
    },
    begin: () => {
      showIndicator()
      if (model.current.isPulling)
        return
      // 内边距出现，没有可见的移动，和 beginRefreshing() 一样。
      cancelPendingEnd()
      const current = edge.resolveOwner()
      place(REFRESH_HEIGHT)
      scrollOwnerBy(current, REFRESH_HEIGHT)
      hasInset = true
    },
    settle,
    end,
  }
}
