import { describe, expect, it } from 'vitest'
import { textDirection } from './textDirection.js'

describe('textDirection', () => {
  it('lays out plain text with no right-to-left letter left to right', () => {
    for (const text of ['https://', '.com', '+3', '@alice', 'C++', '#design', 'Inbox', ''])
      expect(textDirection(text), text).toBe('ltr')
    expect(textDirection(42)).toBe('ltr')
  })

  it('leaves text with a right-to-left letter in the page direction', () => {
    for (const text of [
      'iPhone \u062C\u062F\u064A\u062F',
      'example.com \u0645\u0648\u0642\u0639',
      '\u05E9\u05DC\u05D5\u05DD',
      '\u0710\u0712',
      '\u0780\u0781',
      '\u07CA\u07CB',
      '\uFB50',
      '\u0800\u0801',
      '\u{1E900}\u{1E923}\u{1E924}!',
    ]) {
      expect(textDirection(text), text).toBeUndefined()
    }
  })

  it('reads an invisible leading character as no right-to-left letter', () => {
    expect(textDirection('\uFEFF+3')).toBe('ltr')
    expect(textDirection('\uFEFF\u05E9\u05DC\u05D5\u05DD')).toBeUndefined()
  })

  it('counts the right-to-left mark and the Arabic letter mark as right to left', () => {
    expect(textDirection('\u200F+3')).toBeUndefined()
    expect(textDirection('\u061C+3')).toBeUndefined()
  })

  it('leaves a rich node to its caller', () => {
    expect(textDirection(null)).toBeUndefined()
    expect(textDirection(undefined)).toBeUndefined()
    expect(textDirection(['a', 'b'])).toBeUndefined()
  })
})
