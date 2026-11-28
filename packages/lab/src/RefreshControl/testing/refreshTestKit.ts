/**
 * @file refreshTestKit.ts
 * @input vitest、@vue/test-utils、useRefreshControl
 * @output 下拉刷新测试共用的触屏开关、最小的滚动容器、触摸和滚轮事件、读位移的工具
 * @position useRefreshControl 测试的工具，不进发布产物
 */

import type { VueWrapper } from '@vue/test-utils'
import type { Ref } from 'vue'
import type { UseRefreshControlResult } from '../useRefreshControl'
import { flushPromises, mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useRefreshControl } from '../useRefreshControl'

const COARSE = /\(\s*pointer\s*:\s*coarse\s*\)/

/**
 * 主指针是不是手指；`reduced` 打开减少动态效果。窗口一直带 `ontouchstart`：happy-dom 没有它，
 * 手势宿主就不读触摸事件。
 */
export function useTouchScreen(isTouch: boolean, { reduced = false }: { reduced?: boolean } = {}): void {
  vi.stubGlobal('ontouchstart', null)
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: (isTouch && COARSE.test(query)) || (reduced && query.includes('prefers-reduced-motion: reduce')),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }))
}

/** 给元素一个高度和内容高度：happy-dom 不排版。 */
export function sized(element: HTMLElement, { client, scroll }: { client: number, scroll: number }): void {
  Object.defineProperty(element, 'clientHeight', { value: client, configurable: true })
  Object.defineProperty(element, 'scrollHeight', { value: scroll, configurable: true })
}

/** 量 UIKit 帧时滚动视图的高度（334）和溢出的内容：触发距离是 UIKit 的下限 73。 */
function measured(element: unknown): void {
  if (element instanceof HTMLElement)
    sized(element, { client: 334, scroll: 1000 })
}

export interface RefreshOptions {
  onRefresh?: () => unknown
  isRefreshing?: Ref<boolean | undefined>
  isDisabled?: Ref<boolean>
  announce?: string
  /** 不包滚动容器，由测试自己给。 */
  isBare?: boolean
  /** 挂到这个元素里（默认 body）。 */
  attachTo?: HTMLElement
}

const mounted = new Set<VueWrapper>()

export function unmountAll(): void {
  for (const wrapper of mounted)
    wrapper.unmount()
  mounted.clear()
}

/** 挂上 hook 驱动的结构：app 的滚动容器、被拉的内容和一个指示器。 */
export async function mountRefresh(options: RefreshOptions = {}): Promise<{ wrapper: VueWrapper, control: UseRefreshControlResult }> {
  let control!: UseRefreshControlResult
  const Harness = defineComponent(() => {
    control = useRefreshControl({
      onRefresh: options.onRefresh,
      isRefreshing: () => options.isRefreshing?.value,
      isDisabled: () => options.isDisabled?.value,
      announce: options.announce ?? 'Refreshing',
    })
    return () => {
      const pulled = h('div', { 'data-testid': 'refresh', 'ref': control.contentRef, 'aria-busy': control.isRefreshing.value || undefined }, [
        h('div', { 'ref': control.indicatorRef, 'aria-hidden': 'true' }),
        h('p', 'Inbox'),
      ])
      return options.isBare ? pulled : h('div', { 'data-testid': 'list', 'ref': measured, 'style': { overflowY: 'auto' } }, [pulled])
    }
  })
  const wrapper = mount(Harness, { attachTo: options.attachTo ?? document.body })
  mounted.add(wrapper)
  await nextTick()
  // 内容的 ref 先于外层容器的量尺寸挂上，拥有者在两帧后重新读。
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  return { wrapper, control }
}

export function content(): HTMLElement {
  return document.querySelector<HTMLElement>('[data-testid="refresh"]')!
}

export function indicator(): HTMLElement {
  return content().firstElementChild as HTMLElement
}

/** 触摸层露出指示器多少，0 到 1。 */
export function reveal(): string {
  return indicator().style.getPropertyValue('--astryx-refresh-reveal')
}

