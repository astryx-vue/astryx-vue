/**
 * @file segmentedSelectionMotion.ts
 * @input The radiogroup, its lens and leaving layers, the selected value,
 *   the presentation, and the presses segmentedTracking.ts reports
 * @output SegmentedSelectionMotion: the selection motion of one
 *   SegmentedControl, as UIKit's segmented control moves it
 * @position Decides when each motion plays; segmentedLens.ts draws it.
 *   Wired to the component by useSegmentedSelection.ts
 *
 * - Every change slides the lens to the new segment: a tap, a key or the
 *   program's. Under the touch presentation (a coarse primary pointer) it
 *   slides on UISegmentedControl's measured spring; under a fine pointer on
 *   the segment's own transition, the theme's duration and easing. A change
 *   mid-flight continues from what is on screen, with its velocity.
 * - Under a finger, a press on the selected segment lifts the lens: it grows
 *   by `liftGrowth` on the `lift` spring and wears the theme's low elevation,
 *   then shrinks back on the same spring after the release.
 * - A drag from the selected segment carries the lens: its center chases the
 *   pointer, at most `dragOvershoot` past the end segments. The selected
 *   title's color follows the lens's center, with hysteresis at each
 *   boundary. The release commits the segment under the pointer.
 * - A mouse or a pen drags the lens the same way, on the pointer itself.
 * - Under Reduce Motion a held lens still follows the pointer (direct
 *   manipulation). Nothing else travels, lifts or scales: under a finger the
 *   lens fades in at the new segment while the old surface fades out in
 *   place; a fine pointer's change lands at once.
 */

import type { MotionHandle } from '../motion/animator'
import type { Box, TitleFace } from './segmentedGeometry'
import { registerSegmentedTable, segmentedControl } from '../motion/uikit/segmented'
import { registerSpringsTable } from '../motion/uikit/springs'
import { boxesIn, center, facedSegmentAt, isEnabledSegment, isLaidOut, isSameBox, segmentFor, segmentsOf, selectedIn, trackXIn } from './segmentedGeometry'
import { SegmentedLens } from './segmentedLens'

const TITLE_SELECTOR = '.astryx-segmented-control-item__label'

/** A press, from landing to lift. */
interface Press {
  readonly toTrackX: (clientX: number) => number
  readonly boxes: ReadonlyMap<HTMLElement, Box>
  /** The segment the press landed on, if any. */
  readonly origin: HTMLElement | null
  /** It landed on the selected segment: a drag carries the lens. */
  readonly carriesLens: boolean
  /** A finger pressed: under Reduce Motion its release cross-fades. */
  readonly isFinger: boolean
  /** The selected title's face and an unselected one, read at landing. */
  readonly faces: { readonly selected: TitleFace, readonly unselected: TitleFace } | null
}

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now()
}

function titleOf(segment: HTMLElement): HTMLElement | null {
  return segment.querySelector<HTMLElement>(TITLE_SELECTOR)
}

function faceOf(title: HTMLElement): TitleFace {
  return { color: getComputedStyle(title).color }
}

export class SegmentedSelectionMotion {
  private track: HTMLElement | null = null
  private readonly lens: SegmentedLens
  private readonly running = new Set<MotionHandle>()
  private press: Press | null = null
  /** The lens is bound to the pressed segment: a drag moves it. */
  private isHeld = false
  /** The held lens grew by `liftGrowth`; its settle shrinks it back. */
  private isLifted = false
  /** The touch presentation applies: changes slide on UIKit's springs. */
  private isPresenting = false
  /** The value a release already sent the lens to; its change re-aims it. */
  private committed: string | null = null
  /** The commit's click ran unvetoed: the lens waits for the value. */
  private isAwaitingValue = false
  /** The last release was a finger's. */
  private releasedByFinger = true
  /** The track's layout size when the lens's motion began. */
  private trackSize = { width: 0, height: 0 }
  /** The segment showing the selected face under a dragging pointer. */
  private facedSegment: HTMLElement | null = null
  private readonly faceOverrides = new Set<HTMLElement>()
  private lensFrame: number | null = null
  private declineTimer: ReturnType<typeof setTimeout> | null = null

  constructor(private readonly clock: () => number = now) {
    registerSpringsTable()
    registerSegmentedTable()
    this.lens = new SegmentedLens({ now: clock, onMotion: handle => this.trackHandle(handle) })
  }

