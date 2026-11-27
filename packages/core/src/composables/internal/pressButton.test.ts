import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  installPressFeedback,
  PRESSABLE_ATTRIBUTE,
  PRESSED_ATTRIBUTE,
  pressFadeMs,
  resetPressFeedbackForTest,
} from './pressFeedback.js'

let release: () => void = () => undefined

function stubPrimaryPointer(coarse: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: coarse && query.includes('pointer: coarse'),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }))
}

function pointer(element: Element, type: string, pointerType: string, init: { button?: number, pointerId?: number } = {}): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: 10, clientY: 10, pointerId: init.pointerId ?? 1, pointerType, button: init.button ?? 0 })
  element.dispatchEvent(event)
}

function key(element: Element, type: 'keydown' | 'keyup'): void {
  element.dispatchEvent(new KeyboardEvent(type, { key: ' ', bubbles: true, cancelable: true }))
}

function pressable(tag = 'button'): HTMLElement {
  const element = document.createElement(tag)
  element.setAttribute(PRESSABLE_ATTRIBUTE, '')
  document.body.appendChild(element)
  return element
}

beforeEach(() => {
  vi.useFakeTimers()
  document.body.innerHTML = ''
  release = installPressFeedback()
})

afterEach(() => {
  release()
  resetPressFeedbackForTest()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('主指针是粗指针时，鼠标键的按压由控制器画', () => {
  it('按下立刻亮，位移不结束，松开淡出，淡出的钟走完后擦掉', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    pointer(button, 'pointerdown', 'mouse')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    pointer(button, 'pointermove', 'mouse')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    pointer(button, 'pointerup', 'mouse')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
    vi.advanceTimersByTime(pressFadeMs(button) + 1)
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('只认主键', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    pointer(button, 'pointerdown', 'mouse', { button: 2 })
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('指针被取消时立刻擦掉', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    pointer(button, 'pointerdown', 'mouse')
    pointer(button, 'pointercancel', 'mouse')
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('主指针精细（桌面）时鼠标仍交给 :active，控制器不画', () => {
    stubPrimaryPointer(false)
    const button = pressable()
    pointer(button, 'pointerdown', 'mouse')
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('菜单里的可按元素不画，菜单自己的高亮是唯一的画面', () => {
    stubPrimaryPointer(true)
    const menu = document.createElement('div')
    menu.setAttribute('data-astryx-menu-press', '')
    document.body.appendChild(menu)
    const item = document.createElement('div')
    item.setAttribute(PRESSABLE_ATTRIBUTE, '')
    menu.appendChild(item)
    pointer(item, 'pointerdown', 'mouse')
    expect(item.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('手指落在另一个元素上不会结束鼠标键的按压', () => {
    stubPrimaryPointer(true)
    const mouseButton = pressable()
    const fingerButton = pressable()
    pointer(mouseButton, 'pointerdown', 'mouse', { pointerId: 1 })
    pointer(fingerButton, 'pointerdown', 'touch', { pointerId: 2 })
    expect(mouseButton.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    expect(fingerButton.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
  })
})

describe('主指针是粗指针时，空格键的按压由控制器画', () => {
  it('焦点按钮按下空格立刻亮，松开淡出', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    key(button, 'keydown')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    key(button, 'keyup')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
  })

  it('按住不放产生的重复 keydown 不重新开始', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    key(button, 'keydown')
    key(button, 'keyup')
    button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', repeat: true, bubbles: true }))
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
  })

  it('空格不激活的元素（链接）不画', () => {
    stubPrimaryPointer(true)
    const link = pressable('a')
    key(link, 'keydown')
    expect(link.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('页面取消了的空格不画', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    button.addEventListener('keydown', event => event.preventDefault())
    key(button, 'keydown')
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('按下空格后焦点离开，按压带着淡出结束', () => {
    stubPrimaryPointer(true)
    const button = pressable()
    key(button, 'keydown')
    button.dispatchEvent(new Event('blur'))
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
  })

  it('主指针精细时空格交给 :active', () => {
    stubPrimaryPointer(false)
    const button = pressable()
    key(button, 'keydown')
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })
})

describe('释放等它的动画播完才结束', () => {
  function withAnimation(element: HTMLElement): { end: () => void } {
    let resolve: () => void = () => undefined
    const finished = new Promise<void>((done) => {
      resolve = done
    })
    const animation = {
      effect: { target: element, getComputedTiming: () => ({ endTime: 175 }) },
      animationName: 'astryx-press-release',
      playState: 'running',
      finished,
    }
    Object.assign(element, { getAnimations: () => [animation] })
    return {
      end: () => {
        animation.playState = 'finished'
        resolve()
      },
    }
  }

  it('钟到点时动画还在播，属性留着，动画播完才擦掉', async () => {
    stubPrimaryPointer(false)
    const button = pressable()
    pointer(button, 'pointerdown', 'touch')
    const animation = withAnimation(button)
    pointer(button, 'pointerup', 'touch')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
    vi.advanceTimersByTime(pressFadeMs(button) + 1)
    await Promise.resolve()
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
    animation.end()
    await vi.advanceTimersByTimeAsync(0)
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('释放期间又按了一次，等着的那次作废，不会擦掉新的一次', async () => {
    stubPrimaryPointer(false)
    const button = pressable()
    pointer(button, 'pointerdown', 'touch')
    const animation = withAnimation(button)
    pointer(button, 'pointerup', 'touch')
    vi.advanceTimersByTime(pressFadeMs(button) + 1)
    pointer(button, 'pointerdown', 'touch', { pointerId: 2 })
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    animation.end()
    await vi.advanceTimersByTimeAsync(0)
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
  })
})
