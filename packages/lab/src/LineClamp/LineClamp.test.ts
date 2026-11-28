import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import LineClamp from './LineClamp.vue'

enableAutoUnmount(afterEach)

const restores: Array<() => void> = []

function stubGetter(prototype: object, name: string, get: (this: HTMLElement) => unknown): void {
  const original = Object.getOwnPropertyDescriptor(prototype, name)
  Object.defineProperty(prototype, name, { configurable: true, get })
  restores.push(() => {
    if (original)
      Object.defineProperty(prototype, name, original)
    else
      delete (prototype as Record<string, unknown>)[name]
  })
}

function stubMethod<T extends object>(prototype: T, name: keyof T, value: unknown): void {
  const original = prototype[name]
  ;(prototype as Record<keyof T, unknown>)[name] = value
  restores.push(() => {
    (prototype as Record<keyof T, unknown>)[name] = original
  })
}

/** 内容比盒子高：多行截断成立。 */
function makeContentOverflow(): void {
  stubGetter(window.HTMLElement.prototype, 'clientHeight', () => 40)
  stubMethod(window.Range.prototype, 'getBoundingClientRect', () => ({ height: 100 }))
}

/**
 * 简单的版面：截断容器底边在 40，`data-top` 标出元素的顶边。没写的元素顶边是 0。
 */
function layOut(): void {
  stubMethod(window.Element.prototype, 'getBoundingClientRect', function (this: Element) {
    const top = this.hasAttribute('data-line-clamp-root') ? 0 : Number(this.getAttribute('data-top') ?? 0)
    const bottom = this.hasAttribute('data-line-clamp-root') ? 40 : top + 16
    return { top, bottom, left: 0, right: 100, width: 100, height: bottom - top, x: 0, y: top, toJSON: () => ({}) }
  })
  stubMethod(window.Element.prototype, 'getClientRects', function (this: Element) {
    return [this.getBoundingClientRect()]
  })
}

beforeEach(() => {
  // 没有 ResizeObserver 时 useTruncation 当场测量，测试不用等通知。
  vi.stubGlobal('ResizeObserver', undefined)
})

afterEach(() => {
  while (restores.length > 0)
    restores.pop()!()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function mountClamp(props: Record<string, unknown> = {}, content = () => ['Some ', h('strong', 'mixed'), ' inline content']) {
  return mount(LineClamp, { attachTo: document.body, props: { maxLines: 2, ...props }, slots: { default: content } })
}

describe('lineClamp', () => {
  it('renders arbitrary mixed children in a div by default, or the element passed via as', () => {
    const wrapper = mountClamp()
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('strong').text()).toBe('mixed')
    expect(wrapper.classes()).toContain('astryx-line-clamp')

    const span = mountClamp({ as: 'span' })
    expect(span.element.tagName).toBe('SPAN')
  })

  it('makes a truncated clamp a tab stop with no native title, and leaves a fitting one alone', async () => {
    const fits = mountClamp()
    expect(fits.attributes('tabindex')).toBeUndefined()

    makeContentOverflow()
    const truncated = mountClamp()
    await nextTick()
    expect(truncated.attributes('tabindex')).toBe('0')
    expect(truncated.attributes('title')).toBeUndefined()
  })

  it('lets a caller tabindex win and skips the stop when the tooltip is off', async () => {
    makeContentOverflow()
    const caller = mount(LineClamp, { attachTo: document.body, props: { maxLines: 2 }, attrs: { tabindex: '-1' }, slots: { default: () => 'Long text' } })
    const off = mountClamp({ hasTruncateTooltip: false })
    await nextTick()
    expect(caller.attributes('tabindex')).toBe('-1')
    expect(off.attributes('tabindex')).toBeUndefined()
  })

  it('mounts its tooltip only after a hover lasts the delay, then shows the full text', async () => {
    vi.useFakeTimers()
    makeContentOverflow()
    const wrapper = mountClamp()
    await nextTick()
    expect(document.querySelector('[role="tooltip"]')).toBeNull()

    wrapper.element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
    await vi.advanceTimersByTimeAsync(100)
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
    await vi.advanceTimersByTimeAsync(100)

    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent?.trim()).toBe('Some mixed inline content')
    expect(tooltip?.style.display).not.toBe('none')
  })

  it('mounts nothing when the mouse leaves before the delay', async () => {
    vi.useFakeTimers()
    makeContentOverflow()
    const wrapper = mountClamp()
    await nextTick()
    wrapper.element.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
    wrapper.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }))
    await vi.advanceTimersByTimeAsync(300)
    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })
})

