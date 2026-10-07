export const THUMB_SIZE = 20

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
