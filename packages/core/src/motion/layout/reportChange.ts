/**
 * @file reportChange.ts
 * @position Internal to motion/layout; split from upstream motion/animatedLayout.ts
 */

import type { AnimatedLayout } from './handle'
import { batchPresented } from '../presentation'
import { batches, batchFor, flush } from './batch'
import { originOf, visibleRect } from './geometry'
import { areaOf } from './handle'
import { beginChange } from './play'
import { bandFor, collectCandidates, onGlideClock, rectOf } from './walk'

type Target = { readonly current: Element | null } | (() => Element | null)

export function resolve(target: Target): Element | null {
  return typeof target === 'function' ? target() : target.current
}

export interface LayoutChange {
  /** Before the change commits (in the event handler that causes it). */
  measureBefore: () => void
  /**
   * After it commits (a layout effect). Returns whether the change was
   * measured: an unmeasured change (an owner set the state directly) moves
   * nothing, and the component plays no entrance for it either.
   *
   * `beforeMove`, when given, runs once the new places are read and before
   * any glide starts, with the elements the glide may move: whatever the
   * component reads from the layout for the glide, it reads there, so the page
   * is not laid out again (`playLayoutChange` included).
   */
  animate: (beforeMove?: (candidates: ReadonlyArray<Element>) => void) => boolean
}

/**
 * Report a size change of `target` to the handle's area. Call
 * `measureBefore()` before the change commits and `animate()` after it; the
 * content after `target`, up to the area, glides from its old place.
 * Changes in one area in one frame move together. Without a handle, or
 * outside its container, nothing moves.
 */
export function reportLayoutChange(
  handle: AnimatedLayout | null | undefined,
  target: Target,
): LayoutChange {
  return {
    measureBefore() {
      const element = resolve(target)
      if (element == null || handle == null) {
        return
      }
      const area = areaOf(handle, element)
      if (area == null) {
        return
      }
      beginChange(element.ownerDocument)
      const batch = batchFor(area)
      if (batch.changed.has(element)) {
        return
      }
      batch.changed.add(element)
      batch.changedSize += rectOf(element, batch.cache).height
      batch.visible ??= visibleRect(area)
      batch.originBefore ??= originOf(area)
      batch.walksToBand
        ??= area.ownerDocument.defaultView
          ?.getComputedStyle(area)
          .getPropertyValue('overflow-anchor') === 'none'
      // Changes in one frame add up: every change's walk reaches the band
      // their summed size can pull into view. When that outgrows the band
      // walked so far, the band at least doubles and every change is walked
      // again (from the cache), so a frame of many changes re-walks a few
      // times, not once per change.
      const needed = Math.max(batch.visible.height, batch.changedSize)
      const walks = needed > batch.reach ? [...batch.changed] : [element]
      if (needed > batch.reach) {
        batch.reach = Math.max(needed, batch.reach * 2)
      }
      const band = bandFor(batch.visible, batch.reach)
      for (const changed of walks) {
        const candidates = collectCandidates(
          changed,
          area,
          band,
          batch.cache,
          batch.walksToBand,
          batch.ancestors,
          batch.befores,
        )
        for (const [candidate, rect] of candidates) {
          if (!batch.before.has(candidate)) {
            batch.before.set(candidate, onGlideClock(candidate, rect, area))
          }
        }
        batch.candidates.set(changed, [...candidates.keys()])
      }
    },
    animate(beforeMove) {
      const element = resolve(target)
      if (element == null || handle == null) {
        return false
      }
      const area = areaOf(handle, element)
      const batch = area == null ? undefined : batches.get(area)
      if (batch == null || !batch.changed.has(element)) {
        return false
      }
      if (beforeMove != null) {
        batch.beforeMove.push(beforeMove)
      }
      if (!batch.scheduled) {
        batch.scheduled = true
        // After every layout effect of this commit, before paint, with one
        // registry notice for all the glides it starts.
        queueMicrotask(() => batchPresented(() => flush(batch)))
      }
      return true
    },
  }
}
