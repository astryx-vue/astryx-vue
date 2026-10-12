import { onBeforeUnmount, ref } from 'vue'

export interface ScrollOverflowState {
  overflowStart: boolean
  overflowEnd: boolean
  hasOverflow: boolean
}

/**
 * 观察一个横向滚动容器，报告起始边和结束边有没有被挡住。
 * 容差 1px，滚动和尺寸变化都会重新量。
 */
export function useScrollOverflow() {
  const element = ref<HTMLElement | null>(null)
  const overflowStart = ref(false)
  const overflowEnd = ref(false)
  const hasOverflow = ref(false)
  let observer: ResizeObserver | undefined

  function measure() {
    const node = element.value
    if (node == null)
      return
    const tolerance = 1
    const maxScroll = node.scrollWidth - node.clientWidth
    const nextStart = Math.abs(node.scrollLeft) > tolerance
    const nextEnd = Math.abs(node.scrollLeft) < maxScroll - tolerance
    const nextHas = node.scrollWidth > node.clientWidth + tolerance
    overflowStart.value = nextStart
    overflowEnd.value = nextEnd
    hasOverflow.value = nextHas
  }

  function scrollRef(node: HTMLElement | null) {
    element.value?.removeEventListener('scroll', measure)
    observer?.disconnect()
    element.value = node
    if (node == null)
      return
    node.addEventListener('scroll', measure, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(node)
    }
    measure()
  }

  onBeforeUnmount(() => {
    element.value?.removeEventListener('scroll', measure)
    observer?.disconnect()
  })

  return {
    scrollRef,
    overflowStart,
    overflowEnd,
    hasOverflow,
  }
}

export type UseScrollOverflowResult = ReturnType<typeof useScrollOverflow>
