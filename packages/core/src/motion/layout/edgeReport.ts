/**
 * @file edgeReport.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { LayoutEdge } from './edge'
import type { AnimatedLayout } from './handle'
import { sharedWeakMap } from '../../utils/sharedRealm'
import { changeStartIn } from './batch'
import { extentOf, isRtl, previousInFlow, pxClip } from './edge'
import { rideNeighbour } from './edgeRide'
import { nextInFlow, placeOf } from './exit'
import { intersects, scaleOf, visibleRect } from './geometry'
import { areaOf } from './handle'
import { beginChange, safeAnimate } from './play'
import { reportLayoutChange } from './reportChange'
import { layoutMotion, sampleOver } from './timing'

/** A resized element's edge reveal, reported around its change. */
export interface LayoutEdgeReport {
  /** Before the change commits: measures the element and what moves. */
  measureBefore: () => void
  /**
   * After the new size is applied, before paint: the element reveals or
   * conceals by its edge, from the extent it showed to its new one, and the
   * content beside it glides on the same motion.
   */
  animate: () => void
  /** Ends a running reveal or conceal at once, removing what it holds. */
  cancel: () => void
}

/** A running edge reveal of a resized element. */
interface ResizeReveal {
  readonly animation: Animation | null
  /** The extent it shows `t` ms in, in its own px. */
  shownAt: (t: number) => number
  /** Its extent along the edge's axis as laid out, held or not. */
  readonly box: number
  /** Ends it, putting back what it replaced. */
  release: () => void
}

const resizeReveals = sharedWeakMap<Element, ResizeReveal>(
  'motion/animated-layout/resize-reveals',
  1,
)

/** The inline properties a size hold sets, by axis. */
const HOLD_PROPERTIES = {
  inline: [
    'inline-size',
    'min-inline-size',
    'max-inline-size',
    'flex-basis',
    'flex-grow',
    'flex-shrink',
  ],
  block: [
    'block-size',
    'min-block-size',
    'max-block-size',
    'flex-basis',
    'flex-grow',
    'flex-shrink',
  ],
} as const

/**
 * The inside of an element as it was laid out: its padding along an axis, its
 * overflow and its scroll offset. A size change can change them in the same
 * commit, as a LayoutPanel at width 0 drops its padding and stops scrolling.
 */
interface LaidOutInside {
  /** Its padding at the axis's start and end. */
  readonly gutters: readonly [string, string]
  /** Its overflow across and down. */
  readonly overflow: readonly [string, string]
  /** Its scroll offset across and down. */
  readonly scroll: readonly [number, number]
}

function insideOf(
  element: HTMLElement,
  axis: 'inline' | 'block',
): LaidOutInside {
  const style = getComputedStyle(element)
  return {
    gutters: [
      style.getPropertyValue(`padding-${axis}-start`),
      style.getPropertyValue(`padding-${axis}-end`),
    ],
    overflow: [
      style.getPropertyValue('overflow-x'),
      style.getPropertyValue('overflow-y'),
    ],
    scroll: [element.scrollLeft, element.scrollTop],
  }
}

function restoreScroll(element: HTMLElement, inside: LaidOutInside): void {
  const [across, down] = inside.scroll
  if (element.scrollLeft !== across) {
    element.scrollLeft = across
  }
  if (element.scrollTop !== down) {
    element.scrollTop = down
  }
}

/**
 * Holds `element` at `extent` own px along `edge`'s axis while it conceals to
 * `keep`, freeing the difference by the margin on that edge's side, so what
 * lies beyond the edge stays where the new size puts it. Its padding,
 * overflow and scroll offset stay as `inside` measured them, so nothing in it
 * moves while it is clipped. Returns what puts back every value it set.
 * When no margin frees it, as the content on that side did not stay put, it
 * sets nothing and returns null.
 */
