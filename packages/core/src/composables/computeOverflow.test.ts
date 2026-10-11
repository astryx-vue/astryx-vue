import { describe, expect, it } from 'vitest'
import { computeOverflow } from './computeOverflow.js'

const widths = [40, 40, 40, 40]

describe('computeOverflow', () => {
  it('keeps every item when the row is wide enough', () => {
    expect(computeOverflow({
      availableWidth: 200,
      collapseFrom: 'end',
      gap: 8,
      indicatorWidth: 32,
      minVisibleItems: 0,
      widths,
    })).toEqual({ rows: 1, visibleCount: 4 })
  })

  it('reserves room for the overflow indicator', () => {
    expect(computeOverflow({
      availableWidth: 136,
      collapseFrom: 'end',
      gap: 8,
      indicatorWidth: 32,
      minVisibleItems: 0,
      widths,
    }).visibleCount).toBe(2)
  })

  it('counts the same number of items when collapsing from the start', () => {
    const input = {
      availableWidth: 120,
      gap: 8,
      indicatorWidth: 32,
      minVisibleItems: 0,
      widths,
    }
    const fromEnd = computeOverflow({ ...input, collapseFrom: 'end' })
    const fromStart = computeOverflow({ ...input, collapseFrom: 'start' })
    expect(fromStart.visibleCount).toBe(fromEnd.visibleCount)
  })

  it('respects the minimum and maximum', () => {
    expect(computeOverflow({
      availableWidth: 10,
      collapseFrom: 'end',
      gap: 0,
      indicatorWidth: 20,
      minVisibleItems: 1,
      widths,
    }).visibleCount).toBe(1)

    expect(computeOverflow({
      availableWidth: 400,
      collapseFrom: 'end',
      gap: 0,
      indicatorWidth: 0,
      maxVisibleItems: 2,
      minVisibleItems: 0,
      widths,
    }).visibleCount).toBe(2)
  })

  it('packs extra rows before overflowing', () => {
    const result = computeOverflow({
      availableWidth: 88,
      collapseFrom: 'end',
      gap: 8,
      indicatorWidth: 32,
      maxRows: 2,
      minVisibleItems: 0,
      widths,
    })
    expect(result.visibleCount).toBeGreaterThan(2)
    expect(result.rows).toBeGreaterThan(1)
  })

  it('returns an empty result for an empty list', () => {
    expect(computeOverflow({
      availableWidth: 100,
      collapseFrom: 'end',
      gap: 0,
      indicatorWidth: 0,
      minVisibleItems: 0,
      widths: [],
    })).toEqual({ rows: 0, visibleCount: 0 })
  })
})
