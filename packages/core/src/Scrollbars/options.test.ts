import { describe, expect, it } from 'vitest'
import { mergeOptions } from './options.js'

describe('mergeOptions', () => {
  it('merges plain objects recursively', () => {
    const merged = mergeOptions(
      { scrollbars: { theme: 'a', autoHide: 'scroll' }, overflow: { x: 'scroll' } },
      { scrollbars: { autoHide: 'never' } },
    )

    expect(merged).toEqual({
      scrollbars: { theme: 'a', autoHide: 'never' },
      overflow: { x: 'scroll' },
    })
  })

  it('replaces arrays and non-plain objects instead of merging them', () => {
    const date = new Date(0)
    const merged = mergeOptions({ list: [1, 2], when: new Date(5) }, { list: [3], when: date })

    expect(merged.list).toEqual([3])
    expect(merged.when).toBe(date)
  })

  it('ignores undefined overrides and keeps the base value', () => {
    expect(mergeOptions({ a: 1, b: { c: 2 } }, { a: undefined, b: undefined })).toEqual({ a: 1, b: { c: 2 } })
  })

  it('does not mutate either input', () => {
    const base = { nested: { a: 1 } }
    const override = { nested: { b: 2 } }
    const merged = mergeOptions(base, override)

    expect(base).toEqual({ nested: { a: 1 } })
    expect(override).toEqual({ nested: { b: 2 } })
    expect(merged.nested).not.toBe(base.nested)
  })

  it('returns a copy when there is no override', () => {
    const base = { a: 1 }
    const merged = mergeOptions(base, undefined)

    expect(merged).toEqual(base)
    expect(merged).not.toBe(base)
  })
})
