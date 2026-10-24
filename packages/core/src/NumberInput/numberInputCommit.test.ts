import { describe, expect, it } from 'vitest'
import { parseNumberInput, resolveNumberInputCommit } from './numberInputCommit.js'

describe('parseNumberInput', () => {
  it('accepts a localized draft only when it is inside the range', () => {
    expect(parseNumberInput('1.234.567', { locale: 'de-DE' })).toBe(1234567)
    expect(parseNumberInput('1·234·567', { locale: 'de-DE' })).toBeNull()
    expect(parseNumberInput('20', { max: 10 })).toBeNull()
  })
})

describe('resolveNumberInputCommit', () => {
  it('commits one valid localized draft', () => {
    expect(resolveNumberInputCommit('1.234.567', { locale: 'de-DE', hasClear: false })).toEqual({
      type: 'commit',
      value: 1234567,
      didClamp: false,
    })
  })

  it('reverts the whole draft when parsing fails', () => {
    expect(resolveNumberInputCommit('12abc', { locale: 'en-US', hasClear: false })).toEqual({ type: 'revert' })
  })

  it('clamps an out-of-range draft', () => {
    expect(resolveNumberInputCommit('100', { min: 1, max: 2, isIntegerOnly: true, hasClear: false })).toEqual({
      type: 'commit',
      value: 2,
      didClamp: true,
    })
  })

  it('clears an empty draft only when the field can be cleared', () => {
    expect(resolveNumberInputCommit('', { hasClear: true })).toEqual({ type: 'clear' })
    expect(resolveNumberInputCommit('', { hasClear: false })).toEqual({ type: 'revert' })
  })

  it('reverts when no value can satisfy the bounds', () => {
    expect(resolveNumberInputCommit('10', { min: 5, max: 2, hasClear: false })).toEqual({ type: 'revert' })
  })
})
