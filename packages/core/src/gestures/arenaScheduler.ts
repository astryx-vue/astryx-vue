/**
 * @file arenaScheduler.ts
 * @input The arena's options and clock
 * @output ArenaScheduler, the arena's state and its event clock: deadlines,
 *   the single real timer, and the run loop that fires due timers before an
 *   input
 * @position The base layer of GestureArena.ts
 */

import type { GestureArenaOptions, GestureClock, Timer, TouchRecord } from './arenaTypes'
import type { GestureRecognizer } from './GestureRecognizer'
import type { GestureEnvironment } from './types'
import {
  browserClock,

} from './arenaTypes'
import { DEFAULT_ENVIRONMENT } from './types'

/** The arena's state and clock; GestureArena is the class to use. */
export abstract class ArenaScheduler {
  /** Resolves what the latest input or timer decided. */
  protected abstract settle(): void
  /** A recognizer's place in resolution order. */
  protected abstract rank(recognizer: GestureRecognizer): number

  readonly environment: GestureEnvironment
  protected readonly clock: GestureClock
  protected readonly options: GestureArenaOptions
  /** The touches whose move the arena is delivering right now. */
  protected movingIds: ReadonlySet<number> = new Set()
  protected readonly records = new Map<number, TouchRecord>()
  /** Recognizers involved in the current interaction, in resolution order. */
  protected active: GestureRecognizer[] = []
  protected readonly timers = new Map<GestureRecognizer, Timer>()
  protected realTimer: unknown = null
  protected realTimerDeadline = Number.POSITIVE_INFINITY
  /** The time of the event or timer being processed; null between them. */
  protected currentTime: number | null = null
  /** The latest time processed: input never moves the clock backwards. */
  protected latestTime = Number.NEGATIVE_INFINITY
  protected depth = 0
  /** Open `deferResolution` calls: what their stops unblock waits. */
  protected deferDepth = 0
  /** A deferred stop left a resolution for the next pass. */
  protected owesResolution = false

  constructor(options: GestureArenaOptions = {}) {
    this.options = options
    this.clock = options.clock ?? browserClock
    this.environment = options.environment ?? DEFAULT_ENVIRONMENT
  }

  // --- Queries ---------------------------------------------------------------

  /** The current time on the event clock. */
  now(): number {
    return this.currentTime ?? Math.max(this.latestTime, this.clock.now())
  }

  /** Run every timer due at or before `time` (the host's timer and tests). */
  advanceTime(time: number): void {
    this.run(time, () => {})
  }

  /** Internal. Arm a recognizer's one timer at an absolute deadline. */
  setTimer(
    recognizer: GestureRecognizer,
    deadline: number,
    callback: () => void,
  ): void {
    this.timers.set(recognizer, { deadline, callback })
    this.scheduleRealTimer()
  }

  /** Internal. */
  clearTimer(recognizer: GestureRecognizer): void {
    if (this.timers.delete(recognizer)) {
      this.scheduleRealTimer()
    }
  }

  /**
   * Runs `body`, code outside input that stops recognizers (an Effect that
   * turns one off or detaches it), without resolving what those stops
   * unblock: the recognitions waiting on them, the touches they held from
   * a view, the resets. A pass a microtask later resolves all of it, at the
   * last event's time, so the listeners and consumers it reaches hear it
   * outside the caller's frame and read the recognized state
   * (react-component-runtime INV2).
   */
  deferResolution(body: () => void): void {
    this.deferDepth += 1
    try {
      body()
    }
    finally {
      this.deferDepth -= 1
    }
    if (this.deferDepth === 0 && this.owesResolution) {
      queueMicrotask(() => {
        if (this.owesResolution && this.deferDepth === 0) {
          this.run(this.lastEventTime(), () => {})
        }
      })
    }
  }

  /** The last event's time, or now before any event. */
  protected lastEventTime(): number {
    return Number.isFinite(this.latestTime)
      ? this.latestTime
      : this.clock.now()
  }

  protected clampTime(time: number): number {
    const clamped = Math.max(time, this.latestTime)
    this.latestTime = clamped
    return clamped
  }

  /**
   * One external entry: run the timers due by `time`, then `body`, then
   * settle (release held deliveries, reset finished recognizers, forget
   * finished touches). Re-entrant calls (a listener feeding input) run
   * inline and settle with the outermost one.
   */
  protected run(time: number, body: () => void): void {
    this.depth += 1
    try {
      if (this.depth === 1 && this.deferDepth === 0 && this.owesResolution) {
        // A deferred stop resolves before anything newer: input that comes
        // ahead of its microtask (a nested dispatch) sees settled state.
        this.owesResolution = false
        this.currentTime = this.clampTime(this.lastEventTime())
        this.settle()
      }
      this.flushTimers(time)
      this.currentTime = this.clampTime(time)
      body()
      // Re-entrant calls settle with the outermost one: settling mid-delivery
      // would reset recognizers that have not heard the event yet. Inside
      // `deferResolution`, the next pass settles.
      if (this.depth === 1) {
        if (this.deferDepth > 0) {
          this.owesResolution = true
        }
        else {
          this.owesResolution = false
          this.settle()
        }
      }
    }
    finally {
      this.depth -= 1
      if (this.depth === 0) {
        this.currentTime = null
      }
    }
  }

  protected flushTimers(upTo: number): void {
    for (;;) {
      let due: [GestureRecognizer, Timer] | null = null
      for (const entry of this.timers) {
        if (
          entry[1].deadline <= upTo
          && (due == null
            || entry[1].deadline < due[1].deadline
            // Same instant: the innermost (earlier in `active`) goes first,
            // as FR15's innermost rule decides a tie on one event.
            || (entry[1].deadline === due[1].deadline
              && this.rank(entry[0]) < this.rank(due[0])))
        ) {
          due = entry
        }
      }
      if (due == null) {
        break
      }
      const [recognizer, timer] = due
      this.timers.delete(recognizer)
      this.currentTime = this.clampTime(timer.deadline)
      timer.callback()
      // Inside a re-entrant entry the outermost call settles (see run()).
      if (this.depth <= 1) {
        this.settle()
      }
    }
    this.scheduleRealTimer()
  }

  protected scheduleRealTimer(): void {
    let earliest = Number.POSITIVE_INFINITY
    for (const timer of this.timers.values()) {
      earliest = Math.min(earliest, timer.deadline)
    }
    if (earliest === this.realTimerDeadline) {
      return
    }
    if (this.realTimer != null) {
      this.clock.clearTimeout(this.realTimer)
      this.realTimer = null
    }
    this.realTimerDeadline = earliest
    if (earliest === Number.POSITIVE_INFINITY) {
      return
    }
    const delay = Math.max(0, earliest - this.clock.now())
    const fire = (mayYield: boolean): void => {
      this.realTimer = null
      this.realTimerDeadline = Number.POSITIVE_INFINITY
      if (mayYield && this.clock.now() > earliest) {
        // Late: a long task held the main thread past the deadline, and
        // input queued behind it may come before the deadline (a lift that
        // fails a long press). Let that input dispatch first, once.
        this.realTimerDeadline = earliest
        this.realTimer = this.clock.setTimeout(() => fire(false), 0)
        return
      }
      // The event clock moves to the deadline only, so input still queued
      // keeps its own timestamps.
      this.advanceTime(earliest)
    }
    this.realTimer = this.clock.setTimeout(() => fire(true), delay)
  }
}
