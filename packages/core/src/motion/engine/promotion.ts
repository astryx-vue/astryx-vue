/**
 * @file promotion.ts
 * The `will-change` promotion while a channel moves, with the stylesheet
 * read and the demotion after it lingers.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionEngine } from './context'
import type { Channel } from './engineTypes'
import { PROMOTION_LINGER_MS } from './constants'
import { queueSheetRead } from './taskClock'

export function installPromotion(engine: MotionEngine): void {
  const { now, pendingGroups, promoted, promotionProperty, segments } = engine

  // -- promotion -------------------------------------------------------------

  /** Writes the promoted channels as will-change (or the pseudo's property). */
  engine.writePromotion = (element: HTMLElement) => {
    const list = [...promoted].join(', ')
    if (promotionProperty != null) {
      if (list === '') {
        element.style.removeProperty(promotionProperty)
      }
      else {
        element.style.setProperty(promotionProperty, list)
      }
      return
    }
    if (list === '') {
      element.style.willChange = engine.ownWillChange ?? ''
      engine.ownWillChange = null
      return
    }
    engine.ownWillChange ??= element.style.willChange
    // Without an inline value, the stylesheet's reasons stay alongside the
    // promotion's. They were read in the task after the element was attached.
    // A promotion that comes first (an element attached in this task that
    // moves at once) is written now. Its reasons join it once the callback's
    // microtasks run (queueSheetRead).
    if (engine.ownWillChange === '' && !engine.sheetWillChangeRead) {
      element.style.willChange = [...promoted].join(', ')
      engine.queueSheetReadFor(element)
      return
    }
    const base = engine.ownWillChange !== '' ? engine.ownWillChange : engine.sheetWillChange
    const own = base === 'auto' ? '' : base
    const reasons = own
      .split(',')
      .map(reason => reason.trim())
      .filter(reason => reason !== '' && !promoted.has(reason as Channel))
    element.style.willChange = [...reasons, ...promoted].join(', ')
  }

  /** Reads the element's own will-change while no promotion of ours is written. */
  engine.readSheetWillChange = (element: HTMLElement) => {
    engine.sheetWillChange
      = element.ownerDocument.defaultView
        ?.getComputedStyle(element)
        .getPropertyValue('will-change') ?? ''
    engine.sheetWillChangeRead = true
  }

  /** Joins the stylesheet's reasons to a promotion once the callback ends. */
  engine.queueSheetReadFor = (element: HTMLElement) => {
    if (engine.sheetReadQueuedFor === element) {
      return
    }
    engine.sheetReadQueuedFor = element
    // Still waiting: the same node, still promoted, with no inline reason.
    const waits = (): boolean =>
      engine.sheetReadQueuedFor === element
      && engine.target === element
      && promoted.size > 0
      && engine.ownWillChange === ''
    queueSheetRead({
      lift: () => {
        if (waits()) {
          element.style.willChange = ''
        }
      },
      read: () => {
        if (waits()) {
          engine.readSheetWillChange(element)
        }
      },
      write: () => {
        if (engine.sheetReadQueuedFor !== element) {
          return
        }
        engine.sheetReadQueuedFor = null
        if (engine.target === element && promoted.size > 0) {
          engine.writePromotion(element)
        }
      },
    })
  }

  /**
   * Reads sheetWillChange in a task of its own, so a later promotion reads no
   * style in its own task. Skipped while a promotion of ours is written,
   * which the read would see (demote asks again), and for a node out of the
   * document. A pseudo-element's promotion is its own property, with
   * nothing to read.
   */
  engine.readSheetWillChangeLater = () => {
    engine.cancelSheetWillChangeRead()
    engine.sheetWillChangeRead = false
    if (engine.target == null || promotionProperty != null) {
      return
    }
    const element = engine.target
    engine.sheetReadTimer = setTimeout(() => {
      engine.sheetReadTimer = null
      // A node out of the document has no style to read, and reading one
      // still costs a style pass: a shared animator (animatorFor) is never
      // detached, so its node can leave with this read waiting. Skipped, the
      // read waits for a promotion that needs it.
      if (engine.target === element && promoted.size === 0 && element.isConnected) {
        engine.readSheetWillChange(element)
      }
    }, 0)
  }

  engine.cancelSheetWillChangeRead = () => {
    if (engine.sheetReadTimer != null) {
      clearTimeout(engine.sheetReadTimer)
      engine.sheetReadTimer = null
    }
  }

  /**
   * Gives the element (or its pseudo-element) a compositing layer for
   * `channel` from the task that starts the motion: Mobile Safari runs an
   * animation whose start time is set from script on its compositor at its
   * first commit only if the element already has a layer.
   */
  engine.promote = (channel: Channel) => {
    if (engine.target == null) {
      return
    }
    if (!promoted.has(channel)) {
      promoted.add(channel)
      engine.writePromotion(engine.target)
    }
    engine.scheduleDemote()
  }

  /** Ends promotion PROMOTION_LINGER_MS after the last motion ends. */
  engine.scheduleDemote = () => {
    if (engine.demoteTimer != null) {
      clearTimeout(engine.demoteTimer)
    }
    let end = now()
    for (const segment of segments.values()) {
      end = Math.max(end, segment.start + segment.duration)
    }
    engine.demoteTimer = setTimeout(
      () => {
        engine.demoteTimer = null
        const time = now()
        const moving = [...segments.values()].some(
          segment => time < segment.start + segment.duration,
        )
        if (moving || pendingGroups.size > 0) {
          engine.scheduleDemote()
          return
        }
        engine.demote()
      },
      Math.max(0, end - now()) + PROMOTION_LINGER_MS,
    )
  }

  engine.demote = () => {
    if (engine.demoteTimer != null) {
      clearTimeout(engine.demoteTimer)
      engine.demoteTimer = null
    }
    if (promoted.size === 0) {
      return
    }
    promoted.clear()
    if (engine.target != null) {
      engine.writePromotion(engine.target)
      // Its stylesheet may have changed its will-change since.
      engine.readSheetWillChangeLater()
    }
  }
}
