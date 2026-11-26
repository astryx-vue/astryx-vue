import { describe, expect, it } from 'vitest'
import { digitValue, INVISIBLE_CHARS, toAsciiDigits } from './unicodeDigits.js'

describe('digitValue', () => {
  it.each([
    ['7', 7],
    ['٧', 7], // Arabic-Indic
    ['۷', 7], // Extended Arabic-Indic
    ['७', 7], // Devanagari
    ['৭', 7], // Bengali
    ['７', 7], // full-width
  ])('reads %s as %i', (char, value) => {
    expect(digitValue(char)).toBe(value)
  })

  it('returns null for a non-digit', () => {
    expect(digitValue('a')).toBeNull()
    expect(digitValue('')).toBeNull()
  })
})

describe('toAsciiDigits', () => {
  it('rewrites digits and leaves everything else', () => {
    expect(toAsciiDigits('٢:٣٠ م')).toBe('2:30 م')
    expect(toAsciiDigits('१२,३४५.६')).toBe('12,345.6')
  })
})

describe('iNVISIBLE_CHARS', () => {
  it('strips bidi marks and zero-width characters', () => {
    expect('\u200F١٢\u061C\uFEFF'.replace(INVISIBLE_CHARS, '')).toBe('١٢')
  })
})
