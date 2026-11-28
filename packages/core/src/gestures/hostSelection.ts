/**
 * @file hostSelection.ts
 * @output HostSelection: The selection lock under a held finger, the drag hold under a claimed mouse or pen, and touch gates
 * @position A layer of GestureHost.ts, below HostWheelInput
 */

import type { GestureRecognizer, SelectionLock } from './GestureRecognizer'
import type {
  TouchConsumer,
} from './types'

import {
  lockDragSelection,
} from '../utils/dragSelection'
import { isElement } from '../utils/nodeType'
import { startsOnSelectableText } from '../utils/selectionRanges'

import { HostHitTest } from './hostHitTest'
import {
  parentAcrossShadow,
} from './nativeScroll'

/** The selection lock under a held finger, the drag hold under a claimed mouse or pen, and touch gates; GestureHost is the class to use. */
export abstract class HostSelection extends HostHitTest {
  /**
   * Turn text selection and the touch callout off, for as long as this
   * finger or pen is down, only on the elements whose hold does something:
   * a long press's (a menu, a hold-repeat), those of recognizers created
   * with a `selectionLock` (a slider's thumb, a switch's drag, a tab bar's
   * zero-delay lens) and that of a press tracker created with one (a
   * stepper's hold-repeat). Anything whose hold does nothing, a plain
   * press-tracked control or row included, keeps the browser's long-press
   * selection (`spec:AST-094` FR41). Restored when the contact ends. Callers
   * lock for a finger or a pen under any primary pointer, never for a mouse
   * (locksSelectionFor), and only once the arena has admitted the contact:
   * `recognizers` and `consumer` are the ones that took it.
   */
  protected lockSelection(
    id: number,
    recognizers: ReadonlyArray<GestureRecognizer>,
    target: EventTarget | null,
    consumer: TouchConsumer | null,
    consumerElement: Element | null,
  ): void {
    // Each recognizer whose hold does something brings its lock; the host
    // never imports one (a component without such a hold does not bundle
    // it). Only one that took this contact locks for it: a recognizer that
    // declined it (its pointer, or its own shouldReceiveTouch) has no hold
    // here.
    // A recognizer attached with manageStyle: false leaves the element's
    // styles to the caller, the lock included (AttachOptions.manageStyle).
    const managed = (element: Element, recognizer?: GestureRecognizer): boolean => {
      const registration = this.registry.get(element)
      return (
        registration?.manageStyle !== false
        && (recognizer == null || registration?.unstyled.has(recognizer) !== true)
      )
    }
    const byLock = new Map<SelectionLock, Set<Element>>()
    for (const recognizer of recognizers) {
      const lock = recognizer.selectionLock
      if (
        lock != null
        && isElement(recognizer.view)
        && managed(recognizer.view, recognizer)
      ) {
        const elements = byLock.get(lock) ?? new Set<Element>()
        elements.add(recognizer.view)
        byLock.set(lock, elements)
      }
    }
    const consumerLock = consumer?.selectionLock
    if (
      consumerLock != null
      && consumerElement != null
      && managed(consumerElement)
    ) {
      const elements = byLock.get(consumerLock) ?? new Set<Element>()
      elements.add(consumerElement)
      byLock.set(consumerLock, elements)
    }
    if (byLock.size > 0) {
      const undo = [...byLock].map(([lock, elements]) =>
        lock(elements, target),
      )
      this.lockedBy.set(id, () => {
        for (const release of undo) {
          release()
        }
      })
    }
  }

  /**
   * Hold the page's selection for a mouse or pen contact that a recognizer
   * claims. Examples are a pan's drag and a press a group claims at its own
   * pointerdown. While the contact is down, the claiming recognizers'
   * elements refuse a new selection. The selection the page had at the press
   * is put back over anything that replaced it. That includes the press's own
   * collapse and a selection the drag made before its claim. The claiming
   * recognizer's element holds from its claim, in any state: a waiting
   * recognizer claims while possible, and a swipe claims as ended. The
   * participants that already recognize hold too. A claim given back to the
   * browser lets its hold go (releaseClaimedDrags). A drag that starts on
   * selectable text never gets here, because no recognizer claims it
   * (`selectingContacts`). A tap claims only at its lift, so a click keeps
   * the selection it made. A finger keeps the touch-down lock alone.
   */
  protected lockClaimedDrags(
    ids: ReadonlyArray<number>,
    claimer: GestureRecognizer,
  ): void {
    for (const id of ids) {
      if (this.claimHolds.has(id)) {
        continue
      }
      const touch = this.arena.touches.find(each => each.id === id)
      // A claim made at the contact's own lift (a tap's) holds nothing: the
      // drag is over, and a click keeps the selection it made. A wheel's
      // contact keeps the page's selection, as a scroll does.
      if (
        touch == null
        || touch.pointerType === 'touch'
        || touch.scrollType != null
        || touch.phase === 'ended'
        || touch.phase === 'cancelled'
      ) {
        continue
      }
      const elements = new Set<Element>()
      for (const recognizer of this.arena.participantsOf(id)) {
        if (
          (recognizer.state === 'began' || recognizer.state === 'changed')
          && (recognizer.view as Node | null)?.nodeType === 1
        ) {
          elements.add(recognizer.view as Element)
        }
      }
      if ((claimer.view as Node | null)?.nodeType === 1) {
        elements.add(claimer.view as Element)
      }
      if (elements.size === 0) {
        continue
      }
      const release = lockDragSelection(
        elements,
        this.doc.defaultView,
        this.pressSelections.get(id) ?? [],
        () => {
          this.dragHolds.delete(release)
        },
      )
      this.dragHolds.add(release)
      // A press lock the contact took at its press stays in `lockedBy`. The
      // hold sits beside it, and the contact's end releases both.
      if (!this.lockedBy.has(id)) {
        this.lockedBy.set(id, release)
      }
      this.claimHolds.set(id, release)
    }
  }

