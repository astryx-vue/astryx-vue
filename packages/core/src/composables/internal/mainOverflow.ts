import { observeResize } from '../../utils/sharedResizeObserver.js'
import { getLogicalAxisMapping, isMeasurable, measureScrollAxis } from './scrollGeometry.js'

/**
 * 内容直接放在滚动容器里、没有内层盒子的区域（AppShell 的主区域，可滚动的 LayoutContent、
 * LayoutPanel、StackItem）是不是溢出。内容变长时容器自己的大小不变，所以盯的是它的直接子元素。
 *
 * 先量一次，之后只在答案变化时调 `onChange`。多个信号合并成每帧一次测量。
 * 藏起来、没连在文档上、尺寸为 0 的区域答「不知道」：保留上一次的答案，等下一次有效的信号。
 * 返回停止观察的函数。
 */
export function observeMainOverflow(main: HTMLElement, onChange: (overflows: boolean) => void): () => void {
  let isActive = true
  let frame: number | null = null
  let overflows: boolean | null = null

  function measure(): void {
    frame = null
    if (!isActive)
      return
    const style = getComputedStyle(main)
    if (!isMeasurable(main, style))
      return
    const mapping = getLogicalAxisMapping(style.writingMode, style.direction)
    const next = measureScrollAxis(main, 'inline', mapping, true, style).isScrollable
      || measureScrollAxis(main, 'block', mapping, true, style).isScrollable
    if (next !== overflows) {
      overflows = next
      onChange(next)
    }
  }

  function scheduleMeasure(): void {
    if (!isActive || frame != null)
      return
    if (typeof requestAnimationFrame !== 'function') {
      measure()
      return
    }
    frame = requestAnimationFrame(measure)
  }

  const childObservers = new Map<Element, () => void>()
  function syncChildObservers(): void {
    const children = new Set(Array.from(main.children))
    for (const [child, stop] of childObservers) {
      if (!children.has(child)) {
        stop()
        childObservers.delete(child)
      }
    }
    for (const child of children) {
      if (!childObservers.has(child))
        childObservers.set(child, observeResize(child, scheduleMeasure))
    }
  }

  measure()
  syncChildObservers()
  const stopObservingMain = observeResize(main, scheduleMeasure)
  const mutations = typeof MutationObserver === 'undefined'
    ? null
    : new MutationObserver(() => {
        syncChildObservers()
        scheduleMeasure()
      })
  mutations?.observe(main, {
    attributes: true,
    attributeFilter: ['class', 'dir', 'hidden', 'style'],
    characterData: true,
    childList: true,
    subtree: true,
  })
  const view = main.ownerDocument.defaultView
  view?.addEventListener('resize', scheduleMeasure)
  main.addEventListener('load', scheduleMeasure, true)
  main.addEventListener('transitionend', scheduleMeasure)
  main.addEventListener('animationend', scheduleMeasure)

  return () => {
    isActive = false
    if (frame != null && typeof cancelAnimationFrame === 'function')
      cancelAnimationFrame(frame)
    frame = null
    stopObservingMain()
    mutations?.disconnect()
    for (const stop of childObservers.values())
      stop()
    childObservers.clear()
    view?.removeEventListener('resize', scheduleMeasure)
    main.removeEventListener('load', scheduleMeasure, true)
    main.removeEventListener('transitionend', scheduleMeasure)
    main.removeEventListener('animationend', scheduleMeasure)
  }
}