  /** Attaches the radiogroup and its two layers, and lays the lens on the selection. */
  attach(track: HTMLElement, lens: HTMLElement, leaving: HTMLElement): void {
    this.track = track
    this.lens.attach(lens, leaving)
    this.settle()
  }

  detach(): void {
    this.stop()
    this.lens.detach()
    this.track?.removeAttribute('data-selection')
    this.track = null
  }

  /** A press of any pointer is down on the control. */
  get isPressed(): boolean {
    return this.press != null
  }

  /** Whether the touch presentation applies; a change of it lands anything in flight. */
  present(isPresenting: boolean): void {
    if (this.isPresenting === isPresenting)
      return
    this.isPresenting = isPresenting
    this.settle()
  }

  /** The selection moved from `from` to `to`; the DOM already shows `to`. */
  select(from: string, to: string): void {
    const track = this.track
    if (track == null)
      return
    const destination = segmentFor(track, to)
    const isReleaseCommit = this.committed === to
    this.clearFaces()
    this.committed = null
    this.isAwaitingValue = false
    if (isReleaseCommit) {
      // The lens already heads there; the new title weights may have moved it.
      if (destination != null)
        this.reaim(destination)
      return
    }
    const box = destination == null ? null : boxesIn(track)(destination)
    // Nothing was shown, or nothing is selected now: no surface to slide.
    if (destination == null || box == null || !isLaidOut(box) || this.lens.box == null || from === to) {
      this.settle()
      return
    }
    // A fine pointer under Reduce Motion: the change lands at once.
    if (!this.isPresenting && this.lens.reducedMotion() !== 'off') {
      this.settle()
      return
    }
    this.moveLensTo(destination, box, false)
  }

  /** A press landed on `origin` (null: none). It reads the geometry and title faces once. */
  begin(origin: HTMLElement | null, isFinger: boolean): void {
    const track = this.track
    if (track == null)
      return
    const segments = segmentsOf(track)
    const boxOf = boxesIn(track)
    const selected = selectedIn(track)
    const other = segments.find(segment => segment !== selected && isEnabledSegment(segment))
    const selectedTitle = selected == null ? null : titleOf(selected)
    const otherTitle = other == null ? null : titleOf(other)
    this.press = {
      toTrackX: trackXIn(track),
      boxes: new Map(segments.map(segment => [segment, boxOf(segment)])),
      origin,
      carriesLens: origin != null && origin === selected,
      isFinger,
      faces: selectedTitle != null && otherTitle != null ? { selected: faceOf(selectedTitle), unselected: faceOf(otherTitle) } : null,
    }
  }

  /** The press tracker highlighted the press: a press on the selected segment lifts the lens. */
  highlighted(): void {
    if (this.press?.carriesLens === true)
      this.lift()
  }

  /** The pointer moved to `clientX`. A drag from the selected segment carries the lens. */
  drag(clientX: number): void {
    const press = this.press
    if (press == null || !press.carriesLens)
      return
    // A drag that starts before the highlight lifts the lens as well.
    this.lift()
    this.hold()
    if (!this.isHeld || this.lens.box == null)
      return
    const centers = [...press.boxes.values()].map(center)
    const reach = segmentedControl.dragOvershoot
    const target = Math.min(Math.max(press.toTrackX(clientX), Math.min(...centers) - reach), Math.max(...centers) + reach)
    if (!this.isPresenting || this.lens.reducedMotion() !== 'off')
      this.lens.follow(target)
    else
      this.lens.spring({ x: target - center(this.lens.box) }, 'tracking', { at: this.clock() })
    this.followLens()
  }

