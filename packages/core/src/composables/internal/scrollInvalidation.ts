const MEASURE_PROPERTIES = ['direction', 'writing-mode', 'display', 'visibility', 'content-visibility']

function declarationsOf(text: string | null): string {
  if (text == null)
    return ''
  return text.split(';')
    .map(part => part.trim().toLowerCase())
    .filter(part => MEASURE_PROPERTIES.some(name => part.startsWith(`${name}:`) || part.startsWith(`${name} :`)))
    .sort()
    .join(';')
}

/** 行内样式前后的差别里有没有会影响量出结果的声明。 */
export function styleAffectsMeasure(before: string | null, after: string | null): boolean {
  return declarationsOf(before) !== declarationsOf(after)
}

/**
 * 什么时候要重新量一块滚动区域。
 *
 * 尺寸变化（ResizeObserver）、滚动、窗口和可视视口变化、图片加载、过渡和动画结束、
 * 内容和祖先的属性变化（class、dir、hidden、style 会改书写方向和可见性）、字体加载完成。
 * 这些信号只负责「该量了」，量本身由调用方合并到一次里做。
 */
export function watchScrollInvalidation(
  viewport: HTMLElement,
  content: HTMLElement,
  schedule: () => void,
  onScroll: () => void = schedule,
): () => void {
  const doc = viewport.ownerDocument
  const view = doc.defaultView
  const cleanups: Array<() => void> = []

  function on(target: EventTarget | null | undefined, type: string, capture = false, handler: () => void = schedule): void {
    if (target == null)
      return
    target.addEventListener(type, handler, { capture, passive: true })
    cleanups.push(() => target.removeEventListener(type, handler, capture))
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule)
    observer.observe(viewport)
    observer.observe(content)
    cleanups.push(() => observer.disconnect())
  }

  on(viewport, 'scroll', false, onScroll)
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
    cleanups.push(() => observer.disconnect())

    // 祖先的行内样式只通过方向、书写模式、显示和可见性影响量出来的结果；盒子大小的变化由尺寸观察器报。
    // 拖动时祖先每一帧都在改 transform，那种变化不用重量。
    const ancestors = new MutationObserver((records) => {
      for (const record of records) {
        if (record.attributeName !== 'style' || !(record.target instanceof Element)
          || styleAffectsMeasure(record.oldValue, record.target.getAttribute('style'))) {
          schedule()
          return
        }
      }
    })
    for (let ancestor = viewport.parentElement; ancestor != null; ancestor = ancestor.parentElement)
      ancestors.observe(ancestor, { attributes: true, attributeFilter: ['class', 'dir', 'hidden', 'style'], attributeOldValue: true })
    cleanups.push(() => ancestors.disconnect())
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
