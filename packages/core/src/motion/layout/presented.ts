/**
 * @file presented.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import { sharedState, sharedWeakMap } from '../../utils/sharedRealm'
import { batchPresented, clearPresentedResolve, registerPresentedOffset, writePresentedResolve } from '../presentation'

/** The glide each element reports now, so that only its end clears it. */
const presentedGlides = sharedWeakMap<Element, object>(
  'motion/animated-layout/presented-glides',
  1,
)

/** A glide's report in the presented hit-test registry. */
interface GlideReport {
  readonly element: Element
  /** Removes the report. A second call does nothing. */
  readonly remove: () => void
}

const glideReports = sharedState(
  'motion/animated-layout/glide-reports',
  1,
  () => new Set<GlideReport>(),
)

/** The reports of ended glides, removed together in a later task. */
const endedReports = sharedState(
  'motion/animated-layout/ended-reports',
  1,
  (): GlideReport[] => [],
)

/**
 * Removes the reports of ended glides with one notice to the registry's
 * watchers. A glide in a closed window or out of its document never ends, so
 * its report goes here too.
 */
function removeEndedReports(): void {
  if (endedReports.length === 0) {
    return
  }
  batchPresented(() => {
    for (const report of endedReports.splice(0)) {
      report.remove()
    }
    for (const report of [...glideReports]) {
      const { element } = report
      if (!element.isConnected || element.ownerDocument.defaultView == null) {
        report.remove()
      }
    }
  })
}

/** Each keyframe's `translate` in px at its offset, or null if one has none. */
function translatesOf(
  keyframes: Keyframe[],
): { at: number, x: number, y: number }[] | null {
  const points: { at: number, x: number, y: number }[] = []
  for (const [index, frame] of keyframes.entries()) {
    const match = /^([\d.e+-]+)px ([\d.e+-]+)px$/.exec(
      String(frame.translate ?? ''),
    )
    if (match == null) {
      return null
    }
    points.push({
      at: frame.offset ?? index / Math.max(1, keyframes.length - 1),
      x: Number(match[1]),
      y: Number(match[2]),
    })
  }
  return points.length > 0 ? points : null
}

/**
 * Reports `element` to the presented hit-test registry while its `translate`
 * glide runs. iOS WebKit hit-tests the element where the glide started. So
 * the gesture host resolves it at touch-down and lands the touch on what is
 * drawn. `scale` is its ancestors' scale. An inert element, such as a swap's
 * copy or a closing element, takes no touch, so it is not reported.
 */
export function presentGlide(
  element: Element,
  animation: Animation,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
  scale: { readonly x: number, readonly y: number },
): (() => void) | undefined {
  const view = element.ownerDocument.defaultView
  const durationMs = Number(options.duration)
  const points
    = (options.easing ?? 'linear') === 'linear' && options.delay == null
      ? translatesOf(keyframes)
      : null
  if (
    view == null
    || points == null
    || !(durationMs > 0)
    || !('style' in element)
    || element.closest('[inert]') != null
  ) {
    return undefined
  }
  const styled = element as Element & ElementCSSInlineStyle
  const now = (): number => view.performance.now()
  // The translate drawn at `time`: the keyframes are linear between samples.
  const drawnAt = (time: number): { x: number, y: number } => {
    const start = animation.startTime
    const progress
      = start == null
        ? 0
        : Math.min(1, Math.max(0, (time - Number(start)) / durationMs))
    let next = 1
    while (next < points.length - 1 && points[next].at < progress) {
      next += 1
    }
    const from = points[next - 1] ?? points[0]
    const to = points[next] ?? from
    const span = to.at - from.at
    const part
      = span > 0 ? Math.min(1, Math.max(0, (progress - from.at) / span)) : 1
    return {
      x: (from.x + (to.x - from.x) * part) * scale.x,
      y: (from.y + (to.y - from.y) * part) * scale.y,
    }
  }
  let hitTested = drawnAt(now())
  let isEnded = false
  let isRemoved = false
  const glide = {}
  presentedGlides.set(element, glide)
  const unregister = registerPresentedOffset(element, {
    // At its end the engine hit-tests the element at its layout again.
    offset: (time = now()) => {
      if (isEnded) {
        return { x: 0, y: 0 }
      }
      const drawn = drawnAt(time)
      return { x: drawn.x - hitTested.x, y: drawn.y - hitTested.y }
    },
    resolve: () => {
      if (!isEnded) {
        writePresentedResolve(styled)
        hitTested = drawnAt(now())
      }
    },
  })
  const report: GlideReport = {
    element,
    remove: () => {
      if (isRemoved) {
        return
      }
      isRemoved = true
      glideReports.delete(report)
      unregister()
      if (presentedGlides.get(element) === glide) {
        presentedGlides.delete(element)
        clearPresentedResolve(styled)
      }
    },
  }
  glideReports.add(report)
  const end = (): void => {
    if (isEnded) {
      return
    }
    isEnded = true
    endedReports.push(report)
    // This module's own timer: a closed frame's timer never fires. The glides
    // of one change end in one frame, so the first task removes them all.
    setTimeout(removeEndedReports, 0)
  }
  animation.addEventListener?.('finish', end)
  animation.addEventListener?.('cancel', end)
  // Its settle's resolve moves where the engine hit-tests it, as a touch's.
  return () => {
    if (!isEnded && presentedGlides.get(element) === glide) {
      hitTested = drawnAt(now())
    }
  }
}
