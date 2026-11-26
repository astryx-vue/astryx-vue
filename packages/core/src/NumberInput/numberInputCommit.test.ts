import { describe, expect, it } from 'vitest'
import { getNumberInputRejection, parseNumberInput, resolveNumberInputCommit } from './numberInputCommit.js'

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

describe('getNumberInputRejection', () => {
  it('rejects text that is not a number', () => {
    expect(getNumberInputRejection('12abc', { locale: 'en-US' })).toEqual({ kind: 'unreadable' })
  })

  it('rejects a fraction in an integer-only field and names the number', () => {
    expect(getNumberInputRejection('2.5', { isIntegerOnly: true })).toEqual({ kind: 'fractional', value: 2.5 })
  })

  it('rejects any number while the range is empty', () => {
    expect(getNumberInputRejection('4', { min: 10, max: 2 })).toEqual({ kind: 'outOfRange', value: 4 })
    // 整数字段把边界往里取整：没有整数落在 (1.2, 1.8) 里。
    expect(getNumberInputRejection('1', { min: 1.2, max: 1.8, isIntegerOnly: true })).toEqual({ kind: 'outOfRange', value: 1 })
  })

  it('does not reject an empty draft, a valid number or a number outside an ordinary range', () => {
    expect(getNumberInputRejection('  ', {})).toBeNull()
    expect(getNumberInputRejection('7', { min: 1, max: 9 })).toBeNull()
    expect(getNumberInputRejection('100', { min: 1, max: 9 })).toBeNull()
  })
})
