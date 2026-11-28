import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { attachScrollSettle, createScrollSteer, PASSIVE } from './scrollSettle.js'
import TouchDateSheet from './TouchDateSheet.vue'

const PANE = 300

interface ScrollCall { left: number, behavior?: ScrollBehavior }

let frames: FrameRequestCallback[] = []
let scrollCalls: ScrollCall[] = []
const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
const originalScrollTo = HTMLElement.prototype.scrollTo
const originalAnimate = HTMLElement.prototype.animate

function flushFrames(): void {
  const pending = frames
  frames = []
  for (const frame of pending)
    frame(performance.now())
}

function mockMedia(reduced: boolean, coarse: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: (reduced && query.includes('prefers-reduced-motion: reduce')) || (coarse && query === '(pointer: coarse)'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }))
}

beforeEach(() => {
  frames = []
  scrollCalls = []
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
  vi.stubGlobal('cancelAnimationFrame', () => {})
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains('astryx-date-touch-scroller') ? PANE : 0
    },
  })
  HTMLElement.prototype.scrollTo = function (this: HTMLElement, options?: ScrollToOptions | number) {
    if (typeof options === 'object' && this.classList.contains('astryx-date-touch-scroller'))
      scrollCalls.push({ left: options.left ?? 0, behavior: options.behavior })
  } as typeof HTMLElement.prototype.scrollTo
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  if (originalClientWidth)
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth)
  HTMLElement.prototype.scrollTo = originalScrollTo
  HTMLElement.prototype.animate = originalAnimate
})

function scroller(): HTMLElement {
  return document.querySelector<HTMLElement>('.astryx-date-touch-scroller')!
}

function touch(element: HTMLElement, type: string, clientX = 0): void {
  const event = new Event(type)
  const points = type === 'touchend' || type === 'touchcancel' ? [] : [{ clientX, clientY: 0 }]
  Object.defineProperty(event, 'touches', { value: points })
  element.dispatchEvent(event)
}

function title(): string {
  return document.querySelector('.astryx-date-touch-title')?.textContent?.trim() ?? ''
}

async function mountSheet(): Promise<number> {
  mount(TouchDateSheet, {
    attachTo: document.body,
    props: { selected: new Date(2026, 2, 10), min: new Date(2026, 0, 1), max: new Date(2026, 11, 31) },
  })
  await nextTick()
  await nextTick()
  const element = scroller()
  // 2026 年 1 月是第 0 排，选中的 3 月是第 2 排。
  expect(element.scrollLeft).toBe(2 * PANE)
  return 2
}

async function clickNext(): Promise<void> {
  document.querySelector<HTMLButtonElement>('.astryx-date-touch-arrow[aria-label="Next month"]')?.click()
  await nextTick()
}

