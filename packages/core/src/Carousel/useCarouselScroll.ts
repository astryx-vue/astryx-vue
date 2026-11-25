import type { Ref } from 'vue'
import type { HeldRow } from '../composables/internal/snapPagingValue.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { moveHeldSnapPaging, moveSnapPaging, nearestStop, snapStops } from '../composables/internal/snapPagingValue.js'
import { pagingStep } from './useCarouselPaging.js'

export interface CarouselOverflow {
  hasOverflow: boolean
  overflowStart: boolean
  overflowEnd: boolean
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function isRtlElement(element: HTMLElement): boolean {
  return getComputedStyle(element).direction === 'rtl'
}

/**
 * Track which logical edges of a horizontal scroller are hiding content.
 * RTL uses the negative `scrollLeft` that Chromium and current Firefox share.
 */
export function readOverflow(element: HTMLElement): CarouselOverflow {
  const max = element.scrollWidth - element.clientWidth
  const hasOverflow = max > 1
  if (!hasOverflow)
    return { hasOverflow: false, overflowStart: false, overflowEnd: false }

  if (isRtlElement(element)) {
    const left = element.scrollLeft
    return {
      hasOverflow: true,
      overflowStart: left < -1,
      overflowEnd: left > -max + 1,
    }
  }

  return {
    hasOverflow: true,
    overflowStart: element.scrollLeft > 1,
    overflowEnd: element.scrollLeft < max - 1,
  }
}

/**
 * 除了滚动，还有这些会改变一行是否溢出：滚动区自己的尺寸、每张卡片的尺寸、
 * 卡片的增删、滚动区的 class 或 style（换了间距或内边距）。返回停止观察的函数。
 */
function observeContent(element: HTMLElement, onChange: () => void): () => void {
  const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onChange)
  const observed = new Set<Element>()
  function followChildren(): void {
    const children = new Set(element.children)
    for (const child of observed) {
      if (!children.has(child)) {
        resize?.unobserve(child)
        observed.delete(child)
      }
    }
    for (const child of children) {
      if (!observed.has(child)) {
        resize?.observe(child)
        observed.add(child)
      }
    }
  }
  resize?.observe(element)
  followChildren()
  const mutations = typeof MutationObserver === 'undefined'
    ? null
    : new MutationObserver(() => {
        followChildren()
        onChange()
      })
  mutations?.observe(element, { childList: true, attributes: true, attributeFilter: ['class', 'style'] })
  return () => {
    mutations?.disconnect()
    resize?.disconnect()
    observed.clear()
  }
}

/** 分页按住的一行显示在哪，就按哪里算两端是否还藏着内容。 */
function heldOverflow(held: HeldRow): CarouselOverflow {
  const hasOverflow = held.travel > 1
  return {
    hasOverflow,
    overflowStart: hasOverflow && held.offset > 1,
    overflowEnd: hasOverflow && held.offset < held.travel - 1,
  }
}

function sameOverflow(a: CarouselOverflow, b: CarouselOverflow): boolean {
  return a.hasOverflow === b.hasOverflow && a.overflowStart === b.overflowStart && a.overflowEnd === b.overflowEnd
}

