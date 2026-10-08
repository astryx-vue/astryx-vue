import { describe, expect, it } from 'vitest'
import { computeLayerPosition } from './position.js'

const viewport = { width: 1024, height: 768 }
const layer = { width: 120, height: 28 }

function rect(top: number, left: number, width = 100, height = 32): DOMRect {
  return { top, left, width, height, bottom: top + height, right: left + width, x: left, y: top, toJSON: () => ({}) } as DOMRect
}

describe('computeLayerPosition', () => {
  it('places an above layer centered over an in-view anchor', () => {
    const position = computeLayerPosition(rect(300, 400), layer, viewport, 'above', 'center', 4)

    expect(position).toEqual({ top: 268, left: 390, placement: 'above' })
  })

  it('clamps an in-view layer to the viewport margin', () => {
    const position = computeLayerPosition(rect(2, 2), layer, viewport, 'start', 'start', 4)

    expect(position.left).toBeGreaterThanOrEqual(8)
    expect(position.top).toBeGreaterThanOrEqual(8)
  })

  it('keeps the layer anchored when the anchor is fully below the viewport', () => {
    const anchor = rect(2151, 505)
    const position = computeLayerPosition(anchor, layer, viewport, 'above', 'center', 4)

    expect(position.top).toBe(anchor.top - 4 - layer.height)
    expect(position.top).toBeGreaterThan(viewport.height)
  })

  it('keeps the layer anchored when the anchor is fully above the viewport', () => {
    const anchor = rect(-500, 505)
    const position = computeLayerPosition(anchor, layer, viewport, 'below', 'center', 4)

    expect(position.top).toBe(anchor.bottom + 4)
    expect(position.top).toBeLessThan(0)
  })
})
