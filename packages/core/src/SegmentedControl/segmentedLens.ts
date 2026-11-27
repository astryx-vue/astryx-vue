/**
 * @file segmentedLens.ts
 * @input SegmentedControl's selection surface (the lens) and the layer that
 *   fades the old surface out under Reduce Motion; the animator, the UIKit
 *   segmented table and the theme's timing
 * @output SegmentedLens: lays the lens out on a segment's box and moves it
 *   with `translate` and `scale` on the animator, on a spring, on the
 *   theme's timing, or as a Reduce Motion cross-fade
 * @position The drawn half of segmentedSelectionMotion.ts, which decides
 *   when each motion plays
 *
 * The lens lays out on the box of the segment it is bound for (inline
 * left, top, width and height), so at rest it sits at translate 0 and scale
 * 1. Rebinding it to another box keeps what is on screen: the presented
 * center and size are re-based onto the new box with their velocities, and
 * the next spring continues them. Nothing lays out or paints per frame.
 */

import type { AnimateOptions, Animator, MotionHandle, MotionValues, SpringTransition } from '../motion/animator'
import type { Box } from './segmentedGeometry'
import { createMotionEngine } from '../motion/animator'
import { mapProgress, mapRange } from '../motion/progress'
import { easedProgress, readThemeTiming } from '../motion/themeTiming'
import { segmentedControl } from '../motion/uikit/segmented'
import { springs } from '../motion/uikit/springs'
import { center } from './segmentedGeometry'

/** The lifted lens wears the theme's low elevation (see segmented-control.css). */
const LIFTED_ATTRIBUTE = 'data-lifted'

/** A theme that gives the segments no transition: the lens lands at once. */
const INSTANT = easedProgress(0.001, progress => progress)

export type LensSpring = 'selection' | 'tracking' | 'lift'

const SPRINGS = {
  selection: segmentedControl.selectionSpring,
  lift: segmentedControl.lift,
  tracking: springs.fingerTracking,
} as const

type Channel = 'x' | 'scaleX' | 'scaleY'

export interface SegmentedLensOptions {
  /** The animators' clock (ms, document timeline). */
  readonly now: () => number
  /** Every motion the lens starts, so its owner knows when all have landed. */
  readonly onMotion: (handle: MotionHandle) => void
}

export class SegmentedLens {
  /** The box the lens lays out on; null while it shows nothing. */
  box: Box | null = null
  private lens: HTMLElement | null = null
  private leaving: HTMLElement | null = null
  private animator: Animator | null = null
  private leavingAnimator: Animator | null = null
  /** Velocities captured by the last `carry`, in the new box's units. */
  private velocity: Partial<Record<Channel, number>> = {}
  /** Bumped by every leaving fade: a finished fade hides only its own. */
  private leavingRun = 0

  constructor(private readonly options: SegmentedLensOptions) {}

  attach(lens: HTMLElement, leaving: HTMLElement): void {
    this.detach()
    this.lens = lens
    this.leaving = leaving
    this.animator = createMotionEngine(lens)
    this.leavingAnimator = createMotionEngine(leaving, { initial: { opacity: 0 } })
  }

  detach(): void {
    for (const animator of [this.animator, this.leavingAnimator]) {
      const element = animator?.element
      animator?.dispose()
      for (const property of ['translate', 'scale', 'opacity'])
        element?.style.removeProperty(property)
    }
    this.animator = this.leavingAnimator = null
    this.lens = this.leaving = null
    this.box = null
    this.velocity = {}
  }

  get isAttached(): boolean {
    return this.animator != null
  }

  /** What Reduce Motion makes of a lens motion now (see Animator.reducedMotion). */
  reducedMotion(touchRelease = false): 'off' | 'crossfade' | 'instant' {
    return this.animator?.reducedMotion({ touchRelease }) ?? 'off'
  }

  /** The lens's presented center and size, from the animator. */
  presented(at = this.options.now()): { center: number, width: number, height: number } | null {
    const box = this.box
    const animator = this.animator
    if (box == null || animator == null)
      return null
    return {
      center: center(box) + animator.get('x', at),
      width: box.width * animator.get('scaleX', at),
      height: box.height * animator.get('scaleY', at),
    }
  }

  /** Lays the lens out on `box` at rest, or hides it (null). Ends every motion. */
  rest(box: Box | null): void {
    this.endLeaving()
    this.velocity = {}
    this.animator?.stop()
    this.box = box
    this.setLifted(false)
    if (this.lens != null && box != null)
      place(this.lens, box)
    this.animator?.set({ x: 0, scaleX: 1, scaleY: 1, opacity: 1 }, { promote: false })
  }

  /**
   * Binds the lens to `box` and keeps what is on screen: the presented
   * geometry re-based onto the new box, with its velocities kept for the
   * next spring. Returns when that motion continues (now), so the next call
   * starts on the same instant.
   */
  carry(box: Box): number | undefined {
    const animator = this.animator
    const lens = this.lens
    if (animator == null || lens == null)
      return undefined
    const previous = this.box
    const at = this.options.now()
    this.velocity = {}
    let start: MotionValues = { x: 0, scaleX: 1, scaleY: 1 }
    if (previous != null) {
      const presented = this.presented(at)!
      start = {
        x: presented.center - center(box),
        scaleX: presented.width / box.width,
        scaleY: presented.height / box.height,
      }
      this.velocity = {
        x: animator.getVelocity('x', at),
        scaleX: (animator.getVelocity('scaleX', at) * previous.width) / box.width,
        scaleY: (animator.getVelocity('scaleY', at) * previous.height) / box.height,
      }
    }
    this.box = box
    place(lens, box)
    // Opaque, whatever a Reduce Motion fade left.
    animator.set({ ...start, opacity: 1 })
    return at
  }

