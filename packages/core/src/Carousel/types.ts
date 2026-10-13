import type { VNode } from 'vue'
import type { SpacingStep } from '../Stack/types.js'

/** Gap steps the carousel actually spaces with. Padding accepts every spacing step. */
export type CarouselGap = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4

export interface CarouselHandle {
  /** Scroll forward by roughly one viewport. With `hasLoop`, wraps to the start at the end. */
  scrollNext: () => void
  /** Scroll backward by roughly one viewport. With `hasLoop`, wraps to the end at the start. */
  scrollPrev: () => void
  /**
   * Scroll the item at the 0-based index to the start edge.
   * The index is clamped. Only the carousel scrolls.
   */
  scrollTo: (index: number) => void
  /** Whether a forward scroll is available. With `hasLoop`, true whenever the content overflows. */
  canScrollNext: () => boolean
  /** Whether a backward scroll is available. With `hasLoop`, true whenever the content overflows. */
  canScrollPrev: () => boolean
}

export interface CarouselProps {
  /**
   * Gap between items, as a spacing step.
   * @default 1
   */
  gap?: CarouselGap
  /**
   * Show previous and next buttons when the content overflows.
   * @default true
   */
  hasButtons?: boolean
  /**
   * Fade the edges that hide overflow, so it is obvious there is more to scroll.
   * @default true
   */
  hasEdgeFade?: boolean
  /**
   * Wrap from the last item back to the first, and the other way around.
   * Buttons stay available at both edges. Has no effect when the content fits.
   * @default false
   */
  hasLoop?: boolean
  /**
   * Snap each direct child to the start edge.
   * @default false
   */
  hasSnap?: boolean
  /**
   * Inline padding inside the scrollport, with matching scroll-padding so snap
   * points line up with the content edge.
   */
  padding?: SpacingStep
  /**
   * Accessible name of the carousel region.
   * @default 'Carousel' (localized)
   */
  label?: string
}

export interface CarouselSlots {
  /** Carousel items, rendered in a horizontal scrollport. */
  default?: () => VNode[]
}
