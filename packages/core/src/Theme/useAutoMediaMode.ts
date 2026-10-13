import type { ComputedRef, Ref } from 'vue'
import { onMounted, ref, watch } from 'vue'
import { parseColor, pickMediaMode } from './contrast.js'

export type DetectedMediaMode = 'dark' | 'light' | 'off' | null

function readPaintedBackground(start: HTMLElement): { background: NonNullable<ReturnType<typeof parseColor>>, ambient: NonNullable<ReturnType<typeof parseColor>> } | null {
  let current: HTMLElement | null = start
  for (let depth = 0; current && depth < 6; depth += 1) {
    const style = getComputedStyle(current)
    const background = parseColor(style.backgroundColor)
    if (background && background.a >= 0.2) {
      const ambient = parseColor(style.color) ?? { r: 23, g: 23, b: 23, a: 1 }
      return { background, ambient }
    }
    current = current.parentElement
  }
  return null
}

/**
 * Measure the element that actually paints behind a `display: contents` media
 * theme. Returns `null` when the surface cannot be read.
 */
export function useAutoMediaMode(
  element: Ref<HTMLElement | null>,
  enabled: ComputedRef<boolean>,
): Ref<DetectedMediaMode> {
  const detected = ref<DetectedMediaMode>(null)

  function measure(): void {
    if (!enabled.value || typeof getComputedStyle !== 'function') {
      detected.value = null
      return
    }
    const parent = element.value?.parentElement
    if (!parent) {
      detected.value = null
      return
    }
    const painted = readPaintedBackground(parent)
    detected.value = painted ? pickMediaMode(painted.background, painted.ambient) : null
  }

  onMounted(measure)
  watch(enabled, measure)

  return detected
}
