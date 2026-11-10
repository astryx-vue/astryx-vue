type ContentCallback = () => void

const OPTIONS: MutationObserverInit = {
  characterData: true,
  childList: true,
  subtree: true,
}

let observer: MutationObserver | null = null
const callbacks = new Map<Node, Set<ContentCallback>>()

function dispatch(records: MutationRecord[]): void {
  // A record may target any descendant. Walk to each observed root and call
  // every callback only once for the whole batch.
  const pending = new Set<ContentCallback>()
  for (const record of records) {
    for (let node: Node | null = record.target; node; node = node.parentNode)
      callbacks.get(node)?.forEach(callback => pending.add(callback))
  }
  pending.forEach(callback => callback())
}

/**
 * Observe text and child changes anywhere inside an element. All registrations
 * share one MutationObserver; the returned function removes only its own callback.
 */
export function observeContent(element: Element, callback: ContentCallback): () => void {
  if (typeof MutationObserver === 'undefined')
    return () => {}

  observer ??= new MutationObserver(dispatch)
  const existing = callbacks.get(element)
  if (existing) {
    existing.add(callback)
  }
  else {
    callbacks.set(element, new Set([callback]))
    observer.observe(element, OPTIONS)
  }

  let subscribed = true
  return () => {
    if (!subscribed)
      return
    subscribed = false
    const registered = callbacks.get(element)
    registered?.delete(callback)
    if (registered?.size === 0)
      callbacks.delete(element)
    if (callbacks.size === 0 && observer) {
      observer.disconnect()
      observer = null
    }
  }
}
