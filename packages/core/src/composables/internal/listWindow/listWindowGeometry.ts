import type { ShallowRef } from 'vue'
import { onScopeDispose, shallowRef, watch } from 'vue'

/** 窗口化读到的滚动几何。块方向是行堆叠的方向，行内方向是列排开的方向。 */
export interface ListWindowGeometry {
  /** 视口在块方向上的可见高度。 */
  viewportHeight: number
  scrollTop: number
  /** 视口里整个内容的高度，含列表之后的其他内容。 */
  scrollHeight: number
  /** 从滚动起点到第一行的距离，和 `scrollTop` 同一坐标。 */
  startOffset: number
  /** 视口在行内方向上的宽度。 */
  viewportWidth: number
  /** 从行内起点量起的滚动距离；从右到左排版时也是正数。 */
  scrollLeft: number
  isMeasured: boolean
  /** 内容或布局每失效一次加一；单纯滚动不变。 */
  revision: number
  /** 尺寸、字体这类布局变化每发生一次加一。 */
  layoutRevision: number
}

export const UNMEASURED_LIST_GEOMETRY: ListWindowGeometry = Object.freeze({
  viewportHeight: 0,
  scrollTop: 0,
  scrollHeight: 0,
  startOffset: 0,
  viewportWidth: 0,
  scrollLeft: 0,
  isMeasured: false,
  revision: 0,
  layoutRevision: 0,
})

export interface ListWindowGeometrySource {
  snapshot: Readonly<ShallowRef<ListWindowGeometry>>
  /** 挂载的内容变了（例如新挂了几行）之后调用，重新量一次。`isLayout` 表示尺寸类的变化。 */
  invalidate: (isLayout?: boolean) => void
}

export interface UseListWindowGeometryOptions {
  /** 滚动视口。 */
  viewport: () => HTMLElement | null
  /** 第一行所在的容器，用来量列表前面还有多高的内容。 */
  start: () => HTMLElement | null
  /** 只在窗口化时监听，别的时候什么都不装。 */
  isActive: () => boolean
}

/**
 * 一个滚动视口的几何来源：一个滚动监听加一个 ResizeObserver，块方向和行内方向共用。
 * 单纯滚动只读 `scrollTop` / `scrollLeft`；尺寸和内容的变化才重新量全部。
 */
export function useListWindowGeometry(options: UseListWindowGeometryOptions): ListWindowGeometrySource {
  const snapshot = shallowRef<ListWindowGeometry>(UNMEASURED_LIST_GEOMETRY)
  let stop: (() => void) | undefined

  function measure(isContent: boolean, isLayout: boolean): void {
    const viewport = options.viewport()
    const start = options.start()
    if (viewport == null || start == null || !viewport.isConnected)
      return
    const current = snapshot.value
    const scrollTop = viewport.scrollTop
    const scrollLeft = Math.abs(viewport.scrollLeft)
    if (!isContent && !isLayout && current.isMeasured) {
      if (scrollTop !== current.scrollTop || scrollLeft !== current.scrollLeft)
        snapshot.value = { ...current, scrollTop, scrollLeft }
      return
    }
    const viewportHeight = viewport.clientHeight
    if (viewportHeight <= 0)
      return
    const next: ListWindowGeometry = {
      viewportHeight,
      scrollTop,
      scrollHeight: viewport.scrollHeight,
      startOffset: Math.max(0, start.getBoundingClientRect().top - viewport.getBoundingClientRect().top + scrollTop - viewport.clientTop),
      viewportWidth: viewport.clientWidth,
      scrollLeft,
      isMeasured: true,
      revision: current.revision + 1,
      layoutRevision: current.layoutRevision + (isLayout ? 1 : 0),
    }
    if (
      !isLayout
      && current.isMeasured
      && current.viewportHeight === next.viewportHeight
      && current.scrollTop === next.scrollTop
      && current.scrollHeight === next.scrollHeight
      && current.startOffset === next.startOffset
      && current.viewportWidth === next.viewportWidth
      && current.scrollLeft === next.scrollLeft
    ) {
      return
    }
    snapshot.value = next
  }

  function connect(viewport: HTMLElement, start: HTMLElement): () => void {
    const onScroll = (): void => measure(false, false)
    viewport.addEventListener('scroll', onScroll, { passive: true })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => measure(true, true))
    observer?.observe(viewport)
    observer?.observe(start)
    measure(true, true)
    return () => {
      viewport.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }

  watch(
    () => [options.isActive(), options.viewport(), options.start()] as const,
    ([isActive, viewport, start]) => {
      stop?.()
      stop = undefined
      if (isActive && viewport != null && start != null)
        stop = connect(viewport, start)
    },
    { immediate: true, flush: 'post' },
  )

  onScopeDispose(() => {
    stop?.()
    stop = undefined
  })

  return {
    snapshot,
    invalidate(isLayout = false) {
      if (stop != null)
        measure(true, isLayout)
    },
  }
}
