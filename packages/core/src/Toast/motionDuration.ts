const TOAST_MOTION_DURATION_VAR = '--astryx-toast-motion-duration'
const TOAST_MOTION_DURATION_FALLBACK_MS = 165

/** 把 `165ms` 或 `0.2s` 解析成毫秒。解析不了就返回 null。 */
export function parseCssDurationMs(value: string): number | null {
  const text = value.trim()
  if (text.endsWith('ms')) {
    const ms = Number.parseFloat(text)
    return Number.isFinite(ms) ? ms : null
  }
  if (text.endsWith('s')) {
    const seconds = Number.parseFloat(text)
    return Number.isFinite(seconds) ? seconds * 1000 : null
  }
  return null
}

function readDurationRaw(element: Element): string {
  if (typeof getComputedStyle === 'function') {
    const computed = getComputedStyle(element).getPropertyValue(TOAST_MOTION_DURATION_VAR).trim()
    const parsed = parseCssDurationMs(computed)
    if (parsed != null)
      return computed
  }
  if (element instanceof HTMLElement)
    return element.style.getPropertyValue(TOAST_MOTION_DURATION_VAR)
  return ''
}

/**
 * 读 toast 视口上的运动时长。
 * 样式还没算出来时用 165 毫秒，和 `--astryx-duration-fast-max` 的默认值一致。
 */
export function readToastMotionDurationMs(element: Element | null | undefined): number {
  if (element == null)
    return TOAST_MOTION_DURATION_FALLBACK_MS
  return parseCssDurationMs(readDurationRaw(element)) ?? TOAST_MOTION_DURATION_FALLBACK_MS
}
