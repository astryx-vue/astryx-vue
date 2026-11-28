/**
 * @file useRefreshControl.motion.test.ts
 * @input vitest（happy-dom）、useRefreshControl、记下触摸层动效引擎的 useMotionEngine 替身
 * @output 证明回落把手指的速度交给弹簧、指示器沿着内容的回落曲线淡出、减少动态效果下指示器
 *   等回落结束才复位、接住的淡出留住显示的样子，以及结束按主题时长播 UIKit 的 easeInEaseOut
 * @position 单元测试；真机上的手感见文档页
 */

import type { MotionCurve, MotionEngine } from '@astryx-vue/core/internal/touch'
import type * as MotionEngineModule from '../internal/useMotionEngine'
import { PanGestureRecognizer } from '@astryx-vue/core/internal/touch'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { revealProgress } from './refreshPull'
import { advanceClock, content, followEventClock, mountRefresh, pull, reveal, settleFrames, touch, translateY, unmountAll, useTouchScreen } from './testing/refreshTestKit'

// 记下触摸层建的引擎，内容的在前。
const animators = vi.hoisted(() => ({ list: [] as unknown[] }))
vi.mock('../internal/useMotionEngine', async (importOriginal) => {
  const real = await importOriginal<typeof MotionEngineModule>()
  return {
    ...real,
    useMotionEngine: (...args: Parameters<typeof real.useMotionEngine>): ReturnType<typeof real.useMotionEngine> => {
      const result = real.useMotionEngine(...args)
      animators.list.push(result.animator)
      return result
    },
  }
})

function engines(): [MotionEngine, MotionEngine] {
  const [contentAnimator, indicatorAnimator] = animators.list.slice(-2) as MotionEngine[]
  return [contentAnimator!, indicatorAnimator!]
}

/** 内容回到顶部的回落换成 `settleCurve` 给的曲线和测试控制的结束；记下指示器透明度上播的曲线。 */
function watchFade(settleCurve: () => MotionCurve | null): { fades: () => MotionCurve[], finishSettle: (done: boolean) => void } {
  const [contentAnimator, indicatorAnimator] = engines()
  let finishSettle: (done: boolean) => void = () => {}
  const animate = contentAnimator.animate.bind(contentAnimator)
  vi.spyOn(contentAnimator, 'animate').mockImplementation((to, transition, options) => {
    const handle = animate(to, transition, options)
    if (to.y !== 0)
      return handle
    const curve = settleCurve()
    const finished = new Promise<boolean>((resolve) => {
      finishSettle = resolve
    })
    return { ...handle, finished, curve: () => curve }
  })
  const play = vi.spyOn(indicatorAnimator, 'play')
  return {
    fades: () => play.mock.calls
      .map(([curves]) => curves.opacity)
      .filter((curve): curve is MotionCurve => curve != null),
    finishSettle: done => finishSettle(done),
  }
}

beforeEach(() => {
  animators.list.length = 0
  useTouchScreen(true)
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: undefined, configurable: true })
})

afterEach(() => {
  unmountAll()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  Reflect.deleteProperty(HTMLElement.prototype, 'animate')
  document.body.innerHTML = ''
})

