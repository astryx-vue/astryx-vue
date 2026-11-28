/**
 * @file assignedSlot.ts
 * @output exposeAssignedSlot(): elements and text read `assignedSlot` as in
 *   a browser, until restored
 * @position Test helper of packages/core/src/gestures
 *
 * The flat-tree walks (utils/flatTree.ts) step from slotted content to the
 * slot it renders in through `assignedSlot`. happy-dom has no
 * `assignedSlot`, so a test of slotted content exposes it first: the slot
 * in the parent's open shadow root whose name matches the node's `slot`.
 */

function assignedSlotOf(node: Node): HTMLSlotElement | null {
  const root = node.parentElement?.shadowRoot
  if (root == null) {
    return null
  }
  const name = node instanceof Element ? (node.getAttribute('slot') ?? '') : ''
  return (
    [...root.querySelectorAll('slot')].find(
      slot => (slot.getAttribute('name') ?? '') === name,
    ) ?? null
  )
}

/** Give elements and text an `assignedSlot`; the returned function takes it away. */
export function exposeAssignedSlot(): () => void {
  const owners = [Element.prototype, Text.prototype].filter(
    owner => !('assignedSlot' in owner),
  )
  for (const owner of owners) {
    Object.defineProperty(owner, 'assignedSlot', {
      configurable: true,
      get(this: Node) {
        return assignedSlotOf(this)
      },
    })
  }
  return () => {
    for (const owner of owners) {
      Reflect.deleteProperty(owner, 'assignedSlot')
    }
  }
}
