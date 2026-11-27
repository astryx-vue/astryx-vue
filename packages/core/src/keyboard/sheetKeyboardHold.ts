/**
 * @file sheetKeyboardHold.ts
 * @input A sheet's keyboard body (sheetKeyboardBody.ts), the layout guide's
 *   transitions and UIKit's keyboard spring
 * @output createSheetKeyboardHolds: how a sheet's content moves while the
 *   keyboard goes. It holds the inset through a hide on the keyboard's slide
 *   or, with no guide, rides the content down on the keyboard's spring from
 *   the blur
 * @position Keyboard module, internal to core. sheetKeyboard.ts builds one
 *   per attached sheet and asks it before each reveal.
 */

import type { Animator } from '../motion/animator'
import type { MotionHandle } from '../motion/types'
import type { KeyboardLayoutGuide } from './keyboardLayoutGuide'
import type { KeyboardTransition } from './keyboardModel'
import type { SheetKeyboardBody, SheetKeyboardLayout } from './sheetKeyboardBody'
import { KEYBOARD_SPRING } from '../motion/uikit/springs'
import { rideKeyboard } from './rideKeyboard'
import { isVisualViewportRecovered, mayKeepKeyboard } from './sheetKeyboardBody'

/** A hide the sheet holds the inset through. */
interface HeldHide {
  readonly release: () => void
  /** Whether a reveal during the hold goes on. */
  readonly onReveal?: () => boolean
}

export interface SheetKeyboardHoldsOptions {
  body: HTMLElement
  keyboard: SheetKeyboardBody
  layout: SheetKeyboardLayout
  guide: KeyboardLayoutGuide | null
  /** The sheet's reveal, which commits the layout once a hide lands. */
  reveal: () => void
}

export interface SheetKeyboardHolds {
  /** Whether a hold under way keeps the layout from a reveal now. */
  blocksReveal: () => boolean
  /**
   * Keeps the content drawn where it is across a change of the body's
   * scroll, then rides it to its new place on the keyboard's spring. Call
   * the returned function after the change.
   */
  keepDrawnPlace: () => () => void
  /** Rides the content down from a blur, with no guide to ride. */
  holdThroughUnguidedHide: () => void
  /** Follows the guide's transitions. Returns the unsubscribe. */
  followGuide: () => () => void
  /** Ends any hold and puts the content back where its layout puts it. */
  stop: () => void
}

function rideKeyboardSpring(animator: Animator, y: number): MotionHandle {
  return animator.animate({ y }, { spring: KEYBOARD_SPRING })
}

