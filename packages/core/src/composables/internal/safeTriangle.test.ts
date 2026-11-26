import { describe, expect, it } from 'vitest'
import { isPointInSafeTriangle } from './safeTriangle.js'

describe('isPointInSafeTriangle', () => {
  const flyout = { top: 0, bottom: 200, left: 300, right: 500 }

  it('accepts a point between the apex and the near edge of a flyout to the right', () => {
    const apex = { x: 250, y: 100 }
    expect(isPointInSafeTriangle({ x: 275, y: 100 }, apex, flyout)).toBe(true)
    expect(isPointInSafeTriangle({ x: 290, y: 30 }, apex, flyout)).toBe(true)
    expect(isPointInSafeTriangle({ x: 290, y: 180 }, apex, flyout)).toBe(true)
  })

  it('rejects a point that has left the triangle', () => {
    const apex = { x: 250, y: 100 }
    expect(isPointInSafeTriangle({ x: 250, y: 400 }, apex, flyout)).toBe(false)
    expect(isPointInSafeTriangle({ x: 200, y: 100 }, apex, flyout)).toBe(false)
    expect(isPointInSafeTriangle({ x: 260, y: 300 }, apex, flyout)).toBe(false)
  })

  it('uses the right edge when the flyout flipped to the left of the pointer', () => {
    const apex = { x: 550, y: 100 }
    expect(isPointInSafeTriangle({ x: 525, y: 100 }, apex, flyout)).toBe(true)
    expect(isPointInSafeTriangle({ x: 600, y: 100 }, apex, flyout)).toBe(false)
  })

  it('uses the top or bottom edge when the pointer left above or below the flyout', () => {
    expect(isPointInSafeTriangle({ x: 400, y: -20 }, { x: 400, y: -40 }, flyout)).toBe(true)
    expect(isPointInSafeTriangle({ x: 400, y: 220 }, { x: 400, y: 240 }, flyout)).toBe(true)
  })

  it('has no triangle when the pointer left from over the flyout itself', () => {
    expect(isPointInSafeTriangle({ x: 400, y: 100 }, { x: 400, y: 100 }, flyout)).toBe(false)
  })
})
