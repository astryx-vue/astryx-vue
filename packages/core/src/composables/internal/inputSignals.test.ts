import { afterEach, describe, expect, it, vi } from 'vitest'
import { focusForLastInput, isFocusDetached } from './focusReturn.js'
import { isImeKeyEvent } from './ime.js'
import {
  getInteractionModality,
  isKeyboardModality,
  resetInteractionModalityForTest,
  trackInteractionModality,
} from './interactionModality.js'
import { isApplePlatform, readClientHintsPlatform } from './platform.js'

// 输入信号的几个小工具：输入法、平台、交互模态、焦点归还。

afterEach(() => {
  resetInteractionModalityForTest()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('isImeKeyEvent', () => {
  it('isComposing、keyCode 229、key 为 Process 任一成立都算拼字中', () => {
    expect(isImeKeyEvent({ isComposing: true })).toBe(true)
    expect(isImeKeyEvent({ keyCode: 229 })).toBe(true)
    expect(isImeKeyEvent({ key: 'Process' })).toBe(true)
    expect(isImeKeyEvent({ key: 'Enter', keyCode: 13, isComposing: false })).toBe(false)
  })
})

describe('平台判断', () => {
  function setPlatform(platform: string, hints?: { platform?: unknown }): void {
    vi.spyOn(navigator, 'platform', 'get').mockReturnValue(platform)
    Object.defineProperty(navigator, 'userAgentData', { configurable: true, value: hints })
  }

  afterEach(() => {
    Reflect.deleteProperty(navigator, 'userAgentData')
  })

  it('client Hints 说了平台就听它的', () => {
    setPlatform('Win32', { platform: 'macOS' })
    expect(isApplePlatform()).toBe(true)
    setPlatform('MacIntel', { platform: 'Windows' })
    expect(isApplePlatform()).toBe(false)
  })

  it('空字符串和 Unknown 是「说不出来」，退回 navigator.platform，不当成「不是苹果」', () => {
    expect(readClientHintsPlatform({ platform: '' })).toBe('unknown')
    expect(readClientHintsPlatform({ platform: ' Unknown ' })).toBe('unknown')
    setPlatform('MacIntel', { platform: '' })
    expect(isApplePlatform()).toBe(true)
    setPlatform('iPhone', { platform: 'Unknown' })
    expect(isApplePlatform()).toBe(true)
    setPlatform('Linux x86_64', { platform: 'unknown' })
    expect(isApplePlatform()).toBe(false)
  })
})

describe('交互模态', () => {
  it('没有输入时是键盘；指针按下变成指针；按键变回键盘', () => {
    trackInteractionModality()
    expect(getInteractionModality()).toBe('keyboard')
    document.dispatchEvent(new PointerEvent('pointerdown'))
    expect(getInteractionModality()).toBe('pointer')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    expect(isKeyboardModality()).toBe(true)
  })

  it('只按 ⌘ / Alt / Ctrl 不改模态；按住 Shift 的按键算键盘', () => {
    trackInteractionModality()
    document.dispatchEvent(new PointerEvent('pointerdown'))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Meta', metaKey: true }))
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', ctrlKey: true }))
    expect(getInteractionModality()).toBe('pointer')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }))
    expect(getInteractionModality()).toBe('keyboard')
  })

  it('反复开始跟踪只装一对监听', () => {
    const added = vi.spyOn(document, 'addEventListener')
    trackInteractionModality()
    trackInteractionModality()
    expect(added).not.toHaveBeenCalled()
  })
})

describe('焦点归还', () => {
  it('焦点在 body 上算「哪儿都不在」，在按钮上不算', () => {
    const button = document.body.appendChild(document.createElement('button'))
    expect(isFocusDetached()).toBe(true)
    button.focus()
    expect(isFocusDetached()).toBe(false)
  })

  it('上一次是指针：聚焦时要求不画焦点环；上一次是键盘：照常聚焦', () => {
    trackInteractionModality()
    const button = document.body.appendChild(document.createElement('button'))
    const focus = vi.spyOn(button, 'focus')
    document.dispatchEvent(new PointerEvent('pointerdown'))
    focusForLastInput(button)
    expect(focus).toHaveBeenLastCalledWith({ focusVisible: false })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    focusForLastInput(button, { preventScroll: true })
    expect(focus).toHaveBeenLastCalledWith({ preventScroll: true })
  })

  it('文本输入类元素总是直接聚焦', () => {
    trackInteractionModality()
    const input = document.body.appendChild(document.createElement('input'))
    const focus = vi.spyOn(input, 'focus')
    document.dispatchEvent(new PointerEvent('pointerdown'))
    focusForLastInput(input)
    expect(focus).toHaveBeenLastCalledWith(undefined)
  })
})
