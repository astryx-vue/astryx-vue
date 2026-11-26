import { describe, expect, it } from 'vitest'
import { isImeKeyEvent } from './ime.js'

function keydown(key: string, init: { isComposing?: boolean, keyCode?: number } = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key })
  for (const prop of ['isComposing', 'keyCode'] as const) {
    if (init[prop] != null)
      Object.defineProperty(event, prop, { get: () => init[prop] })
  }
  return event
}

describe('isImeKeyEvent', () => {
  it('认得出输入法组字时的三种信号', () => {
    expect(isImeKeyEvent(keydown('ArrowDown', { isComposing: true }))).toBe(true)
    expect(isImeKeyEvent(keydown('ArrowDown', { keyCode: 229 }))).toBe(true)
    expect(isImeKeyEvent(keydown('Process'))).toBe(true)
  })

  it('普通按键不算组字', () => {
    expect(isImeKeyEvent(keydown('ArrowDown'))).toBe(false)
    expect(isImeKeyEvent(keydown('Enter'))).toBe(false)
  })
})