export function translateY(element: HTMLElement): number {
  const value = element.style.getPropertyValue('translate')
  if (value === '' || value === 'none')
    return 0
  const parts = value.trim().split(/\s+/)
  return Number.parseFloat(parts[1] ?? '0')
}

/** 事件时间一直往前走：文档的手势宿主活得比每个用例都久。 */
let clock = 100_000
/**
 * 让浏览器的时钟跟着事件走：事件从现在之后开始，`performance.now` 读事件时间，两次事件之间的
 * 真实时间不会被读成松手前的停顿。用 `vi.restoreAllMocks()` 放开。
 */
export function followEventClock(): void {
  clock = Math.max(clock, performance.now() + 100_000)
  vi.spyOn(performance, 'now').mockImplementation(() => clock)
}

/** 时钟往前走 `ms`，比如等一段回落落完。 */
export function advanceClock(ms: number): void {
  clock += ms
}

export function touch(type: string, target: EventTarget, y: number, isLift = false): void {
  clock += 16
  const event = new Event(type, { bubbles: true, cancelable: true })
  const entry = { identifier: 1, clientX: 100, clientY: y, target }
  Object.defineProperty(event, 'changedTouches', { value: [entry] })
  Object.defineProperty(event, 'touches', { value: isLift ? [] : [entry] })
  Object.defineProperty(event, 'timeStamp', { value: clock })
  target.dispatchEvent(event)
}

/** 一根手指从 y 100 往下，依次走过每一步。 */
export function pull(target: EventTarget, steps: number[], lift = true): void {
  clock += 1000
  let y = 100
  touch('touchstart', target, y)
  for (const step of steps) {
    y += step
    touch('touchmove', target, y)
  }
  if (lift)
    touch('touchend', target, y, true)
}

/** 鼠标或笔从 y 100 开始拖：`move` 按着键往下一步，`lift` 松开。 */
export function pointerDrag(target: EventTarget, pointerType: 'mouse' | 'pen'): { move: (step: number) => void, lift: () => void } {
  clock += 1000
  let y = 100
  const send = (type: string, buttons: number): void => {
    clock += 16
    const event = new Event(type, { bubbles: true, cancelable: true, composed: true })
    Object.defineProperties(event, {
      pointerId: { value: 7 },
      pointerType: { value: pointerType },
      isPrimary: { value: true },
      clientX: { value: 100 },
      clientY: { value: y },
      button: { value: type === 'pointermove' ? -1 : 0 },
      buttons: { value: buttons },
      pressure: { value: buttons === 0 ? 0 : 0.5 },
      width: { value: 1 },
      height: { value: 1 },
      timeStamp: { value: clock },
    })
    target.dispatchEvent(event)
  }
  send('pointerdown', 1)
  return {
    move(step) {
      y += step
      send('pointermove', 1)
    },
    lift() {
      send('pointerup', 0)
    },
  }
}

/** 每步 `dy` px 的滚轮。`trackpad` 加上 Chromium 和 WebKit 给触控板的旧字段 `wheelDeltaY`；没有它，手势宿主读成鼠标滚轮。 */
export function wheel(target: EventTarget, steps: number[], { trackpad }: { trackpad: boolean }): void {
  for (const dy of steps) {
    clock += 16
    const event = new WheelEvent('wheel', { bubbles: true, cancelable: true, composed: true, deltaY: dy, deltaMode: 0 })
    // happy-dom 的 WheelEvent 不带鼠标事件的坐标字段。
    Object.defineProperties(event, {
      timeStamp: { value: clock },
      clientX: { value: 100 },
      clientY: { value: 100 },
    })
    if (trackpad) {
      Object.defineProperty(event, 'wheelDeltaX', { value: 0 })
      Object.defineProperty(event, 'wheelDeltaY', { value: -3 * dy })
    }
    target.dispatchEvent(event)
  }
}

/** 等 Promise、Vue 的更新和几帧走完。 */
export async function settleFrames(ms = 60): Promise<void> {
  await flushPromises()
  await new Promise(resolve => setTimeout(resolve, ms))
  await flushPromises()
}
