/**
 * @file arenaDelivery.ts
 * @input The arena's touch records
 * @output ArenaDelivery: what reaches the view-level consumer (began, held,
 *   ended, cancelled) and what the browser's click after a lift does
 * @position The middle layer of GestureArena.ts
 */

import type { ClickDisposition, TouchRecord } from './arenaTypes'
import type { GestureRecognizer } from './GestureRecognizer'
import type { GestureEventContext, GestureTouch, TouchInput } from './types'
import { ArenaScheduler } from './arenaScheduler'
import { internals } from './recognizerInternals'

/** Delivery to the view and click dispositions; GestureArena is the class to use. */
export abstract class ArenaDelivery extends ArenaScheduler {
  /** Internal. A recognizer takes its touches from the view, unclaimed. */
  cancelTouchesInViewOf(recognizer: GestureRecognizer): void {
    this.cancelViewTouchesOf(recognizer)
  }

  // --- View delivery ---------------------------------------------------------

  protected deliverViewBegan(record: TouchRecord): void {
    if (record.consumer == null || record.view !== 'none') {
      return
    }
    if (record.suppressClick) {
      record.view = 'done'
      return
    }
    if (this.beginDelayers(record)) {
      record.view = 'held'
      return
    }
    record.view = 'delivered'
    record.consumer.touchBegan(record.touch)
  }

  /** What a lifted touch's view and click get, decided at the lift. */
  protected resolveEnd(record: TouchRecord): ClickDisposition {
    if (record.suppressClick) {
      return 'suppress'
    }
    const isHeld = this.endDelayers(record)
    switch (record.view) {
      case 'delivered':
        if (isHeld) {
          record.view = 'endHeld'
          record.deferredClick = true
          return 'defer'
        }
        record.view = 'done'
        record.consumer?.touchEnded(record.touch)
        return 'allow'
      case 'held':
        if (!this.beginDelayers(record)) {
          // The recognizer that held the view finished on this lift: the
          // view gets the whole touch now and the click goes with it, not a
          // `defer` for a click already released.
          record.view = 'delivered'
          record.consumer?.touchBegan(record.touch)
          return this.resolveEnd(record)
        }
        record.deferredClick = true
        return 'defer'
      case 'none':
      case 'endHeld':
      case 'done':
        if (isHeld) {
          record.deferredClick = true
          return 'defer'
        }
        return 'allow'
    }
  }

  /** Release whatever no recognizer is holding any more. */
  protected reviewHeld(): void {
    for (const record of this.records.values()) {
      if (record.view === 'held' && !this.beginDelayers(record)) {
        if (record.suppressClick) {
          record.view = 'done'
        }
        else {
          record.view = 'delivered'
          record.consumer?.touchBegan(record.touch)
          if (record.isLifted && !this.endDelayers(record)) {
            record.view = 'done'
            record.consumer?.touchEnded(record.touch)
          }
          else if (record.isLifted) {
            record.view = 'endHeld'
          }
        }
      }
      if (record.view === 'endHeld' && !this.endDelayers(record)) {
        record.view = 'done'
        if (record.suppressClick) {
          record.consumer?.touchCancelled(record.touch)
        }
        else {
          record.consumer?.touchEnded(record.touch)
        }
      }
      if (
        record.deferredClick
        && record.view !== 'held'
        && record.view !== 'endHeld'
        && !this.endDelayers(record)
      ) {
        record.deferredClick = false
        this.options.onDeferredClick?.(record.touch, !record.suppressClick)
      }
    }
  }

  protected beginDelayers(record: TouchRecord): boolean {
    return record.participants.some(
      recognizer =>
        recognizer.delaysTouchesBegan
        && recognizer.state === 'possible'
        && recognizer.isInvolved()
        && internals(recognizer).seenTouchIds.has(record.touch.id),
    )
  }

  protected endDelayers(record: TouchRecord): boolean {
    return record.participants.some(
      recognizer =>
        recognizer.delaysTouchesEnded
        && recognizer.state === 'possible'
        && recognizer.isInvolved()
        && internals(recognizer).seenTouchIds.has(record.touch.id),
    )
  }

  protected cancelViewTouchesOf(recognizer: GestureRecognizer): void {
    for (const id of internals(recognizer).seenTouchIds) {
      const record = this.records.get(id)
      if (record == null) {
        continue
      }
      record.suppressClick = true
      this.cancelView(record)
    }
  }

  protected cancelView(record: TouchRecord): void {
    if (record.view === 'delivered' || record.view === 'endHeld') {
      record.consumer?.touchCancelled(record.touch)
    }
    if (record.view !== 'none' || record.consumer != null) {
      record.view = 'done'
    }
  }

  // --- Plumbing --------------------------------------------------------------

  protected context(): GestureEventContext {
    return {
      time: this.now(),
      allTouches: [...this.records.values()]
        .filter(record => !record.isLifted)
        .map(record => record.touch),
    }
  }

  protected liveTouches(ids: ReadonlyArray<number>): GestureTouch[] {
    const touches: GestureTouch[] = []
    for (const id of ids) {
      const record = this.records.get(id)
      if (record != null && !record.isLifted) {
        touches.push(record.touch)
      }
    }
    return touches
  }

  protected update(
    inputs: ReadonlyArray<TouchInput>,
    phase: 'moved' | 'ended',
  ): GestureTouch[] {
    const changed: GestureTouch[] = []
    for (const input of inputs) {
      const record = this.records.get(input.id)
      if (record == null || record.isLifted) {
        continue
      }
      const time = this.clampTime(input.time)
      const touch = record.touch
      const history = (input.history ?? []).filter(
        sample => sample.time > touch.time && sample.time < time,
      )
      touch.samples = [...history, { x: input.x, y: input.y, time }]
      touch.x = input.x
      touch.y = input.y
      touch.time = time
      touch.phase = phase
      changed.push(touch)
    }
    return changed
  }
}
