import { describe, expect, it } from 'vitest'
import { isImeKeyEvent } from './ime.js'

describe('isImeKeyEvent', () => {
  it('认现代的 isComposing', () => {
    expect(isImeKeyEvent({ isComposing: true })).toBe(true)
    expect(isImeKeyEvent({ isComposing: true, keyCode: 13 })).toBe(true)
  })

  it('认旧的 keyCode 229', () => {
    expect(isImeKeyEvent({ keyCode: 229 })).toBe(true)
    expect(isImeKeyEvent({ isComposing: false, keyCode: 229 })).toBe(true)
  })

  it('认 key 为 Process 的拼字键', () => {
    expect(isImeKeyEvent({ key: 'Process' })).toBe(true)
  })

  it('普通按键不是拼字', () => {
    expect(isImeKeyEvent({})).toBe(false)
    expect(isImeKeyEvent({ isComposing: false })).toBe(false)
    expect(isImeKeyEvent({ keyCode: 13 })).toBe(false)
    expect(isImeKeyEvent({ keyCode: 27 })).toBe(false)
    expect(isImeKeyEvent({ isComposing: false, keyCode: 13 })).toBe(false)
    expect(isImeKeyEvent({ key: 'Enter', keyCode: 13, isComposing: false })).toBe(false)
  })

  it('只有字面的 true 才算 isComposing', () => {
    // @ts-expect-error 故意传入非布尔，确认不是真值就放行
    expect(isImeKeyEvent({ isComposing: 1 })).toBe(false)
  })
})
