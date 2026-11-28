/**
 * 把 ChatVirtualizer 接到一个滚动容器上（自带的或调用方的，包括整页滚动者）：
 * 关掉浏览器的滚动锚定、听滚动和滚轮、观察容器尺寸；整页滚动时再放一个和视口一样大的
 * 隐藏探针，听窗口 resize 和读者的按键、按下，用来分辨旋转屏幕时浏览器自己写的滚动。
 * 另有行尺寸的测量管线：共用 ResizeObserver 的每一条记录攒成一次修正轮。
 */
import type { VirtualizerHost, VirtualizerState } from './chatVirtualizerState.js'
import { observeResize, unstable_scrollEventTarget as scrollEventTarget, unstable_scrollsPage as scrollsPage, unstable_setScrollAnchoringOff as setScrollAnchoringOff } from '@astryx-vue/core'
import { cancelFrame } from './chatVirtualizerState.js'

export interface SizeObserver {
  observe: (el: Element) => void
  unobserve: (el: Element) => void
  dispose: () => void
}

/** 行和容器的尺寸观察。行的高度取边框盒，和首次挂载时读的 offsetHeight 是同一个盒子。 */
export function createSizeObserver<T>(state: VirtualizerState, host: VirtualizerHost<T>, sync: () => void): SizeObserver {
  let queued = false
  const onResize = (entry: ResizeObserverEntry): void => {
    // 注册时那次同步回调没有尺寸，读它只会强制一次布局。
    if (entry.borderBoxSize === undefined && entry.contentRect === undefined)
      return
    if (!queued) {
      queued = true
      queueMicrotask(() => {
        queued = false
        sync()
      })
    }
    const key = (entry.target as HTMLElement).dataset?.pkey
    if (key === undefined) {
      // 容器本身变了尺寸：贴底目标和窗口覆盖范围都跟着变。
      state.geoChanged = true
      return
    }
    const px = entry.borderBoxSize?.[0]?.blockSize ?? (entry.target as HTMLElement).offsetHeight
    if (host.sizes.record(key, px))
      state.geoChanged = true
  }
  const stops = new Map<Element, () => void>()
  return {
    observe(el) {
      if (!stops.has(el))
        stops.set(el, observeResize(el, onResize))
    },
    unobserve(el) {
      stops.get(el)?.()
      stops.delete(el)
    },
    dispose() {
      for (const stop of stops.values())
        stop()
      stops.clear()
    },
  }
}

/** 和视口一样大的隐藏盒子：视口变了、整页滚动者自己的盒子没变时，它的尺寸记录照样会来。 */
function addViewportProbe(doc: Document): HTMLElement {
  const probe = doc.createElement('div')
  probe.setAttribute('aria-hidden', 'true')
  probe.className = 'astryx-chat-virtualizer__viewport-probe'
  doc.body.appendChild(probe)
  return probe
}

export function attachScroller(
  el: HTMLElement,
  state: VirtualizerState,
  onScroll: () => void,
  sizes: SizeObserver,
): () => void {
  // 换了一个容器：旧容器的滚动状态一概不算数。
  if (state.prevScroller !== null && state.prevScroller !== el) {
    state.lastEventScrollTop = null
    state.userAway = 0
    state.progTarget = null
  }
  state.prevScroller = el
  const endViewportMove = (): void => {
    state.viewportChangedAt = Number.NEGATIVE_INFINITY
    state.isRestoreArmed = false
  }
  // 滚轮是意图信号，打断收敛；但它本身不让列表离开跟随，容器有没有真的动由滚动事件来量。
  const onWheel = (): void => {
    state.converging = false
    state.priceFreeze = false
    endViewportMove()
  }
  setScrollAnchoringOff(el, true)
  const scrollTarget = scrollEventTarget(el)
  scrollTarget.addEventListener('scroll', onScroll, { passive: true })
  el.addEventListener('wheel', onWheel, { passive: true })
  const doc = el.ownerDocument
  const probe = scrollsPage(el) ? addViewportProbe(doc) : null
  const view = probe !== null ? doc.defaultView : null
  const onViewportResize = (): void => {
    state.viewportChangedAt = performance.now()
    state.isRestoreArmed = true
  }
  if (probe !== null) {
    sizes.observe(probe)
    // 捕获阶段：按键的处理函数阻止了冒泡，页面照样会滚。
    doc.addEventListener('keydown', endViewportMove, { capture: true, passive: true })
    doc.addEventListener('pointerdown', endViewportMove, { capture: true, passive: true })
    view?.addEventListener('resize', onViewportResize, { passive: true })
  }
  state.isPageViewport = probe !== null
  sizes.observe(el)
  return () => {
    setScrollAnchoringOff(el, false)
    scrollTarget.removeEventListener('scroll', onScroll)
    el.removeEventListener('wheel', onWheel)
    doc.removeEventListener('keydown', endViewportMove, { capture: true })
    doc.removeEventListener('pointerdown', endViewportMove, { capture: true })
    view?.removeEventListener('resize', onViewportResize)
    if (probe !== null) {
      sizes.unobserve(probe)
      probe.remove()
    }
    state.isPageViewport = false
    state.viewportChangedAt = Number.NEGATIVE_INFINITY
    state.passViewportHeight = null
    state.isRestoreArmed = false
    cancelFrame(state, 'restore')
    // 容器换掉或卸载时手势随之结束；spacer 吸收的偏移丢掉不折算，新容器第一轮按参照系重来。
    cancelFrame(state, 'flush')
    state.gestureActive = false
    state.gestureMoved = false
    state.gestureAdj = 0
    sizes.unobserve(el)
  }
}