/** Creates how a sheet's content moves while the keyboard goes. */
export function createSheetKeyboardHolds({
  body,
  keyboard,
  layout,
  guide,
  reveal,
}: SheetKeyboardHoldsOptions): SheetKeyboardHolds {
  let heldHide: HeldHide | null = null

  // A report of the keyboard gone, with no ride under way, moves the content
  // this way.
  const keepDrawnPlace = (): (() => void) => {
    const animator = keyboard.unguidedAnimator()
    if (animator == null) {
      return () => {}
    }
    const drawnBefore = animator.get('y') - body.scrollTop
    return () => {
      const y = drawnBefore + body.scrollTop
      if (Math.abs(y - animator.get('y')) < 0.5) {
        return
      }
      animator.set({ y })
      void rideKeyboardSpring(animator, 0)
    }
  }

  // A field that loses focus to nothing takes the keyboard down. Without
  // the guide, the content rides down to its resting scroll from the blur.
  // It rides on the keyboard's spring, as the keyboard does. The inset and
  // the scroll stay meanwhile. Once the keyboard is gone (its report), the
  // inset drops and the scroll goes back with the translate in one commit.
  // So nothing moves then. A ride not yet landed goes on from there at the
  // same speed. A control that takes focus first and brings up a keyboard
  // or a picker keeps that space covered, so the content rides back up. A
  // field inside an open shadow root does too, and so can a frame or a
  // custom element, whose field the page cannot see.
  const holdThroughUnguidedHide = (): void => {
    const animator = keyboard.unguidedAnimator()
    if (animator == null || heldHide != null) {
      return
    }
    const drop = body.scrollTop - keyboard.restingScrollTop()
    if (drop === 0) {
      return
    }
    const hold: HeldHide = {
      release: () => {
        if (heldHide === hold) {
          heldHide = null
        }
      },
      onReveal: () => {
        const active = document.activeElement
        if (
          active instanceof HTMLElement
          && body.contains(active)
          && mayKeepKeyboard()
        ) {
          hold.release()
          void rideKeyboardSpring(animator, 0)
          return true
        }
        if (isVisualViewportRecovered()) {
          hold.release()
          const y = animator.get('y')
          const velocity = animator.getVelocity('y')
          const scrollBefore = body.scrollTop
          keyboard.clearKeyboardLayout()
          // The scroll's drop moved the layout down by `shift`.
          const shift = scrollBefore - body.scrollTop
          if (Math.abs(y - shift) < 0.5) {
            animator.set({ y: 0 })
          }
          else {
            animator.set({ y: y - shift })
            void animator.animate(
              { y: 0 },
              { spring: KEYBOARD_SPRING, velocity: { y: velocity } },
            )
          }
        }
        return false
      },
    }
    heldHide = hold
    void rideKeyboardSpring(animator, drop)
  }

  // Through a hide on the keyboard's slide, the inset stays, so nothing
  // drops while the keyboard still covers the sheet's bottom. The content
  // rides down on the hide's curve by the scroll the body drops at rest. At
  // rest, the inset drops, the scroll goes back, and the translate clears in
  // one commit. A busy page reads Chrome's report of the keyboard gone
  // after the slide. Until then the content stays where the slide leaves
  // it, and the report commits.
  const holdInsetThrough = (transition: KeyboardTransition): void => {
    heldHide?.release()
    const animator = keyboard.contentAnimator()
    const drop = body.scrollTop - keyboard.restingScrollTop()
    const handle
      = animator != null && drop !== 0
        ? rideKeyboard(animator, { y: drop }, transition)
        : null
    let timer: ReturnType<typeof setTimeout> | undefined
    let landed = false
    const commit = (): void => {
      reveal()
      animator?.set({ y: 0 })
    }
    const hold: HeldHide = {
      release: () => {
        clearTimeout(timer)
        if (heldHide === hold) {
          heldHide = null
        }
      },
      onReveal: () => {
        if (landed && isVisualViewportRecovered()) {
          hold.release()
          commit()
        }
        return false
      },
    }
    heldHide = hold
    const land = (): void => {
      if (heldHide !== hold) {
        return
      }
      landed = true
      if (layout.hasLayout && !isVisualViewportRecovered()) {
        return
      }
      hold.release()
      commit()
    }
    if (handle == null) {
      const end = transition.start + (transition.curve?.durationMs ?? 0)
      timer = setTimeout(land, Math.max(0, end - performance.now()))
    }
    else {
      void handle.finished.then(land)
    }
  }

  return {
    blocksReveal: () => heldHide != null && heldHide.onReveal?.() !== true,
    keepDrawnPlace,
    holdThroughUnguidedHide,
    followGuide: () =>
      guide?.subscribe((transition) => {
        // A jump lands with the reports: only a slide rides.
        if (transition.curve == null) {
          return
        }
        if (transition.kind === 'hide') {
          if (layout.hasLayout && transition.animated) {
            holdInsetThrough(transition)
          }
          return
        }
        if (heldHide != null) {
          // The keyboard comes back before it is down (focus returns): the
          // inset never left, so the content rides back to its place with it.
          heldHide.release()
          const animator = keyboard.contentAnimator()
          if (animator != null) {
            rideKeyboard(animator, { y: 0 }, transition)
          }
        }
      }) ?? (() => {}),
    stop: () => {
      heldHide?.release()
      ;(keyboard.contentAnimator() ?? keyboard.unguidedAnimator())?.set({ y: 0 })
    },
  }
}
