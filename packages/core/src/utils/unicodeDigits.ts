import { unicodeRegExp } from './unicodeRegExp.js'

/**
 * 任何数字文字（阿拉伯-印度数字、天城文、全角……）折成 ASCII 数字。
 * 数字的值是 Unicode 属性，和语言偏好无关，所以不需要 `Intl` 也不需要语言。
 * NumberInput 的数字解析和时间解析共用它；内部模块，不对外导出。
 */

const DECIMAL_DIGIT = unicodeRegExp('\\p{Nd}')

/**
 * Zero-width joiners, bidi marks and isolates (which Intl writes around RTL
 * numbers and day periods), and the BOM Excel prepends.
 */
export const INVISIBLE_CHARS
  = /[\u200B-\u200D\u200E\u200F\u061C\u2066-\u2069\uFEFF]/g

/**
 * Value of any Unicode decimal digit. Each digit script lays its ten digits
 * out consecutively, so walking back to the script's zero derives the value
 * for Arabic-Indic, Devanagari, full-width and the rest without shipping a
 * table of them. Returns null for a non-digit, and in the one shape the walk
 * cannot resolve: two digit blocks adjacent in code space (the mathematical
 * alphanumerics).
 */
export function digitValue(char: string): number | null {
  const codePoint = char.codePointAt(0)
  if (codePoint == null || !DECIMAL_DIGIT.test(char)) {
    return null
  }
  for (let zero = codePoint; codePoint - zero < 10; zero--) {
    if (!DECIMAL_DIGIT.test(String.fromCodePoint(zero - 1))) {
      return codePoint - zero
    }
  }
  return null
}

/**
 * Rewrites every decimal digit as its ASCII digit, leaving other characters
 * alone. Returns null when a digit's value cannot be resolved.
 */
export function toAsciiDigits(text: string): string | null {
  let out = ''
  for (const char of text) {
    if (!DECIMAL_DIGIT.test(char)) {
      out += char
      continue
    }
    const value = digitValue(char)
    if (value == null) {
      return null
    }
    out += String(value)
  }
  return out
}
