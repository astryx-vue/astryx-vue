/**
 * @file segmentedGeometry.test.ts
 * @input segmentedGeometry.ts with segments built by hand
 * @output The segment a lift commits, along the control's axis, and the
 *   hysteresis of the selected title's face under a dragging lens
 * @position Unit tests of segmentedGeometry.ts
 */

import type { Box, SegmentSpan } from './segmentedGeometry'
import { describe, expect, it } from 'vitest'
import { facedSegmentAt, liftTargetAt } from './segmentedGeometry'

function segment(value: string, isDisabled = false): HTMLElement {
  const element = document.createElement('button')
  element.dataset.value = value
  if (isDisabled)
    element.setAttribute('aria-disabled', 'true')
  return element
}

const a = segment('a')
const b = segment('b')
const c = segment('c', true)
/** Three segments in a row with 4 px gaps; the last one is disabled. */
const spans: SegmentSpan[] = [
  { element: a, left: 0, right: 60, top: 0, bottom: 32 },
  { element: b, left: 64, right: 154, top: 0, bottom: 32 },
  { element: c, left: 158, right: 198, top: 0, bottom: 32 },
]

describe('liftTargetAt', () => {
  it('counts along the axis: above, below and past the ends choose by x', () => {
    expect(liftTargetAt(100, -80, spans)).toBe(b)
    expect(liftTargetAt(100, 400, spans)).toBe(b)
    expect(liftTargetAt(-50, 16, spans)).toBe(a)
  })

  it('splits a gap at its middle and names no disabled segment', () => {
    expect(liftTargetAt(61.9, 16, spans)).toBe(a)
    expect(liftTargetAt(62.1, 16, spans)).toBe(b)
    expect(liftTargetAt(300, 16, spans)).toBeNull()
  })
})

describe('facedSegmentAt', () => {
  const boxes: [HTMLElement, Box][] = [
    [a, { x: 0, y: 0, width: 60, height: 32 }],
    [b, { x: 64, y: 0, width: 80, height: 32 }],
  ]

  it('moves the face only a quarter of the next segment past the boundary', () => {
    // The boundary is at 62; a quarter of b is 20 px.
    expect(facedSegmentAt(81, boxes, a)).toBe(a)
    expect(facedSegmentAt(82, boxes, a)).toBe(b)
    // Back: a quarter of a is 15 px.
    expect(facedSegmentAt(48, boxes, b)).toBe(b)
    expect(facedSegmentAt(47, boxes, b)).toBe(a)
  })
})
