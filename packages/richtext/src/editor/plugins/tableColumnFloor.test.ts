import { describe, expect, it } from 'vitest'
import { tableColumnFloors } from './tableColumnFloor.js'

describe('tableColumnFloors', () => {
  it('returns nothing for a table with no rows', () => {
    expect(tableColumnFloors([])).toEqual([])
  })

  it('never goes below 4ch, even for short columns', () => {
    expect(tableColumnFloors([[1, 1], [1, 2]])).toEqual([4, 4])
  })

  it('lets the longest cell wrap to about two lines', () => {
    // 最长 18 个字 → 9ch，高于下限 4ch，低于表头的一行上限
    expect(tableColumnFloors([[3], [18]])).toEqual([9])
  })

  it('keeps a header on one line up to its cap of 20ch', () => {
    expect(tableColumnFloors([[12], [2]])).toEqual([12])
    expect(tableColumnFloors([[30], [2]])).toEqual([20])
  })

  it('caps a column at 24ch however long the content is', () => {
    expect(tableColumnFloors([[3], [200]])).toEqual([24])
  })

  it('treats a missing body cell as empty', () => {
    expect(tableColumnFloors([[5, 5], [10]])).toEqual([5, 5])
  })
})
