/**
 * @file retarget.ts
 * @input An event about to be dispatched on a target
 * @output retargetAcrossShadows(): the event's `target` reads as a browser's
 *   does at each listener
 * @position Test helper of packages/core/src/gestures
 *
 * A browser retargets an event that leaves an open shadow root: a listener
 * outside it sees the shadow host in `event.target`, while the composed path
 * still starts at the element itself. happy-dom keeps the inner element as
 * the target everywhere, so a test of shadow-root input retargets it here.
 */

function isNode(value: unknown): value is Node {
  return typeof value === 'object' && value != null && 'nodeType' in value
}

/** Whether `ancestor` is `node` or contains it, crossing shadow hosts. */
function isShadowIncludingInclusiveAncestor(ancestor: Node, node: Node): boolean {
  let current: Node | null = node
  while (current != null) {
    if (current === ancestor) {
      return true
    }
    current = current instanceof ShadowRoot ? current.host : current.parentNode
  }
  return false
}

/** The DOM standard's retarget of `target` against `listener`. */
function retarget(target: EventTarget, listener: EventTarget | null): EventTarget {
  let current = target
  while (isNode(current)) {
    const root = current.getRootNode()
    if (!(root instanceof ShadowRoot)) {
      return current
    }
    if (isNode(listener) && isShadowIncludingInclusiveAncestor(root, listener)) {
      return current
    }
    current = root.host
  }
  return current
}

/** Make `event`, dispatched on `target`, report `target` as a browser would. */
export function retargetAcrossShadows(event: Event, target: EventTarget): void {
  Object.defineProperty(event, 'target', {
    configurable: true,
    get: () => retarget(target, event.currentTarget),
  })
}
