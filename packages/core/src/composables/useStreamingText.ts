import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import { computed, ref, toValue, watch } from 'vue'
import { useMediaQuery } from './useMediaQuery.js'

export type StreamingTextSpeed = 'natural' | 'fast' | 'instant'

export interface UseStreamingTextOptions {
  /**
   * How quickly revealed text catches up with the source.
   * `natural` reveals a short run each frame, `fast` drains the backlog sooner,
   * and `instant` returns the source unchanged.
   * @default 'natural'
   */
  speed?: StreamingTextSpeed
}

const CHARS_PER_TICK: Record<StreamingTextSpeed, number> = {
  natural: 10,
  fast: 4,
  instant: Number.POSITIVE_INFINITY,
}

const FALLBACK_DURATION_MS = 95

function parseCssDuration(value: string): number | null {
  const milliseconds = /^([\d.]+)ms$/.exec(value.trim())
  if (milliseconds?.[1] != null)
    return Number(milliseconds[1])
  const seconds = /^([\d.]+)s$/.exec(value.trim())
  if (seconds?.[1] != null)
    return Number(seconds[1]) * 1000
  return null
}

function motionDuration(): number {
  if (typeof document === 'undefined')
    return FALLBACK_DURATION_MS
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--astryx-duration-fast-min')
  return parseCssDuration(raw) ?? FALLBACK_DURATION_MS
}

function tickInterval(speed: StreamingTextSpeed): number {
  if (speed === 'instant')
    return 0
  const duration = motionDuration()
  const tick = speed === 'fast' ? duration / 20 : duration / 10
  return Math.max(4, Math.round(tick))
}

const graphemeSegmenter = typeof Intl.Segmenter === 'function'
  ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
  : null

function isLowSurrogate(codeUnit: number): boolean {
  return codeUnit >= 0xDC00 && codeUnit <= 0xDFFF
}

/**
 * Move `offset` back to the start of the grapheme it lands inside, so a slice
 * never cuts a surrogate pair, a flag, or a ZWJ sequence in half.
 */
export function snapToGraphemeBoundary(text: string, offset: number): number {
  if (offset <= 0 || offset >= text.length)
    return offset
  if (graphemeSegmenter != null)
    return graphemeSegmenter.segment(text).containing(offset)?.index ?? offset
  return isLowSurrogate(text.charCodeAt(offset)) ? offset - 1 : offset
}

/**
 * Smooth a burst of streamed text into a steady reveal.
 * While `isStreaming` is false, or the user prefers reduced motion, the full
 * source is returned. The reveal steps by UTF-16 units and then snaps back to
 * a grapheme boundary.
 */
export function useStreamingText(
  targetText: MaybeRefOrGetter<string>,
  isStreaming: MaybeRefOrGetter<boolean> = false,
  options?: MaybeRefOrGetter<UseStreamingTextOptions>,
): ComputedRef<string> {
  const displayedLen = ref(0)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const target = computed(() => toValue(targetText))
  const streaming = computed(() => toValue(isStreaming))
  const speed = computed<StreamingTextSpeed>(() => toValue(options)?.speed ?? 'natural')
  const instant = computed(() => !streaming.value || speed.value === 'instant' || prefersReducedMotion.value)

  watch(target, (next, previous) => {
    if (next.length === 0 && (previous?.length ?? 0) > 0)
      displayedLen.value = 0
  })

  watch(streaming, (next) => {
    if (!next)
      displayedLen.value = target.value.length
  })

  watch(instant, (isInstant, _, onCleanup) => {
    if (isInstant)
      return

    let frame = 0
    let lastTick = 0
    const tick = (now: number): void => {
      const interval = tickInterval(speed.value)
      if (now - lastTick >= interval) {
        lastTick = now
        const goal = target.value.length
        if (displayedLen.value < goal) {
          const step = CHARS_PER_TICK[speed.value]
          displayedLen.value = Math.min(displayedLen.value + step, goal)
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    onCleanup(() => cancelAnimationFrame(frame))
  }, { immediate: true })

  return computed(() => {
    const text = target.value
    if (instant.value)
      return text
    return text.slice(0, snapToGraphemeBoundary(text, displayedLen.value))
  })
}
