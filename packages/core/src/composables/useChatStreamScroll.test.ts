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

describe('useChatStreamScroll 滚动锚定', () => {
  it('贴着末尾时关掉浏览器的滚动锚定，读者上滑后还回去', async () => {
    const scroller = createScroller()
    const { api, wrapper } = mountScroll(scroller)
    await frames()
    expect(scroller.el.getAttribute('data-astryx-scroll-anchoring')).toBe('off')
    expect(document.head.querySelectorAll('style[data-astryx-scroll-anchoring="rule"]')).toHaveLength(1)

    scroller.el.scrollTop = 100
    scroller.el.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(api.isLocked.value).toBe(false)
    expect(scroller.el.hasAttribute('data-astryx-scroll-anchoring')).toBe(false)

    scroller.el.scrollTop = 595
    scroller.el.dispatchEvent(new Event('scrollend'))
    await nextTick()
    expect(scroller.el.getAttribute('data-astryx-scroll-anchoring')).toBe('off')

    wrapper.unmount()
    expect(scroller.el.hasAttribute('data-astryx-scroll-anchoring')).toBe(false)
  })

  it('不再给滚动容器打 data-astryx-scrolling', async () => {
    const scroller = createScroller()
    const { api } = mountScroll(scroller)
    await frames()
    scroller.el.scrollTop = 0
    api.scrollToBottom()
    expect(scroller.el.hasAttribute('data-astryx-scrolling')).toBe(false)
  })
})

describe('useChatStreamScroll 整页滚动', () => {
  function createPage(): Scroller & { scrollTo: ReturnType<typeof vi.fn> } {
    const page = createScroller(1000, 400)
    // 整页的 offsetHeight 是页面总高，clientHeight 才是视口。
    Object.defineProperty(page.el, 'offsetHeight', { configurable: true, get: () => 5000 })
    const scrollTo = vi.fn((options: ScrollToOptions) => {
      page.el.scrollTop = options.top ?? 0
    })
    Object.defineProperty(page.el, 'scrollTo', { configurable: true, value: scrollTo })
    return Object.assign(page, { scrollTo })
  }

  function mountPage(page: Scroller) {
    Object.defineProperty(document, 'scrollingElement', { configurable: true, get: () => page.el })
    return mountScroll(page)
  }

  afterEach(() => {
    delete (document as { scrollingElement?: unknown }).scrollingElement
  })

  it('按视口高度量到末尾的距离，滚动按钮能出现', async () => {
    const page = createPage()
    const { api } = mountPage(page)
    await frames()

    page.el.scrollTop = 0
    document.dispatchEvent(new Event('scroll'))
    await nextTick()
    // 到末尾还有 600px；用页面总高（5000）算的话会得出负数，按钮永远不出现。
    expect(api.isScrolledUp.value).toBe(true)
  })

  it('页面的滚动事件触发在 document 上，读者上滑就停止跟随', async () => {
    const page = createPage()
    const { api } = mountPage(page)
    await frames()
    expect(page.scrollTop).toBe(600)

    page.el.scrollTop = 300
    document.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(api.isLocked.value).toBe(false)

    page.el.scrollTop = 595
    document.dispatchEvent(new Event('scrollend'))
    await nextTick()
    expect(api.isLocked.value).toBe(true)
  })

  it('scrollToMessage 从视口顶部量起', async () => {
    const page = createPage()
    const { api } = mountPage(page)
    await frames()
    page.el.scrollTop = 300
    page.el.getBoundingClientRect = () => ({ top: -300 }) as DOMRect

    const message = document.createElement('div')
    message.getBoundingClientRect = () => ({ top: 700 }) as DOMRect
    api.scrollToMessage(message)

    // 700（消息在视口里的位置）+ 300（已滚动）：不能再减去根元素盒子的 -300。
    expect(page.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: 'instant' })
  })
})
