/**
 * @file useScrollEdgeEffect.ts
 * @input IntersectionObserver；lab 的动效引擎；core 的手势宿主、手指滚动判断、
 *   共享尺寸监听和粗指针判断
 * @output useScrollEdgeEffect：栏下滚动边缘遮罩和触发它的哨兵元素的模板 ref，
 *   按调用方给的弹簧淡入淡出
 * @position lab 内部，NavigationStack 在手指下的 iOS 26 栏外观。不从 lab 入口导出。
 *   用鼠标时什么都不监听。遮罩和哨兵的样式在 styles/navigation-stack.css
 *   （`.astryx-scroll-edge`、`.astryx-scroll-edge-sentinel`）。
 */

import type { SpringDescription } from '@astryx-vue/core/internal/touch'
import type { MaybeRefOrGetter, Ref } from 'vue'
import { useCoarsePointer } from '@astryx-vue/core'
import { getGestureHost, observeResize, useFingerScroll } from '@astryx-vue/core/internal/touch'
import { computed, toValue, watch } from 'vue'
import { useMotionEngine } from './useMotionEngine'

/**
 * 遮罩层 `will-change` 读的私有自定义属性：手指在滚动容器上操作时是 `opacity`，
 * 其余时候不设。只由这里以内联样式写入，不是主题数据。
 */
export const SCROLL_EDGE_LAYER_PROMOTION = '--_scroll-edge-will-change'

export interface UseScrollEdgeEffectOptions {
  /** 是否运行。关掉时（以及用鼠标时）遮罩保持透明，什么都不监听。 */
  readonly enabled: MaybeRefOrGetter<boolean>
  /** 内容从栏下经过的滚动容器。 */
  readonly root: Ref<HTMLElement | null>
  /** 栏从容器内边距边缘往下盖住多少 px。44px 的栏写 44。 */
  readonly rootInset: number
  /** 淡入淡出用的弹簧。 */
  readonly springs: {
    readonly appear: SpringDescription
    readonly disappear: SpringDescription
  }
}

export interface UseScrollEdgeEffect {
  /** 绑到遮罩元素的 `:ref` 上。 */
  readonly layerRef: (element: unknown) => void
  /** 绑到哨兵元素的 `:ref` 上。哨兵放在滚动内容顶部，随内容一起滚。 */
  readonly sentinelRef: (element: unknown) => void
}

/**
 * 手指下 iOS 26 栏的滚动边缘效果：内容在栏下移动超过 10px 后一层遮罩淡入，
 * 回来时淡出。它是一个带定时淡变的开关，不是跟着滚动走的渐变。
 */
export function useScrollEdgeEffect(options: UseScrollEdgeEffectOptions): UseScrollEdgeEffect {
  const isTouch = useCoarsePointer()
  const isOn = computed(() => toValue(options.enabled) && isTouch.value)
  const { ref: layerRef, animator } = useMotionEngine({ initial: { opacity: 0 } })
  // 运行中的效果的合成层检查。手指滚动结束时由 useFingerScroll 调用。
  let updatePromotion: (() => void) | null = null
  const isFingerScroll = useFingerScroll(
    () => (isOn.value ? options.root.value : null),
    { onEnd: () => updatePromotion?.() },
  )
  let sentinel: HTMLElement | null = null
  let observer: IntersectionObserver | null = null
  const sentinelRef = (element: unknown): void => {
    const next = element instanceof HTMLElement ? element : null
    if (next === sentinel)
      return
    if (observer != null && sentinel != null)
      observer.unobserve(sentinel)
    sentinel = next
    if (observer != null && next != null)
      observer.observe(next)
  }

  watch(
    () => [isOn.value, options.root.value] as const,
    ([on, container], _previous, onCleanup) => {
      if (!on || container == null || typeof IntersectionObserver === 'undefined')
        return
      const doc = container.ownerDocument
      let isShown: boolean | null = null
      // 各引擎对滚动容器根矩形的理解不同：Chromium 取内边距盒，WebKit 取内容盒。
      // 第一次报告量出差值。
      let rootOffset: number | null = null
      let stopWaiting: (() => void) | null = null
      const report = (entries: IntersectionObserverEntry[]): void => {
        const entry = entries.at(-1)
        if (entry == null)
          return
        if (rootOffset == null) {
          // 没有布局的容器（藏起来的面板里的栈）量不出东西：等它有了尺寸再重新观察，
          // 新的观察者会立刻报告一次。
          if (container.clientHeight <= 0) {
            stopWaiting ??= observeResize(container, () => {
              if (container.clientHeight <= 0)
                return
              stopWaiting?.()
              stopWaiting = null
              observer?.disconnect()
              observe()
            })
            return
          }
          const paddingEdge = container.getBoundingClientRect().top + container.clientTop
          const bounds = entry.rootBounds
          const offset = bounds == null ? 0 : Math.round(bounds.top - options.rootInset - paddingEdge)
          rootOffset = offset
          if (offset !== 0) {
            // WebKit 按内容盒量的这次：改从内边距边缘重新观察。
            observer?.disconnect()
            observe()
            return
          }
        }
        // 哨兵底边越过根的顶边时，内容已在栏下移动超过 10px。刚好贴着也算相交：
        // 10px 不亮，10.25px 亮，和实测一致。
        const next = !entry.isIntersecting
        if (next === isShown)
          return
        // 页面忙时报告可能在手指滚动结束后才到：按观察者记下越线那一刻判断。
        if (isShown != null && isFingerScroll(entry.time)) {
          // 「减弱动态效果」下，动效引擎在粗指针上自己换成淡入淡出。
          animator.animate(
            { opacity: next ? 1 : 0 },
            { spring: next ? options.springs.appear : options.springs.disappear },
          )
        }
        else {
          // 第一次报告，或程序滚动：立刻到位，不建合成层。
          animator.set({ opacity: next ? 1 : 0 }, { promote: false })
        }
        isShown = next
      }
      function observe(): void {
        observer = new IntersectionObserver(report, {
          root: container,
          rootMargin: `${(rootOffset ?? 0) - options.rootInset}px 0px 0px 0px`,
          threshold: 0,
        })
        if (sentinel != null)
          observer.observe(sentinel)
      }
      observe()
      // 从手指落下到它的滚动（含惯性）结束，遮罩层一直在合成层上，中途开始的淡入
      // 才有层可用。iOS 不再在程序滚过合成层时把粘性栏涂白之后可以去掉。
      const host = getGestureHost(doc)
      const releaseHost = host.retain()
      let isPromoted = false
      updatePromotion = () => {
        const layer = animator.element
        const next = host.isFingerDownIn(container) || isFingerScroll()
        if (layer == null || next === isPromoted)
          return
        isPromoted = next
        if (next)
          layer.style.setProperty(SCROLL_EDGE_LAYER_PROMOTION, 'opacity')
        else
          layer.style.removeProperty(SCROLL_EDGE_LAYER_PROMOTION)
      }
      const unsubscribeFingers = host.onFingersChange(updatePromotion)
      onCleanup(() => {
        observer?.disconnect()
        observer = null
        unsubscribeFingers()
        updatePromotion = null
        stopWaiting?.()
        releaseHost()
        animator.element?.style.removeProperty(SCROLL_EDGE_LAYER_PROMOTION)
        animator.set({ opacity: 0 }, { promote: false })
      })
    },
    { immediate: true, flush: 'post' },
  )

  return { layerRef, sentinelRef }
}
