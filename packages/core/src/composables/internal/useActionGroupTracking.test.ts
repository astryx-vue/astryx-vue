import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { installPressFeedback, PRESSED_ATTRIBUTE, resetPressFeedbackForTest } from './pressFeedback.js'
import { pressGroupItemProps, useActionGroupTracking } from './useActionGroupTracking.js'

function pointer(target: EventTarget, type: string, x: number, init: { pointerType?: string, pointerId?: number, isPrimary?: boolean } = {}): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: x, clientY: 10, button: 0, pointerId: init.pointerId ?? 1, pointerType: init.pointerType ?? 'touch', isPrimary: init.isPrimary ?? true })
  target.dispatchEvent(event)
}

/** 浏览器在手指抬起后补发的那个 click（detail 1）。 */
function nativeClick(target: Element): MouseEvent {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })
  target.dispatchEvent(event)
  return event
}

function placeAt(element: Element, left: number, right: number): void {
  element.getBoundingClientRect = () => ({ left, right, top: 0, bottom: 40, width: right - left, height: 40, x: left, y: 0, toJSON: () => ({}) })
}

const clicks: string[] = []
const enabled = ref(true)

async function mountGroup(disabledB = false) {
  const wrapper = mount(defineComponent({
    setup() {
      const root = ref<HTMLElement | null>(null)
      useActionGroupTracking(root, { isEnabled: enabled })
      const item = (name: string, disabled = false) => h('button', {
        'type': 'button',
        'class': name,
        'aria-disabled': disabled || undefined,
        ...pressGroupItemProps(),
        'onClick': () => clicks.push(name),
      }, name)
      return () => h('div', { ref: root }, [item('a'), item('b', disabledB), h('button', { type: 'button', class: 'menu', onClick: () => clicks.push('menu') }, 'menu')])
    },
  }), { attachTo: document.body })
  await nextTick()
  return wrapper
}

let release: () => void = () => undefined

beforeEach(() => {
  clicks.length = 0
  enabled.value = true
  release = installPressFeedback()
})

afterEach(() => {
  release()
  resetPressFeedbackForTest()
  document.body.innerHTML = ''
})

describe('按住滑动，松手时执行手指下的那个', () => {
  it('按下立刻高亮，滑到另一个上高亮跟过去，松手只执行它', async () => {
    const wrapper = await mountGroup()
    const [a, b] = [wrapper.get('.a').element, wrapper.get('.b').element]
    placeAt(a, 0, 100)
    placeAt(b, 100, 200)
    pointer(a, 'pointerdown', 50)
    expect(a.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    pointer(a, 'pointermove', 150)
    expect(a.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    expect(b.getAttribute(PRESSED_ATTRIBUTE)).toBe('on')
    pointer(a, 'pointerup', 150)
    expect(b.getAttribute(PRESSED_ATTRIBUTE)).toBe('fading')
    expect(clicks).toEqual(['b'])
    // 浏览器补发到按下那个按钮上的 click 被吞掉。
    expect(nativeClick(a).defaultPrevented).toBe(true)
    expect(clicks).toEqual(['b'])
    wrapper.unmount()
  })

  it('轻点一下只执行一次', async () => {
    const wrapper = await mountGroup()
    const a = wrapper.get('.a').element
    pointer(a, 'pointerdown', 50)
    pointer(a, 'pointerup', 50)
    nativeClick(a)
    expect(clicks).toEqual(['a'])
    wrapper.unmount()
  })

  it('在组外松手、或者手势被取消，什么都不执行', async () => {
    const wrapper = await mountGroup()
    const a = wrapper.get('.a').element
    placeAt(a, 0, 100)
    placeAt(wrapper.get('.b').element, 100, 200)
    pointer(a, 'pointerdown', 50)
    pointer(a, 'pointermove', 400)
    pointer(a, 'pointerup', 400)
    expect(clicks).toEqual([])
    pointer(a, 'pointerdown', 50)
    pointer(a, 'pointercancel', 50)
    expect(a.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    pointer(a, 'pointerup', 50)
    expect(clicks).toEqual([])
    wrapper.unmount()
  })

  it('第二根手指落下就结束，什么都不执行', async () => {
    const wrapper = await mountGroup()
    const a = wrapper.get('.a').element
    pointer(a, 'pointerdown', 50)
    pointer(document.body, 'pointerdown', 300, { pointerId: 2, isPrimary: false })
    expect(a.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    pointer(a, 'pointerup', 50)
    expect(clicks).toEqual([])
    wrapper.unmount()
  })

  it('滑过禁用的成员不亮，在上面松手也不执行', async () => {
    const wrapper = await mountGroup(true)
    const [a, b] = [wrapper.get('.a').element, wrapper.get('.b').element]
    placeAt(a, 0, 100)
    placeAt(b, 100, 200)
    pointer(a, 'pointerdown', 50)
    pointer(a, 'pointermove', 150)
    expect(b.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    pointer(a, 'pointerup', 150)
    expect(clicks).toEqual([])
    wrapper.unmount()
  })
})

describe('不归组跟踪的按压', () => {
  it('鼠标不跟踪，保持原生按钮的行为', async () => {
    const wrapper = await mountGroup()
    const a = wrapper.get('.a').element
    pointer(a, 'pointerdown', 50, { pointerType: 'mouse' })
    expect(a.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    pointer(a, 'pointerup', 50, { pointerType: 'mouse' })
    expect(clicks).toEqual([])
    wrapper.unmount()
  })

  it('没有组标记的成员（比如菜单触发器）保留自己的点击', async () => {
    const wrapper = await mountGroup()
    const menu = wrapper.get('.menu').element
    pointer(menu, 'pointerdown', 250)
    pointer(menu, 'pointerup', 250)
    expect(clicks).toEqual([])
    expect(nativeClick(menu).defaultPrevented).toBe(false)
    expect(clicks).toEqual(['menu'])
    wrapper.unmount()
  })

  it('关掉跟踪后不再接手', async () => {
    enabled.value = false
    const wrapper = await mountGroup()
    const a = wrapper.get('.a').element
    pointer(a, 'pointerdown', 50)
    pointer(a, 'pointerup', 50)
    expect(clicks).toEqual([])
    wrapper.unmount()
  })

  it('按压控制器不再给组跟踪的成员画按压，由组来画', () => {
    vi.useFakeTimers()
    const button = document.createElement('button')
    button.setAttribute('data-astryx-pressable', '')
    for (const [name, value] of Object.entries(pressGroupItemProps()))
      button.setAttribute(name, value)
    document.body.appendChild(button)
    pointer(button, 'pointerdown', 10)
    vi.advanceTimersByTime(500)
    expect(button.hasAttribute(PRESSED_ATTRIBUTE)).toBe(false)
    pointer(button, 'pointerup', 10)
    vi.useRealTimers()
  })
})
