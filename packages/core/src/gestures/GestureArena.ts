/**
 * @file GestureArena.ts
 * @input Touch input (began / moved / ended / cancelled / taken by the
 *   browser), each new touch with the recognizers on its hit path and the
 *   view-level consumer under it
 * @output Exports GestureArena (UIKit's gesture environment), its clock
 *   abstraction and the click disposition type
 * @position Pure coordinator of packages/core/src/gestures: no DOM. The DOM
 *   host (GestureHost.ts) feeds it real events and carries out what it
 *   decides; tests feed it synthetic streams with explicit timestamps.
 *
 * WHAT IT DECIDES, the way UIKit decides it:
 *
 * - Participation. A new touch is offered to every recognizer on its hit
 *   path, innermost first; each one that accepts it tracks it until it ends.
 * - Exclusivity. Two recognizers that share a touch are not active at once
 *   unless both allow it (`shouldRecognizeSimultaneously`, FR15). The first
 *   to recognize fails the other possible ones; a recognizer that tries to
 *   begin while a conflicting one is active fails instead.
 * - Failure requirements. A recognizer that requires another to fail waits
 *   (still `possible`) until that one fails, then recognizes; if that one
 *   recognizes, it fails. An idle recognizer holds nothing up.
 * - Delivery to the view. The touch's consumer (a pressable control) gets
 *   began / moved / ended unless a recognizer delays them
 *   (`delaysTouchesBegan`, `delaysTouchesEnded`) or recognizing cancels them
 *   (`cancelsTouchesInView`).
 * - The browser. A touch owned by a recognized gesture is CLAIMED: the host
 *   cancels the browser's pan and zoom for it. A touch whose gesture
 *   cancelled the view's touches has its click swallowed; a click held for a
 *   recognizer that may still recognize is DEFERRED, then replayed or dropped.
 *
 * TIME. Every input carries its timestamp, and timers are deadlines on that
 * same clock. Before an input is processed, every timer due at or before its
 * timestamp runs first, at its own deadline. A long press therefore begins at
 * exactly touch-down + 500 ms even when the main thread was blocked and the
 * timer callback came late, and a test drives the whole machine with explicit
 * timestamps and no real time at all.
 *
 * SYNC: When modified, update GestureRecognizer.ts and
 * __tests__/arena.test.ts.
 */

import type { ArenaBeganInput, ClickDisposition, TouchRecord } from './arenaTypes'
import type { GestureRecognizer } from './GestureRecognizer'
import type { GestureTouch, TouchBeganInput, TouchConsumer, TouchInput, TouchSample } from './types'
import { ArenaResolution } from './arenaResolution'
import { internals } from './recognizerInternals'

export { browserClock } from './arenaTypes'
export type {
  ArenaBeganInput,
  ClickDisposition,
  GestureArenaOptions,
  GestureClock,
} from './arenaTypes'

/**
 * The arena that decides which recognizer gets a touch.
 */
export class GestureArena extends ArenaResolution {
  /** Whether a recognizer owns this touch, so the browser must not pan or zoom it. */
  isClaimed(id: number): boolean {
    return this.records.get(id)?.isClaimed === true
  }

  /** Internal. The view-level consumer of this touch, if any. */
  consumerOf(id: number): TouchConsumer | null {
    return this.records.get(id)?.consumer ?? null
  }

  /** The live touch with this id. */
  getTouch(id: number): GestureTouch | undefined {
    return this.records.get(id)?.touch
  }

  /**
   * The recognizers that took touch `id` when it began: each was enabled,
   * accepted its pointer, and its `shouldReceiveTouch` agreed. Empty for a
   * touch the arena does not track.
   */
  participantsOf(id: number): ReadonlyArray<GestureRecognizer> {
    return this.records.get(id)?.participants ?? []
  }

  /** Every touch the arena tracks, lifted ones awaiting a decision included. */
  get touches(): ReadonlyArray<GestureTouch> {
    return [...this.records.values()].map(record => record.touch)
  }

