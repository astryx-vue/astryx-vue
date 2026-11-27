import type { DraftEdit } from './sheetDraftEdits.js'
import type { PowerSearchFilter } from './types.js'
import { describe, expect, it } from 'vitest'
import { hasSameFilters, removedFilters, replayDraftEdits } from './sheetDraftEdits.js'
import { createFilterIdentities, filterSignature, nearestEditableIndex, resolveFilterIdentityIndex } from './sheetFilterIdentity.js'

const name = (value: string, extra: Partial<PowerSearchFilter> = {}): PowerSearchFilter => ({ field: 'name', operator: 'contains', value: { type: 'string', value }, ...extra })

function record() {
  const reports: Array<[string[], string, number]> = []
  return {
    reports,
    report: (filters: PowerSearchFilter[], changeType: string, index: number) => {
      reports.push([filters.map(filter => (filter.value as { value: string }).value), changeType, index])
    },
  }
}

describe('sheet draft replay', () => {
  it('replays each edit onto the latest filters and reports every step', () => {
    const ada = name('ada')
    const bob = name('bob')
    const cy = name('cy')
    const edits: DraftEdit[] = [
      { before: [ada, bob], after: [ada, bob, cy], changeType: 'add', index: 2 },
      { before: [ada, bob, cy], after: [ada, name('bea'), cy], changeType: 'edit', index: 1 },
      { before: [ada, name('bea'), cy], after: [name('bea'), cy], changeType: 'remove', index: 0 },
    ]
    // 父组件在弹层开着时自己加了一个条件。
    const latest = [ada, bob, name('zed')]
    const { reports, report } = record()
    const result = replayDraftEdits(latest, edits, report)
    expect(reports).toEqual([
      [['ada', 'bob', 'zed', 'cy'], 'add', 3],
      [['ada', 'bea', 'zed', 'cy'], 'edit', 1],
      [['bea', 'zed', 'cy'], 'remove', 0],
    ])
    expect(result.map(filter => (filter.value as { value: string }).value)).toEqual(['bea', 'zed', 'cy'])
  })

  it('skips edits whose target the parent already removed', () => {
    const ada = name('ada')
    const edits: DraftEdit[] = [
      { before: [ada], after: [name('ann')], changeType: 'edit', index: 0 },
      { before: [ada], after: [], changeType: 'remove', index: 0 },
    ]
    const { reports, report } = record()
    expect(replayDraftEdits([], edits, report)).toEqual([])
    expect(reports).toEqual([])
  })

  it('compares filters by structure, not object identity', () => {
    expect(hasSameFilters([name('a')], [name('a')])).toBe(true)
    expect(hasSameFilters([name('a')], [name('a', { isReadOnly: true })])).toBe(false)
    expect(removedFilters([name('a'), name('a'), name('b')], [name('a')]).map(filterSignature)).toEqual([name('a'), name('b')].map(filterSignature))
  })
})

describe('sheet filter identity', () => {
  it('finds the edited filter again after the parent clones or reorders the list', () => {
    const ada = name('ada')
    const signature = filterSignature(ada)
    expect(resolveFilterIdentityIndex([name('x'), ada], ada, signature, 0)).toBe(1)
    expect(resolveFilterIdentityIndex([name('ada'), name('x')], ada, signature, 0)).toBe(0)
    expect(resolveFilterIdentityIndex([name('x'), name('ada')], ada, signature, 0)).toBe(1)
    expect(resolveFilterIdentityIndex([name('ada'), name('ada')], ada, signature, 5)).toBeNull()
  })

  it('keeps row ids stable across clones and hands new rows new ids', () => {
    const identities = createFilterIdentities()
    const first = identities.next([name('a'), name('b')])
    const second = identities.next([name('b'), name('a'), name('c')])
    expect(second).toEqual([first[1], first[0], 2])
  })

  it('moves focus to the nearest editable row, preferring the later one on a tie', () => {
    const rows = [name('a'), name('b', { isReadOnly: true }), name('c')]
    expect(nearestEditableIndex(rows, 1)).toBe(2)
    expect(nearestEditableIndex([name('a', { isReadOnly: true })], 0)).toBeUndefined()
  })
})
