import type { Ref } from 'vue'
import type { OutlineItem } from './types.js'
import { onScopeDispose, ref, watch } from 'vue'

const HEADING_SELECTOR = 'h1,h2,h3,h4,h5,h6'

/** 收集容器里带 id、有文字的标题。 */
export function collectOutlineItems(container: HTMLElement | null): OutlineItem[] {
  if (container == null)
    return []
  return [...container.querySelectorAll(HEADING_SELECTOR)].flatMap((heading) => {
    const label = heading.textContent?.trim() ?? ''
    if (heading.id === '' || label === '')
      return []
    const level = Number(heading.tagName.slice(1))
    return [{ id: heading.id, label, level }]
  })
}

/** 盯着容器里的 h1–h6。增删、改字、改 id 都会重算。 */
export function useOutlineFromDOM(container: Ref<HTMLElement | null | undefined>): Ref<OutlineItem[]> {
  const items = ref<OutlineItem[]>([])
  let observer: MutationObserver | undefined

  function refresh(): void {
    items.value = collectOutlineItems(container.value ?? null)
  }

  watch(container, (element) => {
    observer?.disconnect()
    observer = undefined
    refresh()
    if (element == null || typeof MutationObserver === 'undefined')
      return
    observer = new MutationObserver(refresh)
    observer.observe(element, {
      attributeFilter: ['id'],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
  }, { immediate: true })

  onScopeDispose(() => {
    observer?.disconnect()
    observer = undefined
  })

  return items
}
