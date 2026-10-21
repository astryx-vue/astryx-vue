import { describe, expect, it } from 'vitest'
import { formatEditableNumber, parseLocaleNumber } from './numberParser.js'

const NBSP = '\u00A0'
const NARROW_NBSP = '\u202F'
const APOSTROPHE = '\u2019'
const MIDDLE_DOT = '\u00B7'

const CORPUS: [string, string, number | null][] = [
  ['1,234,234,234', 'en-US', 1234234234],
  ['1,234,234,234', 'de-DE', 1234234234],
  ['1,234,234,234', 'fr-FR', 1234234234],
  ['1,234,234,234', 'ar-SA', 1234234234],
  ['1.234.234.234', 'de-DE', 1234234234],
  ['1.234.234.234', 'en-US', 1234234234],
  [`1${NARROW_NBSP}234${NARROW_NBSP}234${NARROW_NBSP}234`, 'fr-FR', 1234234234],
  [`1${NBSP}234${NBSP}234`, 'fr-FR', 1234234],
  [`1${NBSP}234`, 'en-US', 1234],
  [`1${APOSTROPHE}234${APOSTROPHE}234`, 'de-CH', 1234234],
  ['1\'234\'234', 'de-CH', 1234234],
  ['1,234', 'en-US', 1234],
  ['1,234', 'de-DE', 1.234],
  ['12,34,567', 'en-IN', 1234567],
  ['12,34,567', 'en-US', null],
  ['1,23,4', 'en-US', null],
  ['1,2345', 'en-US', null],
  ['12 34', 'en-US', null],
  ['1,5', 'de-DE', 1.5],
  ['1,5', 'en-US', null],
  ['1.5', 'en-US', 1.5],
  ['1.5', 'de-DE', 1.5],
  ['1.5', 'fr-FR', 1.5],
  ['1234.56', 'de-DE', 1234.56],
  ['-3.25', 'fr-FR', -3.25],
  ['0.5', 'de-DE', 0.5],
  ['1.5e3', 'de-DE', 1500],
  ['1.234', 'de-DE', 1234],
  ['1.2345', 'de-DE', 1.2345],
  ['1.234', 'fr-FR', 1.234],
  ['1,234.56', 'en-US', 1234.56],
  ['1.234,56', 'de-DE', 1234.56],
  ['1,234.56', 'de-DE', null],
  ['-1,234.56', 'en-US', -1234.56],
  ['+7', 'en-US', 7],
  ['-7', 'en-US', -7],
  ['7-', 'ar-SA', -7],
  ['.5', 'en-US', 0.5],
  ['5.', 'en-US', 5],
  ['-', 'en-US', null],
  ['', 'en-US', null],
  ['   ', 'en-US', null],
  ['  42  ', 'en-US', 42],
  ['\t1,234\n', 'en-US', 1234],
  ['1,234\n5,678', 'en-US', null],
  ['١٢٣', 'ar-SA', 123],
  ['۱۲۳', 'fa-IR', 123],
  ['१२३', 'hi-IN', 123],
  ['１２３', 'ja-JP', 123],
  ['١,٢٣٤', 'en-US', 1234],
  ['٣٫٥', 'ar-SA', 3.5],
  ['$1,234.56', 'en-US', 1234.56],
  ['£1,234', 'en-US', 1234],
  ['1.234,56 €', 'de-DE', 1234.56],
  ['1.234,56 €', 'en-US', null],
  ['-$1,234', 'en-US', -1234],
  ['1,234 GB', 'en-US', null],
  ['72°F', 'en-US', null],
  ['1,234 kg', 'en-US', null],
  ['(1,234)', 'en-US', -1234],
  ['($1,234.50)', 'en-US', -1234.5],
  ['(1,234', 'en-US', null],
  ['(-1,234)', 'en-US', null],
  ['(+1,234)', 'en-US', null],
  ['\u22121234', 'en-US', -1234],
  ['\u20131234', 'en-US', -1234],
  ['1.23E+09', 'en-US', 1230000000],
  ['1.23e9', 'en-US', 1230000000],
  ['1.5e-3', 'en-US', 0.0015],
  ['1e', 'en-US', null],
  ['\uFEFF1,234', 'en-US', 1234],
  ['1,234\u200B', 'en-US', 1234],
  ['\u200E1,234', 'en-US', 1234],
  ['NaN', 'en-US', null],
  ['Infinity', 'en-US', null],
  ['abc', 'en-US', null],
  ['12abc', 'en-US', null],
  ['1/2', 'en-US', null],
  ['1 234 (approx)', 'en-US', null],
  ['--5', 'en-US', null],
  ['1..234', 'en-US', null],
  ['123-456-789', 'en-US', null],
  ['1-800-555', 'en-US', null],
  ['555-123-456', 'en-US', null],
  ['1_234_567', 'en-US', null],
  ['1/234/567', 'en-US', null],
  ['1:234:567', 'en-US', null],
  ['1*234*567', 'en-US', null],
  ['800-555-1212', 'en-US', null],
  ['2024-01-15', 'en-US', null],
  [`1${MIDDLE_DOT}234${MIDDLE_DOT}567`, 'en-US', null],
  [`1${MIDDLE_DOT}234${MIDDLE_DOT}567`, 'ca-ES', null],
  ['45%', 'en-US', null],
  ['0.5%', 'en-US', null],
  ['45 %', 'fr-FR', null],
]

describe('parseLocaleNumber', () => {
  it.each(CORPUS)('reads %j in %s', (input, locale, expected) => {
    expect(parseLocaleNumber(input, locale)).toBe(expected)
  })

  it('reads the grouping each locale writes', () => {
    for (const locale of ['en-US', 'de-DE', 'fr-FR', 'de-CH', 'en-IN', 'ar-SA']) {
      const text = new Intl.NumberFormat(locale).format(1234234234)
      expect(parseLocaleNumber(text, locale)).toBe(1234234234)
    }
  })
})

describe('formatEditableNumber', () => {
  it.each([
    [1.5, 'en-US', '1.5'],
    [1.5, 'de-DE', '1,5'],
    [-1234.56, 'fr-FR', '-1234,56'],
    [3.5, 'ar-SA', '3٫5'],
    [1234234234, 'de-DE', '1234234234'],
    [42, 'de-DE', '42'],
    [1e21, 'de-DE', '1e+21'],
    [1.5e-7, 'de-DE', '1,5e-7'],
  ])('shows %j in %s as %j', (value, locale, expected) => {
    expect(formatEditableNumber(value, locale)).toBe(expected)
  })

  it('round trips in each locale', () => {
    for (const locale of ['en-US', 'de-DE', 'fr-FR', 'de-CH', 'en-IN', 'ar-SA', 'ja-JP', 'hi-IN']) {
      for (const value of [0, 1, -1, 0.1, 1.5, -0.5, 1234.56, -1234567.125, 123456789, 3.141592653589793, 1e21, 1.5e-7, -9007199254740991])
        expect(parseLocaleNumber(formatEditableNumber(value, locale), locale)).toBe(value)
    }
  })
})
