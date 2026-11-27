/**
 * @file wheelOptions.ts
 * @input Nothing; the option type and pure functions over a wheel's rows
 * @output PickerWheelOption, the keys a wheel answers (wheelKeyOf), the row a
 *   key moves to (steppedRow) and the enabled row nearest a rest
 *   (nearestEnabledIndex): what both wheel columns share
 * @position Internal; read by PickerWheel.vue, TouchPickerWheel.vue and
 *   useTouchWheel.ts
 */

export interface PickerWheelOption {
  value: string
  label: string
  /** Rows outside the bounds stay visible but cannot be committed. */
  disabled?: boolean
}

/** Rows a Page Up or Page Down key moves. */
export const PAGE_ROWS = 10

/** A key a wheel answers: a step of some rows, or one end. */
export type WheelKey = { step: number } | { end: 'first' | 'last' }

const STEPS: Record<string, number> = {
  ArrowUp: -1,
  ArrowDown: 1,
  PageUp: -PAGE_ROWS,
  PageDown: PAGE_ROWS,
}

/** What `key` asks of a wheel, or null for a key it leaves alone. */
export function wheelKeyOf(key: string): WheelKey | null {
  const step = STEPS[key]
  if (step != null)
    return { step }
  if (key === 'Home')
    return { end: 'first' }
  if (key === 'End')
    return { end: 'last' }
  return null
}

/**
 * The row `key` moves to from row `from`. Keys walk the enabled rows only: an
 * Arrow moves one, a Page key ten, Home and End go to the first and last. A
 * key stops at the end instead of wrapping round. Null when the key goes
 * nowhere new, or no row is enabled.
 */
export function steppedRow(options: ReadonlyArray<PickerWheelOption>, from: number, key: WheelKey): number | null {
  const enabled: number[] = []
  options.forEach((option, index) => {
    if (!option.disabled)
      enabled.push(index)
  })
  if (enabled.length === 0)
    return null
  const last = enabled.length - 1
  const current = enabled.indexOf(from)
  let next: number
  if ('end' in key)
    next = key.end === 'first' ? 0 : last
  else if (current < 0)
    next = key.step > 0 ? 0 : last
  else
    next = Math.min(Math.max(current + key.step, 0), last)
  const row = enabled[next] ?? null
  return row === from ? null : row
}

/**
 * The enabled row nearest `index`, for a wheel that came to rest there. On a
 * tie it goes toward `towardIndex` (the committed row). With no enabled row
 * it is `towardIndex`.
 */
export function nearestEnabledIndex(options: ReadonlyArray<PickerWheelOption>, index: number, towardIndex: number): number {
  const isEnabled = (i: number): boolean => i >= 0 && i < options.length && !options[i]!.disabled
  if (isEnabled(index))
    return index
  for (let distance = 1; distance < options.length; distance++) {
    const below = isEnabled(index - distance)
    const above = isEnabled(index + distance)
    if (below && above)
      return towardIndex < index ? index - distance : index + distance
    if (below)
      return index - distance
    if (above)
      return index + distance
  }
  return towardIndex
}
