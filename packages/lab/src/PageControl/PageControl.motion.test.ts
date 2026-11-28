/**
 * @file PageControl.motion.test.ts
 * @input vitest（happy-dom）、记录关键帧的 `Element.animate` 替身、包了一层的 animatorFor、
 *   PageControl 和它的测试工具
 * @output 证明触屏呈现的动效：旧点按实测时长和曲线淡出、按住的样子、窗口 50ms 后按临界阻尼弹簧
 *   滑一格且不过冲、减少动态效果下的替代、越过边缘的自动连翻
 * @position 单元测试；语义、几何和输入在 PageControl.test.ts
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { jogInterval, PITCH, SWITCH } from './pageControlModel'
import { pageControl as PC } from './pageControlTable'
import { asTouch, dots, drag, media, mountControl, nextPressTime, pinnedPressTime, pointer, stubMedia, unmountAll } from './testing/pageControlTestKit'

interface RecordedAnimator {
  set: ReturnType<typeof vi.spyOn>
  animate: ReturnType<typeof vi.spyOn>
}

const animators = vi.hoisted(() => new Map<HTMLElement, unknown>())
vi.mock('@astryx-vue/core/internal/touch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@astryx-vue/core/internal/touch')>()
  return {
    ...actual,
    animatorFor: ((element: HTMLElement, options?: Parameters<typeof actual.animatorFor>[1]) => {
      const animator = actual.animatorFor(element, options)
      if (!animators.has(element))
        animators.set(element, { set: vi.spyOn(animator, 'set'), animate: vi.spyOn(animator, 'animate') })
      return animator
    }) as typeof actual.animatorFor,
  }
})

const recordedOf = (element: Element): RecordedAnimator => animators.get(element as HTMLElement) as RecordedAnimator

interface Played {
  element: Element
  keyframes: Keyframe[]
}

let played: Played[] = []
const originalAnimate = Element.prototype.animate

beforeEach(() => {
  played = []
  animators.clear()
  media.coarse = false
  media.reduced = false
  stubMedia()
  Element.prototype.animate = function (this: Element, keyframes: Keyframe[] | PropertyIndexedKeyframes | null) {
    played.push({ element: this, keyframes: keyframes as Keyframe[] })
    return {
      cancel: vi.fn(),
      addEventListener() {},
      startTime: null,
      currentTime: 0,
      effect: { setKeyframes() {}, updateTiming() {} },
    } as unknown as Animation
  }
})

afterEach(() => {
  unmountAll()
  Element.prototype.animate = originalAnimate
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

/** 记下每次强制读样式时这个点上写着的过渡：淡出就是在这一刻按写好的时长开始的。 */
function recordFadeStarts(): string[] {
  const started: string[] = []
  const original = window.getComputedStyle.bind(window)
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) => {
    if (element instanceof HTMLElement && element.dataset.page != null)
      started.push(element.style.transition)
    return original(element, pseudo)
  })
  return started
}

const REDUCED_FADE = 'opacity 0.2s cubic-bezier(0.42, 0, 0.58, 1)'

describe('pageControl 的淡出', () => {
  it('手指下旧的当前点按实测的 250ms 和曲线淡出，主题变量改不了它；之后马上又是切换', async () => {
    asTouch()
    const { slider, page } = await mountControl({ attrs: { style: { '--motion-page-control-fade-out-ms': '500ms' } } })
    const started = recordFadeStarts()
    const old = slider().querySelector<HTMLElement>('[data-page="2"]')!
    page.value = 4
    await nextTick()
    expect(started).toEqual(['opacity 0.25s cubic-bezier(0, 0, 0.58, 1)'])
    expect(old.style.transition).toBe(SWITCH)
  })

  it('点按要的页，旧点淡得更快（125ms）', async () => {
    asTouch()
    const { slider } = await mountControl()
    const started = recordFadeStarts()
    pointer('pointerdown', slider(), 50, { kind: 'touch', time: nextPressTime() })
    pointer('pointerup', slider(), 50, { kind: 'touch' })
    await nextTick()
    expect(slider().getAttribute('aria-valuenow')).toBe('4')
    expect(started).toEqual(['opacity 0.125s cubic-bezier(0, 0, 0.58, 1)'])
  })

  it('手指下减少动态效果时当前点立刻换，没有淡出', async () => {
    asTouch({ reduced: true })
    const { slider, page } = await mountControl()
    const started = recordFadeStarts()
    page.value = 4
    await nextTick()
    await nextTick()
    expect(started).toEqual([])
    expect(dots(slider()).map(dot => dot.style.transition)).toEqual(Array.from({ length: 5 }).fill('none'))
  })
})

