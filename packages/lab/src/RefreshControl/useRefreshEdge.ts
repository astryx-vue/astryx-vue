/**
 * @file useRefreshEdge.ts
 * @input 被拉的内容元素、下拉此刻是否开着；core 的共用尺寸观察
 * @output useRefreshEdge：找出让内容滚动的容器（滚动拥有者），在它顶部附近接管越界，
 *   跟着它的滚动和尺寸变化更新
 * @position useRefreshControl 触摸层的一部分，只有 useRefreshTouch.ts 用它
 */

// 下拉只发生在离内容最近、能滚而且内容溢出的容器里，从不发生在页面本身上。这个容器溢出时，
// 顶部附近给它写 `overscroll-behavior-y: none`，让浏览器不在下拉画东西的地方画自己的橡皮筋。
// 内容装得下的容器会把滚动交给祖先，所以不接管它。滚动本身一直是浏览器的。

import { observeResize } from '@astryx-vue/core/internal/touch'
import { watch } from 'vue'
import { REFRESH_HEIGHT } from './refreshPull'

/** `start` 往上、页面以下所有竖向能滚的祖先，近的在前。 */
export function scrollContainersOf(start: HTMLElement): HTMLElement[] {
  const doc = start.ownerDocument
  const containers: HTMLElement[] = []
  for (let node = start.parentElement; node != null && node !== doc.body && node !== doc.documentElement; node = node.parentElement) {
    const { overflowY } = getComputedStyle(node)
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay')
      containers.push(node)
  }
  return containers
}

function overflows(element: HTMLElement): boolean {
  return element.scrollHeight > element.clientHeight
}

/** 让内容滚动的元素：最近的溢出的滚动容器。都不溢出时是 null，页面本身从不归下拉。 */
function findScrollOwner(start: HTMLElement): HTMLElement | null {
  return scrollContainersOf(start).find(overflows) ?? null
}

export function scrollTopOf(owner: HTMLElement | null): number {
  return owner?.scrollTop ?? 0
}

export function heightOf(owner: HTMLElement): number {
  return owner.clientHeight
}

export function scrollOwnerBy(owner: HTMLElement | null, delta: number): void {
  if (owner != null && delta !== 0)
    owner.scrollTop += delta
}

export interface RefreshEdge {
  /** 现在的滚动拥有者。 */
  owner: () => HTMLElement | null
  /** 重新找滚动拥有者，换了就放开旧的顶部并把滚动监听挪过去。 */
  resolveOwner: () => HTMLElement | null
  /** 按现在的滚动位置接管或放开顶部。 */
  applyEdge: () => void
  /** 内容挂上或换了：重新找拥有者、观察尺寸。 */
  contentChanged: () => void
}

export function useRefreshEdge(content: () => HTMLElement | null, isEnabled: () => boolean): RefreshEdge {
  let owner: HTMLElement | null = null
  let edge: { element: HTMLElement | null, saved: string | null } = { element: null, saved: null }

  function releaseEdge(): void {
    if (edge.element != null && edge.saved != null)
      edge.element.style.overscrollBehaviorY = edge.saved
    edge = { element: null, saved: null }
  }

  function applyEdge(): void {
    const current = owner
    const near = isEnabled()
      && current != null
      && overflows(current)
      && scrollTopOf(current) < Math.max(heightOf(current), REFRESH_HEIGHT)
    if (!near || edge.element !== current)
      releaseEdge()
    if (!near || current == null)
      return
    if (current.style.overscrollBehaviorY !== 'none') {
      // 第一次接管，或者拥有者自己的渲染换掉了这个值。
      edge = { element: current, saved: current.style.overscrollBehaviorY }
      current.style.overscrollBehaviorY = 'none'
    }
  }

  // 拥有者自己的滚动挪动它的顶部，所以只在那里听，而且只在手指能拉的时候听。
  let isListening = false
  let listened: HTMLElement | null = null
  function listenToOwner(): void {
    const next = isListening ? owner : null
    if (next !== listened) {
      listened?.removeEventListener('scroll', applyEdge)
      next?.addEventListener('scroll', applyEdge, { passive: true })
      listened = next
    }
  }

  function resolveOwner(): HTMLElement | null {
    const element = content()
    if (element == null)
      return owner
    const next = findScrollOwner(element)
    if (next !== owner) {
      releaseEdge()
      owner = next
      listenToOwner()
    }
    return next
  }

  let setUp: (() => void) | null = null

  // 只在手指能拉时看着拥有者和它的顶部；关着时不留任何监听，触点落下时再重新找拥有者。
  // 顶部在手指落下前就接管好：手势宿主的监听是被动的，落下时才接管可能晚于浏览器自己的越界。
  watch(isEnabled, (enabled, _previous, onCleanup) => {
    if (!enabled) {
      releaseEdge()
      return
    }
    isListening = true
    const update = (): void => {
      if (content() == null) {
        // 脱开的内容没有拥有者可接管或监听。
        releaseEdge()
        owner = null
      }
      else {
        resolveOwner()
        applyEdge()
      }
      listenToOwner()
    }
    // 容器随内容或自己的尺寸变化开始或停止溢出，不发 scroll，所以内容和它的每个滚动容器
    // 变尺寸时都重新读拥有者。
    let unobserve: Array<() => void> = []
    const observe = (): void => {
      for (const stop of unobserve)
        stop()
      const element = content()
      unobserve = element == null
        ? []
        : [element, ...scrollContainersOf(element)].map(node => observeResize(node, update))
    }
    setUp = () => {
      update()
      observe()
    }
    setUp()
    // 滚动容器可能在自己挂好、量过之后才能滚（ScrollableArea 量好视口前会裁掉它），
    // 所以两帧后再读一次拥有者。
    const raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null
    let frame = raf?.(() => {
      frame = raf(() => setUp?.())
    }) ?? 0
    onCleanup(() => {
      setUp = null
      if (raf != null)
        cancelAnimationFrame(frame)
      for (const stop of unobserve)
        stop()
      isListening = false
      listenToOwner()
      releaseEdge()
    })
  }, { immediate: true })

  return {
    owner: () => owner,
    resolveOwner,
    applyEdge,
    contentChanged: () => setUp?.(),
  }
}
