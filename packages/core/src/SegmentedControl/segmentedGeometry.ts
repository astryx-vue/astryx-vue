/**
 * @file segmentedGeometry.ts
 * @input A SegmentedControl's radiogroup and its segments
 * @output The segments' boxes in the track's coordinates, the pointer's x
 *   there, and the segment a lift commits
 * @position Pure geometry of SegmentedControl's selection motion
 *   (segmentedSelectionMotion.ts) and press tracking (segmentedTracking.ts)
 */

/** The segments, in DOM order. */
export const SEGMENT_SELECTOR = '[role="radio"][data-value]'

/** A box in the track's padding-box coordinates, CSS px. */
export interface Box {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export function segmentsOf(track: HTMLElement): HTMLElement[] {
  return Array.from(track.querySelectorAll<HTMLElement>(SEGMENT_SELECTOR))
}

/** The selected segment, as the DOM shows it now. */
export function selectedIn(track: HTMLElement): HTMLElement | null {
  return segmentsOf(track).find(segment => segment.getAttribute('aria-checked') === 'true') ?? null
}

/** The segment that commits `value`. */
export function segmentFor(track: HTMLElement, value: string | null | undefined): HTMLElement | null {
  return value == null ? null : segmentsOf(track).find(segment => segment.dataset.value === value) ?? null
}

export function isEnabledSegment(segment: HTMLElement): boolean {
  return !segment.hasAttribute('disabled') && segment.getAttribute('aria-disabled') !== 'true'
}

export function isLaidOut(box: Box): boolean {
  return box.width > 0 && box.height > 0
}

export function center(box: Box): number {
  return box.x + box.width / 2
}

/** Whether two boxes are the same to a quarter of a pixel. */
export function isSameBox(a: Box, b: Box): boolean {
  return Math.abs(a.x - b.x) < 0.25
    && Math.abs(a.y - b.y) < 0.25
    && Math.abs(a.width - b.width) < 0.25
    && Math.abs(a.height - b.height) < 0.25
}

/**
 * The scale an ancestor transform applies to the track's client rects. The
 * lens lays out untransformed. `offsetWidth` rounds to whole pixels, so only
 * a difference past that rounding counts as a transform.
 */
function scaleOf(track: HTMLElement, rect: DOMRect): number {
  if (track.offsetWidth <= 0 || rect.width <= 0)
    return 1
  return Math.abs(rect.width - track.offsetWidth) <= 1 ? 1 : rect.width / track.offsetWidth
}

/** Boxes relative to the track's padding box, where the lens lays out. */
export function boxesIn(track: HTMLElement): (element: HTMLElement) => Box {
  const trackRect = track.getBoundingClientRect()
  const scale = scaleOf(track, trackRect)
  return (element) => {
    const rect = element.getBoundingClientRect()
    return {
      x: (rect.left - trackRect.left) / scale - track.clientLeft,
      y: (rect.top - trackRect.top) / scale - track.clientTop,
      width: rect.width / scale,
      height: rect.height / scale,
    }
  }
}

/** Maps a client x to the track's padding-box x, read once per press. */
export function trackXIn(track: HTMLElement): (clientX: number) => number {
  const rect = track.getBoundingClientRect()
  const scale = scaleOf(track, rect)
  return clientX => (clientX - rect.left) / scale - track.clientLeft
}

/** A segment as measured when the pointer landed: its viewport box, px. */
export interface SegmentSpan {
  readonly element: HTMLElement
  readonly left: number
  readonly right: number
  readonly top: number
  readonly bottom: number
}

/** Every segment of `track`, disabled ones included, measured once. */
export function measureSegments(track: HTMLElement): SegmentSpan[] {
  return segmentsOf(track).map((element) => {
    const { left, right, top, bottom } = element.getBoundingClientRect()
    return { element, left, right, top, bottom }
  })
}

/** No segment has a width: the control has no layout, as in a unit test's DOM. */
export function hasNoLayout(segments: ReadonlyArray<SegmentSpan>): boolean {
  return segments.every(({ left, right }) => right - left <= 0)
}

/**
 * The segment a pointer at viewport `x` counts for: the one under it, else
 * the nearest. A gap between two segments splits at its middle, as UIKit's
 * segments share an edge, and past the ends the end segment counts. Null
 * when that segment is disabled.
 */
export function segmentTargetAt(x: number, segments: ReadonlyArray<SegmentSpan>): HTMLElement | null {
  let best: SegmentSpan | null = null
  let distance = Infinity
  for (const segment of segments) {
    const d = Math.max(segment.left - x, 0, x - segment.right)
    if (d < distance) {
      distance = d
      best = segment
    }
  }
  return best != null && isEnabledSegment(best.element) ? best.element : null
}

/**
 * The segment a lift at viewport (`x`, `y`) commits. The press counts along
 * the control's axis: a pointer that drifted off the control above or below
 * keeps choosing by its horizontal position, and one past an end chooses that
 * end. A pointer inside a segment's own box picks that segment, so a tap on a
 * segment wrapped onto a second row keeps it.
 */
export function liftTargetAt(x: number, y: number, segments: ReadonlyArray<SegmentSpan>): HTMLElement | null {
  const under = segments.find(({ left, right, top, bottom }) => x >= left && x <= right && y >= top && y <= bottom)
  if (under != null)
    return isEnabledSegment(under.element) ? under.element : null
  return segmentTargetAt(x, segments)
}

/** The face a title wears: what a dragging pointer moves between titles. */
export interface TitleFace {
  readonly color: string
}

/**
 * The selected face moves to another segment only once the lens's center is
 * this far past the boundary: a quarter of that segment's width, at least
 * 8 px, so a pointer resting on a boundary does not flip it.
 */
const FACE_HYSTERESIS_RATIO = 0.25
const FACE_HYSTERESIS_MIN_PX = 8

/**
 * The segment whose title wears the selected face while the lens's center
 * is at `lensCenter`, given the one wearing it now (`current`). `spans` are
 * the enabled segments' boxes in the track's coordinates.
 */
export function facedSegmentAt(
  lensCenter: number,
  spans: ReadonlyArray<readonly [HTMLElement, Box]>,
  current: HTMLElement,
): HTMLElement {
  const sorted = [...spans].sort((a, b) => a[1].x - b[1].x)
  const at = sorted.findIndex(([segment]) => segment === current)
  if (at < 0)
    return current
  const edge = (i: number): number => (sorted[i]![1].x + sorted[i]![1].width + sorted[i + 1]![1].x) / 2
  let next = at
  while (next + 1 < sorted.length && lensCenter > edge(next))
    next += 1
  while (next > 0 && lensCenter < edge(next - 1))
    next -= 1
  if (next === at)
    return current
  const boundary = next > at ? edge(at) : edge(at - 1)
  const hysteresis = Math.max(FACE_HYSTERESIS_MIN_PX, FACE_HYSTERESIS_RATIO * sorted[next]![1].width)
  return Math.abs(lensCenter - boundary) >= hysteresis ? sorted[next]![0] : current
}
