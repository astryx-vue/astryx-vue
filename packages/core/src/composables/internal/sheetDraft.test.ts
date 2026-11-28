import { describe, expect, it } from 'vitest'
import { hasSameSelection, nameSheetDraftChange } from './sheetDraft.js'

const a = { id: 'a', label: 'A' }
const b = { id: 'b', label: 'B' }
const c = { id: 'c', label: 'C' }

describe('hasSameSelection', () => {
  it('compares selections as sets', () => {
    expect(hasSameSelection([a, b], [b, a])).toBe(true)
    expect(hasSameSelection([a], [a, b])).toBe(false)
    expect(hasSameSelection([a, b], [a, c])).toBe(false)
  })
})

describe('nameSheetDraftChange', () => {
  it('reports nothing when the draft matches the selection at open', () => {
    expect(nameSheetDraftChange([a], [a], { item: b, type: 'remove' })).toBeNull()
  })

  it('names the last edit while it still holds', () => {
    expect(nameSheetDraftChange([a], [a, b, c], { item: c, type: 'add' })).toEqual({ item: c, type: 'add' })
    expect(nameSheetDraftChange([a, b], [b], { item: a, type: 'remove' })).toEqual({ item: a, type: 'remove' })
  })

  it('falls back to a net removal after a removal that no longer holds', () => {
    // 删了 A，又删了 C 再加回 C：最后一次（删 C）不成立，报还缺着的 A。
    expect(nameSheetDraftChange([a, c], [c], { item: c, type: 'remove' })).toEqual({ item: a, type: 'remove' })
  })

  it('falls back to a net add, keeping create when the last edit created it', () => {
    expect(nameSheetDraftChange([a], [a, b], { item: a, type: 'add' })).toEqual({ item: b, type: 'add' })
    expect(nameSheetDraftChange([a], [a, b], { item: b, type: 'create' })).toEqual({ item: b, type: 'create' })
    expect(nameSheetDraftChange([a], [b], null)).toEqual({ item: b, type: 'add' })
  })

  it('names a net removal when nothing was added', () => {
    expect(nameSheetDraftChange([a, b], [a], { item: c, type: 'add' })).toEqual({ item: b, type: 'remove' })
  })
})
