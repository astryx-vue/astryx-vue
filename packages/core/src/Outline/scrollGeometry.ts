import type { OutlineItem } from './types.js'

export function getScrollableAncestor(element: HTMLElement | null): HTMLElement | null {
  let current = element?.parentElement ?? null
  while (current != null) {
    const overflowY = getComputedStyle(current).overflowY
    const scrollable = (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay')
      && current.scrollHeight > current.clientHeight
    if (scrollable)
      return current
    current = current.parentElement
  }
  return null
}

export function getScrollMarginTop(element: HTMLElement): number {
  return Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0
}

export function getRootTop(scrollRoot: HTMLElement | null): number {
  return scrollRoot != null ? scrollRoot.getBoundingClientRect().top : 0
}

export function getRestingTop(target: HTMLElement, scrollRoot: HTMLElement | null, offset: number): number {
  return getRootTop(scrollRoot) + offset + getScrollMarginTop(target)
}

export function scrollToTarget(
  target: HTMLElement,
  scrollRoot: HTMLElement | null,
  scrollTarget: HTMLElement | Window,
  offset: number,
): void {
  const behavior = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth'
  if (offset === 0) {
    target.scrollIntoView({ behavior, block: 'start' })
    return
  }
  const delta = target.getBoundingClientRect().top - getRestingTop(target, scrollRoot, offset)
  scrollTarget.scrollBy({ top: delta, behavior })
}

export function resolveActiveId(
  items: readonly OutlineItem[],
  scrollRoot: HTMLElement | null,
  offset: number,
): string | undefined {
  if (items.length === 0)
    return undefined

  const atBottom = scrollRoot != null
    ? scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 2
    : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (atBottom)
    return items[items.length - 1].id

  let activeId = items[0].id
  for (const item of items) {
    const element = document.getElementById(item.id)
    if (element == null)
      continue
    const top = element.getBoundingClientRect().top
    if (top <= getRestingTop(element, scrollRoot, offset) + 1)
      activeId = item.id
    else
      break
  }
  return activeId
}

/** Heading levels 1 and 2 share the first indent. Levels 5 and 6 share the fourth. */
export function indentLevel(level: number): 1 | 2 | 3 | 4 {
  const indent = Math.max(1, Math.min(4, level - 1 || 1))
  return indent as 1 | 2 | 3 | 4
}