  /**
   * Claimed contacts the arena gave back. Their drag holds end at once, so
   * the browser's drag selects again. A contact's press lock (lockSelection)
   * is not a drag hold and stays.
   */
  protected releaseClaimedDrags(ids: ReadonlyArray<number>): void {
    for (const id of ids) {
      const release = this.claimHolds.get(id)
      if (release == null) {
        continue
      }
      this.claimHolds.delete(id)
      if (this.lockedBy.get(id) === release) {
        this.lockedBy.delete(id)
      }
      release({ isCancel: true })
    }
  }

  /**
   * At a mouse or pen press, mark one that lands on selectable text: once it
   * moves, it is the browser's drag, and selects text.
   * Text whose hold does something is locked at this press already
   * (lockSelection), so it is not selectable text.
   */
  protected noteSelectingPress(
    id: number,
    x: number,
    y: number,
    target: EventTarget | null,
  ): void {
    if (
      !this.lockedBy.has(id)
      && startsOnSelectableText(this.doc, x, y, target)
    ) {
      this.selectingContacts.add(id)
    }
  }

  /**
   * Undo a contact's selection locks, its press lock and its drag hold, at
   * once for a cancel, and forget its press's selection; idempotent. A
   * drag's hold keeps its last task after a lift (lockDragSelection).
   */
  protected unlockSelection(id: number, isCancel = false): void {
    const lock = this.lockedBy.get(id)
    lock?.({ isCancel })
    // A press lock keeps `lockedBy` when the contact also has a drag hold.
    // Release the hold too.
    const hold = this.claimHolds.get(id)
    if (hold != null && hold !== lock) {
      hold({ isCancel })
    }
    this.lockedBy.delete(id)
    this.claimHolds.delete(id)
    this.pressSelections.delete(id)
    this.selectingContacts.delete(id)
  }

  // --- Touch events ----------------------------------------------------------

  /**
   * Hold touches away from every participant while `gate(target)` answers
   * true. Returns the release. The input hold's held layers need no gate,
   * because the host asks `holdsTouch` for every touch.
   */
  addTouchGate(gate: (target: Node) => boolean): () => void {
    this.touchGates.add(gate)
    return () => {
      this.touchGates.delete(gate)
    }
  }

  /**
   * Internal. Whether a press consumer that keeps its press (a hold-repeat
   * control, `keepsTouch`) sits on the path from `target` up to `boundary`,
   * both included. Such a control keeps its long press its own. Its right
   * click and Shift+F10 still reach a context request around it
   * (contextRequest.ts).
   */
  keepsPressBetween(target: unknown, boundary: Element): boolean {
    for (
      let node: Node | null = target instanceof Node ? target : null;
      node != null;
      node = parentAcrossShadow(node)
    ) {
      if (!(node instanceof Element)) {
        continue
      }
      const consumer = this.registry.get(node)?.consumer
      if (consumer?.keepsTouch != null && consumer.isEnabled?.() !== false) {
        return true
      }
      if (node === boundary) {
        break
      }
    }
    return false
  }

  /**
   * How many fingers are on the screen: the length of `touches` in the last
   * touch event the host's listeners heard (`touchstart`, `touchmove`,
   * `touchend`, `touchcancel`), whatever its target, so a finger on an
   * element with no recognizer counts too. 0 before any, and while no
   * listener is installed. A recognizer that must not begin under a second
   * finger reads it in `shouldBegin`.
   */
  fingersDown(): number {
    return this.fingerTargets.length
  }

  /** Whether this event is new to the host (and mark it handled). */
  protected takeEvent(event: Event): boolean {
    if (this.processed.has(event)) {
      return false
    }
    this.processed.add(event)
    return true
  }
}
