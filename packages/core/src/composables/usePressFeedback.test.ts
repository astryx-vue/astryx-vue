import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import {
  installPressFeedback,
  isPressFeedbackInstalledForTest,
  PRESSABLE_ATTRIBUTE,
  PRESSED_ATTRIBUTE,
  resetPressFeedbackForTest,
} from './internal/pressFeedback.js'
import { PRESS_FADE_MS, PRESS_FLASH_MS, PRESS_ONSET_MS, PRESS_SCROLL_BRAKE_MS, PRESS_SLOP_PX } from './internal/pressGesture.js'
import { usePressFeedback } from './usePressFeedback.js'

let release: () => void = () => undefined
let scroller: HTMLElement
let rows: HTMLElement[]

function press(element: Element, type: string, x: number, y: number, pointerType = 'touch', pointerId = 1): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: x, clientY: y, pointerId, pointerType })
  element.dispatchEvent(event)
}

const pressedRow = (): number => rows.findIndex(row => row.getAttribute(PRESSED_ATTRIBUTE) === 'on')

function pressable(tag = 'div'): HTMLElement {
  const element = document.createElement(tag)
  element.setAttribute(PRESSABLE_ATTRIBUTE, '')
  return element
}

beforeEach(() => {
  vi.useFakeTimers()
  document.body.innerHTML = ''
  scroller = document.createElement('div')
  rows = []
  for (let index = 0; index < 4; index += 1) {
    const row = pressable()
    row.append(Object.assign(document.createElement('span'), { textContent: `row ${index}` }))
    scroller.appendChild(row)
    rows.push(row)
  }
  document.body.appendChild(scroller)
  release = installPressFeedback()
})

afterEach(() => {
  release()
  resetPressFeedbackForTest()
  vi.useRealTimers()
})

describe('按压落在手指下的那个元素上', () => {
  it('等满 150ms 才亮，之前不亮', () => {
    press(rows[2]!.firstElementChild!, 'pointerdown', 10, 420)
    vi.advanceTimersByTime(PRESS_ONSET_MS - 1)
    expect(pressedRow()).toBe(-1)
    vi.advanceTimersByTime(1)
    expect(pressedRow()).toBe(2)
  })

  it('嵌套时亮最里面那一个', () => {
    const inner = pressable('button')
    rows[1]!.appendChild(inner)
    press(inner, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(inner.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    expect(rows[1]!.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('鼠标完全不管，留给 :active', () => {
    press(rows[0]!, 'pointerdown', 10, 10, 'mouse')
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(-1)
  })

  it('落在可按元素外面的触摸什么都不做', () => {
    const outside = document.createElement('p')
    document.body.appendChild(outside)
    press(outside, 'pointerdown', 10, 600)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(document.querySelectorAll(`[${PRESSED_ATTRIBUTE}]`)).toHaveLength(0)
  })

  it('禁用的元素不亮，也不会把外面那一行点亮', () => {
    const disabled = pressable('button')
    disabled.setAttribute('disabled', '')
    rows[1]!.appendChild(disabled)
    press(disabled, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(disabled.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    expect(pressedRow()).toBe(-1)

    const ariaDisabled = pressable()
    ariaDisabled.setAttribute('aria-disabled', 'true')
    rows[2]!.appendChild(ariaDisabled)
    press(ariaDisabled, 'pointerdown', 10, 200)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(-1)
  })
})

describe('滚动拿走手势，之后不再亮回来', () => {
  it('祖先滚动时清掉', () => {
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    scroller.dispatchEvent(new Event('scroll'))
    expect(pressedRow()).toBe(-1)
  })

  it('pointercancel 时清掉（iOS 在第一个 scroll 之前就发它）', () => {
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[1]!, 'pointercancel', 10, 100)
    expect(pressedRow()).toBe(-1)
  })

  it('手指一直按着时，滑到别的行也不会再亮', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[0]!, 'pointermove', 10, 40)
    press(rows[1]!, 'pointermove', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS * 2)
    expect(pressedRow()).toBe(-1)
    press(rows[1]!, 'pointerup', 10, 100)
    expect(pressedRow()).toBe(-1)
  })

  it('等待期内就被滚动接管：什么都不亮', () => {
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(30)
    scroller.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(-1)
  })

  it('滚动的手指抬起后，下一次按压照常亮；以 pointercancel 结束的也一样', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    press(rows[0]!, 'pointermove', 10, 60)
    press(rows[0]!, 'pointerup', 10, 60)
    vi.advanceTimersByTime(PRESS_SCROLL_BRAKE_MS + 10)
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
    press(rows[1]!, 'pointercancel', 10, 100)
    press(rows[2]!, 'pointerdown', 10, 200)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(2)
  })

  it('落在还在滑动的列表上是刹车，不是按压；列表停稳后照常按', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    press(rows[0]!, 'pointerup', 10, 10)
    scroller.dispatchEvent(new Event('scroll'))
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS * 2)
    expect(pressedRow()).toBe(-1)
    press(rows[1]!, 'pointerup', 10, 100)

    vi.advanceTimersByTime(PRESS_SCROLL_BRAKE_MS + 10)
    press(rows[2]!, 'pointerdown', 10, 200)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(2)
  })

  it('程序自己滚动不算刹车', () => {
    scroller.dispatchEvent(new Event('scroll'))
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
  })

  it('别处的一次触摸不会让程序滚动变成刹车', () => {
    const elsewhere = document.createElement('div')
    document.body.appendChild(elsewhere)
    press(elsewhere, 'pointerdown', 10, 500)
    press(elsewhere, 'pointerup', 10, 500)
    scroller.dispatchEvent(new Event('scroll'))
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
  })

  it('鼠标松开不算手指，不会让下一次滚动变成刹车', () => {
    press(rows[0]!, 'pointerdown', 10, 10, 'mouse')
    press(rows[0]!, 'pointerup', 10, 10, 'mouse')
    scroller.dispatchEvent(new Event('scroll'))
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
  })

  it('别的容器在滚，不会吞掉这里的按压', () => {
    const elsewhere = document.createElement('div')
    document.body.appendChild(elsewhere)
    press(rows[0]!, 'pointerdown', 10, 10)
    press(rows[0]!, 'pointerup', 10, 10)
    elsewhere.dispatchEvent(new Event('scroll'))
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
  })

  it('手指挪过容差就清掉，不用等 scroll 事件', () => {
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[1]!, 'pointermove', 10, 100 + PRESS_SLOP_PX + 1)
    expect(pressedRow()).toBe(-1)
  })

  it('从按住的元素开始拖拽时清掉', () => {
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    rows[1]!.dispatchEvent(new Event('dragstart', { bubbles: true }))
    expect(pressedRow()).toBe(-1)
  })
})

