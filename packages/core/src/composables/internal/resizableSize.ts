/**
 * @file resizableSize.ts
 * @position useResizable 内部：把尺寸写法（像素、百分比、percent()）换算成像素，读取百分比的基准
 */
import type { PixelWidth } from '../../Table/types.js'
import type { ResizableDirection, ResizablePercentSize, ResizableSize } from '../useResizable.js'

const UNMEASURED_BASIS = 1200

export function percent(
  value: number,
  options: { min: PixelWidth, max?: never } | { min?: never, max: PixelWidth },
): ResizablePercentSize {
  return { type: 'percent', value, ...options }
}

export interface Basis {
  px: number
  measured: boolean
}

export function readBasis(container: HTMLElement | null | undefined, direction: ResizableDirection): Basis {
  if (container) {
    const px = direction === 'horizontal' ? container.clientWidth : container.clientHeight
    if (px > 0)
      return { px, measured: true }
    return { px: UNMEASURED_BASIS, measured: false }
  }
  if (typeof window === 'undefined')
    return { px: UNMEASURED_BASIS, measured: false }
  const px = direction === 'horizontal' ? window.innerWidth : window.innerHeight
  return { px: px > 0 ? px : UNMEASURED_BASIS, measured: px > 0 }
}

export function parseSize(value: ResizableSize | string | undefined, basis: number, fallback: number): number {
  if (value == null)
    return fallback
  if (typeof value === 'number')
    return value
  if (typeof value === 'string') {
    const text = value.trim()
    if (text.endsWith('%'))
      return (Number(text.slice(0, -1)) / 100) * basis
    if (text.endsWith('px'))
      return Number(text.slice(0, -2))
    const asNumber = Number(text)
    return Number.isFinite(asNumber) ? asNumber : fallback
  }
  if (value.type === 'pixel')
    return value.value
  const px = (value.value / 100) * basis
  if (value.min)
    return Math.max(px, value.min.value)
  if (value.max)
    return Math.min(px, value.max.value)
  return px
}

export function clampSize(size: number, min: number, max: number, snaps: number[]): number {
  const clamped = Math.min(max, Math.max(min, size))
  if (snaps.length === 0)
    return clamped
  let nearest = snaps[0] ?? clamped
  let nearestDist = Math.abs(clamped - nearest)
  for (let index = 1; index < snaps.length; index += 1) {
    const snap = snaps[index] ?? nearest
    const dist = Math.abs(clamped - snap)
    if (dist < nearestDist) {
      nearest = snap
      nearestDist = dist
    }
  }
  return Math.min(max, Math.max(min, nearest))
}

export function sizeDependsOnBasis(value: ResizableSize | string | undefined): boolean {
  if (typeof value === 'string')
    return value.trim().endsWith('%')
  return typeof value === 'object' && value != null && value.type === 'percent'
}

export function contentBox(element: HTMLElement, direction: ResizableDirection): number | null {
  const style = getComputedStyle(element)
  const size = direction === 'vertical'
    ? element.clientHeight - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom)
    : element.clientWidth - Number.parseFloat(style.paddingLeft) - Number.parseFloat(style.paddingRight)
  return Number.isFinite(size) ? size : null
}
