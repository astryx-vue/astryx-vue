/**
 * 什么时候要重新量一块滚动区域。
 *
 * 尺寸变化（ResizeObserver）、滚动、窗口和可视视口变化、图片加载、过渡和动画结束、
 * 内容和祖先的属性变化（class、dir、hidden、style 会改书写方向和可见性）、字体加载完成。
 * 这些信号只负责「该量了」，量本身由调用方合并到一次里做。
 */
export function watchScrollInvalidation(viewport: HTMLElement, content: HTMLElement, schedule: () => void): () => void {
  const doc = viewport.ownerDocument
  const view = doc.defaultView
  const cleanups: Array<() => void> = []

  function on(target: EventTarget | null | undefined, type: string, capture = false): void {
    if (target == null)
      return
    target.addEventListener(type, schedule, { capture, passive: true })
    cleanups.push(() => target.removeEventListener(type, schedule, capture))
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule)
    observer.observe(viewport)
    observer.observe(content)
    cleanups.push(() => observer.disconnect())
  }

  on(viewport, 'scroll')
  on(view, 'resize')
  on(view?.visualViewport, 'resize')
  on(content, 'load', true)
  for (const element of [viewport, content]) {
    on(element, 'transitionend')
    on(element, 'animationend')
  }

  if (typeof MutationObserver !== 'undefined') {
    const attributeFilter = ['class', 'dir', 'hidden', 'style']
    const observer = new MutationObserver(schedule)
    observer.observe(viewport, { attributes: true, attributeFilter })
    observer.observe(content, { attributes: true, attributeFilter, characterData: true, childList: true, subtree: true })
    for (let ancestor = viewport.parentElement; ancestor != null; ancestor = ancestor.parentElement)
      observer.observe(ancestor, { attributes: true, attributeFilter })
    cleanups.push(() => observer.disconnect())
  }

  const fonts = (doc as Document & { fonts?: FontFaceSet }).fonts
  if (fonts != null) {
    fonts.addEventListener?.('loadingdone', schedule)
    cleanups.push(() => fonts.removeEventListener?.('loadingdone', schedule))
    void fonts.ready?.then(schedule)
  }

  return () => {
    for (const cleanup of cleanups)
      cleanup()
  }
}