describe('pageControl 按住的样子', () => {
  it('手指按住 155ms 后在这个任务里就显示垫片、其余点变暗', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    asTouch()
    const { slider } = await mountControl()
    pointer('pointerdown', slider(), 1, { kind: 'touch', time: pinnedPressTime() })
    vi.advanceTimersByTime(PC.interactionDelayMs - 1)
    await nextTick()
    expect(slider().hasAttribute('data-interacting')).toBe(false)
    vi.advanceTimersByTime(1)
    // 只等这个任务的微任务，不推进任何计时器。
    await nextTick()
    expect(slider().hasAttribute('data-interacting')).toBe(true)
    const other = slider().querySelector<HTMLElement>('[data-page="0"]')!
    expect(other.style.opacity).toBe(String(PC.interactingOtherIndicatorAlpha))
    pointer('pointerup', slider(), 1, { kind: 'touch' })
    await nextTick()
    expect(slider().hasAttribute('data-interacting')).toBe(false)
  })

  it('减少动态效果时按住的样子立刻出现，松手时按规则的 200ms 淡出', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    asTouch({ reduced: true })
    const { slider } = await mountControl()
    const look = (): { platter: string, dots: string[] } => ({
      platter: slider().style.getPropertyValue('--_page-control-platter-transition'),
      dots: dots(slider()).map(dot => dot.style.transition),
    })
    pointer('pointerdown', slider(), 1, { kind: 'touch', time: pinnedPressTime() })
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(slider().hasAttribute('data-interacting')).toBe(true)
    expect(look()).toEqual({ platter: 'none', dots: Array.from({ length: 5 }).fill('none') })
    // 抬起时翻一页：点立刻换，垫片照样按规则淡出。
    pointer('pointerup', slider(), 1, { kind: 'touch' })
    await nextTick()
    expect(slider().getAttribute('aria-valuenow')).not.toBe('3')
    expect(slider().hasAttribute('data-interacting')).toBe(false)
    expect(look()).toEqual({ platter: REDUCED_FADE, dots: Array.from({ length: 5 }).fill('none') })
  })
})

describe('pageControl 的窗口滑动', () => {
  async function windowed() {
    vi.spyOn(performance, 'now').mockReturnValue(1000)
    asTouch()
    const control = await mountControl({ totalPages: 50, page: 26 })
    const strip = control.slider().children[0] as HTMLElement
    return { ...control, strip }
  }

  it('当前页落进缩小的槽位时，窗口 50ms 后按 UIKit 的临界阻尼弹簧挪一格，条和每个点共用开始时刻', async () => {
    const { page, strip, slider } = await windowed()
    page.value = 27
    await nextTick()
    await nextTick()
    const stripCalls = recordedOf(strip).animate.mock.calls as unknown[][]
    expect(stripCalls).toHaveLength(1)
    expect(stripCalls[0]).toEqual([{ x: -19 * PITCH }, { spring: PC.windowSlide }, { at: 1000 + PC.windowSlideDelayMs }])
    expect(PC.windowSlide).toEqual({ response: 0.15, dampingRatio: 1 })
    for (const dot of dots(slider())) {
      const calls = recordedOf(dot).animate.mock.calls as unknown[][]
      expect(calls.at(-1)?.[2]).toEqual({ at: 1000 + PC.windowSlideDelayMs })
    }
  })

  it('滑动自己的关键帧一路逼近下一格，不回头也不越过（临界阻尼不过冲）', async () => {
    const { page, strip } = await windowed()
    played = []
    page.value = 27
    await nextTick()
    await nextTick()
    const slide = played.find(entry => entry.element === strip && entry.keyframes.some(frame => frame.translate != null))
    expect(slide).toBeDefined()
    const xs = slide!.keyframes.map(frame => Number.parseFloat(String(frame.translate)))
    expect(xs.length).toBeGreaterThan(2)
    for (let i = 1; i < xs.length; i++)
      expect(xs[i]!).toBeLessThanOrEqual(xs[i - 1]! + 0.01)
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(-19 * PITCH - 0.01)
  })

  it('减少动态效果时条交叉淡化，点在淡化的中点（50ms + 100ms）换成新尺寸', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    vi.spyOn(performance, 'now').mockReturnValue(1000)
    asTouch({ reduced: true })
    const { page, slider } = await mountControl({ totalPages: 50, page: 26 })
    page.value = 27
    await nextTick()
    await nextTick()
    // 点 19 原来在窗口第二格（边缘尺寸 7.33），新窗口从 19 开始、左侧还有页，它变成最小的 4.31。
    const dot = slider().querySelector<HTMLElement>('[data-page="19"]')!
    const engine = recordedOf(dot)
    expect(engine.animate).not.toHaveBeenCalled()
    const resized = (): boolean => (engine.set.mock.calls as unknown[][]).some(call => Math.abs((call[0] as { scale?: number }).scale! - 4.31 / 10) < 1e-6)
    vi.advanceTimersByTime(PC.windowSlideDelayMs + 99)
    expect(resized()).toBe(false)
    vi.advanceTimersByTime(1)
    expect(resized()).toBe(true)
  })
})

describe('pageControl 越过边缘的连翻', () => {
  it('手指拖过内容末尾 20px，按 UIKit 的速率隔 1 / (0.173 × 20) 秒翻下一页', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'performance'] })
    asTouch()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return this.getAttribute('role') === 'slider'
        ? { left: 80, top: 0, width: 161.3, height: 25.67, right: 241.3, bottom: 25.67, x: 80, y: 0, toJSON: () => ({}) }
        : { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) }
    })
    const { slider, onChange } = await mountControl({ totalPages: 50, page: 26 })
    const end = 241.3 - PC.horizontalPadding
    drag(slider(), { x: 200 }, { x: end + 20 }, { kind: 'touch', lift: false })
    expect(onChange).not.toHaveBeenCalled()
    const interval = jogInterval(20, 1) * 1000
    vi.advanceTimersByTime(interval - 1)
    expect(onChange).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onChange).toHaveBeenLastCalledWith(27)
    await nextTick()
    vi.advanceTimersByTime(interval)
    expect(onChange).toHaveBeenLastCalledWith(28)
    pointer('pointerup', slider(), end + 20, { kind: 'touch' })
    vi.advanceTimersByTime(interval * 3)
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
