import type { FakeResizeObserver } from '../composables/testing/fakeResizeObserver.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { installFakeResizeObserver } from '../composables/testing/fakeResizeObserver.js'
import Heading from '../Heading/Heading.vue'
import Text from './Text.vue'

enableAutoUnmount(afterEach)

let resize: FakeResizeObserver
let restoreWidths: () => void

/** 让每个元素都量成内容比盒子宽：单行截断成立。 */
function makeEverythingOverflow(): () => void {
  const prototype = window.HTMLElement.prototype
  const scrollWidth = Object.getOwnPropertyDescriptor(prototype, 'scrollWidth')
  const clientWidth = Object.getOwnPropertyDescriptor(prototype, 'clientWidth')
  Object.defineProperty(prototype, 'scrollWidth', { configurable: true, get: () => 500 })
  Object.defineProperty(prototype, 'clientWidth', { configurable: true, get: () => 100 })
  return () => {
    for (const [name, descriptor] of [['scrollWidth', scrollWidth], ['clientWidth', clientWidth]] as const) {
      if (descriptor)
        Object.defineProperty(prototype, name, descriptor)
      else
        delete (prototype as unknown as Record<string, unknown>)[name]
    }
  }
}

function pointer(type: string, pointerType: string): PointerEvent {
  return new PointerEvent(type, { bubbles: type !== 'pointerenter' && type !== 'pointerleave', pointerType })
}

function tooltips(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="tooltip"]')]
}

function isShown(tooltip: HTMLElement | undefined): boolean {
  return tooltip != null && tooltip.style.display !== 'none'
}

async function mountTruncatedText(props: Record<string, unknown> = {}) {
  const wrapper = mount(Text, {
    attachTo: document.body,
    props: { maxLines: 1, ...props },
    slots: { default: 'A label far wider than its column' },
  })
  resize.notify()
  await nextTick()
  return { wrapper, element: wrapper.get('span').element as HTMLElement }
}

beforeEach(() => {
  vi.useFakeTimers()
  resize = installFakeResizeObserver()
  restoreWidths = makeEverythingOverflow()
})

afterEach(() => {
  restoreWidths()
  resize.restore()
  vi.useRealTimers()
  document.body.innerHTML = ''
})

describe('truncation tooltip mounts on the first interaction', () => {
  it('mounts no tooltip layer and no description for truncated text at rest', async () => {
    const { element } = await mountTruncatedText()
    expect(tooltips()).toHaveLength(0)
    expect(element.hasAttribute('aria-describedby')).toBe(false)
  })

  it('a first mouse hover mounts the tooltip, which opens after its delay', async () => {
    const { element } = await mountTruncatedText()
    element.dispatchEvent(pointer('pointerenter', 'mouse'))
    await nextTick()

    const [tooltip] = tooltips()
    expect(tooltip?.textContent?.trim()).toBe('A label far wider than its column')
    expect(element.getAttribute('aria-describedby')).toBe(tooltip?.id)
    expect(isShown(tooltip)).toBe(false)

    await vi.advanceTimersByTimeAsync(200)
    expect(isShown(tooltip)).toBe(true)
  })

  it('a first tap mounts the tooltip open at once', async () => {
    const { element } = await mountTruncatedText()
    element.dispatchEvent(pointer('pointerdown', 'touch'))
    await nextTick()
    await nextTick()

    expect(isShown(tooltips()[0])).toBe(true)
  })

  it('a hover that leaves before the tooltip mounts opens nothing', async () => {
    const { element } = await mountTruncatedText()
    element.dispatchEvent(pointer('pointerenter', 'mouse'))
    element.dispatchEvent(pointer('pointerleave', 'mouse'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)

    expect(isShown(tooltips()[0])).toBe(false)
  })

  it('a mouse press before the tooltip mounts cancels the hover', async () => {
    const { element } = await mountTruncatedText()
    element.dispatchEvent(pointer('pointerenter', 'mouse'))
    element.dispatchEvent(pointer('pointerdown', 'mouse'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)

    expect(isShown(tooltips()[0])).toBe(false)
  })

  it('a hover on text that fits mounts nothing', async () => {
    restoreWidths()
    restoreWidths = () => {}
    const { element } = await mountTruncatedText()
    element.dispatchEvent(pointer('pointerenter', 'mouse'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)

    expect(tooltips()).toHaveLength(0)
  })

  it('a hover with the truncation tooltip off mounts nothing', async () => {
    const { element } = await mountTruncatedText({ hasTruncateTooltip: false })
    element.dispatchEvent(pointer('pointerenter', 'mouse'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)

    expect(tooltips()).toHaveLength(0)
  })

  it('keyboard focus inside the text mounts the tooltip', async () => {
    const wrapper = mount(Text, {
      attachTo: document.body,
      props: { maxLines: 1 },
      slots: { default: 'Read the <a href="#guide">long guide</a> first' },
    })
    resize.notify()
    await nextTick()
    const element = wrapper.get('span').element as HTMLElement
    expect(tooltips()).toHaveLength(0)

    const link = wrapper.get('a').element as HTMLElement
    link.focus()
    await nextTick()
    expect(element.getAttribute('aria-describedby')).toBe(tooltips()[0]?.id)
  })

  it('a tap on a link inside keeps the tap when the browser then focuses the link', async () => {
    const wrapper = mount(Text, {
      attachTo: document.body,
      props: { maxLines: 1 },
      slots: { default: 'Read the <a href="#guide">long guide</a> first' },
    })
    resize.notify()
    await nextTick()
    const link = wrapper.get('a').element as HTMLElement

    link.dispatchEvent(pointer('pointerdown', 'touch'))
    link.focus()
    await nextTick()
    await nextTick()

    expect(isShown(tooltips()[0])).toBe(true)
  })

  it('works the same for a truncated Heading', async () => {
    const wrapper = mount(Heading, {
      attachTo: document.body,
      props: { level: 2, maxLines: 1 },
      slots: { default: 'A heading far wider than its column' },
    })
    resize.notify()
    await nextTick()
    const element = wrapper.get('h2').element as HTMLElement
    expect(tooltips()).toHaveLength(0)

    element.dispatchEvent(pointer('pointerenter', 'mouse'))
    await nextTick()
    await vi.advanceTimersByTimeAsync(200)
    expect(isShown(tooltips()[0])).toBe(true)
    expect(element.hasAttribute('title')).toBe(false)
  })
})
