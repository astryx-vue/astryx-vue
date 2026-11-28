import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import ButtonGroup from '../ButtonGroup/ButtonGroup.vue'
import InputClearButton from '../Field/InputClearButton.vue'
import ToggleButton from '../ToggleButton/ToggleButton.vue'
import ToggleButtonGroup from '../ToggleButton/ToggleButtonGroup.vue'
import Button from './Button.vue'

/**
 * 粗指针下按钮的触控热区：朝 44px 长，碰到相邻控件停在一半间距，细指针下不长。
 * 这里没有真实布局，每个元素的矩形由 `data-rect`（left,top,width,height）给出，
 * 测量用的帧由测试手动推进。
 */

enableAutoUnmount(afterEach)

let frames: FrameRequestCallback[] = []

function stubPointer(coarse: boolean): void {
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    matches: coarse && query.includes('pointer: coarse'),
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  })))
}

function rectOf(element: Element): DOMRect {
  const [left = 0, top = 0, width = 0, height = 0] = (element.getAttribute('data-rect') ?? '').split(',').map(Number)
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }
}

/** 推进测量帧，直到没有待测的控件。 */
async function settle(): Promise<void> {
  await flushPromises()
  while (frames.length > 0) {
    const due = frames
    frames = []
    due.forEach(frame => frame(0))
  }
  await nextTick()
}

function insets(element: Element): Record<string, string> {
  const style = (element as HTMLElement).style
  return Object.fromEntries(['top', 'right', 'bottom', 'left'].map(side => [side, style.getPropertyValue(`--astryx-hit-inset-${side}`)]))
}

function px(top: number, right: number, bottom: number, left: number): Record<string, string> {
  return { top: `${top}px`, right: `${right}px`, bottom: `${bottom}px`, left: `${left}px` }
}

function touch(target: Element, type: string, x: number, y: number): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, { clientX: x, clientY: y, button: 0, pointerId: 1, pointerType: 'touch', isPrimary: true })
  target.dispatchEvent(event)
}