describe('touchMonthScroller 横向翻月', () => {
  it('量到宽度后摆到选中的月份，只挂它两边几个月', async () => {
    await mountSheet()
    const panes = document.querySelectorAll('.astryx-date-touch-pane')
    expect(panes.length).toBe(6)
    expect(title()).toContain('March')
  })

  it('箭头翻月是一次平滑滚动，停稳时浏览器提前截断也送到标题那个月', async () => {
    const row = await mountSheet()
    await clickNext()
    expect(title()).toContain('April')
    expect(scrollCalls.at(-1)).toEqual({ left: (row + 1) * PANE, behavior: 'smooth' })
    // WebKit 提前结束的平滑滚动：停在离 3 月更近的地方。
    const element = scroller()
    element.scrollLeft = row * PANE + 100
    element.dispatchEvent(new Event('scrollend'))
    flushFrames()
    expect(scrollCalls.at(-1)).toEqual({ left: (row + 1) * PANE, behavior: 'smooth' })
    expect(title()).toContain('April')
  })

  it('手指自己滚的，停稳后落到最近的那个月并更新标题', async () => {
    const row = await mountSheet()
    const element = scroller()
    touch(element, 'touchstart')
    element.scrollLeft = (row + 1) * PANE - 40
    element.dispatchEvent(new Event('scroll'))
    flushFrames()
    await nextTick()
    expect(title()).toContain('April')
    touch(element, 'touchend')
    element.dispatchEvent(new Event('scrollend'))
    flushFrames()
    expect(scrollCalls.at(-1)).toEqual({ left: (row + 1) * PANE, behavior: 'smooth' })
  })

  it('手指一按就结束引导，之后停稳按最近的月份校正', async () => {
    const row = await mountSheet()
    await clickNext()
    const element = scroller()
    touch(element, 'touchstart')
    touch(element, 'touchend')
    element.scrollLeft = row * PANE + 100
    element.dispatchEvent(new Event('scrollend'))
    flushFrames()
    expect(scrollCalls.at(-1)).toEqual({ left: row * PANE, behavior: 'smooth' })
  })

  it('非手指滚动重新居中时关掉吸附，提交后的下一帧再打开', async () => {
    const row = await mountSheet()
    const element = scroller()
    element.scrollLeft = (row + 1) * PANE
    element.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(element.style.scrollSnapType).toBe('none')
    await nextTick()
    flushFrames()
    expect(element.style.scrollSnapType).toBe('')
  })

  it('手指滚动重新居中时不动吸附', async () => {
    const row = await mountSheet()
    const element = scroller()
    touch(element, 'touchstart')
    element.scrollLeft = (row + 1) * PANE
    element.dispatchEvent(new Event('scroll'))
    flushFrames()
    expect(element.style.scrollSnapType).toBe('')
  })

  it('减少动效、精细指针：箭头翻月直接换，不滑动', async () => {
    mockMedia(true, false)
    const row = await mountSheet()
    await clickNext()
    await nextTick()
    expect(scrollCalls.some(call => call.behavior === 'smooth')).toBe(false)
    expect(scrollCalls.at(-1)).toEqual({ left: (row + 1) * PANE, behavior: 'auto' })
  })

  it('减少动效、粗指针：箭头翻月在一次透明度下沉里换', async () => {
    mockMedia(true, true)
    const animations: Keyframe[][] = []
    HTMLElement.prototype.animate = function (keyframes: Keyframe[] | PropertyIndexedKeyframes | null) {
      animations.push(keyframes as Keyframe[])
      return { finished: Promise.resolve(), cancel: () => {}, startTime: 0 } as unknown as Animation
    } as typeof HTMLElement.prototype.animate
    const row = await mountSheet()
    await clickNext()
    expect(animations[0]?.at(-1)).toEqual({ opacity: 0 })
    await Promise.resolve()
    await nextTick()
    await nextTick()
    expect(scrollCalls.some(call => call.behavior === 'smooth')).toBe(false)
    expect(scrollCalls.at(-1)).toEqual({ left: (row + 1) * PANE, behavior: 'auto' })
    expect(animations[1]?.at(-1)).toEqual({ opacity: 1 })
  })

  it('键盘把焦点挪出这个月：滚到下个月并聚焦那一天', async () => {
    const row = await mountSheet()
    const day = document.querySelector<HTMLButtonElement>('[aria-label="March 2026"] button[tabindex="0"]')!
    expect(day.dataset.date).toBe('2026-03-01')
    day.focus()
    day.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }))
    await nextTick()
    await nextTick()
    expect(scrollCalls.at(-1)).toEqual({ left: (row + 1) * PANE, behavior: 'smooth' })
    expect(document.activeElement?.getAttribute('data-date')).toBe('2026-04-01')
  })
})

describe('attachScrollSettle 的监听', () => {
  it('直接挂上、直接摘下，被动监听共用一个选项对象', () => {
    const element = document.createElement('div')
    const add = vi.spyOn(element, 'addEventListener')
    const remove = vi.spyOn(element, 'removeEventListener')
    const detach = attachScrollSettle(element, () => {}, createScrollSteer())
    const passive = add.mock.calls.filter(([type]) => type !== 'keydown')
    expect(passive.length).toBeGreaterThan(0)
    for (const call of passive)
      expect(call[2]).toBe(PASSIVE)
    detach()
    expect(remove.mock.calls).toEqual(add.mock.calls)
  })
})