function holdExtent(
  element: HTMLElement,
  area: Element,
  edge: LayoutEdge,
  extent: number,
  keep: number,
  inside: LaidOutInside,
): (() => void) | null {
  const axis = edge.startsWith('inline') ? 'inline' : 'block'
  const margin = `margin-${edge}`
  const insideProperties = [
    [`padding-${axis}-start`, inside.gutters[0]],
    [`padding-${axis}-end`, inside.gutters[1]],
    ['overflow-x', inside.overflow[0]],
    ['overflow-y', inside.overflow[1]],
  ] as const
  const properties = [
    ...HOLD_PROPERTIES[axis],
    margin,
    ...insideProperties.map(([property]) => property),
  ]
  const prior = properties.map(
    property =>
      [
        property,
        element.style.getPropertyValue(property),
        element.style.getPropertyPriority(property),
      ] as const,
  )
  const restore = (): void => {
    for (const [property, value, priority] of prior) {
      if (value === '') {
        element.style.removeProperty(property)
      }
      else {
        element.style.setProperty(property, value, priority)
      }
    }
  }
  const isEnd = edge.endsWith('end')
  const rtl = axis === 'inline' && isRtl(element)
  const beyond = isEnd
    ? nextInFlow(element, area)
    : previousInFlow(element, area)
  const before = beyond == null ? null : placeOf(beyond, rtl)
  const size = `${extent}px`
  element.style.setProperty(`${axis}-size`, size, 'important')
  element.style.setProperty(`min-${axis}-size`, size, 'important')
  element.style.setProperty(`max-${axis}-size`, size, 'important')
  element.style.setProperty('flex-basis', 'auto', 'important')
  element.style.setProperty('flex-grow', '0', 'important')
  element.style.setProperty('flex-shrink', '0', 'important')
  for (const [property, value] of insideProperties) {
    if (value !== '') {
      element.style.setProperty(property, value, 'important')
    }
  }
  element.style.setProperty(margin, `${keep - extent}px`, 'important')
  if (beyond != null && before != null) {
    // One correction from the measured result (a gap, the element's own
    // margin), then everything beyond the edge must be where it was.
    const landed = placeOf(beyond, rtl)
    const scale = scaleOf(element, element.getBoundingClientRect())
    const perPx = axis === 'inline' ? scale.x : scale.y
    const sign = isEnd ? 1 : -1
    const drift = (landed[axis] - before[axis]) * sign
    if (Math.abs(drift) > 0.5) {
      element.style.setProperty(
        margin,
        `${keep - extent - drift / perPx}px`,
        'important',
      )
    }
    const settled = placeOf(beyond, rtl)
    if (
      Math.abs(settled.block - before.block) > 1
      || Math.abs(settled.inline - before.inline) > 1
    ) {
      restore()
      return null
    }
  }
  restoreScroll(element, inside)
  return restore
}

/**
 * Reports a resized element's edge reveal (`spec:AST-105` FR9) with no copy:
 * a resize controller's pane collapsing or opening beside the content it
 * shares a row with (`component:Resizable` FR8, `component:LayoutPanel`
 * FR7). Measure before the change commits and animate after the
 * new size is applied, as `reportLayoutChange` does; the content beside the
 * element glides through that report. A larger extent reveals by `edge` from
 * the extent the element showed. A smaller one conceals: the element is held
 * at the extent it was laid out at, the difference freed by the margin on
 * that edge's side so the content beyond it stays where the new size puts it,
 * and clipped down to its new extent; the hold goes when the motion ends.
 * Its padding, overflow and scroll offset stay as laid out while it is held,
 * so nothing inside it jumps when the new size changes them. The
 * moving edge rides the glide of the content on that side, frame by frame,
 * and a change made while it runs starts from the extent it shows. It slides:
 * nothing fades. Under Reduce Motion with a coarse primary pointer a reveal
 * fades in and a conceal lands at once (`design:reduced-motion` DR2); with a
 * fine one every change lands at once (DR3).
 */
