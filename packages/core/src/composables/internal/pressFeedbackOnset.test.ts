import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isInsideScrollView } from '../../utils/scrollView'
import {
  installPressFeedback,
  PRESS_FADE_REDUCED_MAX_MS,
  PRESSABLE_ATTRIBUTE,
  PRESSED_ATTRIBUTE,
  pressFadeMs,
  resetPressFeedbackForTest,
} from './pressFeedback.js'
import { PRESS_ONSET_MS } from './pressGesture.js'

let release: () => void = () => undefined

function touch(element: Element, type: string, ageMs = 0): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: 10, clientY: 10, pointerId: 1, pointerType: 'touch' })
  if (ageMs > 0)
    Object.defineProperty(event, 'timeStamp', { value: Date.now() - ageMs })
  element.dispatchEvent(event)
}

function pressable(parent: HTMLElement): HTMLElement {
  const element = document.createElement('button')
  element.setAttribute(PRESSABLE_ATTRIBUTE, '')
  parent.appendChild(element)
  return element
}

function scrollView(parent: HTMLElement, touchAction?: string): HTMLElement {
  const element = document.createElement('div')
  element.style.overflowY = 'auto'
  if (touchAction != null)
    element.style.touchAction = touchAction
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: 1000 })
  Object.defineProperty(element, 'clientHeight', { configurable: true, value: 200 })
  parent.appendChild(element)
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

describe('滚动视图外，手指落下那一帧就亮', () => {
  it('不在滚动容器里的可按元素按下就亮', () => {
    const button = pressable(document.body)
    touch(button, 'pointerdown')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    touch(button, 'pointerup')
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
  })

  it('滚动容器里的要等 150ms', () => {
    const button = pressable(scrollView(document.body))
    touch(button, 'pointerdown')
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
  })

  it('滚动容器里的 position: fixed 盒子不跟着滚，里面的按下就亮', () => {
    const fixed = document.createElement('div')
    fixed.style.position = 'fixed'
    scrollView(document.body).appendChild(fixed)
    expect(isInsideScrollView(pressable(fixed))).toBe(false)
  })

  it('touch-action 不让浏览器在能滚的方向上平移时，不算滚动视图', () => {
    const button = pressable(scrollView(document.body, 'pan-x'))
    expect(isInsideScrollView(button)).toBe(false)
  })
})

describe('滚动视图里的 150ms 从触摸本身算起', () => {
  it('监听函数晚跑了 100ms，只再等剩下的 50ms', () => {
    const button = pressable(scrollView(document.body))
    touch(button, 'pointerdown', 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS - 100 - 1)
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    vi.advanceTimersByTime(1)
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
  })

  it('晚到超过 150ms 的触摸立刻亮', () => {
    const button = pressable(scrollView(document.body))
    touch(button, 'pointerdown', 400)
    vi.advanceTimersByTime(0)
    expect(button.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
  })
})

describe('减少动态效果时的抬手淡出', () => {
  function withExit(value: string): HTMLElement {
    const element = document.createElement('div')
    element.style.setProperty('--astryx-duration-exit', value)
    document.body.appendChild(element)
    return element
  }

  it('主题的退出时长再长，也不超过 200ms', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }))
    expect(pressFadeMs(withExit('400ms'))).toBe(PRESS_FADE_REDUCED_MAX_MS)
    expect(pressFadeMs(withExit('120ms'))).toBe(120)
  })

  it('没开减少动态效果时照主题的退出时长', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    expect(pressFadeMs(withExit('400ms'))).toBe(400)
  })
})

describe('calc() 写的退出时长', () => {
  it('按浏览器算出的长度计时，而不是退回默认值', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    const element = document.createElement('div')
    element.style.setProperty('--astryx-duration-exit', 'calc(100ms + 100ms)')
    document.body.appendChild(element)
    const real = window.getComputedStyle.bind(window)
    vi.spyOn(window, 'getComputedStyle').mockImplementation((target: Element) => {
      if (target.parentElement === element)
        return { transitionDuration: '200ms' } as CSSStyleDeclaration
      return real(target)
    })
    expect(pressFadeMs(element)).toBe(200)
  })

  it('探针用完就移除', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    const element = document.createElement('div')
    element.style.setProperty('--astryx-duration-exit', 'calc(100ms + 100ms)')
    document.body.appendChild(element)
    pressFadeMs(element)
    expect(element.childElementCount).toBe(0)
  })
})

describe('没有按着的接触时的抬起事件', () => {
  it('抬起事件没有 pointerId、也没有正在按的接触，不会报错', () => {
    const errors: unknown[] = []
    const onError = (event: ErrorEvent): void => {
      errors.push(event.error)
    }
    window.addEventListener('error', onError)
    const event = new MouseEvent('pointerup', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'pointerType', { value: 'touch' })
    window.dispatchEvent(event)
    window.removeEventListener('error', onError)
    expect(errors).toEqual([])
  })
})

