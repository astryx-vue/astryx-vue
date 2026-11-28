/**
 * @file dragSelection.ts
 * @input The elements a claimed mouse or pen drag presses, their window,
 *   and the page's selection when the press began
 * @output lockDragSelection (and its DragSelectionHold and
 *   DragSelectionReleaseOptions): a claimed drag's hold, which refuses a new
 *   selection and keeps the page's
 * @position The gesture host's drag hold; a held finger's lock is
 *   lockSelection in selectionLock.ts, and the selection reads are
 *   selectionRanges.ts
 *
 * SYNC: When modified, update gestures/hostSelection.ts.
 */

import { deepActiveElement } from './flatTree'
import { subscribeInput } from './inputStream'
import { isTextEntry, lockStyles } from './selectionLock'
import {
  heldRanges,
  isValidRange,
  sameRanges,
  selectionRangesOf,
  selectRanges,
  shadowRootsOfRanges,
} from './selectionRanges'

export interface DragSelectionReleaseOptions {
  /**
   * The press was cancelled (a pointercancel, a blur, a detach), so no
   * mouseup or click follows: the hold ends at once. Called again after a
   * lift, it ends the hold's last task at once too.
   */
  isCancel?: boolean
}

/** A drag's selection hold: call it to release the hold. */
export interface DragSelectionHold {
  (options?: DragSelectionReleaseOptions): void
  /**
   * Called after the lift's own handlers ran. A selection they made since
   * the release stays: the hold then puts it back, not the press's.
   */
  keepLiftSelection: () => void
}

/**
 * Refuse a new selection while a mouse or pen drag that a recognizer claimed
 * runs, until the returned function runs. `kept` is the page's selection
 * when the press began, and it stays. Anything that replaces it while the
 * drag runs is put back to it. That includes the press's own collapse and a
 * selection the drag started before its claim. So the drag takes no new
 * selection and never clears an existing one. `elements` refuse a
 * selection with inline styles, on every engine. The document refuses one
 * too, because WebKit extends a drag's selection over text outside the
 * elements without another `selectstart`. So a `selectstart` anywhere is
 * refused, and the selection is put back. A `selectstart` does not leave its
 * shadow tree. So the document refuses only one that starts outside every
 * shadow tree, and a claiming element inside one refuses its own. The
 * press's own `mouseup` and `click` come after its `pointerup` in the same
 * task, and WebKit settles the drag's selection there. So the document's
 * hold ends a task after a lift. A cancel ends it at once, because nothing
 * follows a cancel. `onReleased` runs once the document's hold has ended.
 * The page listeners exist only during a press. Idempotent.
 */
export function lockDragSelection(
  elements: Iterable<Element>,
  view: Window | null | undefined,
  kept: ReadonlyArray<AbstractRange>,
  onReleased?: () => void,
): DragSelectionHold {
  const doc = view?.document ?? null
  let keptRanges = kept
  let roots = shadowRootsOfRanges(keptRanges)
  // The selection when the lift released the hold, until the lift's
  // handlers ran.
  let atLift: ReadonlyArray<AbstractRange> | null = null
  const restore = (): void => {
    const selection = view?.getSelection()
    // The focused field keeps its own selection (a drag never starts in one).
    if (selection == null || isTextEntry(deepActiveElement(doc))) {
      return
    }
    const held = heldRanges(selection, roots)
    if (keptRanges.length === 0) {
      if (held.some(range => !range.collapsed)) {
        selection.removeAllRanges()
      }
      return
    }
    // A render can remove what the kept selection held: then there is
    // nothing to put back.
    if (sameRanges(held, keptRanges) || !keptRanges.every(isValidRange)) {
      return
    }
    selectRanges(selection, keptRanges)
  }
  restore()
  const set = new Set(elements)
  const refuse = (event: Event): void => {
    if (!isTextEntry(event.target)) {
      event.preventDefault()
    }
  }
  for (const element of set) {
    element.addEventListener('selectstart', refuse)
  }
  const stopDocument
    = view == null
      ? []
      : [
          subscribeInput(view, 'selectstart', refuse, { cancels: true }),
          subscribeInput(view, 'selectionchange', restore),
        ]
  const unlockStyles = lockStyles(set)
  let stage: 'held' | 'lifted' | 'done' = 'held'
  let timer: number | null = null
  const releaseDocument = (): void => {
    if (stage === 'done') {
      return
    }
    stage = 'done'
    if (timer != null) {
      view?.clearTimeout(timer)
      timer = null
    }
    try {
      restore()
    }
    finally {
      for (const stop of stopDocument) {
        stop()
      }
      onReleased?.()
    }
  }
  const release = (({ isCancel = false }: DragSelectionReleaseOptions = {}) => {
    if (stage === 'held') {
      stage = 'lifted'
      atLift = selectionRangesOf(view)
      for (const element of set) {
        element.removeEventListener('selectstart', refuse)
      }
      unlockStyles()
      // A lift's own mouseup and click follow in its task and must still
      // meet the hold; nothing follows a cancel, which ends it at once.
      if (view == null || isCancel) {
        releaseDocument()
      }
      else {
        timer = view.setTimeout(releaseDocument, 0)
      }
    }
    else if (stage === 'lifted' && isCancel) {
      releaseDocument()
    }
  }) as DragSelectionHold
  release.keepLiftSelection = () => {
    if (stage !== 'lifted' || atLift == null) {
      return
    }
    const before = atLift
    atLift = null
    const keepIfChanged = (): void => {
      const now = selectionRangesOf(view)
      if (stage !== 'done' && !sameRanges(now, before)) {
        keptRanges = now
        roots = shadowRootsOfRanges(now)
      }
    }
    keepIfChanged()
    // A click's state update renders in a microtask, and its layout effect
    // may select then. That still runs before the press's own mouseup.
    queueMicrotask(keepIfChanged)
  }
  return release
}
