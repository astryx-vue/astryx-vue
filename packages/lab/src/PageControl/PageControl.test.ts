/**
 * @file PageControl.test.ts
 * @input vitest（happy-dom）、@vue/test-utils、PageControl 和它的测试工具
 * @output 证明语义、键盘、实测几何和透明度、宽度上限、渲染的窗口、点按和拖动、热区、
 *   服务端渲染和 hidesForSinglePage
 * @position 单元测试；动效（淡出、按住的样子、窗口滑动、连翻）在 PageControl.motion.test.ts
 */

import { provideAstryxLocale } from '@astryx-vue/core'
import { flushPromises, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { asMouse, asTouch, click, dots, drag, layOutRow, media, mountControl, nextPressTime, PageControl, pinnedPressTime, pointer, stubMedia, unmountAll } from './testing/pageControlTestKit'

beforeAll(() => {
  // 动效引擎在没有 Web Animations 时直接写终值。
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: undefined, configurable: true })
})

beforeEach(() => {
  media.coarse = false
  media.reduced = false
  stubMedia()
})

afterEach(() => {
  unmountAll()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

afterAll(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

/** WCAG 对比度：`fg` 以 `alpha` 叠在 `bg` 上，和 `bg` 比。 */
function contrastOver(fg: number[], bg: number[], alpha: number): number {
  const luminance = (rgb: number[]): number => {
    const [r = 0, g = 0, b = 0] = rgb.map((value) => {
      const v = value / 255
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const mixed = fg.map((c, i) => c * alpha + bg[i]! * (1 - alpha))
  return (luminance(bg) + 0.05) / (luminance(mixed) + 0.05)
}

describe('pageControl', () => {
  it('是一个叫「Page indicators」的滑块，读作「Page 3 of 5」', async () => {
    const { slider } = await mountControl()
    const el = slider()
    expect(el.getAttribute('aria-label')).toBe('Page indicators')
    expect(el.getAttribute('aria-valuemin')).toBe('1')
    expect(el.getAttribute('aria-valuemax')).toBe('5')
    expect(el.getAttribute('aria-valuenow')).toBe('3')
    expect(el.getAttribute('aria-valuetext')).toBe('Page 3 of 5')
    expect(el.getAttribute('aria-orientation')).toBe('horizontal')
    expect(el.getAttribute('tabindex')).toBe('0')
  })

  it('名称和读法跟着语言走，也能自己给名字', async () => {
    const Harness = defineComponent(() => {
      provideAstryxLocale('zh-CN')
      return () => h(PageControl, { totalPages: 5, page: 3 })
    })
    // 卸载而不是清空 body：文档的手势宿主活得比用例久，留着脱离文档的注册会每帧重查。
    const zhWrapper = mount(Harness, { attachTo: document.body })
    const zh = document.querySelector('[role="slider"]')!
    expect(zh.getAttribute('aria-label')).toBe('页码指示')
    expect(zh.getAttribute('aria-valuetext')).toBe('第 3 页，共 5 页')
    zhWrapper.unmount()
    const { slider } = await mountControl({ attrs: { label: 'Onboarding' } })
    expect(slider().getAttribute('aria-label')).toBe('Onboarding')
  })

  it('方向键、Home 和 End 要页', async () => {
    const { slider, onChange } = await mountControl({ follows: false })
    const keys: Array<[string, number]> = [['ArrowRight', 4], ['ArrowLeft', 2], ['ArrowUp', 4], ['ArrowDown', 2], ['Home', 1], ['End', 5]]
    for (const [key, page] of keys) {
      slider().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      expect(onChange).toHaveBeenLastCalledWith(page)
      // 每次之后 app 都保留原值；下一个任务里请求作废。
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  })

  it('从右往左时左右方向键对调', async () => {
    const { slider, onChange } = await mountControl({ follows: false, attrs: { style: { direction: 'rtl' } } })
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(onChange).toHaveBeenLastCalledWith(2)
    await new Promise(resolve => setTimeout(resolve, 0))
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
    expect(onChange).toHaveBeenLastCalledWith(4)
  })

  it('第一页之前、最后一页之后什么都不要', async () => {
    const { slider, onChange } = await mountControl({ page: 5 })
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('画 UIPageControl 的几何：9.67px 的点，当前点不透明，其余 48%（UIKit 的 45% 提到 3:1）', async () => {
    const { slider } = await mountControl()
    const el = slider()
    expect(el.style.height).toBe('25.67px')
    expect(el.style.width).toBe('108.35px')
    const indicators = dots(el)
    expect(indicators).toHaveLength(5)
    // 10px 的盒子缩到 9.67px：落在哪都是圆的。
    expect(indicators[0]!.style.width).toBe('10px')
    expect(Number.parseFloat(indicators[0]!.style.scale) * 10).toBeCloseTo(9.67, 3)
    expect(indicators.map(dot => dot.style.opacity)).toEqual(['0.48', '0.48', '1', '0.48', '0.48'])
  })

  it('宽度不超过 161.3px；手指下页数超过十个时渲染当前页周围的窗口', async () => {
    asTouch()
    const { slider } = await mountControl({ totalPages: 50, page: 26 })
    expect(slider().style.width).toBe('161.3px')
    // 从第一页翻到第 26 页（点 25）时，它在窗口最后一个原尺寸槽位：窗口从点 18 开始，
    // 两侧各多渲染三个槽位给滑动用。
    const pages = dots(slider()).map(dot => Number(dot.dataset.page))
    expect(pages[0]).toBe(15)
    expect(pages.at(-1)).toBe(30)
  })

  it('鼠标下长的控件是被裁掉的整排，没有淡出也没有缩小的槽位', async () => {
    asMouse()
    const { slider } = await mountControl({ totalPages: 50, page: 26 })
    expect(slider().style.width).toBe('161.3px')
    const all = dots(slider())
    expect(all).toHaveLength(50)
    expect(all.every(dot => dot.style.transition === 'none')).toBe(true)
  })

  it('鼠标点在当前点后面要下一页，点在前面要上一页', async () => {
    asMouse()
    const { slider, onChange } = await mountControl()
    click(slider(), 50)
    expect(onChange).toHaveBeenLastCalledWith(4)
    await nextTick()
    // 现在在第 4 页：happy-dom 的盒子都在 0，负的横坐标在它前面。
    click(slider(), -50)
    expect(onChange).toHaveBeenLastCalledWith(3)
  })

  it('鼠标按下松开经点按识别器翻一页，浏览器随后的 click 不再翻', async () => {
    asMouse()
    const { slider, onChange } = await mountControl({ follows: false })
    pointer('pointerdown', slider(), 50)
    pointer('pointerup', slider(), 50)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(4)
    slider().dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 50 }))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it.each(['mouse', 'pen'] as const)('%s 拖动换页：页码跟到指针下面的点', async (kind) => {
    asMouse()
    layOutRow()
    const { slider, onChange } = await mountControl({ follows: false })
    // 在第 3 页的点（中心 137）按下，拖到第 5 页的（169）。
    drag(slider(), { x: 137 }, { x: 169 }, { kind })
    expect(onChange).toHaveBeenCalledWith(4)
    expect(onChange).toHaveBeenLastCalledWith(5)
  })

  it('鼠标在被裁的长排上拖动时这排不动，松手才挪', async () => {
    asMouse()
    layOutRow()
    const { slider } = await mountControl({ totalPages: 50, page: 6 })
    const strip = slider().children[0] as HTMLElement
    const rest = strip.style.translate
    // 在第 6 页的点（中心 185）按下，拖过三个点；每个事件之后都等它渲染完。
    pointer('pointerdown', slider(), 185, { time: nextPressTime() })
    for (let i = 1; i <= 12; i++) {
      pointer('pointermove', slider(), 185 + 4 * i)
      await nextTick()
      await nextTick()
      expect(strip.style.translate).toBe(rest)
    }
    expect(slider().getAttribute('aria-valuenow')).toBe('9')
    pointer('pointerup', slider(), 233)
    await nextTick()
    await nextTick()
    expect(strip.style.translate).not.toBe(rest)
  })

  it('鼠标按住超过 155ms 没有垫片也不变暗：按住的样子是触屏呈现', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    asMouse()
    const { slider } = await mountControl()
    const dot = slider().querySelector<HTMLElement>('[data-page="0"]')!
    const rest = dot.style.opacity
    pointer('pointerdown', slider(), 50, { time: pinnedPressTime() })
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(slider().hasAttribute('data-interacting')).toBe(false)
    expect(dot.style.opacity).toBe(rest)
    pointer('pointerup', slider(), 50)
  })

  it('手指在点上竖着滑，什么页都不要，每次移动都留给页面滚动', async () => {
    asTouch()
    const { slider, onChange } = await mountControl()
    const cancelled = drag(slider(), { x: 50, y: 10 }, { x: 52, y: -290 }, { kind: 'touch', steps: 30 })
    expect(cancelled).toBe(false)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('手指点按翻一页，浏览器随后的 click 不再翻', async () => {
    asTouch()
    const { slider, onChange } = await mountControl()
    click(slider(), 50, 'touch')
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('先没有页、后来才有页时点按照样能用', async () => {
    const { slider, totalPages, onChange } = await mountControl({ totalPages: 0 })
    expect(document.querySelector('[role="slider"]')).toBeNull()
    totalPages.value = 5
    await nextTick()
    await nextTick()
    click(slider(), 50)
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('app 没接受的一页可以再要一次', async () => {
    const { slider, onChange } = await mountControl({ follows: false })
    click(slider(), 50)
    await new Promise(resolve => setTimeout(resolve, 0))
    click(slider(), 50)
    expect(onChange).toHaveBeenCalledTimes(2)
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(onChange).toHaveBeenCalledTimes(2)
    await new Promise(resolve => setTimeout(resolve, 0))
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('调用方的 onKeydown 先跑，preventDefault 就不翻页', async () => {
    const onKeydown = vi.fn((event: KeyboardEvent) => {
      if (event.key === 'End')
        event.preventDefault()
    })
    const { slider, onChange } = await mountControl({ attrs: { onKeydown } })
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }))
    expect(onKeydown).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenLastCalledWith(4)
    slider().dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }))
    expect(onKeydown).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('其余的点在 core 默认页面背景上达到 3:1（WCAG 1.4.11）', async () => {
    const { slider } = await mountControl()
    const dot = slider().querySelector<HTMLElement>('[data-page="0"]')!
    // core 的浅色默认值：主文字 #0A1317，页面背景 #F1F4F7。
    expect(contrastOver([0x0A, 0x13, 0x17], [0xF1, 0xF4, 0xF7], Number(dot.style.opacity))).toBeGreaterThanOrEqual(3)
  })

  it('服务端渲染的长控件已经带上静止的偏移和尺寸', async () => {
    const html = await renderToString(createSSRApp({ render: () => h(PageControl, { totalPages: 50, page: 27 }) }))
    const rest = /--_page-control-rest:\s*([\d.]+)px/.exec(html)
    expect(rest).not.toBeNull()
    expect(Number(rest?.[1])).toBeGreaterThan(0)
    expect(html).toMatch(/--_page-control-scale:\s*0\.967/)
  })

  it('hidesForSinglePage 时一页什么都不渲染', async () => {
    await mountControl({ totalPages: 1, page: 1, attrs: { hidesForSinglePage: true } })
    expect(document.querySelector('[role="slider"]')).toBeNull()
  })
})

describe('pageControl 的触屏热区', () => {
  let frames: FrameRequestCallback[] = []

  beforeEach(() => {
    frames = []
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => frames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', () => undefined)
    vi.stubGlobal('IntersectionObserver', undefined)
    vi.stubGlobal('ResizeObserver', undefined)
    vi.stubGlobal('MutationObserver', undefined)
  })

  it('粗指针下，看不见的热区把 25.67px 高的控件往 44px 撑', async () => {
    asTouch()
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return this.getAttribute('role') === 'slider'
        ? { left: 100, top: 100, width: 108.33, height: 25.67, right: 208.33, bottom: 125.67, x: 100, y: 100, toJSON: () => ({}) }
        : { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) }
    })
    const { slider } = await mountControl()
    await flushPromises()
    while (frames.length > 0)
      frames.splice(0).forEach(frame => frame(0))
    await nextTick()
    const inset = (side: string): number => Number.parseFloat(slider().style.getPropertyValue(`--astryx-hit-inset-${side}`))
    expect(slider().classList.contains('astryx-touch-hit-area-band')).toBe(true)
    expect(inset('top')).toBeCloseTo((44 - 25.67) / 2, 1)
    expect(inset('bottom')).toBeCloseTo((44 - 25.67) / 2, 1)
    expect(inset('left')).toBe(0)
    expect(inset('right')).toBe(0)
  })
})