  /**
   * The pointer let go on `target` (null: none, or disabled). Moves the lens
   * there and returns its value when it is not the selected one (the
   * caller's click commits it), else null.
   */
  release(target: HTMLElement | null): string | null {
    const press = this.press
    this.press = null
    if (press == null)
      return null
    const selected = [...press.boxes.keys()].find(segment => segment.getAttribute('aria-checked') === 'true') ?? null
    const destination = (target != null && isEnabledSegment(target) ? target : null) ?? selected
    const isHeld = press.carriesLens && this.isHeld
    this.releasedByFinger = press.isFinger
    if (destination == null) {
      this.clearFaces()
      if (isHeld)
        this.settle()
      return null
    }
    const value = destination !== selected ? (destination.dataset.value ?? null) : null
    // A drag's borrowed face stays only if the release commits.
    if (value == null)
      this.clearFaces()
    this.committed = value
    this.isAwaitingValue = false
    const box = press.boxes.get(destination)!
    // A fine pointer under Reduce Motion moves only a held lens.
    if (isHeld || (value != null && (this.isPresenting || this.lens.reducedMotion(press.isFinger) !== 'instant')))
      this.moveLensTo(destination, box, press.isFinger)
    return value
  }

  /** The commit's click for `value` ran; a cancelled click sends the lens back. */
  clicked(value: string, isCancelled: boolean): void {
    if (this.committed !== value)
      return
    if (isCancelled) {
      this.decline(value)
      return
    }
    this.isAwaitingValue = true
    // An owner that keeps its value never answers: once nothing moves, the lens goes back.
    if (this.declineTimer != null)
      clearTimeout(this.declineTimer)
    this.declineTimer = setTimeout(() => {
      this.declineTimer = null
      if (this.committed === value && this.running.size === 0)
        this.decline(value)
    }, 0)
  }

  /** The press was taken back (Escape, or the browser took the pointer): the lens goes back. */
  cancel(): void {
    const press = this.press
    this.press = null
    this.clearFaces()
    if (press?.origin == null || !press.carriesLens || !this.isHeld)
      return
    this.moveLensTo(press.origin, press.boxes.get(press.origin)!, press.isFinger)
  }

  /** The control resized: a lens in motion aims at stale boxes, so it lands at once. */
  resized(): void {
    const track = this.track
    if (track == null || this.press != null)
      return
    const isMoving = this.running.size > 0
    if (isMoving && Math.abs(track.offsetWidth - this.trackSize.width) < 0.5 && Math.abs(track.offsetHeight - this.trackSize.height) < 0.5)
      return
    this.settle()
  }

  /** Lands the lens at rest on the selected segment now, or hides it when there is none. */
  settle(): void {
    this.isHeld = false
    this.isLifted = false
    this.running.clear()
    const track = this.track
    if (track == null)
      return
    const selected = selectedIn(track)
    const box = selected == null ? null : boxesIn(track)(selected)
    const shows = box != null && isLaidOut(box)
    this.lens.rest(shows ? box : null)
    track.toggleAttribute('data-selection', shows)
  }

  /** Ends everything in flight (unmount). */
  stop(): void {
    this.press = null
    this.committed = null
    this.isAwaitingValue = false
    this.cancelFrame()
    if (this.declineTimer != null) {
      clearTimeout(this.declineTimer)
      this.declineTimer = null
    }
    this.clearFaces()
    this.lens.stop()
    this.settle()
  }

  /** The value a release sent the lens to was not adopted: it goes back to the selection. */
  private decline(value: string): void {
    if (this.committed !== value)
      return
    this.committed = null
    this.isAwaitingValue = false
    this.clearFaces()
    const track = this.track
    const selected = track == null ? null : selectedIn(track)
    const box = selected == null ? null : boxesIn(track!)(selected)
    if (selected == null || box == null || !isLaidOut(box)) {
      this.settle()
      return
    }
    this.moveLensTo(selected, box, this.releasedByFinger)
  }

  /** Aims the lens at `destination`'s box as it is now. */
  private reaim(destination: HTMLElement): void {
    const track = this.track
    const current = this.lens.box
    if (track == null || current == null)
      return
    const box = boxesIn(track)(destination)
    if (isLaidOut(box) && !isSameBox(box, current))
      this.moveLensTo(destination, box, this.releasedByFinger)
  }

  /** A press on the selected segment binds the lens there, so a drag moves it. */
  private hold(): void {
    const press = this.press
    if (press?.origin == null || this.isHeld)
      return
    const box = press.boxes.get(press.origin)
    if (box == null || !isLaidOut(box))
      return
    this.beginMotion()
    this.lens.carry(box)
    this.isHeld = true
  }

