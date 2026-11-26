import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive, ref } from 'vue'
import { wheelEvent } from '../gestures/__tests__/wheelEvent'
import { TOUCH_ACTION_ATTRIBUTE } from '../gestures/touchActionRule'
import { paging } from '../motion/uikit/paging'
import { pickPage, viewPages } from './internal/snapPagingMotion.js'
import { attachSnapPaging, isSnapPaging, moveHeldSnapPaging, moveSnapPaging, nearestStop, snapPages, snapStops } from './internal/snapPagingValue.js'
import { fakeRow, layOutRow, swipe, touch } from './testing/fakeSnapRow.js'
import { useSnapPaging } from './useSnapPaging.js'

// 记下每个元素的尺寸回调，测试里手动报一次「改了尺寸」。
const resizeCallbacks = vi.hoisted(() => new Map<Element, Set<() => void>>())
vi.mock('../utils/sharedResizeObserver', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../utils/sharedResizeObserver')>()
  return {
    ...actual,
    observeResize(element: Element, callback: (entry: ResizeObserverEntry) => void) {
      const notify = () => callback({ target: element } as ResizeObserverEntry)
      const set = resizeCallbacks.get(element) ?? new Set()
      set.add(notify)
      resizeCallbacks.set(element, set)
      const unobserve = actual.observeResize(element, callback)
      return () => {
        set.delete(notify)
        unobserve()
      }
    },
  }
})

function reportResize(element: Element): void {
  for (const notify of resizeCallbacks.get(element) ?? [])
    notify()
}

const advance = (ms: number) => vi.advanceTimersByTime(ms)
// 十项、每项 100 像素，一屏 300 像素：停点是 0 到 700，每 100 一个。
const TEN = { width: 300, items: Array.from({ length: 10 }).fill(100) as number[] }

function reducedMotion(matches: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: matches && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }) as unknown as MediaQueryList)
}

// 手势宿主跟着 document 活过一个个测试，所以事件时间只能往前走。
let elapsed = 0

beforeEach(() => {
  vi.useFakeTimers()
  vi.advanceTimersByTime(elapsed)
  reducedMotion(false)
})

