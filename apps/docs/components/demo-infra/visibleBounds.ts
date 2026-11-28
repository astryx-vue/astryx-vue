import type { Directive } from 'vue'

const HIDDEN_SELECTOR = '.astryx-visually-hidden, [hidden]'
const MEDIA_TAGS = new Set(['svg', 'IMG', 'CANVAS', 'VIDEO', 'INPUT', 'TEXTAREA', 'IFRAME'])

export interface Rect { left: number, top: number, right: number, bottom: number }

function paints(element: Element, style: CSSStyleDeclaration): boolean {
  if (MEDIA_TAGS.has(element.tagName))
    return true
  if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' || style.backgroundImage !== 'none' || style.boxShadow !== 'none')
    return true
  if (style.borderStyle !== 'none' && Number.parseFloat(style.borderWidth) > 0)
    return true
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      return true
  }
  return false
}

function union(a: Rect | null, b: Rect | null): Rect | null {
  if (a == null || b == null)
    return a ?? b
  return { left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) }
}

/**
 * 从上往下走一遍元素树：透明、隐藏的子树整棵跳过（元素自己的 opacity 不会被子元素继承，
 * 只看元素本身会把淡出中的提示层算进来）；滚动容器、overflow 不可见的祖先把子孙裁到自己的范围内。
 */
function walk(element: Element, clip: Rect | null): Rect | null {
  if (element.matches(HIDDEN_SELECTOR))
    return null
  const style = getComputedStyle(element)
  if (style.display === 'none' || style.opacity === '0')
    return null
  let bounds: Rect | null = null
  if (style.display !== 'contents' && style.visibility !== 'hidden' && paints(element, style)) {
    const box = element.getBoundingClientRect()
    const rect = clip == null
      ? { left: box.left, top: box.top, right: box.right, bottom: box.bottom }
      : { left: Math.max(box.left, clip.left), top: Math.max(box.top, clip.top), right: Math.min(box.right, clip.right), bottom: Math.min(box.bottom, clip.bottom) }
    if (rect.right - rect.left >= 1 && rect.bottom - rect.top >= 1)
      bounds = rect
  }
  let childClip = clip
  if (style.overflowX !== 'visible' || style.overflowY !== 'visible') {
    const box = element.getBoundingClientRect()
    const own = {
      left: style.overflowX !== 'visible' ? box.left : -Infinity,
      right: style.overflowX !== 'visible' ? box.right : Infinity,
      top: style.overflowY !== 'visible' ? box.top : -Infinity,
      bottom: style.overflowY !== 'visible' ? box.bottom : Infinity,
    }
    childClip = clip == null
      ? own
      : { left: Math.max(own.left, clip.left), top: Math.max(own.top, clip.top), right: Math.min(own.right, clip.right), bottom: Math.min(own.bottom, clip.bottom) }
  }
  for (const child of element.children)
    bounds = union(bounds, walk(child, childClip))
  return bounds
}

/** 示例里所有画出东西的元素（文字、底色、边框、图标）合起来的外框，root 自己的裁切不算在内。 */
export function visibleBounds(root: HTMLElement): Rect | null {
  let bounds: Rect | null = null
  for (const child of root.children)
    bounds = union(bounds, walk(child, null))
  return bounds
}

/** 尺寸变化、进退场动画结束时，在下一帧重新适配。挂在 el 上，同时盯着 el 和 content。 */
export function fitDirective(content: (el: HTMLElement) => Element | null | undefined, fit: (el: HTMLElement) => void): Directive<HTMLElement> {
  const observers = new WeakMap<HTMLElement, { resize: ResizeObserver, mutation: MutationObserver }>()
  return {
    mounted(el) {
      let pending = 0
      const schedule = (): void => {
        cancelAnimationFrame(pending)
        pending = requestAnimationFrame(() => fit(el))
      }
      const resize = new ResizeObserver(schedule)
      resize.observe(el)
      const target = content(el)
      if (target != null)
        resize.observe(target)
      // 图表、异步加载的示例在挂载后才画出内容，切换 class 或 hidden 才显出来的示例外框尺寸也不变，要靠节点变化来触发。
      // 不看 style：适配本身就在写 style，看了会自己触发自己。
      const mutation = new MutationObserver(schedule)
      mutation.observe(el, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'hidden'] })
      observers.set(el, { resize, mutation })
      void document.fonts?.ready.then(schedule)
      // 示例自带进场动画（菜单展开、提示滑入）时，动画结束后的位置才是最终位置。
      el.addEventListener('transitionend', schedule)
      el.addEventListener('animationend', schedule)
      fit(el)
    },
    beforeUnmount(el) {
      const entry = observers.get(el)
      entry?.resize.disconnect()
      entry?.mutation.disconnect()
      observers.delete(el)
    },
  }
}
