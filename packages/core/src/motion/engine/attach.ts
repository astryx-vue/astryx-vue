/**
 * @file attach.ts
 * The animator's `reducedMotion` and `attach`.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionEngine } from './context'
import type { Channel } from './engineTypes'
import { CHANNELS, IDENTITY, PROPERTIES } from './constants'

export function installAttach(engine: MotionEngine): void {
  const { animator, heldForFrame, isCoarsePointer, landings, now, pseudoElement, restWaits, resting, retireFrames, retireLooks, retireTimers, running, segments } = engine

  animator.reducedMotion = (reducedOptions = {}) => {
    if (!engine.prefersReducedMotion()) {
      return 'off'
    }
    return isCoarsePointer() || reducedOptions.touchRelease === true
      ? 'crossfade'
      : 'instant'
  }

  animator.attach = (next) => {
    if (next === engine.target) {
      return
    }
    engine.flushDeferred()
    engine.present(false)
    // The next node never showed the old curves.
    engine.forgetShown()
    heldForFrame.clear()
    if (next == null) {
      // Unmount, unless a node replaces this one in the same task (React's
      // replacement order: attach(null), then the new node): nothing is
      // left to animate, so at the end of the task every other handle
      // settles as interrupted, every atRest() wait settles and no
      // completion timer outlives the element, as in dispose()
      // (architecture:react-component-runtime INV5). A replacement keeps
      // them all: the motion goes on on the new node.
      engine.lastDetached = engine.target
      if (!engine.unmountQueued) {
        engine.unmountQueued = true
        queueMicrotask(() => {
          if (!engine.unmountQueued) {
            return
          }
          engine.unmountQueued = false
          // A Reduce Motion move still waiting lands where it was going, as
          // in dispose(), on the node just detached too: a dip's fade out
          // left its low opacity inline there, so a later attach of that
          // node (a Suspense or Activity reveal) shows it landed and
          // visible. Its calls settle as interrupted.
          engine.onLastDetached(() => {
            engine.landPending(false)
            // The landing's commit rebuilt every channel it touched on the
            // detached node, any axis still moving included: leave that
            // node with no animation, timer or promotion.
            for (const animation of running.values()) {
              animation.cancel()
            }
            running.clear()
            for (const timer of retireTimers.values()) {
              clearTimeout(timer)
            }
            retireTimers.clear()
            for (const timer of retireLooks.values()) {
              clearTimeout(timer)
            }
            retireLooks.clear()
            retireFrames.clear()
            engine.demote()
            // demote() asks for a fresh will-change read of the node it
            // demotes; a detached node gets none.
            engine.cancelSheetWillChangeRead()
          })
          engine.lastDetached = null
          const time = now()
          for (const property of PROPERTIES) {
            engine.interrupt(property, time)
          }
          for (const wait of [...restWaits]) {
            wait.settle()
          }
        })
      }
    }
    else {
      // A node in place of the one just detached: no unmount.
      engine.unmountQueued = false
      engine.lastDetached = null
    }
    // After the landing's commit, which can promote the element again.
    engine.demote()
    // A pseudo-element holds an identity with a static animation, which the
    // cancel below drops: note the channels to hold again on the next node
    // (never a borrowed opacity, which is the stylesheet's).
    const isOpacityBorrowed
      = engine.borrowedOpacity != null
        || [...landings].some(landing => landing.restoreIsBorrowed === true)
    const pseudoHeld
      = pseudoElement == null || engine.target == null
        ? null
        : new Set(
            (Object.keys(CHANNELS) as Channel[]).filter(
              channel =>
                running.has(channel)
                && !(channel === 'opacity' && isOpacityBorrowed)
                && CHANNELS[channel].every(
                  p => !segments.has(p) && resting[p] === IDENTITY[p],
                ),
            ),
          )
    for (const animation of running.values()) {
      animation.cancel()
    }
    running.clear()
    for (const timer of retireTimers.values()) {
      clearTimeout(timer)
    }
    retireTimers.clear()
    for (const timer of retireLooks.values()) {
      clearTimeout(timer)
    }
    retireLooks.clear()
    retireFrames.clear()
    if (isOpacityBorrowed) {
      // A running borrowed dip (or an exit by role returning to the
      // stylesheet) stays in the model through any attach, so a pending
      // move still lands while the element is invisible; only the
      // outgoing element gets its stylesheet's opacity back.
      engine.releaseOwnOpacity()
    }
    // Identities the outgoing node holds inline over a stylesheet that
    // differs, kept through a detach for the node that comes next.
    if (engine.target != null) {
      const outgoing = engine.target
      engine.heldIdentity
        = pseudoHeld
          ?? new Set(
            (Object.keys(CHANNELS) as Channel[]).filter(
              channel =>
                outgoing.style.getPropertyValue(engine.cssName(channel))
                === engine.identityOf(channel),
            ),
          )
    }
    const held = engine.heldIdentity
    engine.target = next
    // A new node: its own will-change is read again.
    engine.cancelSheetWillChangeRead()
    engine.sheetWillChangeRead = false
    if (engine.target == null) {
      return
    }
    engine.heldIdentity = new Set()
    const time = now()
    // A borrowed dip that ended while detached hands the opacity back
    // instead of writing the borrowed value inline.
    const dip = segments.get('opacity')
    if (
      engine.borrowedOpacity != null
      && (dip == null || time >= dip.start + dip.duration)
    ) {
      engine.borrowedOpacity = null
      segments.delete('opacity')
      resting.opacity = IDENTITY.opacity
    }
    for (const channel of Object.keys(CHANNELS) as Channel[]) {
      const properties = CHANNELS[channel]
      const isDefault = properties.every(
        p => !segments.has(p) && resting[p] === IDENTITY[p],
      )
      if (!isDefault) {
        engine.rebuild(channel, time)
      }
      else if (held.has(channel)) {
        // An identity the animator held inline over a stylesheet that
        // differs goes onto the new node too (writeInline keeps it only
        // where the new node's stylesheet still differs); a pseudo-element's
        // is held again.
        if (pseudoElement != null) {
          engine.hold(channel, time)
        }
        else {
          engine.writeInline(channel, property => resting[property])
        }
      }
    }
    engine.flushReleases()
    engine.readSheetWillChangeLater()
  }
}
