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

  it('clamps an in-view layer to the viewport gutter on the far edges only', () => {
    // end 对齐的 below 浮层：起始边受空隙约束，结束边贴着锚点。
    const position = computeLayerPosition(rect(2, 2), layer, viewport, 'below', 'end', 4)

    expect(position.left).toBeGreaterThanOrEqual(16)
    expect(position.top).toBe(38)
  })

  it('lets a start-aligned layer share the trigger origin inside the gutter', () => {
    const position = computeLayerPosition(rect(2, 8), layer, viewport, 'below', 'start', 4)

    expect(position.left).toBe(8)
  })

  it('flips a start-aligned layer to end alignment when it would run past the inline end edge', () => {
    // 原版 position-try 的 flip-inline：右边放不下就改成和触发器右边对齐。
    const anchor = rect(100, viewport.width - 40, 32, 32)
    const position = computeLayerPosition(anchor, layer, viewport, 'below', 'start', 4)

    expect(position.left).toBe(anchor.right - layer.width)
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
