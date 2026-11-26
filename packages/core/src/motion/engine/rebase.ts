/**
 * @file rebase.ts
 * The animator's `rebase`, `atRest` and `dispose`.
 * @position Internal to motion/engine; split from upstream motion/animator.ts
 */

import type { MotionProperty } from '../types'
import type { MotionEngine } from './context'
import type { HandleState, RestWait, Segment } from './engineTypes'
import { solveSpring, toSpring } from '../spring'
import { SETTLE_THRESHOLD } from '../types'
import { CHANNEL_OF, MAX_DURATION_MS, PROPERTIES, SAME_VALUE } from './constants'
import { expand, expandList } from './cssValues'

export function installRebase(engine: MotionEngine): void {
  const { animator, heldForFrame, landings, now, restWaits, resting, retireFrames, retireLooks, retireTimers, running, segments, shown, stale } = engine

  animator.rebase = (deltas, rebaseOptions = {}) => {
    engine.syncPending()
    engine.flushDeferred()
    const time = rebaseOptions.at ?? now()
    const towards = expand(rebaseOptions.towards ?? {})
    const changed: MotionProperty[] = []
    const owners = new Set<HandleState>()
    for (const [property, delta] of Object.entries(expand(deltas)) as [
      MotionProperty,
      number,
    ][]) {
      if (delta === 0) {
        continue
      }
      const noted = shown.get(property)
      if (noted != null) {
        noted.offset += delta
      }
      const segment = engine.segmentAt(property, time)
      if (segment == null) {
        changed.push(property)
        resting[property] = engine.valueAt(property, time) + delta
        segments.delete(property)
        continue
      }
      owners.add(segment.owner)
      // A curve still waiting for the browser's start stays in its call:
      // it starts with that call's commit. A curve whose call had its first
      // frame is on screen already, so it leaves the call (leaveWaitingCall).
      const latest = engine.shownSince(property, segment)
      const group
        = latest == null && segment.group != null && !segment.group.resolved
          ? segment.group
          : undefined
      const replace = (next: Segment): void => {
        if (group != null) {
          engine.replaceIn(group, segment, next)
        }
        segments.set(property, next)
      }
      const heading = towards[property]
      if (
        segment.spring != null
        && heading != null
        && Math.abs(segment.target + delta - heading) <= SAME_VALUE
      ) {
        // The spring keeps its course to the shifted target from its own
        // start.
        const whole: Segment = {
          ...segment,
          target: heading,
          at: t => segment.at(t) + delta,
        }
        if (latest == null) {
          changed.push(property)
          replace(whole)
          continue
        }
        // While the browser has not told the start, only the model moves.
        // The call that follows rebuilds the channel from it, or else the
        // end of the task does.
        const waiting = segment.group
        if (waiting != null && !waiting.resolved) {
          engine.replaceIn(waiting, segment, whole)
          segments.set(property, whole)
          engine.markStale(CHANNEL_OF[property])
          continue
        }
      }
      changed.push(property)
      if (segment.spring != null) {
        const from = engine.valueAt(property, time) + delta
        const velocity = engine.velocityAt(property, time)
        if (latest != null) {
          engine.leaveWaitingCall(segment, CHANNEL_OF[property], latest)
        }
        const curve = solveSpring(toSpring(segment.spring), {
          from,
          to: segment.target,
          velocity,
        })
        replace({
          start: group?.provisional ?? time,
          ...(group != null ? { group } : {}),
          duration: Math.min(
            MAX_DURATION_MS,
            curve.settleTime(SETTLE_THRESHOLD[property]) * 1000,
          ),
          target: segment.target,
          at: t => curve.value(t / 1000),
          speed: t => curve.velocity(t / 1000),
          jumps: [],
          owner: segment.owner,
          spring: segment.spring,
        })
      }
      else {
        if (latest != null) {
          engine.leaveWaitingCall(segment, CHANNEL_OF[property], latest)
        }
        replace({
          ...segment,
          source: undefined,
          target: segment.target + delta,
          at: t => segment.at(t) + delta,
        })
      }
    }
    // A waiting channel shows its old curve, moved with the element, until
    // the frame that commits its call.
    engine.commit(
      changed.filter(property => !heldForFrame.has(CHANNEL_OF[property])),
      time,
    )
    for (const channel of new Set(changed.map(p => CHANNEL_OF[p]))) {
      if (heldForFrame.has(channel)) {
        engine.rebuildShown(channel, time)
      }
    }
    // The handles that own the rebased curves finish at their new ends.
    for (const owner of owners) {
      if (owner.settled || owner.timer == null) {
        continue
      }
      clearTimeout(owner.timer)
      let end = time
      for (const segment of segments.values()) {
        if (segment.owner === owner) {
          end = Math.max(end, segment.start + segment.duration)
        }
      }
      owner.timer = setTimeout(
        () => engine.settleAtEnd(owner),
        Math.max(0, end - now()),
      )
    }
  }

  animator.atRest = async (properties) => {
    const list = properties == null ? PROPERTIES : expandList(properties)
    return new Promise<void>((resolve) => {
      const wait: RestWait = { timer: null, settle: () => {} }
      const done = (): void => {
        if (wait.timer != null) {
          clearTimeout(wait.timer)
        }
        restWaits.delete(wait)
        resolve()
      }
      wait.settle = done
      restWaits.add(wait)
      const check = (): void => {
        wait.timer = null
        engine.syncPending()
        const time = now()
        let end = time
        for (const property of list) {
          const segment = segments.get(property)
          if (segment != null) {
            end = Math.max(end, segment.start + segment.duration)
          }
        }
        if (landings.size > 0) {
          // A Reduced Motion landing is still to come.
          wait.timer = setTimeout(check, 16)
        }
        else if (end <= time) {
          done()
        }
        else {
          // A retarget or a later start moves the end: look again then.
          wait.timer = setTimeout(check, end - time)
        }
      }
      check()
    })
  }

  animator.dispose = () => {
    engine.flushDeferred()
    // A Reduce Motion move still waiting to land is written at its end
    // state, so the element is left visible where it was going (the node
    // just detached, when an unmount is pending); its call and the calls
    // it carries settle as interrupted.
    if (engine.target == null && engine.unmountQueued) {
      engine.target = engine.lastDetached
    }
    engine.lastDetached = null
    engine.unmountQueued = false
    engine.landPending(false)
    // Nothing moves any more: every atRest() wait settles.
    for (const wait of [...restWaits]) {
      wait.settle()
    }
    const time = now()
    for (const property of PROPERTIES) {
      engine.interrupt(property, time)
    }
    for (const animation of running.values()) {
      animation.cancel()
    }
    running.clear()
    stale.clear()
    engine.forgetShown()
    heldForFrame.clear()
    for (const timer of retireTimers.values()) {
      clearTimeout(timer)
    }
    retireTimers.clear()
    engine.present(false)
    for (const timer of retireLooks.values()) {
      clearTimeout(timer)
    }
    retireLooks.clear()
    retireFrames.clear()
    engine.handBackBorrow()
    engine.demote()
    engine.cancelSheetWillChangeRead()
    engine.target = null
  }
}