  /** Under the touch presentation the held lens grows by `liftGrowth`. */
  private lift(): void {
    if (this.isLifted || !this.isPresenting || this.lens.reducedMotion() !== 'off')
      return
    this.hold()
    const box = this.lens.box
    if (!this.isHeld || box == null)
      return
    const [width, height] = segmentedControl.liftGrowth
    this.isLifted = true
    this.lens.lift((box.width + width) / box.width, (box.height + height) / box.height)
  }

  /**
   * The lens lands at rest on `segment`'s `box`. Under the touch
   * presentation it springs on the slide spring (a lifted lens shrinks back
   * on the lift's); under a fine pointer it plays the theme's timing. Under
   * Reduce Motion it cross-fades, or lands at once.
   */
  private moveLensTo(segment: HTMLElement, box: Box, touchRelease: boolean): void {
    this.isHeld = false
    if (!isLaidOut(box)) {
      this.settle()
      return
    }
    this.beginMotion()
    const reduced = this.lens.reducedMotion(touchRelease)
    if (reduced !== 'off') {
      this.isLifted = false
      if (reduced === 'crossfade')
        this.lens.crossFadeTo(box, touchRelease)
      else
        this.lens.rest(box)
      return
    }
    const at = this.lens.carry(box)
    if (this.isPresenting && this.isLifted) {
      this.isLifted = false
      this.lens.spring({ x: 0 }, 'selection', { at })
      this.lens.spring({ scaleX: 1, scaleY: 1 }, 'lift', { at })
    }
    else if (this.isPresenting) {
      this.lens.spring({ x: 0, scaleX: 1, scaleY: 1 }, 'selection', { at })
    }
    else {
      this.lens.playThemed(segment, { at })
    }
  }

  private beginMotion(): void {
    const track = this.track
    if (track != null)
      this.trackSize = { width: track.offsetWidth, height: track.offsetHeight }
  }

  /** Waits for `handle`: once nothing is left, the lens lands, or an unanswered commit goes back. */
  private trackHandle(handle: MotionHandle): void {
    this.running.add(handle)
    void handle.finished.then(() => {
      if (!this.running.delete(handle) || this.running.size > 0 || this.isHeld || this.press != null)
        return
      if (this.isAwaitingValue && this.committed != null)
        this.decline(this.committed)
      else if (this.committed == null)
        this.settle()
    })
  }

  /**
   * The selected face follows the held lens's presented center, every frame
   * while it is held, so the face keeps up as the lens settles under a
   * still pointer.
   */
  private followLens(): void {
    const press = this.press
    const shown = this.lens.presented()
    if (press?.origin == null || !press.carriesLens || !this.isHeld || shown == null) {
      this.cancelFrame()
      return
    }
    const spans = [...press.boxes.entries()].filter(([segment]) => isEnabledSegment(segment))
    const faced = facedSegmentAt(shown.center, spans, this.facedSegment ?? press.origin)
    this.showFaceAt(faced === press.origin ? null : faced)
    const view = this.track?.ownerDocument.defaultView
    if (this.lensFrame == null && view != null) {
      this.lensFrame = view.requestAnimationFrame(() => {
        this.lensFrame = null
        this.followLens()
      })
    }
  }

  private cancelFrame(): void {
    if (this.lensFrame != null) {
      this.track?.ownerDocument.defaultView?.cancelAnimationFrame(this.lensFrame)
      this.lensFrame = null
    }
  }

  /**
   * `segment`'s title wears the selected face and the selected segment's
   * title an unselected one (none for null). Only the color moves: a weight
   * swap would resize the titles under the pointer.
   */
  private showFaceAt(segment: HTMLElement | null): void {
    const press = this.press
    if (segment === this.facedSegment)
      return
    this.clearFaces()
    const selectedTitle = press?.origin == null ? null : titleOf(press.origin)
    const title = segment == null ? null : titleOf(segment)
    if (press?.faces == null || title == null || selectedTitle == null)
      return
    this.wearFace(title, press.faces.selected)
    this.wearFace(selectedTitle, press.faces.unselected)
    this.facedSegment = segment
  }

  private wearFace(title: HTMLElement, face: TitleFace): void {
    title.style.color = face.color
    this.faceOverrides.add(title)
  }

  private clearFaces(): void {
    for (const title of this.faceOverrides)
      title.style.removeProperty('color')
    this.faceOverrides.clear()
    this.facedSegment = null
  }
}
