import type { Ref } from 'vue'
import { getCurrentScope, onScopeDispose, ref } from 'vue'

export interface ScrollOverflowState {
  overflowStart: boolean
  overflowEnd: boolean
  hasOverflow: boolean
}

/**
 * 浏览器是不是真的在渲染这个元素。在 `display: none` 的祖先下、或者 `content-visibility: hidden`
 * 的子树里，读布局要么答 0，要么逼浏览器把整棵藏起来的子树排一遍。没有 `checkVisibility` 的浏览器照常量。
 */
function isRendered(node: HTMLElement): boolean {
  return typeof node.checkVisibility !== 'function' || node.checkVisibility()
}

/**
 * 观察一个横向滚动容器，报告起始边和结束边有没有被挡住。容差 1px。
 *
 * 每次滚动都量。尺寸变化和刚绑上时，只在容器真的被渲染时才量：藏起来的容器没有边可报，
 * 保留上一次的结果，等它露出来之后的那次尺寸变化再量。藏着的容器被脚本滚动时照样量，
 * 因为同样大小地露出来不会再有尺寸变化。
 */
export function useScrollOverflow(): UseScrollOverflowResult {
  const element = ref<HTMLElement | null>(null)
  const overflowStart = ref(false)
  const overflowEnd = ref(false)
  const hasOverflow = ref(false)
  let observer: ResizeObserver | undefined

  function measureNow(node: HTMLElement): void {
    const tolerance = 1
    const maxScroll = node.scrollWidth - node.clientWidth
    const nextStart = Math.abs(node.scrollLeft) > tolerance
    const nextEnd = Math.abs(node.scrollLeft) < maxScroll - tolerance
    const nextHas = node.scrollWidth > node.clientWidth + tolerance
    overflowStart.value = nextStart
    overflowEnd.value = nextEnd
    hasOverflow.value = nextHas
  }

  function measure(): void {
    const node = element.value
    if (node != null && isRendered(node))
      measureNow(node)
  }

  function measureOnScroll(): void {
    const node = element.value
    if (node != null)
      measureNow(node)
  }

  function unbind(): void {
    element.value?.removeEventListener('scroll', measureOnScroll)
    observer?.disconnect()
    observer = undefined
  }

  function scrollRef(node: HTMLElement | null): void {
    if (element.value === node)
      return
    unbind()
    element.value = node
    if (node == null)
      return
    node.addEventListener('scroll', measureOnScroll, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure)
      observer.observe(node)
    }
    measure()
  }

  if (getCurrentScope() != null)
    onScopeDispose(unbind)

  return {
    scrollRef,
    overflowStart,
    overflowEnd,
    hasOverflow,
  }
}

export interface UseScrollOverflowResult {
  scrollRef: (node: HTMLElement | null) => void
  overflowStart: Ref<boolean>
  overflowEnd: Ref<boolean>
  hasOverflow: Ref<boolean>
}
