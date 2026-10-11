import { describe, expect, it } from 'vitest'
import { computeOverflow } from './useOverflow'

describe('computeOverflow', () => {
  it('shows everything when the row is wide enough', () => {
    expect(computeOverflow([40, 40, 40], 200, 4, 32)).toBe(3)
  })

  it('reserves room for the overflow indicator', () => {
    // 40 + 4 + 40 = 84, plus gap + indicator 4 + 32 = 120. Third item does not fit.
    expect(computeOverflow([40, 40, 40], 120, 4, 32)).toBe(2)
    expect(computeOverflow([40, 40, 40], 80, 4, 32)).toBe(1)
  })

  it('returns every item when the container has not been measured', () => {
    expect(computeOverflow([40, 40], 0, 4, 32)).toBe(2)
  })

  it('returns zero for an empty list and when even one item cannot fit', () => {
    expect(computeOverflow([], 100, 4, 32)).toBe(0)
    expect(computeOverflow([80, 80], 50, 4, 32)).toBe(0)
  })
})