export function useCarouselScroller(scroller: Ref<HTMLElement | null>): {
  followShown: (held: HeldRow | null) => void
  measure: () => void
  onKeyDown: (event: KeyboardEvent, hasLoop: boolean) => void
  overflow: Ref<CarouselOverflow>
  scrollByDirection: (direction: -1 | 1, hasLoop: boolean) => void
  scrollToIndex: (index: number) => void
} {
  const overflow = ref<CarouselOverflow>({ hasOverflow: false, overflowStart: false, overflowEnd: false })
  let frame = 0
  let stopObservingContent: (() => void) | null = null

  function measure(): void {
    const element = scroller.value
    overflow.value = element == null
      ? { hasOverflow: false, overflowStart: false, overflowEnd: false }
      : readOverflow(element)
  }

  /**
   * 吸附分页按住这一行时，滚动偏移要等交还才落定，两端状态改按它显示的位置算，
   * 并且就在这次回调里改，按钮和渐隐与这一行同一帧变化；两端都没变就什么也不写。
   * 收到 null 说明已经交还，重新读滚动偏移。
   */
  function followShown(held: HeldRow | null): void {
    if (held == null) {
      measure()
      return
    }
    const next = heldOverflow(held)
    if (!sameOverflow(next, overflow.value))
      overflow.value = next
  }

  function schedule(): void {
    if (typeof requestAnimationFrame !== 'function') {
      measure()
      return
    }
    if (frame !== 0)
      return
    frame = requestAnimationFrame(() => {
      frame = 0
      measure()
    })
  }

  function scrollByDirection(direction: -1 | 1, hasLoop: boolean): void {
    const element = scroller.value
    if (element == null)
      return
    // 吸附分页下，不管这一行是否被按住，都由分页来挪：手指可以像接住轻扫一样接住它，松手停在某一页上。
    if (moveSnapPaging(element, (at, end) => pagingStep(element, at, end, direction, hasLoop && end > 1)))
      return
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const rtlSign = isRtlElement(element) ? -1 : 1
    const state = readOverflow(element)
    if (hasLoop && state.hasOverflow) {
      const atEnd = direction === 1 && !state.overflowEnd
      const atStart = direction === -1 && !state.overflowStart
      if (atEnd || atStart) {
        element.scrollBy({ left: rtlSign * -direction * element.scrollWidth, behavior })
        return
      }
    }
    const first = element.firstElementChild as HTMLElement | null
    const itemWidth = first?.offsetWidth ?? 0
    const amount = Math.max(element.clientWidth - itemWidth * 0.5, itemWidth)
    element.scrollBy({ left: rtlSign * direction * amount, behavior })
  }

  function scrollToIndex(index: number): void {
    const element = scroller.value
    const items = element?.children
    if (element == null || items == null || items.length === 0)
      return
    const clamped = Math.max(0, Math.min(index, items.length - 1))
    const target = items[clamped] as HTMLElement
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    const containerRect = element.getBoundingClientRect()
    const itemRect = target.getBoundingClientRect()
    const rtl = isRtlElement(element)
    const delta = rtl
      ? itemRect.right - containerRect.right
      : itemRect.left - containerRect.left
    // 吸附分页下去这一项的停点（在 scroll-padding 之内），交还时原生吸附不会再把它拉回去。
    if (moveSnapPaging(element, (at, end) => nearestStop(snapStops(element, at, end), at + (rtl ? -delta : delta))))
      return
    element.scrollBy({ left: delta, behavior })
  }

  // 鼠标滚轮只给 deltaY，按住 Shift 滚轮是横向滚动的惯例；触控板自带 deltaX，交给浏览器。
  // 这里用原生的非被动监听，才能拦下浏览器自己的那一下，让一格滚轮只滚一次。
  // 只在内容溢出时挂监听，所以放得下的一行不会让页面滚动等脚本；监听里也不读样式和布局。
  function onWheel(event: WheelEvent): void {
    if (event.defaultPrevented || !event.shiftKey || event.deltaY === 0 || event.deltaX !== 0)
      return
    const element = scroller.value
    if (element == null)
      return
    event.preventDefault()
    // 分页按住这一行时，这一格滚轮交给分页，停到离这一步最近的停点。
    const toEnd = (): number => isRtlElement(element) ? -event.deltaY : event.deltaY
    if (moveHeldSnapPaging(element, (at, end) => nearestStop(snapStops(element, at, end), at + toEnd())))
      return
    element.scrollBy({ left: event.deltaY, behavior: 'auto' })
  }

  let wheelTarget: HTMLElement | null = null

  function syncWheelListener(): void {
    const next = overflow.value.hasOverflow ? scroller.value : null
    if (next === wheelTarget)
      return
    wheelTarget?.removeEventListener('wheel', onWheel)
    next?.addEventListener('wheel', onWheel, { passive: false })
    wheelTarget = next
  }

  watch(() => overflow.value.hasOverflow, syncWheelListener)

  function onKeyDown(event: KeyboardEvent, hasLoop: boolean): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
      return
    const element = scroller.value
    if (element == null || element.scrollWidth <= element.clientWidth)
      return
    event.preventDefault()
    const rtl = isRtlElement(element)
    const forward = event.key === 'ArrowRight' ? !rtl : rtl
    scrollByDirection(forward ? 1 : -1, hasLoop)
  }

  onMounted(() => {
    const element = scroller.value
    if (element == null)
      return
    measure()
    syncWheelListener()
    element.addEventListener('scroll', schedule, { passive: true })
    stopObservingContent = observeContent(element, schedule)
  })

  onBeforeUnmount(() => {
    scroller.value?.removeEventListener('scroll', schedule)
    wheelTarget?.removeEventListener('wheel', onWheel)
    wheelTarget = null
    stopObservingContent?.()
    if (frame !== 0 && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
  })

  return { followShown, measure, onKeyDown, overflow, scrollByDirection, scrollToIndex }
}