describe('抬手', () => {
  it('淡出之后不留属性', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[0]!, 'pointerup', 10, 10)
    expect(rows[0]!.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
    vi.advanceTimersByTime(PRESS_FADE_MS)
    expect(rows[0]!.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('太快的轻点在抬手时补亮，闪一下再淡出', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(20)
    press(rows[0]!, 'pointerup', 10, 10)
    expect(rows[0]!.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    vi.advanceTimersByTime(PRESS_FLASH_MS)
    expect(rows[0]!.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
    vi.advanceTimersByTime(PRESS_FADE_MS)
    expect(rows[0]!.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })
})

describe('连着两次触摸', () => {
  it('第一次还在淡出时，第二次照样有反馈', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[0]!, 'pointerup', 10, 10)
    press(rows[2]!, 'pointerdown', 10, 300)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(2)
    expect(rows[0]!.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('第一根手指还按着时来第二根：两根都不画', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[2]!, 'pointerdown', 10, 300, 'touch', 2)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(rows.some(row => row.hasAttribute(PRESSED_ATTRIBUTE))).toBe(false)
  })
})

describe('任何手势结束后都不会留下亮着的元素', () => {
  it('手指在容差内抖动，按压照样成立', () => {
    press(rows[1]!, 'pointerdown', 10, 100)
    for (let tick = 0; tick < 6; tick += 1) {
      vi.advanceTimersByTime(20)
      press(rows[1]!, 'pointermove', 10 + (tick % 2), 100 + (tick % 3))
    }
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
  })

  it('轻点闪亮期间来了 cancel、淡出期间来了滚动，最后都归零', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    press(rows[0]!, 'pointerup', 10, 10)
    press(rows[0]!, 'pointercancel', 10, 10)
    vi.advanceTimersByTime(PRESS_FLASH_MS + PRESS_FADE_MS + 50)
    expect(rows[0]!.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)

    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    press(rows[1]!, 'pointerup', 10, 100)
    scroller.dispatchEvent(new Event('scroll'))
    vi.advanceTimersByTime(PRESS_FADE_MS + 50)
    expect(rows[1]!.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
  })

  it('页面切到后台时擦掉', () => {
    press(rows[0]!, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
    document.dispatchEvent(new Event('visibilitychange'))
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
    expect(pressedRow()).toBe(-1)
  })
})

describe('长列表为它付出的代价', () => {
  it('不给任何一行加监听', () => {
    const row = pressable()
    const added: string[] = []
    row.addEventListener = ((type: string) => added.push(type)) as typeof row.addEventListener
    scroller.appendChild(row)
    press(row, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(added).toEqual([])
  })

  it('装几次都只有一份，最后一个释放时拆掉并擦掉颜色', () => {
    const second = installPressFeedback()
    second()
    press(rows[1]!, 'pointerdown', 10, 100)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(1)
    release()
    expect(pressedRow()).toBe(-1)
    expect(isPressFeedbackInstalledForTest()).toBe(false)
    press(rows[2]!, 'pointerdown', 10, 200)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(pressedRow()).toBe(-1)
    release = installPressFeedback()
  })
})

describe('usePressFeedback', () => {
  function mountPressable(options?: Parameters<typeof usePressFeedback>[0]) {
    return mount(defineComponent({
      setup() {
        const { pressableProps } = usePressFeedback(options)
        return () => h('div', { class: 'surface', ...pressableProps }, 'Press me')
      },
    }), { attachTo: document.body })
  }

  it('给元素打上标记和默认的按压色类名；hasOverlay: false 只给标记', () => {
    const withOverlay = mountPressable()
    expect(withOverlay.attributes(PRESSABLE_ATTRIBUTE)).toBe('')
    expect(withOverlay.classes()).toContain('astryx-pressable')
    const markerOnly = mountPressable({ hasOverlay: false })
    expect(markerOnly.classes()).not.toContain('astryx-pressable')
    withOverlay.unmount()
    markerOnly.unmount()
  })

  it('挂载时装上控制器，最后一个卸载时拆掉', () => {
    release()
    resetPressFeedbackForTest()
    const first = mountPressable()
    const second = mountPressable()
    expect(isPressFeedbackInstalledForTest()).toBe(true)
    first.unmount()
    expect(isPressFeedbackInstalledForTest()).toBe(true)
    second.unmount()
    expect(isPressFeedbackInstalledForTest()).toBe(false)
    release = installPressFeedback()
  })

  it('挂载出来的元素在手指按住后亮起', () => {
    const wrapper = mountPressable()
    const surface = wrapper.element
    press(surface, 'pointerdown', 10, 10)
    vi.advanceTimersByTime(PRESS_ONSET_MS)
    expect(surface.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    wrapper.unmount()
  })
})
