/**
 * @file selectionRanges.ts
 * @input A window's selection, a press's point
 * @output selectionRangesOf and startsOnSelectableText, what a mouse or pen
 *   press reads; caretAt; and the range helpers a drag's hold uses to keep
 *   and put back the page's selection
 * @position Read by the gesture host at a press, and by dragSelection.ts
 *
 * SYNC: When modified, update dragSelection.ts and gestures/hostSelection.ts.
 */

import { parentAcrossShadow, shadowHostOf, shadowRootsOutward } from './flatTree'
import { isTextEntry } from './selectionLock'

/**
 * The page's selection now, its ranges copied; none for a collapsed or empty
 * one. A drag's hold keeps what this read when the press began.
 */
export function selectionRangesOf(
  view: Window | null | undefined,
): ReadonlyArray<AbstractRange> {
  const selection = view?.getSelection()
  if (selection == null) {
    return []
  }
  const composed = composedRangesOf(selection, [])
  if (composed != null) {
    return composed.filter(range => !range.collapsed).map(liveWhereItCan)
  }
  if (selection.isCollapsed) {
    return []
  }
  const ranges: Range[] = []
  for (let index = 0; index < selection.rangeCount; index++) {
    ranges.push(selection.getRangeAt(index).cloneRange())
  }
  return ranges
}

/**
 * Whether a press at (`x`, `y`) lands on text a drag would select. That is a
 * text field, or a character of non-empty text whose element allows a
 * selection. A native button's label, slotted or not, is not selectable text,
 * because the engine starts no selection from a drag inside a button. A point
 * beside text, which a caret query snaps to the nearest character, lands on
 * none. Where the engine has no caret query, nothing is selectable text.
 */
export function startsOnSelectableText(
  doc: Document,
  x: number,
  y: number,
  target: EventTarget | null,
): boolean {
  if (isTextEntry(target)) {
    return true
  }
  const caret = caretAt(doc, x, y, [
    ...ownShadowRoot(target),
    ...openShadowRootsOf(target),
  ])
  if (caret == null) {
    return false
  }
  const { node, offset } = caret
  if (node.nodeType !== 3 || (node.textContent ?? '').trim() === '') {
    return false
  }
  // Text directly under a shadow root takes its host's style.
  const element
    = node.parentElement
      ?? (node.parentNode == null ? null : shadowHostOf(node.parentNode))
  if (element == null || !allowsSelection(element) || isInButton(node)) {
    return false
  }
  const length = (node.textContent ?? '').length
  const range = doc.createRange()
  if (typeof range.getClientRects !== 'function') {
    return false
  }
  for (const start of [offset - 1, offset]) {
    if (start < 0 || start >= length) {
      continue
    }
    range.setStart(node, start)
    range.setEnd(node, start + 1)
    for (const rect of Array.from(range.getClientRects())) {
      if (
        x >= rect.left
        && x <= rect.right
        && y >= rect.top
        && y <= rect.bottom
      ) {
        return true
      }
    }
  }
  return false
}

/** Whether `node` is inside a native button, along the flat tree. */
function isInButton(node: Node): boolean {
  for (let at: Node | null = node; at != null; at = parentAcrossShadow(at)) {
    if (at.nodeType === 1 && (at as Element).localName === 'button') {
      return true
    }
  }
  return false
}

/** The caret position the engine puts at a point, by either query. */
export function caretAt(
  doc: Document,
  x: number,
  y: number,
  shadowRoots: ReadonlyArray<ShadowRoot>,
): { node: Node, offset: number } | null {
  const queries = doc as Document & {
    caretPositionFromPoint?: (
      x: number,
      y: number,
      options?: { shadowRoots?: ShadowRoot[] },
    ) => { offsetNode: Node, offset: number } | null
    caretRangeFromPoint?: (x: number, y: number) => Range | null
  }
  if (typeof queries.caretPositionFromPoint === 'function') {
    // Without the roots, a point over shadow text answers at its host.
    const position
      = shadowRoots.length > 0
        ? queries.caretPositionFromPoint(x, y, {
            shadowRoots: [...shadowRoots],
          })
        : queries.caretPositionFromPoint(x, y)
    return position == null
      ? null
      : { node: position.offsetNode, offset: position.offset }
  }
  if (typeof queries.caretRangeFromPoint === 'function') {
    const range = queries.caretRangeFromPoint(x, y)
    return range == null
      ? null
      : { node: range.startContainer, offset: range.startOffset }
  }
  return null
}

/** Whether an element's text can be selected (`user-select` is not none). */
function allowsSelection(element: Element): boolean {
  const style = element.ownerDocument.defaultView?.getComputedStyle(element)
  if (style == null) {
    return false
  }
  return (
    style.getPropertyValue('user-select') !== 'none'
    && style.getPropertyValue('-webkit-user-select') !== 'none'
  )
}

/**
 * The ranges `selection` holds, with boundaries inside `shadowRoots` where the
 * engine reads composed ranges.
 */
export function heldRanges(
  selection: Selection,
  shadowRoots: ReadonlyArray<ShadowRoot>,
): ReadonlyArray<AbstractRange> {
  const composed = composedRangesOf(selection, shadowRoots)
  if (composed != null) {
    return composed
  }
  const ranges: Range[] = []
  for (let index = 0; index < selection.rangeCount; index++) {
    ranges.push(selection.getRangeAt(index))
  }
  return ranges
}