  /** Recognizers taking part in the current interaction, in resolution order. */
  get involvedRecognizers(): ReadonlyArray<GestureRecognizer> {
    return this.active
  }

  // --- Input -----------------------------------------------------------------

  /** New contacts, each with the recognizers on its hit path. */
  began(inputs: ReadonlyArray<ArenaBeganInput>): void {
    if (inputs.length === 0) {
      return
    }
    this.run(inputs[0].time, () => {
      const newTouches = new Map<GestureRecognizer, GestureTouch[]>()
      const created: TouchRecord[] = []
      for (const input of inputs) {
        if (this.records.has(input.id)) {
          continue
        }
        const time = this.clampTime(input.time)
        const sample: TouchSample = { x: input.x, y: input.y, time }
        const touch: GestureTouch = {
          id: input.id,
          pointerType: input.pointerType,
          phase: 'began',
          x: input.x,
          y: input.y,
          time,
          startX: input.x,
          startY: input.y,
          startTime: time,
          samples: [...(input.history ?? []), sample],
          target: input.target,
          scroll: input.scroll ?? null,
          takenByBrowser: false,
          ...(input.scrollType == null ? {} : { scrollType: input.scrollType }),
        }
        const participants: GestureRecognizer[] = []
        for (const [depth, recognizer] of input.recognizers.entries()) {
          if (!internals(recognizer).wantsTouch(touch)) {
            continue
          }
          participants.push(recognizer)
          internals(recognizer).arena = this
          if (!this.active.includes(recognizer)) {
            // Resolution follows `active`, so a recognizer joins ahead of any
            // that sits further out on this touch's path: when two recognize
            // on the same event the innermost wins (FR15), whichever finger
            // brought the outer one in first.
            const outer = this.active.findIndex(
              other => input.recognizers.indexOf(other) > depth,
            )
            if (outer === -1) {
              this.active.push(recognizer)
            }
            else {
              this.active.splice(outer, 0, recognizer)
            }
          }
          const list = newTouches.get(recognizer) ?? []
          list.push(touch)
          newTouches.set(recognizer, list)
        }
        const record: TouchRecord = {
          touch,
          participants,
          consumer: input.consumer ?? null,
          view: 'none',
          isLifted: false,
          isClaimed: false,
          suppressClick: false,
          deferredClick: false,
        }
        this.records.set(input.id, record)
        created.push(record)
      }
      const context = this.context()
      for (const recognizer of [...this.active]) {
        const touches = newTouches.get(recognizer)
        if (touches != null) {
          internals(recognizer).deliverBegan(touches, context)
        }
      }
      // A recognizer already tracking a gesture hears of a touch that began
      // off its hit path (a second finger elsewhere on the page), which it
      // would otherwise never see.
      for (const recognizer of [...this.active]) {
        const own = newTouches.get(recognizer)
        const elsewhere = created
          .map(record => record.touch)
          .filter(touch => own == null || !own.includes(touch))
        if (elsewhere.length > 0 && recognizer.numberOfTouches > 0) {
          internals(recognizer).deliverBeganElsewhere(elsewhere, context)
        }
      }
      for (const record of created) {
        this.deliverViewBegan(record)
      }
    })
  }

  /**
   * A contact began where nothing takes part (plain page content). It is
   * never tracked and stays the browser's; recognizers already tracking a
   * gesture hear of it, as of any touch off their hit path.
   */
  untrackedBegan(input: TouchBeganInput): void {
    if (!this.active.some(recognizer => recognizer.numberOfTouches > 0)) {
      return
    }
    this.run(input.time, () => {
      const time = this.clampTime(input.time)
      const touch: GestureTouch = {
        id: input.id,
        pointerType: input.pointerType,
        phase: 'began',
        x: input.x,
        y: input.y,
        time,
        startX: input.x,
        startY: input.y,
        startTime: time,
        samples: [{ x: input.x, y: input.y, time }],
        target: input.target,
        scroll: input.scroll ?? null,
        takenByBrowser: false,
      }
      const context = this.context()
      for (const recognizer of [...this.active]) {
        if (recognizer.numberOfTouches > 0) {
          internals(recognizer).deliverBeganElsewhere([touch], context)
        }
      }
    })
  }

