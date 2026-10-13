import type { Ref } from 'vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'

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

export function useCarouselScroller(scroller: Ref<HTMLElement | null>): {
  measure: () => void
  onKeyDown: (event: KeyboardEvent, hasLoop: boolean) => void
  overflow: Ref<CarouselOverflow>
  scrollByDirection: (direction: -1 | 1, hasLoop: boolean) => void
  scrollToIndex: (index: number) => void
} {
  const overflow = ref<CarouselOverflow>({ hasOverflow: false, overflowStart: false, overflowEnd: false })
  let frame = 0
  let observer: ResizeObserver | null = null

  function measure(): void {
    const element = scroller.value
    overflow.value = element == null
      ? { hasOverflow: false, overflowStart: false, overflowEnd: false }
      : readOverflow(element)
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
    const delta = isRtlElement(element)
      ? itemRect.right - containerRect.right
      : itemRect.left - containerRect.left
    element.scrollBy({ left: delta, behavior })
  }

  function onWheel(event: WheelEvent): void {
    if (!event.shiftKey || event.deltaY === 0 || event.deltaX !== 0)
      return
    const element = scroller.value
    if (element == null || element.scrollWidth <= element.clientWidth)
      return
    event.preventDefault()
    element.scrollBy({ left: event.deltaY, behavior: 'auto' })
  }

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
    element.addEventListener('scroll', schedule, { passive: true })
    element.addEventListener('wheel', onWheel, { passive: false })
    observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule)
    observer?.observe(element)
    for (const child of element.children)
      observer?.observe(child)
  })

  onBeforeUnmount(() => {
    const element = scroller.value
    element?.removeEventListener('scroll', schedule)
    element?.removeEventListener('wheel', onWheel)
    observer?.disconnect()
    if (frame !== 0 && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
  })

  return { measure, onKeyDown, overflow, scrollByDirection, scrollToIndex }
}
