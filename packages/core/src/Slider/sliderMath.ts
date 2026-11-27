import { slider as UIKIT_SLIDER } from '../motion/uikit/slider'

export const THUMB_SIZE = 20

/** How far a thumb's touch target reaches past the thumb on each side (UISlider's 48 pt square). */
const HIT_GROWTH = (UIKIT_SLIDER.thumbHitTarget - THUMB_SIZE) / 2

/**
 * A thumb's touch-target insets, which its `::before` draws under a finger.
 * A range's two targets never reach into each other: on the side facing the
 * other thumb the growth stops at half the gap, so a finger takes the nearer
 * thumb. Container units measure the travel, so the gap needs no layout read.
 */
export function thumbHitInsets(index: number, values: readonly number[], min: number, max: number, isHorizontal: boolean): Record<string, string> {
  const full = `${-HIT_GROWTH}px`
  const isRange = values.length === 2
  let facing = full
  if (isRange && max > min) {
    const spread = (values[1]! - values[0]!) / (max - min)
    const travel = isHorizontal ? '100cqi' : '100cqb'
    facing = `calc(-1 * clamp(0px, (${spread} * (${travel} - ${THUMB_SIZE}px) - ${THUMB_SIZE}px) / 2, ${HIT_GROWTH}px))`
  }
  // Values grow toward the inline end, and upward on a vertical slider.
  const towardLower = isRange && index === 1 ? facing : full
  const towardUpper = isRange && index === 0 ? facing : full
  const [top, bottom, start, end] = isHorizontal ? [full, full, towardLower, towardUpper] : [towardUpper, towardLower, full, full]
  return { '--_slider-hit-top': top, '--_slider-hit-bottom': bottom, '--_slider-hit-start': start, '--_slider-hit-end': end }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

function precision(value: number): number {
  const [coefficient = '', exponent = '0'] = String(value).split('e')
  return Math.max(0, (coefficient.split('.')[1]?.length ?? 0) - Number(exponent))
}

export function snap(value: number, min: number, step: number): number {
  const snapped = min + Math.round((value - min) / step) * step
  return Number(snapped.toFixed(Math.min(20, Math.max(precision(min), precision(step)))))
}

export function percent(value: number, min: number, max: number): number {
  return max === min ? 0 : (value - min) / (max - min) * 100
}

export function position(value: number): string {
  return `calc(${value}% + ${THUMB_SIZE / 2}px - ${value / 100 * THUMB_SIZE}px)`
}

export function add(first: number, second: number): number {
  return Number((first + second).toFixed(Math.min(20, Math.max(precision(first), precision(second)))))
}

export function multiply(first: number, second: number): number {
  return Number((first * second).toFixed(Math.min(20, precision(first) + precision(second))))
}