  /** Contacts moved. */
  moved(inputs: ReadonlyArray<TouchInput>): void {
    if (inputs.length === 0) {
      return
    }
    this.run(inputs[0].time, () => {
      const changed = this.update(inputs, 'moved')
      if (changed.length === 0) {
        return
      }
      const context = this.context()
      const previous = this.movingIds
      this.movingIds = new Set(changed.map(touch => touch.id))
      try {
        for (const recognizer of [...this.active]) {
          internals(recognizer).deliverMoved(changed, context)
        }
      }
      finally {
        this.movingIds = previous
      }
      for (const touch of changed) {
        const record = this.records.get(touch.id)
        if (record?.view === 'delivered') {
          record.consumer?.touchMoved(touch)
        }
      }
    })
  }

  /**
   * Contacts lifted. Returns, per touch, what the browser's click for it
   * should do.
   */
  ended(inputs: ReadonlyArray<TouchInput>): Map<number, ClickDisposition> {
    const dispositions = new Map<number, ClickDisposition>()
    if (inputs.length === 0) {
      return dispositions
    }
    this.run(inputs[0].time, () => {
      const changed = this.update(inputs, 'ended')
      const context = this.context()
      for (const recognizer of [...this.active]) {
        internals(recognizer).deliverEnded(changed, context)
      }
      // A lift can decide a waiting recognition (its requirement lifted
      // undecided and failed): settle those first, so each click's answer is
      // the final one, never a `defer` for a click already replayed (FR21).
      this.reviewPending()
      for (const touch of changed) {
        const record = this.records.get(touch.id)
        if (record == null) {
          continue
        }
        record.isLifted = true
        dispositions.set(touch.id, this.resolveEnd(record))
      }
    })
    return dispositions
  }

  /** The system took these contacts (`touchcancel`, a mouse `pointercancel`). */
  cancelled(ids: ReadonlyArray<number>, time: number): void {
    this.run(time, () => {
      const touches = this.liveTouches(ids)
      for (const touch of touches) {
        touch.phase = 'cancelled'
      }
      const context = this.context()
      for (const recognizer of [...this.active]) {
        internals(recognizer).deliverCancelled(touches, context)
      }
      for (const touch of touches) {
        const record = this.records.get(touch.id)
        if (record == null) {
          continue
        }
        record.isLifted = true
        record.suppressClick = true
        this.cancelView(record)
      }
    })
  }

  /**
   * The browser took these contacts for its own pan or zoom: their pointer
   * stream is gone (`pointercancel`) and no click will follow. Possible
   * recognizers sharing them fail and active ones are cancelled, as UIKit
   * fails everything a scroll view's pan beats, except a recognizer that
   * keeps observing the touch. Such a watcher never claims it: a drag the
   * browser took stays the browser's (FR14).
   */
  browserTookOver(ids: ReadonlyArray<number>, time: number): void {
    this.run(time, () => {
      const touches = this.liveTouches(ids).filter(
        touch => !touch.takenByBrowser,
      )
      if (touches.length === 0) {
        return
      }
      for (const touch of touches) {
        touch.takenByBrowser = true
      }
      const context = this.context()
      for (const recognizer of [...this.active]) {
        internals(recognizer).deliverTakenByBrowser(touches, context)
      }
      for (const touch of touches) {
        const record = this.records.get(touch.id)
        if (record == null) {
          continue
        }
        record.suppressClick = true
        this.cancelView(record)
      }
    })
  }
}
