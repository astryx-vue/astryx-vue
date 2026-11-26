import { describe, expect, it } from 'vitest'
import { keepClearOfAnchor } from './anchorClear.js'
import { computeLayerPosition } from './position.js'

const viewport = { width: 1024, height: 400 }
const gutter = { blockStart: 16, blockEnd: 16, inlineStart: 16, inlineEnd: 16 }

function rect(top: number, left: number, width = 100, height = 32): DOMRect {
  return { top, left, width, height, bottom: top + height, right: left + width, x: left, y: top, toJSON: () => ({}) } as DOMRect
}

function place(anchor: DOMRect, layer: { width: number, height: number }) {
  const placed = computeLayerPosition(anchor, layer, viewport, 'above', 'center', 4, gutter)
  return { placed, clear: keepClearOfAnchor(placed, anchor, layer, viewport, 4, gutter) }
}

describe('keepClearOfAnchor', () => {
  it('装得下的浮层原样不动', () => {
    const { placed, clear } = place(rect(180, 400), { width: 120, height: 28 })
    expect(clear).toBe(placed)
  })

  it('比上下空地都高、但装得进视口时，挪到触发器右边而不盖住它', () => {
    const anchor = rect(180, 400)
    const layer = { width: 120, height: 300 }
    const { placed, clear } = place(anchor, layer)
    // 普通落点被夹进视口，盖在触发器上。
    expect(placed.top < anchor.bottom && placed.top + layer.height > anchor.top).toBe(true)
    expect(clear).toMatchObject({ left: anchor.right + 4, placement: 'end' })
    expect(clear.maxHeight).toBeUndefined()
  })

  it('右边放不下就放左边', () => {
    const anchor = rect(180, 1024 - 140)
    const layer = { width: 200, height: 300 }
    const { clear } = place(anchor, layer)
    expect(clear).toMatchObject({ left: anchor.left - 4 - layer.width, placement: 'start' })
  })

  it('比视口还高时放在空地更大的一侧并限高', () => {
    const anchor = rect(120, 400)
    const layer = { width: 120, height: 900 }
    const { clear } = place(anchor, layer)
    const roomBelow = viewport.height - anchor.bottom - 4 - gutter.blockEnd
    expect(clear.placement).toBe('below')
    expect(clear.top).toBe(anchor.bottom + 4)
    expect(clear.maxHeight).toBe(roomBelow)
  })
})