beforeEach(() => {
  frames = []
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
  vi.stubGlobal('cancelAnimationFrame', () => undefined)
  // 没有这些观察者时，控件一律算在屏幕上，页面每次都重新读。
  vi.stubGlobal('IntersectionObserver', undefined)
  vi.stubGlobal('ResizeObserver', undefined)
  vi.stubGlobal('MutationObserver', undefined)
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

describe('按钮的触控热区', () => {
  it('孤立的按钮在粗指针下朝 44px 长，按钮自己的盒子不变', async () => {
    stubPointer(true)
    const wrapper = mount(Button, { attachTo: document.body, props: { label: 'Save', size: 'sm' }, attrs: { 'data-rect': '100,100,80,28' } })
    await settle()
    expect(insets(wrapper.element)).toEqual(px(8, 0, 8, 0))
    expect(wrapper.get('.astryx-button__content').classes()).toContain('astryx-touch-hit-area')
  })

  it('紧挨着相邻控件时，朝它那一边只长到间距的一半', async () => {
    stubPointer(true)
    const Pair = defineComponent(() => () => h('div', [
      h(Button, { 'label': 'Bold', 'isIconOnly': true, 'class': 'bold', 'data-rect': '0,0,32,32' }),
      h('button', { 'class': 'native', 'data-rect': '36,0,32,32' }, 'Italic'),
    ]))
    const wrapper = mount(Pair, { attachTo: document.body })
    await settle()
    expect(insets(wrapper.get('.bold').element)).toEqual(px(6, 2, 6, 6))
  })

  it('两个按钮之间的间隙各分一半，互不重叠', async () => {
    stubPointer(true)
    const Pair = defineComponent(() => () => h('div', [
      h(Button, { 'label': 'Up', 'isIconOnly': true, 'class': 'up', 'data-rect': '0,0,32,32' }),
      h(Button, { 'label': 'Down', 'isIconOnly': true, 'class': 'down', 'data-rect': '0,40,32,32' }),
    ]))
    const wrapper = mount(Pair, { attachTo: document.body })
    await settle()
    expect(insets(wrapper.get('.up').element)).toEqual(px(6, 6, 4, 6))
    expect(insets(wrapper.get('.down').element)).toEqual(px(4, 6, 6, 6))
  })

  it('手指轻点时再量一次：邻居刚挪近、触摸离邻居更近，这一下不执行，热区之后才更新', async () => {
    stubPointer(true)
    const clicks: string[] = []
    const wrapper = mount(Button, {
      attachTo: document.body,
      props: { label: 'Save', size: 'sm', onClick: () => clicks.push('save') },
      attrs: { 'data-rect': '0,0,80,28' },
    })
    await settle()
    expect(insets(wrapper.element).bottom).toBe('8px')
    const neighbour = document.createElement('button')
    neighbour.setAttribute('data-rect', '0,32,80,28')
    document.body.append(neighbour)
    touch(wrapper.element, 'pointerdown', 40, 31)
    wrapper.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    await flushPromises()
    expect(clicks).toEqual([])
    // 复查只读不写：按压动效还在播，热区由随后的那次测量写。
    expect(insets(wrapper.element).bottom).toBe('8px')
    await settle()
    expect(insets(wrapper.element).bottom).toBe('2px')
    touch(wrapper.element, 'pointerdown', 40, 10)
    wrapper.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    await flushPromises()
    expect(clicks).toEqual(['save'])
  })

  it('细指针下不长，也不写热区', async () => {
    stubPointer(false)
    const wrapper = mount(Button, { attachTo: document.body, props: { label: 'Save', size: 'sm' }, attrs: { 'data-rect': '100,100,80,28' } })
    await settle()
    expect(insets(wrapper.element)).toEqual({ top: '', right: '', bottom: '', left: '' })
  })

  it('禁用或只是忙碌的按钮不接点按，没有热区', async () => {
    stubPointer(true)
    const Pair = defineComponent(() => () => h('div', [
      h(Button, { 'label': 'Delete', 'isDisabled': true, 'class': 'disabled', 'data-rect': '0,0,80,28' }),
      h(Button, { 'label': 'Sending', 'isLoading': true, 'class': 'busy', 'data-rect': '0,100,80,28' }),
      h(Button, { 'label': 'Stop', 'isLoading': true, 'isInterruptible': true, 'class': 'stop', 'data-rect': '0,200,80,28' }),
    ]))
    const wrapper = mount(Pair, { attachTo: document.body })
    await settle()
    expect(insets(wrapper.get('.disabled').element).top).toBe('')
    expect(insets(wrapper.get('.busy').element).top).toBe('')
    expect(wrapper.get('.disabled .astryx-button__content').classes()).not.toContain('astryx-touch-hit-area')
    expect(insets(wrapper.get('.stop').element).top).toBe('8px')
  })

  it('输入框的清除按钮不画按钮的热区，用输入框自己的那一圈', async () => {
    stubPointer(true)
    const wrapper = mount(InputClearButton, { attachTo: document.body, props: { label: 'Clear Name' }, attrs: { 'data-rect': '0,0,28,28' } })
    await settle()
    expect(insets(wrapper.get('button').element).top).toBe('')
    expect(wrapper.get('.astryx-button__content').classes()).not.toContain('astryx-touch-hit-area')
  })

  it('卸载或变成禁用时清掉写过的热区', async () => {
    stubPointer(true)
    const wrapper = mount(Button, { attachTo: document.body, props: { label: 'Save', size: 'sm' }, attrs: { 'data-rect': '0,0,80,28' } })
    await settle()
    expect(insets(wrapper.element).top).toBe('8px')
    await wrapper.setProps({ isDisabled: true })
    await settle()
    expect(insets(wrapper.element).top).toBe('')
  })
})

describe('组成员的触控热区', () => {
  function group(component: typeof ButtonGroup | typeof ToggleButtonGroup, member: typeof Button | typeof ToggleButton) {
    const props = (name: string, left: number) => ({ 'label': name, 'value': name, 'class': name, 'data-rect': `${left},0,40,32` })
    return mount(defineComponent(() => () => h('div', [
      h(component, { 'label': 'Actions', 'class': 'group', 'data-rect': '0,0,80,32' }, () => [
        h(member, props('left', 0)),
        h(member, props('right', 40)),
      ]),
      h('button', { 'class': 'neighbour', 'data-rect': '0,36,80,32' }, 'Below'),
    ])), { attachTo: document.body })
  }

  for (const [name, component, member] of [
    ['ButtonGroup', ButtonGroup, Button],
    ['ToggleButtonGroup', ToggleButtonGroup, ToggleButton],
  ] as const) {
    it(`${name} 画一圈热区：两端照成员朝 44px 长，朝组下面的邻居只长到间距一半；成员自己不画`, async () => {
      stubPointer(true)
      const wrapper = group(component, member)
      await settle()
      const root = wrapper.get('.group')
      expect(root.classes()).toContain('astryx-touch-hit-area-below')
      expect(insets(root.element)).toEqual(px(6, 2, 2, 2))
      expect(insets(wrapper.get('.left').element).top).toBe('')
      expect(wrapper.get('.left .astryx-button__content').classes()).not.toContain('astryx-touch-hit-area')
    })

    it(`${name} 把按在热区上的触摸交给最近的成员`, async () => {
      stubPointer(true)
      const clicked: string[] = []
      const wrapper = group(component, member)
      await settle()
      wrapper.get('.right').element.addEventListener('click', () => clicked.push('right'))
      wrapper.get('.left').element.addEventListener('click', () => clicked.push('left'))
      const root = wrapper.get('.group').element
      touch(root, 'pointerdown', 70, -4)
      touch(root, 'pointerup', 70, -4)
      await flushPromises()
      expect(clicked).toEqual(['right'])
    })
  }

  it('细指针下组不画热区', async () => {
    stubPointer(false)
    const wrapper = group(ButtonGroup, Button)
    await settle()
    expect(wrapper.get('.group').classes()).not.toContain('astryx-touch-hit-area-below')
    expect(insets(wrapper.get('.group').element).top).toBe('')
  })
})