afterEach(() => {
  elapsed = performance.now() + 10_000
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('the SnapPaging value', () => {
  it('is recognised from useSnapPaging, also behind a reactive wrapper, and nothing else is', () => {
    const paging = useSnapPaging()
    expect(isSnapPaging(paging)).toBe(true)
    expect(isSnapPaging(reactive({ paging }).paging)).toBe(true)
    expect(isSnapPaging(true)).toBe(false)
    expect(isSnapPaging({})).toBe(false)
    expect(isSnapPaging(null)).toBe(false)
  })

  it('finds the nearest stop, or the offset itself with no stops', () => {
    expect(nearestStop([0, 100, 200], 140)).toBe(100)
    expect(nearestStop([], 42)).toBe(42)
  })

  it('moves only an attached row, and moves a row only while it is held', () => {
    const row = fakeRow(TEN)
    expect(moveSnapPaging(row, () => 100)).toBe(false)
    const detach = attachSnapPaging(useSnapPaging(), row)
    expect(moveHeldSnapPaging(row, () => 100)).toBe(false)
    expect(moveSnapPaging(row, () => 100)).toBe(true)
    detach()
    expect(moveSnapPaging(row, () => 100)).toBe(false)
  })
})

describe('the end page', () => {
  // 一行 299 像素宽，七项各 94.67 像素、间距 8：第五项的停点 410.67 离末端只差约 1.33 像素。
  const SEVEN = { width: 299, items: Array.from({ length: 7 }).fill(94.67) as number[], gap: 8 }
  const rounded = (stops: number[]) => stops.map(stop => Math.round(stop))

  it('takes a stop within half its preceding step of the end into the end page, which rests where the row ends', () => {
    expect(rounded(snapStops(fakeRow(SEVEN), 0, 412))).toEqual([0, 103, 205, 308, 412])
  })

  it('lets native snap skip that stop, until the stop is further from the end than half its step', () => {
    const row = fakeRow(SEVEN)
    expect(snapPages(row, 0, 412).skipped).toEqual([row.children[4]])
    const split = snapPages(row, 0, 471)
    expect(rounded(split.stops)).toEqual([0, 103, 205, 308, 411, 471])
    expect(split.skipped).toEqual([])
  })

  it('turns off native snap on the skipped item at rest, and gives its own value back on detach', () => {
    const row = fakeRow(SEVEN)
    const fifth = row.children[4] as HTMLElement
    fifth.style.setProperty('scroll-snap-align', 'center')
    const detach = attachSnapPaging(useSnapPaging(), row)
    advance(16)
    expect(fifth.style.getPropertyValue('scroll-snap-align')).toBe('none')
    expect((row.children[3] as HTMLElement).style.getPropertyValue('scroll-snap-align')).toBe('')
    detach()
    expect(fifth.style.getPropertyValue('scroll-snap-align')).toBe('center')
  })
})

describe('pages and the page a release picks', () => {
  it('pages one view at a time, each on the stop nearest one view on', () => {
    expect(viewPages([0, 100, 200, 300, 400, 500, 600, 700], 0, 300)).toEqual([0, 300, 600, 700])
    expect(viewPages([0, 100, 200, 300, 400, 500, 600, 700], 2, 300)).toEqual([0, 200, 500, 700])
  })

  it('moves a flick at least one page in its direction, and never more than one page from where it began', () => {
    const pages = [0, 300, 600, 700]
    expect(pickPage(pages, 40, 400, 0)).toBe(1)
    expect(pickPage(pages, 40, 50_000, 0)).toBe(1)
    expect(pickPage(pages, 260, -400, 1)).toBe(0)
  })

  it('rests a slow release on the page nearest where it is', () => {
    expect(pickPage([0, 300, 600], 140, 0, 0)).toBe(0)
    expect(pickPage([0, 300, 600], 160, 0, 0)).toBe(1)
  })
})

describe('paging under a finger', () => {
  function attach(options: Parameters<typeof useSnapPaging>[0] = {}, layout = TEN) {
    const row = fakeRow(layout)
    const detach = attachSnapPaging(useSnapPaging(options), row)
    return { row, detach }
  }

  it('follows the finger with native snap off, then hands the row back on a stop with snap restored', () => {
    const { row } = attach()
    row.style.setProperty('scroll-snap-type', 'x proximity')
    swipe(row, advance, [200, 190, 150, 120], { stepMs: 100, lift: false })
    // 超过拖动阈值的那一段不算，这一行从阈值处开始跟手。
    expect(row.scrollLeft).toBe(70)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('none')
    // 手指停住再抬起：没有速度，回到最近的一页。
    advance(100)
    touch(row, 'pointerup', 120)
    advance(2000)
    expect(row.scrollLeft).toBe(0)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('x proximity')
  })

  it('moves one view on a flick, however fast', () => {
    const { row } = attach()
    swipe(row, advance, [250, 200, 100, 0, -200])
    advance(2000)
    expect(row.scrollLeft).toBe(300)
  })

  it('moves one item on a flick with pages: item', () => {
    const { row } = attach({ pages: 'item' })
    swipe(row, advance, [250, 230, 200, 160])
    advance(2000)
    expect(row.scrollLeft).toBe(100)
  })

  it('reads a new pages option from the next flick', () => {
    const options = ref<{ pages: 'view' | 'item' }>({ pages: 'view' })
    const { row } = attach(options)
    options.value = { pages: 'item' }
    swipe(row, advance, [250, 230, 200, 160])
    advance(2000)
    expect(row.scrollLeft).toBe(100)
  })

  it('animates the settle over several frames, and jumps straight there under reduced motion', () => {
    const { row } = attach()
    swipe(row, advance, [250, 200, 150, 100])
    advance(16)
    const midway = row.scrollLeft
    expect(midway).toBeGreaterThan(100)
    expect(midway).toBeLessThan(300)
    advance(2000)
    expect(row.scrollLeft).toBe(300)

    reducedMotion(true)
    swipe(row, advance, [250, 200, 150, 100])
    expect(row.scrollLeft).toBe(600)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
  })

  it('leaves a mouse drag and a vertical touch to native scrolling', () => {
    const { row } = attach()
    swipe(row, advance, [250, 200, 100], { pointerType: 'mouse' })
    expect(row.scrollLeft).toBe(0)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
    swipe(row, advance, [250, 248, 245], { y: [0, 40, 80] })
    expect(row.scrollLeft).toBe(0)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
  })

  it('keeps vertical touches for the page and takes horizontal ones while attached', () => {
    const { row, detach } = attach()
    expect(row.getAttribute(TOUCH_ACTION_ATTRIBUTE)).toBe('pan-y pinch-zoom')
    detach()
    expect(row.hasAttribute(TOUCH_ACTION_ATTRIBUTE)).toBe(false)
  })

  it('catches a release settle 85 ms after a still touch, keeps the touch from the content, and rests on a page after the lift', () => {
    const { row } = attach()
    const clicks = vi.fn()
    row.addEventListener('click', clicks)
    swipe(row, advance, [250, 200, 150, 100])
    advance(16)
    const touched = row.scrollLeft
    expect(touched).toBeGreaterThan(100)
    expect(touched).toBeLessThan(300)
    touch(row, 'pointerdown', 100)
    // 按下后这一行再走 85 毫秒（UIKit 实测）才停住。
    advance(paging.catchStopMs)
    const caught = row.scrollLeft
    expect(caught).toBeGreaterThan(touched)
    expect(caught).toBeLessThan(300)
    advance(300)
    expect(row.scrollLeft).toBe(caught)
    touch(row, 'pointerup', 100)
    row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    expect(clicks).not.toHaveBeenCalled()
    advance(2000)
    expect([0, 300]).toContain(row.scrollLeft)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
  })

  it('lets a release settle run on when the touch lifts before the catch', () => {
    const { row } = attach()
    swipe(row, advance, [250, 200, 150, 100])
    advance(16)
    touch(row, 'pointerdown', 100)
    advance(30)
    touch(row, 'pointerup', 100)
    advance(2000)
    expect(row.scrollLeft).toBe(300)
  })

  it('stops a programmatic move at the touch itself', () => {
    const { row } = attach()
    moveSnapPaging(row, () => 600)
    advance(48)
    const touched = row.scrollLeft
    expect(touched).toBeGreaterThan(0)
    expect(touched).toBeLessThan(600)
    touch(row, 'pointerdown', 100)
    advance(300)
    expect(row.scrollLeft).toBe(touched)
    // 停住后直接抬起：停到最近的一项。
    touch(row, 'pointerup', 100)
    advance(2000)
    expect(row.scrollLeft).toBe(Math.round(touched / 100) * 100)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
  })

  it('pages the other way from right to left', () => {
    const { row } = attach()
    row.style.direction = 'rtl'
    swipe(row, advance, [0, 50, 150, 250])
    advance(2000)
    expect(row.scrollLeft).toBe(-300)
  })

  it('follows a resize while held: the travel shrinks and the held position stays inside it', () => {
    const { row, detach } = attach()
    // 拖到接近末端再按住不放。
    swipe(row, advance, [290, 200, 100, 10], { stepMs: 100, lift: false })
    const held = row.scrollLeft
    expect(held).toBeGreaterThan(200)
    // 这一行的项变窄：可滚动距离从 700 变成 200。
    Object.defineProperty(row, 'scrollWidth', { configurable: true, value: 500 })
    reportResize(row)
    expect(row.scrollLeft).toBe(200)
    // 收进新范围以后照样跟手。
    touch(row, 'pointermove', 60)
    expect(row.scrollLeft).toBe(200)
    touch(row, 'pointermove', 150)
    expect(row.scrollLeft).toBeLessThan(200)
    advance(100)
    touch(row, 'pointerup', 150)
    advance(2000)
    detach()
    expect(resizeCallbacks.get(row)?.size ?? 0).toBe(0)
  })

  it('hands a held row back where it is shown on detach', () => {
    const { row, detach } = attach()
    swipe(row, advance, [250, 200, 150], { lift: false })
    detach()
    expect(row.scrollLeft).toBe(90)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
    advance(2000)
    expect(row.scrollLeft).toBe(90)
    touch(row, 'pointerup', 150)
  })
})

describe('paging on a trackpad swipe', () => {
  function wheel(row: HTMLElement, init: WheelEventInit): WheelEvent {
    const event = wheelEvent('wheel', { bubbles: true, cancelable: true, ...init })
    row.dispatchEvent(event)
    return event
  }

  /** 触控板的横扫：像素增量正好是旧版 `wheelDelta` 的三分之一，浏览器靠这个认出触控板。 */
  function trackpad(row: HTMLElement, deltaX: number): WheelEvent {
    const event = wheelEvent('wheel', { bubbles: true, cancelable: true, deltaX })
    Object.defineProperty(event, 'wheelDeltaX', { value: -3 * deltaX })
    Object.defineProperty(event, 'wheelDeltaY', { value: 0 })
    row.dispatchEvent(event)
    return event
  }

  it('follows a horizontal swipe, then pages once it stops, one page at most', () => {
    const row = fakeRow(TEN)
    attachSnapPaging(useSnapPaging(), row)
    const events = []
    for (let i = 0; i < 30; i++) {
      events.push(trackpad(row, 30))
      advance(16)
    }
    expect(events.every(event => event.defaultPrevented)).toBe(true)
    expect(row.scrollLeft).toBe(300)
    advance(2000)
    expect(row.scrollLeft).toBe(300)
  })

  it('leaves a mouse wheel to native scrolling', () => {
    const row = fakeRow(TEN)
    attachSnapPaging(useSnapPaging(), row)
    expect(wheel(row, { deltaY: 120 }).defaultPrevented).toBe(false)
    expect(wheel(row, { deltaX: 3, deltaMode: 1 }).defaultPrevented).toBe(false)
    expect(row.style.getPropertyValue('scroll-snap-type')).toBe('')
  })

  it('moves a held row to a new target with moveHeld, and lands there', () => {
    const row = fakeRow(TEN)
    layOutRow(row, TEN)
    attachSnapPaging(useSnapPaging(), row)
    trackpad(row, 30)
    expect(moveHeldSnapPaging(row, () => 5000)).toBe(true)
    advance(2000)
    expect(row.scrollLeft).toBe(700)
  })
})