  /** Puts the lens's center at `x` in the track's coordinates (direct manipulation). */
  follow(x: number): void {
    if (this.box != null)
      this.animator?.set({ x: x - center(this.box) })
  }

  /** Springs the lens toward `values`, keeping the velocities `carry` captured. */
  spring(values: MotionValues, kind: LensSpring, options?: AnimateOptions): void {
    const animator = this.animator
    if (animator == null)
      return
    this.track(animator.animate(values, this.springFrom(values, kind), options))
  }

  /**
   * The lens lands at rest on its box on `segment`'s own transition: the
   * theme's duration and easing, which a mouse's change plays.
   */
  playThemed(segment: HTMLElement, options: AnimateOptions): void {
    const animator = this.animator
    if (animator == null)
      return
    this.velocity = {}
    const progress = readThemeTiming(segment) ?? INSTANT
    const at = options.at
    // Unclamped, so an easing that overshoots carries the lens with it.
    const toward = (from: number, to: number): ReturnType<typeof mapProgress> =>
      mapProgress(progress, mapRange([0, 1], [from, to], { clamp: false }))
    this.track(animator.play({
      x: toward(animator.get('x', at), 0),
      scaleX: toward(animator.get('scaleX', at), 1),
      scaleY: toward(animator.get('scaleY', at), 1),
    }, options))
  }

  /** The lens grows to `scaleX` × `scaleY` on the lift spring and wears its elevation. */
  lift(scaleX: number, scaleY: number): void {
    this.spring({ x: 0 }, 'selection')
    this.spring({ scaleX, scaleY }, 'lift')
    this.setLifted(true)
  }

  /**
   * Under Reduce Motion the lens lands on `box` and fades in there, while
   * the surface on screen fades out in place on the same clock. On a fine
   * pointer both change at once, unless a finger released the change.
   */
  crossFadeTo(box: Box, touchRelease: boolean): void {
    const animator = this.animator
    if (animator == null)
      return
    const now = this.options.now()
    const shown = this.presented(now)
    const from = shown == null || this.box == null
      ? null
      : { x: shown.center - shown.width / 2, y: box.y, width: shown.width, height: box.height }
    const opacity = animator.get('opacity', now)
    this.endLeaving()
    const fades = from != null && opacity > 0 && this.reducedMotion(touchRelease) === 'crossfade'
    if (fades && this.leaving != null) {
      place(this.leaving, from)
      this.leaving.toggleAttribute(LIFTED_ATTRIBUTE, this.lens?.hasAttribute(LIFTED_ATTRIBUTE) === true)
      this.leavingAnimator?.set({ x: 0, scaleX: 1, scaleY: 1, opacity })
    }
    const at = this.carry(box)
    this.velocity = {}
    this.setLifted(false)
    this.track(animator.animate(
      { x: 0, scaleX: 1, scaleY: 1 },
      { spring: segmentedControl.selectionSpring },
      { at, crossfadeAs: 'entrance', touchRelease },
    ))
    if (fades)
      this.fadeLeaving(center(box) - center(from), at, touchRelease)
  }

  /** Stops every motion where it is shown. */
  stop(): void {
    this.animator?.stop()
    this.endLeaving()
  }

  /** The leaving surface fades out in place; as a travel, it lands only once invisible. */
  private fadeLeaving(dx: number, at: number | undefined, touchRelease: boolean): void {
    const run = ++this.leavingRun
    const handle = this.leavingAnimator?.animate(
      { x: dx, opacity: 0 },
      { spring: segmentedControl.selectionSpring },
      { at, touchRelease },
    )
    this.leaving?.setAttribute('data-shown', '')
    void handle?.finished.then(() => {
      if (this.leavingRun === run)
        this.endLeaving()
    })
  }

  private endLeaving(): void {
    this.leavingRun++
    if (this.leaving?.hasAttribute('data-shown') !== true)
      return
    this.leaving.removeAttribute('data-shown')
    this.leavingAnimator?.stop()
    this.leavingAnimator?.set({ x: 0, opacity: 0 }, { promote: false })
  }

  private setLifted(isLifted: boolean): void {
    this.lens?.toggleAttribute(LIFTED_ATTRIBUTE, isLifted)
  }

  /** A spring transition that keeps the captured velocities of `values`; each is spent once. */
  private springFrom(values: MotionValues, kind: LensSpring): SpringTransition {
    const spring = SPRINGS[kind]
    const velocity: Record<string, number> = {}
    for (const key of Object.keys(values) as Channel[]) {
      const v = this.velocity[key]
      if (v != null && v !== 0)
        velocity[key] = v
      delete this.velocity[key]
    }
    return Object.keys(velocity).length > 0 ? { spring, velocity } : { spring }
  }

  private track(handle: MotionHandle): void {
    this.options.onMotion(handle)
  }
}

/** Lays `element` out on `box`. */
function place(element: HTMLElement, box: Box): void {
  element.style.left = `${box.x}px`
  element.style.top = `${box.y}px`
  element.style.width = `${box.width}px`
  element.style.height = `${box.height}px`
}