export function reportLayoutEdge(
  handle: AnimatedLayout | null | undefined,
  getElement: () => HTMLElement | null,
  { edge = 'block-end' }: { edge?: LayoutEdge } = {},
): LayoutEdgeReport {
  const report = reportLayoutChange(handle, getElement)
  /**
   * What the element showed, its laid-out extent and its box, before the
   * change.
   */
  let measured: {
    shown: number
    box: number
    rect: DOMRect
    inside: LaidOutInside
  } | null = null
  const axis = edge.startsWith('inline') ? 'inline' : 'block'
  const release = (element: HTMLElement | null): void => {
    if (element == null) {
      return
    }
    resizeReveals.get(element)?.release()
  }
  return {
    measureBefore() {
      const element = getElement()
      measured = null
      if (element != null) {
        beginChange(element.ownerDocument)
        const running = resizeReveals.get(element)
        const elapsed = Number(running?.animation?.currentTime)
        const rect = element.getBoundingClientRect()
        // A running conceal holds the inside as it was laid out.
        const inside = insideOf(element, axis)
        measured
          = running == null
            ? {
                shown: extentOf(element, edge),
                box: extentOf(element, edge),
                rect,
                inside,
              }
            : {
                shown: running.shownAt(
                  Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0,
                ),
                box: running.box,
                rect,
                inside,
              }
        running?.release()
      }
      report.measureBefore()
    },
    animate() {
      report.animate()
      const element = getElement()
      const before = measured
      measured = null
      if (handle == null || element == null || before == null) {
        return
      }
      // A conceal released to reverse can drop the scroll offset.
      restoreScroll(element, before.inside)
      const area = areaOf(handle, element)
      if (area == null) {
        return
      }
      const after = extentOf(element, edge)
      if (Math.abs(after - before.shown) < 0.5) {
        return
      }
      // In the area's visible part before or after: a pane collapsing to
      // nothing has no box after.
      const visible = visibleRect(area)
      if (
        !intersects(element.getBoundingClientRect(), visible)
        && !intersects(before.rect, visible)
      ) {
        return
      }
      const motion = layoutMotion(area)
      if (motion.kind === 'instant') {
        return
      }
      const isConceal = after < before.shown
      const change = changeStartIn(area, element.ownerDocument)
      if (motion.kind === 'fade') {
        if (!isConceal) {
          safeAnimate(
            element,
            [{ opacity: 0 }, { opacity: 1 }],
            { duration: motion.durationMs, easing: motion.easing },
            change,
          )
        }
        return
      }
      const { progress } = motion
      const rtl = edge.startsWith('inline') && isRtl(element)
      // The box the clip works in: the new one for a reveal; for a conceal,
      // the one it was laid out at, held while it runs.
      const box = isConceal ? Math.max(before.box, before.shown) : after
      const restore = isConceal
        ? holdExtent(element, area, edge, box, after, before.inside)
        : () => {}
      if (restore == null) {
        return
      }
      // Hidden at the start and at the end, in the box's own px.
      const from = box - before.shown
      const to = box - after
      const curve = (t: number): number => to + (from - to) * progress.remaining(t)
      const animation = safeAnimate(
        element,
        sampleOver(progress.durationMs, t => ({
          clipPath: pxClip(edge, curve(t), rtl),
        })),
        { duration: progress.durationMs, easing: 'linear' },
        change,
      )
      const reveal: ResizeReveal = {
        animation,
        shownAt: t => box - curve(t),
        box,
        release: () => {
          if (resizeReveals.get(element) !== reveal) {
            return
          }
          resizeReveals.delete(element)
          animation?.cancel()
          restore()
        },
      }
      if (animation == null) {
        restore()
        return
      }
      resizeReveals.set(element, reveal)
      animation.addEventListener?.('finish', reveal.release)
      rideNeighbour(
        element,
        area,
        edge,
        rtl,
        animation,
        () => resizeReveals.get(element) === reveal,
        // Anywhere in its box: the content beside it may carry a running
        // motion past where this one starts or ends, and the edge follows.
        towards =>
          Math.min(box, Math.max(0, isConceal ? to - towards : -towards)),
        hidden => ({ clipPath: pxClip(edge, hidden, rtl) }),
        (hiddenAt) => {
          reveal.shownAt = t => box - hiddenAt(t)
        },
      )
    },
    cancel() {
      measured = null
      release(getElement())
    },
  }
}