/**
 * A live copy of `range` when both boundaries share a root, so it follows
 * DOM changes. A range across roots stays static: no live range holds it.
 */
function liveWhereItCan(range: StaticRange): AbstractRange {
  const live = range.startContainer.ownerDocument?.createRange()
  if (
    live == null
    || range.startContainer.getRootNode() !== range.endContainer.getRootNode()
  ) {
    return range
  }
  live.setStart(range.startContainer, range.startOffset)
  live.setEnd(range.endContainer, range.endOffset)
  return live
}

/** Whether both of `range`'s boundaries still exist in the document. */
export function isValidRange(range: AbstractRange): boolean {
  return (
    isValidBoundary(range.startContainer, range.startOffset)
    && isValidBoundary(range.endContainer, range.endOffset)
  )
}

function isValidBoundary(node: Node, offset: number): boolean {
  const length
    = node.nodeType === 3 || node.nodeType === 4 || node.nodeType === 8
      ? (node as CharacterData).length
      : node.childNodes.length
  return node.isConnected && offset >= 0 && offset <= length
}

/** Whether two range lists have the same boundaries, in order. */
export function sameRanges(
  held: ReadonlyArray<AbstractRange>,
  kept: ReadonlyArray<AbstractRange>,
): boolean {
  return (
    held.length === kept.length
    && kept.every((range, index) => {
      const other = held[index]
      return (
        other.startContainer === range.startContainer
        && other.startOffset === range.startOffset
        && other.endContainer === range.endContainer
        && other.endOffset === range.endOffset
      )
    })
  )
}

/**
 * Put `ranges` back as the selection. One range goes through
 * `setBaseAndExtent`, which also reaches inside a shadow root.
 */
export function selectRanges(
  selection: Selection,
  ranges: ReadonlyArray<AbstractRange>,
): void {
  const [only] = ranges
  if (ranges.length === 1 && typeof selection.setBaseAndExtent === 'function') {
    selection.setBaseAndExtent(
      only.startContainer,
      only.startOffset,
      only.endContainer,
      only.endOffset,
    )
    return
  }
  selection.removeAllRanges()
  for (const range of ranges) {
    const copy = range.startContainer.ownerDocument?.createRange()
    if (copy == null) {
      continue
    }
    copy.setStart(range.startContainer, range.startOffset)
    copy.setEnd(range.endContainer, range.endOffset)
    selection.addRange(copy)
  }
}

/**
 * The selection's composed ranges, reaching into each open shadow root a
 * boundary lands on; null where the engine has no `getComposedRanges`.
 * Without the roots, a selection inside a shadow root reads as one around
 * its host.
 */
function composedRangesOf(
  selection: Selection,
  known: ReadonlyArray<ShadowRoot>,
): StaticRange[] | null {
  const query = (
    selection as Selection & {
      getComposedRanges?: (options?: {
        shadowRoots?: ShadowRoot[]
      }) => StaticRange[]
    }
  ).getComposedRanges
  if (typeof query !== 'function') {
    return null
  }
  // Engines take the roots as a dictionary, or, in older releases, as
  // arguments.
  const read = (roots: ShadowRoot[]): StaticRange[] | null => {
    try {
      return query.call(selection, { shadowRoots: roots })
    }
    catch {
      try {
        return (query as (...roots: ShadowRoot[]) => StaticRange[]).call(
          selection,
          ...roots,
        )
      }
      catch {
        return null
      }
    }
  }
  const roots = [...known]
  for (;;) {
    const ranges = read([...roots])
    if (ranges == null) {
      return null
    }
    const found = new Set<ShadowRoot>()
    for (const range of ranges) {
      for (const [node, offset] of [
        [range.startContainer, range.startOffset],
        [range.endContainer, range.endOffset],
      ] as const) {
        for (const child of [
          node.childNodes[offset],
          node.childNodes[offset - 1],
        ]) {
          const root
            = child?.nodeType === 1 ? (child as Element).shadowRoot : null
          if (root != null && !roots.includes(root)) {
            found.add(root)
          }
        }
      }
    }
    if (found.size === 0) {
      return ranges
    }
    roots.push(...found)
  }
}

/** The open shadow roots on the root chains of `ranges`' boundaries. */
export function shadowRootsOfRanges(
  ranges: ReadonlyArray<AbstractRange>,
): ReadonlyArray<ShadowRoot> {
  const roots = new Set<ShadowRoot>()
  for (const range of ranges) {
    for (const root of [
      ...openShadowRootsOf(range.startContainer),
      ...openShadowRootsOf(range.endContainer),
    ]) {
      roots.add(root)
    }
  }
  return [...roots]
}

/**
 * The open shadow root `target` hosts, if any. A press on text directly under
 * a shadow root targets its host.
 */
function ownShadowRoot(target: EventTarget | null): ShadowRoot[] {
  const root
    = (target as Node | null)?.nodeType === 1
      ? (target as Element).shadowRoot
      : null
  return root == null ? [] : [root]
}

/** The open shadow roots on `target`'s root chain, innermost first. */
function openShadowRootsOf(target: EventTarget | null): ShadowRoot[] {
  if (target == null || typeof (target as Node).nodeType !== 'number') {
    return []
  }
  return shadowRootsOutward((target as Node).getRootNode())
    .map(({ root }) => root)
    .filter(root => root.mode === 'open')
}