describe('lineClamp keeps a clipped focusable out of the tab order', () => {
  const links = () => [
    'Read ',
    h('a', { 'href': '#visible', 'data-top': '0' }, 'visible'),
    ' then ',
    h('a', { 'href': '#clipped', 'data-top': '60' }, 'clipped'),
  ]

  it('marks a link past the last visible line inert and leaves a visible one alone', async () => {
    layOut()
    const wrapper = mountClamp({}, links)
    await nextTick()
    const [visible, clipped] = wrapper.findAll('a').map(link => link.element)
    expect(visible!.hasAttribute('inert')).toBe(false)
    expect(clipped!.hasAttribute('inert')).toBe(true)
  })

  it('makes a link reachable again once it is no longer clipped', async () => {
    layOut()
    const wrapper = mountClamp({}, links)
    await nextTick()
    const clipped = wrapper.findAll('a')[1]!.element
    clipped.setAttribute('data-top', '0')
    await wrapper.setProps({ maxLines: 3 })
    expect(clipped.hasAttribute('inert')).toBe(false)
  })

  it('never rewrites a caller tabindex or aria-hidden', async () => {
    layOut()
    const wrapper = mountClamp({}, () => [h('a', { 'href': '#x', 'data-top': '60', 'tabindex': '2', 'aria-hidden': 'false' }, 'clipped')])
    await nextTick()
    const link = wrapper.get('a').element
    expect(link.hasAttribute('inert')).toBe(true)
    expect(link.getAttribute('tabindex')).toBe('2')
    expect(link.getAttribute('aria-hidden')).toBe('false')
  })

  it('never hides the element that holds focus, and hides it once focus leaves', async () => {
    layOut()
    const wrapper = mountClamp({}, () => [h('a', { 'href': '#x', 'data-top': '0' }, 'link'), h('button', { type: 'button' }, 'outside')])
    await nextTick()
    const link = wrapper.get('a').element as HTMLElement
    const button = wrapper.get('button').element as HTMLElement
    link.focus()
    link.setAttribute('data-top', '60')
    await wrapper.setProps({ maxLines: 3 })
    expect(link.hasAttribute('inert')).toBe(false)

    button.focus()
    await nextTick()
    expect(link.hasAttribute('inert')).toBe(true)
  })

  it('keeps a caller inert set while the link is clipped', async () => {
    layOut()
    const wrapper = mountClamp({}, links)
    await nextTick()
    const clipped = wrapper.findAll('a')[1]!.element
    // happy-dom 把空字符串的旧值报成 null，所以这里让调用方写两次：第二条记录带着非空的旧值。
    clipped.setAttribute('inert', 'inert')
    clipped.setAttribute('inert', 'inert')
    clipped.setAttribute('data-top', '0')
    await wrapper.setProps({ maxLines: 3 })
    expect(clipped.hasAttribute('inert')).toBe(true)
  })

  it('leaves a link in a nested clamp to the nested clamp', async () => {
    layOut()
    const wrapper = mountClamp({}, () => [
      h(LineClamp, { 'maxLines': 5, 'data-top': '60' }, () => [h('a', { 'href': '#inner', 'data-top': '10' }, 'inner')]),
    ])
    await nextTick()
    // 内层容器自己的底边也是 40，链接在 10，归内层管，内层认为它可见。
    expect(wrapper.get('a').element.hasAttribute('inert')).toBe(false)
  })
})
