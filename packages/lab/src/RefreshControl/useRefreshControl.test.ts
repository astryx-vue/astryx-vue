/**
 * @file useRefreshControl.test.ts
 * @input vitest（happy-dom）、放在最小 app 滚动容器里的 useRefreshControl、内容上的输入事件、
 *   触屏的替身、包了一层的动效引擎
 * @output 证明下拉、结束、受控和代码发起的刷新、播报；哪些输入能拉、哪些不能；关掉的状态；
 *   滚动容器顶部的越界接管
 * @position 单元测试；动效本身（回落的弹簧、结束的曲线）在 useRefreshControl.motion.test.ts
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { content, indicator, mountRefresh, pointerDrag, pull, reveal, settleFrames, sized, touch, translateY, unmountAll, useTouchScreen, wheel } from './testing/refreshTestKit'

beforeEach(() => {
  useTouchScreen(true)
  // 没有 Web Animations 时动效引擎直接写终值。
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: undefined, configurable: true })
})

afterEach(() => {
  unmountAll()
  vi.unstubAllGlobals()
  vi.useRealTimers()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  document.body.innerHTML = ''
})

describe('useRefreshControl', () => {
  it('照 UIKit 拉动内容：过了门槛一比一跟手，直到内边距的高度', async () => {
    await mountRefresh({ onRefresh: () => {} })
    pull(content(), [12, 8, 20], false)
    // 手指走了 40px，其中 10px 是拖动的门槛。
    expect(translateY(content())).toBeCloseTo(30, 5)
    touch('touchmove', content(), 170)
    expect(translateY(content())).toBeCloseTo(60, 5)
    touch('touchend', content(), 170, true)
  })

  it('手指还按着就触发，松手落到刷新时的内边距上，并播报', async () => {
    const onRefresh = vi.fn(() => new Promise<void>(() => {}))
    await mountRefresh({ onRefresh })
    pull(content(), [20, 20, 20, 20], false)
    expect(onRefresh).not.toHaveBeenCalled()
    // 105px 的行程：过了触发点（73px 越界）。
    touch('touchmove', content(), 205)
    expect(onRefresh).toHaveBeenCalledTimes(1)
    await nextTick()
    expect(content().getAttribute('aria-busy')).toBe('true')
    expect(translateY(content())).toBeGreaterThan(74)
    expect(translateY(content())).toBeLessThan(95)
    // 下一帧回到手指下，一比一，和 UIKit 一样。
    touch('touchmove', content(), 210)
    expect(translateY(content())).toBeCloseTo(100, 5)
    touch('touchend', content(), 210, true)
    await settleFrames()
    expect(translateY(content())).toBeCloseTo(60, 5)
    expect(document.body.textContent).toContain('Refreshing')
  })

  it('从跨过门槛的那次移动开始拉，正好落在门槛上的也算', async () => {
    await mountRefresh({ onRefresh: () => {} })
    // 每步 5px：第二步落在 10px 的门槛上，拖动在位移 0 处开始；之后两步拉 10px。
    pull(content(), [5, 5, 5, 5], false)
    expect(translateY(content())).toBe(10)
  })

  it('下拉、回落和结束时指示器一直在滚动视图顶部', async () => {
    let resolve: () => void = () => {}
    await mountRefresh({ onRefresh: () => new Promise<void>((done) => {
      resolve = done
    }) })
    pull(content(), [30, 30, 30, 30], false)
    // 指示器骑在内容上沿，内容越过内边距多少，它就往回挪多少。
    const pulled = translateY(content())
    expect(pulled).toBeGreaterThan(60)
    expect(translateY(indicator())).toBeCloseTo(60 - pulled, 5)
    touch('touchend', content(), 220, true)
    await settleFrames()
    expect(translateY(content())).toBeCloseTo(60, 5)
    expect(translateY(indicator())).toBeCloseTo(0, 5)
    resolve()
    await settleFrames()
    expect(translateY(content())).toBe(0)
    // 回到顶部，内容的上沿盖住它。
    expect(translateY(indicator())).toBeCloseTo(60, 5)
  })

  it('没到触发点就回到顶部，不刷新', async () => {
    const onRefresh = vi.fn()
    await mountRefresh({ onRefresh })
    pull(content(), [20, 20, 20, 10])
    expect(onRefresh).not.toHaveBeenCalled()
    await settleFrames()
    expect(translateY(content())).toBe(0)
    expect(content().hasAttribute('aria-busy')).toBe(false)
  })

  it('onRefresh 返回的 Promise 落定时结束并去掉内边距，被拒绝的也一样', async () => {
    for (const outcome of ['resolve', 'reject'] as const) {
      let finish: () => void = () => {}
      await mountRefresh({ onRefresh: () => new Promise<void>((done, fail) => {
        finish = outcome === 'resolve' ? done : () => fail(new Error('offline'))
      }) })
      pull(content(), [30, 30, 30, 30])
      await nextTick()
      expect(content().getAttribute('aria-busy')).toBe('true')
      finish()
      await settleFrames()
      expect(content().hasAttribute('aria-busy')).toBe(false)
      expect(translateY(content())).toBe(0)
      unmountAll()
    }
  })

  it('跟着受控的 isRefreshing 走，不为它调 onRefresh', async () => {
    const onRefresh = vi.fn()
    const isRefreshing = ref<boolean | undefined>(false)
    await mountRefresh({ onRefresh, isRefreshing })
    isRefreshing.value = true
    await nextTick()
    expect(content().getAttribute('aria-busy')).toBe('true')
    expect(onRefresh).not.toHaveBeenCalled()
    isRefreshing.value = false
    await nextTick()
    expect(content().hasAttribute('aria-busy')).toBe(false)
  })

  it('受控时父组件接手拉出的刷新就一直刷新，直到父组件结束它', async () => {
    const isRefreshing = ref<boolean | undefined>(false)
    await mountRefresh({ onRefresh: () => {
      isRefreshing.value = true
    }, isRefreshing })
    pull(content(), [30, 30, 30, 30])
    await settleFrames()
    expect(content().getAttribute('aria-busy')).toBe('true')
    expect(translateY(content())).toBeCloseTo(60, 5)
    isRefreshing.value = false
    await settleFrames()
    expect(content().hasAttribute('aria-busy')).toBe(false)
    expect(translateY(content())).toBe(0)
  })

  it('受控的 isRefreshing 一直是 false 时，拉出的刷新在下一次更新时结束', async () => {
    const isRefreshing = ref<boolean | undefined>(false)
    const { control } = await mountRefresh({ onRefresh: () => {}, isRefreshing })
    pull(content(), [30, 30, 30, 30])
    await settleFrames()
    expect(control.isRefreshing.value).toBe(false)
    expect(translateY(content())).toBe(0)
  })

  it('受控的 isRefreshing 从第一次渲染起就生效', async () => {
    await mountRefresh({ isRefreshing: ref(true) })
    expect(content().getAttribute('aria-busy')).toBe('true')
  })

  it.each(['pen', 'mouse'] as const)('%s 拖动从不下拉：留给浏览器选文字', async (pointerType) => {
    useTouchScreen(false)
    const onRefresh = vi.fn()
    await mountRefresh({ onRefresh })
    const drag = pointerDrag(content(), pointerType)
    for (const step of [12, 8, 20, 20, 20, 25])
      drag.move(step)
    expect(translateY(content())).toBe(0)
    drag.lift()
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('触控板在顶部的双指滚动和手指一样拉：同样的映射、触发，滚动停下后落到内边距', async () => {
    useTouchScreen(false)
    const onRefresh = vi.fn(() => new Promise<void>(() => {}))
    await mountRefresh({ onRefresh })
    wheel(content(), [-12, -8, -20], { trackpad: true })
    // 往顶部滚了 40px，其中 10px 是拖动的门槛，和手指一样。
    expect(translateY(content())).toBeCloseTo(30, 5)
    wheel(content(), [-20, -20, -25], { trackpad: true })
    // 105px：滚动中途过了触发点。
    expect(onRefresh).toHaveBeenCalledTimes(1)
    await nextTick()
    expect(content().getAttribute('aria-busy')).toBe('true')
    // 最后一步之后 100ms 滚动停下，内容落到内边距上。
    await settleFrames(400)
    expect(translateY(content())).toBeCloseTo(60, 5)
  })

  it('鼠标滚轮的一格格从不下拉', async () => {
    useTouchScreen(false)
    const onRefresh = vi.fn()
    await mountRefresh({ onRefresh })
    wheel(content(), [-100, -100, -100], { trackpad: false })
    expect(translateY(content())).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('关掉时不下拉', async () => {
    const onRefresh = vi.fn()
    await mountRefresh({ onRefresh, isDisabled: ref(true) })
    pull(content(), [30, 30, 30, 30])
    expect(translateY(content())).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('接管所在滚动容器的顶部而不是页面的，卸载时还原容器自己的值', async () => {
    const { wrapper } = await mountRefresh({ onRefresh: () => {} })
    const list = document.querySelector<HTMLElement>('[data-testid="list"]')!
    list.style.overscrollBehaviorY = 'contain'
    list.scrollTop = 1
    list.dispatchEvent(new Event('scroll'))
    list.scrollTop = 0
    list.dispatchEvent(new Event('scroll'))
    expect(list.style.overscrollBehaviorY).toBe('none')
    expect(document.documentElement.style.overscrollBehaviorY).toBe('')
    wrapper.unmount()
    expect(list.style.overscrollBehaviorY).toBe('contain')
  })

  it('跟着滚动容器的滚动：只有顶部附近归下拉', async () => {
    await mountRefresh({ onRefresh: () => {} })
    const list = document.querySelector<HTMLElement>('[data-testid="list"]')!
    expect(list.style.overscrollBehaviorY).toBe('none')
    list.scrollTop = 400
    list.dispatchEvent(new Event('scroll'))
    expect(list.style.overscrollBehaviorY).toBe('')
    list.scrollTop = 10
    list.dispatchEvent(new Event('scroll'))
    expect(list.style.overscrollBehaviorY).toBe('none')
  })

  it('装得下内容的滚动容器留给浏览器：不接管顶部，也不下拉', async () => {
    const host = document.createElement('div')
    host.style.overflowY = 'auto'
    sized(host, { client: 334, scroll: 334 })
    document.body.append(host)
    const onRefresh = vi.fn()
    await mountRefresh({ onRefresh, isBare: true, attachTo: host })
    expect(host.style.overscrollBehaviorY).toBe('')
    pull(content(), [30, 30, 30, 30])
    expect(translateY(content())).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('只在能滚的元素里下拉：页面本身的顶部留给浏览器', async () => {
    const onRefresh = vi.fn()
    await mountRefresh({ onRefresh, isBare: true })
    pull(content(), [30, 30, 30, 30])
    expect(translateY(content())).toBe(0)
    expect(onRefresh).not.toHaveBeenCalled()
    expect(document.documentElement.style.overscrollBehaviorY).toBe('')
  })

  it('没有下拉开始的刷新完整显示指示器，内边距出现时容器跟着滚，看不出移动', async () => {
    const onRefresh = vi.fn(() => new Promise<void>(() => {}))
    const { control } = await mountRefresh({ onRefresh })
    const list = document.querySelector<HTMLElement>('[data-testid="list"]')!
    control.refresh()
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(reveal()).toBe('1')
    expect(translateY(content())).toBe(60)
    expect(list.scrollTop).toBe(60)
  })

  it('没有溢出的容器时，没有下拉开始的刷新不滚任何东西', async () => {
    const { control } = await mountRefresh({ onRefresh: () => new Promise<void>(() => {}), isBare: true })
    control.refresh()
    expect(document.documentElement.scrollTop).toBe(0)
  })

  it('跟着下拉露出指示器，手指下结束时又藏起来', async () => {
    const isRefreshing = ref<boolean | undefined>(false)
    await mountRefresh({ onRefresh: () => {}, isRefreshing })
    // 离触发点还有一段：露出一部分。
    pull(content(), [20, 20], false)
    const partway = Number(reveal())
    expect(partway).toBeGreaterThan(0)
    expect(partway).toBeLessThan(1)
    // 过了触发点、手指还按着：全露出来。
    touch('touchmove', content(), 170)
    touch('touchmove', content(), 200)
    isRefreshing.value = true
    await nextTick()
    expect(reveal()).toBe('1')
    isRefreshing.value = false
    await nextTick()
    touch('touchend', content(), 200, true)
    // 指示器沿着内容的回落曲线淡完才复位。
    await settleFrames(1000)
    expect(reveal()).toBe('0')
  })

  it('只调一次 onRefresh：刷新中的下拉只是拉伸', async () => {
    const onRefresh = vi.fn(() => new Promise<void>(() => {}))
    await mountRefresh({ onRefresh })
    pull(content(), [30, 30, 30, 30])
    await settleFrames()
    pull(content(), [30, 30, 30, 30])
    await settleFrames()
    expect(onRefresh).toHaveBeenCalledTimes(1)
    expect(translateY(content())).toBeCloseTo(60, 5)
  })

  it('刷新在手指下结束时，内边距不再托着内容：手指往回内容就跟着回去', async () => {
    const isRefreshing = ref<boolean | undefined>(true)
    await mountRefresh({ onRefresh: () => {}, isRefreshing })
    // 刷新中拉一下：内边距托着内容。
    pull(content(), [20, 10], false)
    expect(translateY(content())).toBeGreaterThanOrEqual(60)
    isRefreshing.value = false
    await nextTick()
    touch('touchmove', content(), 105)
    expect(translateY(content())).toBeLessThan(60)
    touch('touchend', content(), 105, true)
  })
})
