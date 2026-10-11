import type { UseChatStreamScrollReturn } from './useChatStreamScroll.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { useChatStreamScroll } from './useChatStreamScroll.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

interface Scroller {
  el: HTMLDivElement
  scrollTop: number
  setScrollHeight: (value: number) => void
}

function createScroller(scrollHeight = 1000, clientHeight = 400): Scroller {
  const el = document.createElement('div')
  let scrollTop = 0
  let height = scrollHeight
  Object.defineProperty(el, 'scrollTop', {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value
    },
  })
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    get: () => height,
  })
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => clientHeight,
  })
  Object.defineProperty(el, 'offsetHeight', {
    configurable: true,
    get: () => clientHeight,
  })
  return {
    el,
    get scrollTop() {
      return scrollTop
    },
    setScrollHeight(value: number) {
      height = value
    },
  }
}

function mountScroll(scroller: Scroller, enabled = true) {
  let api: UseChatStreamScrollReturn | undefined
  const scrollRef = ref<HTMLElement | null>(scroller.el)
  const Host = defineComponent({
    setup() {
      api = useChatStreamScroll({ scrollRef, enabled })
      return () => null
    },
  })
  const wrapper = mount(Host)
  return {
    wrapper,
    get api() {
      if (!api)
        throw new Error('scroll api missing')
      return api
    },
  }
}

async function frames(count = 2): Promise<void> {
  for (let index = 0; index < count; index += 1)
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
  await nextTick()
}

describe('useChatStreamScroll', () => {
  it('jumps to the bottom on the first fill and starts locked', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()
    expect(scroller.scrollTop).toBe(600)
    expect(api.isLocked.value).toBe(true)
    expect(api.isScrolledUp.value).toBe(false)
  })

  it('unlocks when the reader scrolls up past the button threshold', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()

    scroller.el.scrollTop = 100
    scroller.el.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(api.isLocked.value).toBe(false)
    expect(api.isScrolledUp.value).toBe(true)
  })

  it('ignores a scroll event caused by the content growing', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()

    scroller.setScrollHeight(1400)
    scroller.el.scrollTop = 500
    scroller.el.dispatchEvent(new Event('scroll'))
    await nextTick()

    expect(api.isLocked.value).toBe(true)
  })

  it('locks again when a scroll settles near the bottom', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()
    api.unlock()

    scroller.el.scrollTop = 595
    scroller.el.dispatchEvent(new Event('scrollend'))
    await nextTick()

    expect(api.isLocked.value).toBe(true)
  })

  it('jumps immediately for an instant scroll and for reduced motion', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()
    scroller.el.scrollTop = 0

    api.scrollToBottom({ behavior: 'instant' })
    expect(scroller.scrollTop).toBe(600)
    expect(api.isLocked.value).toBe(true)

    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    const reduced = createScroller()
    const reducedScroll = mountScroll(reduced)
    await frames()
    reduced.el.scrollTop = 20
    reducedScroll.api.scrollToBottom()
    expect(reduced.scrollTop).toBe(600)
  })

  it('positions the first scrollable fill in one step, and stays put while unlocked', async () => {
    const scroller = createScroller(100, 400)
    const { api } = mountScroll(scroller)
    await frames()
    expect(scroller.scrollTop).toBe(0)

    scroller.setScrollHeight(1000)
    api.scrollIfLocked()
    expect(scroller.scrollTop).toBe(600)

    api.unlock()
    scroller.el.scrollTop = 40
    api.scrollIfLocked()
    expect(scroller.scrollTop).toBe(40)
  })

  it('drops the lock when the reader wheels upward during the spring', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()
    scroller.el.scrollTop = 0
    api.scrollToBottom()
    scroller.el.dispatchEvent(new WheelEvent('wheel', { deltaY: -1 }))
    await nextTick()
    expect(api.isLocked.value).toBe(false)
  })
})