describe('useRefreshControl 的动效', () => {
  it('没到触发点松手时，指示器沿着内容的回落曲线淡出', async () => {
    await mountRefresh({ onRefresh: () => {} })
    // 一条弹簧做不出的曲线：淡出跟的是回落自己的曲线。
    let from = 0
    const settle: MotionCurve = {
      duration: 0.8,
      at: t => from * Math.max(0, 1 - t / 0.8),
      velocity: t => (t < 0.8 ? -from / 0.8 : 0),
    }
    const fade = watchFade(() => settle)
    pull(content(), [20, 20, 20, 10], false)
    from = translateY(content())
    expect(from).toBeGreaterThan(0)
    touch('touchend', content(), 170, true)
    const fades = fade.fades()
    expect(fades).toHaveLength(1)
    expect(fades[0]!.duration).toBe(0.8)
    const start = revealProgress(from, 334)
    for (const time of [0, 0.2, 0.4, 0.6, 0.8])
      expect(fades[0]!.at(time)).toBeCloseTo(revealProgress(settle.at(time), 334) / start, 6)
  })

  it('减少动态效果下回落没有曲线：指示器留着，回落结束后才复位', async () => {
    await mountRefresh({ onRefresh: () => {} })
    const fade = watchFade(() => null)
    pull(content(), [20, 20, 20, 10])
    expect(Number(reveal())).toBeGreaterThan(0)
    expect(fade.fades()).toEqual([])
    fade.finishSettle(true)
    await settleFrames()
    expect(reveal()).toBe('0')
  })

  it('手指接住淡出时留住指示器显示的样子，淡出不再在手指下复位它', async () => {
    await mountRefresh({ onRefresh: () => {} })
    const [, indicatorAnimator] = engines()
    const play = vi.spyOn(indicatorAnimator, 'play')
    pull(content(), [20, 20, 20, 10])
    const fadeAt = play.mock.calls.findIndex(([curves]) => 'opacity' in curves)
    expect(fadeAt).toBeGreaterThanOrEqual(0)
    const fade = play.mock.results[fadeAt]!.value as ReturnType<MotionEngine['play']>
    const shown = Number(reveal())
    expect(shown).toBeGreaterThan(0)
    // 手指在淡出一半时接住回落。
    const presentedGet = indicatorAnimator.get.bind(indicatorAnimator)
    const presented = vi.spyOn(indicatorAnimator, 'get').mockImplementation(property => (property === 'opacity' ? 0.5 : presentedGet(property)))
    const set = vi.spyOn(indicatorAnimator, 'set')
    touch('touchstart', content(), 100)
    presented.mockRestore()
    expect(Number(reveal())).toBeCloseTo(shown * 0.5, 6)
    expect(set).toHaveBeenCalledWith({ opacity: 1 })
    touch('touchmove', content(), 110)
    touch('touchmove', content(), 120)
    expect(await fade.finished).toBe(false)
    expect(Number(reveal())).toBeGreaterThan(0)
  })

  it('每次松手的回落从手指抬起时内容的速度开始：一比一段是手指的速度，橡皮筋里更慢，落到内边距也一样', async () => {
    followEventClock()
    const scrollVelocity = vi.spyOn(PanGestureRecognizer.prototype, 'scrollVelocity')
    const release = async (steps: number[], onRefresh: () => unknown = () => {}): Promise<{ to?: number, content?: number, indicator?: number, scroll?: number, isBusy: boolean }> => {
      await mountRefresh({ onRefresh })
      const [contentAnimator, indicatorAnimator] = engines()
      const contentAnimate = vi.spyOn(contentAnimator, 'animate')
      const indicatorAnimate = vi.spyOn(indicatorAnimator, 'animate')
      scrollVelocity.mockClear()
      pull(content(), steps)
      const [to, transition] = contentAnimate.mock.calls.at(-1) ?? []
      const result = {
        to: to?.y,
        content: transition?.velocity?.y,
        indicator: indicatorAnimate.mock.calls.at(-1)?.[1].velocity?.y,
        scroll: (scrollVelocity.mock.results.at(-1)?.value as { y: number } | undefined)?.y,
        isBusy: content().getAttribute('aria-busy') === 'true',
      }
      unmountAll()
      return result
    }
    // 每 16ms 走 10px 就是 625px/s。
    const tracked = await release([10, 10, 10, 10, 10])
    expect(tracked.to).toBe(0)
    expect(tracked.content).toBeCloseTo(625, 6)
    expect(tracked.indicator).toBeCloseTo(-625, 6)
    // 过了一比一段，内容比手指慢。
    const banded = await release([10, 10, 10, 10, 10, 10, 10, 10])
    expect(banded.content).toBeGreaterThan(0)
    expect(banded.content).toBeLessThan(625)
    expect(banded.indicator).toBeCloseTo(-(banded.content ?? 0), 6)
    // 越来越快的一甩交出滚动视图的松手速度：拖动最后两个值的混合，低于最后一帧的速度。
    const flick = await release([5, 5, 5, 10, 15])
    expect(flick.scroll).toBeGreaterThan(0)
    expect(flick.content).toBeCloseTo(flick.scroll ?? Number.NaN, 6)
    expect(flick.content).toBeLessThan(15 / 0.016)
    // 抬起前停住的手指不交出速度。
    expect((await release([10, 10, 10, 10, 0, 0, 0, 0, 0, 0])).content).toBe(0)
    // 触发了的下拉把速度带到刷新时的内边距上。
    const inset = await release([20, 20, 20, 20, 20, 20, 20, 20], () => new Promise<void>(() => {}))
    expect(inset.to).toBe(60)
    expect(inset.content).toBeGreaterThan(600)
  })

  it('结束按主题的时长变量播 UIKit 的 easeInEaseOut，内容和指示器一起滑', async () => {
    followEventClock()
    let finish: () => void = () => {}
    await mountRefresh({ onRefresh: () => new Promise<void>((done) => {
      finish = done
    }) })
    content().style.setProperty('--astryx-duration-medium', '450ms')
    const [contentAnimator, indicatorAnimator] = engines()
    pull(content(), [30, 30, 30, 30])
    await settleFrames()
    expect(translateY(content())).toBeCloseTo(60, 5)
    // 落到内边距的回落早已落完。
    advanceClock(2000)
    const contentPlay = vi.spyOn(contentAnimator, 'play')
    const indicatorPlay = vi.spyOn(indicatorAnimator, 'play')
    finish()
    await settleFrames()
    const slide = contentPlay.mock.calls.map(([curves]) => curves.y).find(curve => curve != null)
    expect(slide).toBeDefined()
    expect(slide!.duration).toBeCloseTo(0.45, 6)
    expect(slide!.at(0)).toBeCloseTo(60, 6)
    expect(slide!.at(0.45)).toBeCloseTo(0, 6)
    // easeInEaseOut 关于中点对称：走到一半时间正好走一半路。
    expect(slide!.at(0.225)).toBeCloseTo(30, 3)
    // 慢进：开头 10% 的时间走不到 10% 的路。
    expect(slide!.at(0.045)).toBeGreaterThan(54)
    const band = indicatorPlay.mock.calls.map(([curves]) => curves.y).find(curve => curve != null)
    expect(band!.at(0)).toBeCloseTo(0, 6)
    expect(band!.at(0.45)).toBeCloseTo(60, 6)
    expect(translateY(content())).toBe(0)
  })

  it('没有主题时长变量时结束不滑，直接回到顶部', async () => {
    let finish: () => void = () => {}
    await mountRefresh({ onRefresh: () => new Promise<void>((done) => {
      finish = done
    }) })
    const [contentAnimator] = engines()
    pull(content(), [30, 30, 30, 30])
    await settleFrames()
    const contentPlay = vi.spyOn(contentAnimator, 'play')
    finish()
    await settleFrames()
    expect(contentPlay.mock.calls.filter(([curves]) => curves.y != null)).toEqual([])
    expect(translateY(content())).toBe(0)
  })
})
