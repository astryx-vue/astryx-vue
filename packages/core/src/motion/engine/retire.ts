/**
 * @file retire.ts
 * Retires finished animations into end holds, and the opacity borrow,
 * pending landings and identity releases around it.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { Channel } from './engineTypes'
import { END_HOLD_MS, END_RECHECK_MS, IDENTITY, RETIRE_RECHECK_MS } from './constants'
import { isIdentityText } from './cssValues'

export function installRetire(engine: MotionEngine): void {
  const { carriedOwners, heldForFrame, landings, now, pendingGroups, pseudoElement, releasing, requestFrame, resting, retireFrames, retireLooks, retireTimers, running, segments } = engine

  /**
   * Once the main thread runs after the curve's end, the animation leaves the
   * running state: an element's end values are written inline in the task
   * that cancels it; a pseudo-element's end value moves to a static holding
   * animation, created before the long one goes.
   *
   * Why a timer at the curve's end: no browser event reports that an
   * animation's time has reached a point inside its effect, and its
   * `finished` comes only after the END_HOLD_MS tail, which would keep the
   * element promoted and the animation alive for a minute. The timer is set
   * on the curve's own clock and re-armed while a sampler pauses or seeks the
   * animation, so it never retires a held one.
   */
  engine.scheduleRetire = (
    channel: Channel,
    animation: Animation,
    end: number,
  ) => {
    clearTimeout(retireTimers.get(channel))
    retireTimers.delete(channel)
    clearTimeout(retireLooks.get(channel))
    retireLooks.delete(channel)
    // Looks for the end in the next frame, before it paints: the frame whose
    // time reaches the curve's end retires it there, where a timer could land
    // between two frames under load and leave it on the element a frame or two
    // past its curve. The timers stay, for a page that draws no frames (a
    // hidden tab).
    const lookAtFrame = (): void => {
      if (requestFrame == null || retireFrames.has(animation)) {
        return
      }
      retireFrames.add(animation)
      requestFrame(() => {
        retireFrames.delete(animation)
        // eslint-disable-next-line ts/no-use-before-define -- 只在帧回调里调用，那时 retire 已经定义
        retire(true)
      })
    }
    // `atFrame`: a look from a frame callback, which leaves a pending timer
    // where it is.
    const retire = (atFrame = false): void => {
      if (!atFrame) {
        retireTimers.delete(channel)
      }
      if (running.get(channel) !== animation) {
        return
      }
      // The old curve plays on until the frame that commits the call
      // (lookAtShown).
      if (heldForFrame.has(channel)) {
        if (!retireTimers.has(channel)) {
          retireTimers.set(channel, setTimeout(retire, END_RECHECK_MS))
        }
        return
      }
      // Paused or sought (a sampler holding it): retire when its own time
      // reaches the curve's end, never from the wall clock.
      const remaining = engine.remainingCurve(animation)
      if (atFrame && remaining == null) {
        // Its time cannot be read: the timer decides.
        return
      }
      if (remaining != null && remaining > 0) {
        const paused = animation.playState === 'paused'
        // A frame look keeps looking while up to two frames remain: the frame
        // it ran in can be dated before the timer that started the looks was
        // due, and the frame after it is the one that reaches the end.
        if (!paused && remaining <= (atFrame ? 2 : 1) * END_RECHECK_MS) {
          lookAtFrame()
        }
        if (!retireTimers.has(channel)) {
          retireTimers.set(
            channel,
            setTimeout(
              retire,
              paused ? RETIRE_RECHECK_MS : Math.max(remaining, END_RECHECK_MS),
            ),
          )
        }
        return
      }
      clearTimeout(retireTimers.get(channel))
      retireTimers.delete(channel)
      running.delete(channel)
      if (channel === 'translate') {
        engine.present(false)
      }
      // A pseudo-element holds its resting value, unless the stylesheet
      // takes it back now (a borrowed dip that has ended).
      const handsBack
        = channel === 'opacity'
          && engine.borrowedOpacity != null
          && ![...landings].some(landing => landing.fadeIn?.isBorrowed === true)
      if (pseudoElement != null && !handsBack) {
        engine.hold(channel, now())
      }
      else {
        // The end goes inline in the task that cancels the animation. Whether
        // an identity end may leave the element is judged after the cancel:
        // until then the end-state tail still holds the end, so the computed
        // style would hide a stylesheet value (an opacity 0) under it.
        engine.writeInline(channel, engine.finalValue, false)
      }
      // A call from rest the browser never started (finished from outside
      // before its first frame, a sampler's finish()): read its start from the
      // animation before the cancel takes it, and with nothing left to wait
      // on the call keeps its own clock, so its landing is still armed.
      const waiting = [...pendingGroups].filter(group =>
        group.animations.includes(animation),
      )
      for (const group of waiting) {
        engine.syncGroup(group)
      }
      animation.cancel()
      for (const group of waiting) {
        engine.resolveGroup(group, group.provisional)
      }
      engine.releaseIdentity(channel)
      engine.flushReleases()
    }
    retireTimers.set(channel, setTimeout(retire, Math.max(0, end - now())))
    if (requestFrame != null) {
      // Frames start looking a frame before the end, so the frame that
      // reaches it retires it even when the timer above runs late.
      retireLooks.set(
        channel,
        setTimeout(
          () => {
            retireLooks.delete(channel)
            lookAtFrame()
          },
          Math.max(0, end - now() - END_RECHECK_MS),
        ),
      )
    }
  }

  /** The element's own (stylesheet) opacity, read once when a dip starts. */
  engine.ownOpacity = (): number => {
    const view = engine.target?.ownerDocument.defaultView
    const value
      = engine.target == null
        ? NaN
        : Number.parseFloat(
            view
              ?.getComputedStyle(engine.target, pseudoElement ?? null)
              .getPropertyValue('opacity') ?? '',
          )
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 1
  }

  /**
   * Whether the animator holds an opacity of its own on the element: an inline
   * value it wrote, or a pseudo-element's holding animation (a `set` over a
   * stylesheet that hides or dims it). A dip returns to that value.
   */
  engine.writesOwnOpacity = (): boolean =>
    pseudoElement == null
      ? (engine.target?.style.getPropertyValue('opacity') ?? '') !== ''
      : running.has('opacity')

  /**
   * Gives the element's opacity back to its stylesheet: an element's inline
   * value goes; a pseudo-element, which has no inline style, loses the
   * animation holding its value.
   */
  engine.releaseOwnOpacity = () => {
    if (pseudoElement == null) {
      engine.target?.style.removeProperty('opacity')
      return
    }
    const held = running.get('opacity')
    running.delete('opacity')
    held?.cancel()
  }

  /**
   * Lands every Reduce Motion move still waiting, at once, on the current
   * element: its travel, and the opacity its fade was heading to (the
   * stylesheet's again for a borrowed one). Its calls settle `finished`.
   */
  engine.landPending = (finished: boolean) => {
    if (landings.size === 0) {
      return
    }
    const changed = new Set<MotionProperty>()
    let handedBack = false
    for (const landing of [...landings]) {
      engine.endLanding(landing)
      for (const [property, value] of landing.values) {
        segments.delete(property)
        resting[property] = value
        changed.add(property)
      }
      if (landing.fadeIn != null || landing.restore != null) {
        const borrowed
          = landing.fadeIn?.isBorrowed === true
            || landing.restoreIsBorrowed === true
        segments.delete('opacity')
        resting.opacity = borrowed
          ? IDENTITY.opacity
          : (landing.fadeIn?.to ?? landing.restore ?? IDENTITY.opacity)
        changed.add('opacity')
        if (borrowed) {
          engine.borrowedOpacity = null
          handedBack = true
        }
      }
      for (const owner of [landing.owner, ...landing.carried]) {
        carriedOwners.delete(owner)
        if (!owner.settled) {
          engine.settle(owner, finished)
        }
      }
    }
    engine.commit(changed, now())
    if (handedBack) {
      // The stylesheet owns its opacity again: no value stays inline.
      engine.releaseOwnOpacity()
    }
  }

  /**
   * Ends a borrowed dip on the element it ran on: the stylesheet owns its
   * opacity again (an unmount or a new element never keeps the borrow).
   */
  engine.handBackBorrow = () => {
    if (engine.borrowedOpacity == null) {
      return
    }
    engine.borrowedOpacity = null
    segments.delete('opacity')
    resting.opacity = IDENTITY.opacity
    engine.releaseOwnOpacity()
  }

  /**
   * A channel at identity with no animation of its own leaves the element:
   * its inline value is removed, unless the stylesheet would then move the
   * element, in which case the identity stays inline. Runs when such a value
   * is written and again when a motion ends.
   */
  engine.releaseIdentity = (channel: Channel) => {
    if (engine.target == null || running.has(channel)) {
      return
    }
    if (channel === 'opacity' && engine.borrowedOpacity != null) {
      if ([...landings].some(landing => landing.fadeIn?.isBorrowed === true)) {
        // At the bottom of the dip, before it lands and fades back in.
        return
      }
      // A dip on the stylesheet's opacity ended: the stylesheet owns it again.
      engine.borrowedOpacity = null
      segments.delete('opacity')
      resting.opacity = IDENTITY.opacity
      engine.releaseOwnOpacity()
      return
    }
    if (pseudoElement != null) {
      return
    }
    if (
      engine.target.style.getPropertyValue(engine.cssName(channel)) !== engine.identityOf(channel)
    ) {
      return
    }
    // Read with every other channel the same commit leaves at identity: one
    // style read for the element, not one per channel (flushReleases).
    releasing.add(channel)
    if (!engine.releaseQueued) {
      engine.releaseQueued = true
      queueMicrotask(engine.flushReleases)
    }
  }

  /**
   * Removes the identity values written since the last flush, reads the
   * stylesheet once for all of them, and puts back the ones it would move:
   * a single forced style read per element and commit, where a read per
   * channel used to force one each.
   */
  engine.flushReleases = () => {
    engine.releaseQueued = false
    const element = engine.target
    const channels = [...releasing].filter(
      channel =>
        !running.has(channel)
        && element?.style.getPropertyValue(engine.cssName(channel))
        === engine.identityOf(channel),
    )
    releasing.clear()
    if (element == null || channels.length === 0) {
      return
    }
    for (const channel of channels) {
      element.style.removeProperty(engine.cssName(channel))
    }
    const style = element.ownerDocument.defaultView?.getComputedStyle(element)
    for (const channel of channels) {
      const underneath = style?.getPropertyValue(engine.cssName(channel))
      if (underneath != null && !isIdentityText(channel, underneath)) {
        element.style.setProperty(engine.cssName(channel), engine.identityOf(channel))
      }
    }
  }

  /**
   * Curve time an animation still has to play on its own clock (its keyframes
   * hold the end for END_HOLD_MS after the curve), or null where the engine
   * does not report it; a paused animation always has some left.
   */
  engine.remainingCurve = (animation: Animation): number | null => {
    const timing = animation.effect?.getTiming?.()
    const current = animation.currentTime
    if (timing == null || current == null) {
      return animation.playState === 'paused' ? Infinity : null
    }
    const left = Number(timing.duration) - END_HOLD_MS - Number(current)
    return animation.playState === 'paused' ? Math.max(left, 1) : left
  }
}
