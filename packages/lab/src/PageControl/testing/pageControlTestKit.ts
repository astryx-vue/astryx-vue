/**
 * @file pageControlTestKit.ts
 * @input vitest、@vue/test-utils、PageControl
 * @output PageControl 测试共用的指针与减少动态效果开关、挂载和指针事件
 * @position PageControl.test.ts 和 PageControl.motion.test.ts 的测试工具，不进发布产物
 */

import type { VueWrapper } from '@vue/test-utils'
import type { Mock, MockInstance } from 'vitest'
import type { Component, Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import PageControlComponent from '../PageControl.vue'

export const PageControl = PageControlComponent as unknown as Component

/**
 * 当前用例的指针和减少动态效果设置，每个 stub 返回的媒体查询都实时读它。core 的手势宿主
 * 只在建立时要一次 `(pointer: coarse)` 的查询并一直留着，冻结答案的查询会把第一个用例的
 * 指针带进后面所有用例。
 */
export const media = { coarse: false, reduced: false }

export function stubMedia(): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return (media.coarse && query.includes('pointer: coarse'))
        || (!media.coarse && query.includes('pointer: fine'))
        || (media.reduced && query.includes('prefers-reduced-motion: reduce'))
    },
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

/** 手指：粗的主指针；`reduced` 打开减少动态效果。 */
export function asTouch({ reduced = false }: { reduced?: boolean } = {}): void {
  media.coarse = true
  media.reduced = reduced
}

/** 鼠标：细的主指针。 */
export function asMouse(): void {
  media.coarse = false
  media.reduced = false
}

const mounted = new Set<VueWrapper>()

export function unmountAll(): void {
  for (const wrapper of mounted)
    wrapper.unmount()
  mounted.clear()
}

export interface ControlOptions {
  totalPages?: number
  page?: number
  /** app 跟着 `update:page` 改自己的页（默认）；false 时保留原值。 */
  follows?: boolean
  attrs?: Record<string, unknown>
}

/** 挂上一个 PageControl，等它挂好（粗指针检测在挂载时生效）。 */
export interface MountedControl {
  wrapper: VueWrapper
  page: Ref<number>
  totalPages: Ref<number>
  onChange: Mock
  slider: () => HTMLElement
}

export async function mountControl(options: ControlOptions = {}): Promise<MountedControl> {
  const page = ref(options.page ?? 3)
  const totalPages = ref(options.totalPages ?? 5)
  const onChange = vi.fn()
  const Harness = defineComponent(() => () => h(PageControl, {
    'totalPages': totalPages.value,
    'page': page.value,
    'onUpdate:page': (next: number) => {
      if (options.follows !== false)
        page.value = next
    },
    onChange,
    ...options.attrs,
  }))
  const wrapper = mount(Harness, { attachTo: document.body })
  mounted.add(wrapper)
  await nextTick()
  await nextTick()
  return { wrapper, page, totalPages, onChange, slider: () => document.querySelector<HTMLElement>('[role="slider"]')! }
}

export function dots(slider: HTMLElement): HTMLElement[] {
  return [...slider.querySelectorAll<HTMLElement>('[data-page]')]
}

/** 事件时间一直往前走：文档的手势宿主活得比每个用例都久。 */
let clock = 1000
export function nextPressTime(): number {
  clock += 10_000
  return clock
}

/**
 * 一次要等计时器的按压的开始时刻，并把 `performance.now` 钉在这一刻。手势场按事件时间加时长
 * 排计时器、按 `performance.now` 算还要等多久，两边对上，假计时器推进的毫秒才是按住的时长。
 */
export function pinnedPressTime(): number {
  const time = nextPressTime()
  vi.spyOn(performance, 'now').mockReturnValue(time)
  return time
}

/** 一个指针事件（手指、鼠标或笔），带上手势宿主读的字段。 */
export function pointer(
  type: 'pointerdown' | 'pointermove' | 'pointerup',
  target: Element,
  x: number,
  { kind = 'mouse', y = 10, time }: { kind?: 'mouse' | 'pen' | 'touch', y?: number, time?: number } = {},
): Event {
  const event = new Event(type, { bubbles: true, cancelable: true, composed: true })
  Object.defineProperties(event, {
    pointerId: { value: kind === 'touch' ? 2 : 1 },
    pointerType: { value: kind },
    isPrimary: { value: true },
    clientX: { value: x },
    clientY: { value: y },
    button: { value: type === 'pointermove' ? -1 : 0 },
    buttons: { value: type === 'pointerup' ? 0 : 1 },
    pressure: { value: type === 'pointerup' ? 0 : 0.5 },
    width: { value: 1 },
    height: { value: 1 },
    timeStamp: { value: time ?? (clock += 16) },
  })
  target.dispatchEvent(event)
  return event
}

/** 按下再松开：手势宿主收到按压，浏览器随后补一个 click。 */
export function click(target: Element, x: number, kind: 'mouse' | 'pen' | 'touch' = 'mouse'): void {
  pointer('pointerdown', target, x, { kind, time: nextPressTime() })
  pointer('pointerup', target, x, { kind })
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: x, clientY: 10 }))
}

/** 从 `from` 拖到 `to`，分 `steps` 步，每步 16ms。 */
export function drag(
  target: Element,
  from: { x: number, y?: number },
  to: { x: number, y?: number },
  { kind = 'mouse', steps = 8, lift = true }: { kind?: 'mouse' | 'pen' | 'touch', steps?: number, lift?: boolean } = {},
): boolean {
  let cancelled = false
  const y0 = from.y ?? 10
  const y1 = to.y ?? y0
  pointer('pointerdown', target, from.x, { kind, y: y0, time: nextPressTime() })
  for (let i = 1; i <= steps; i++) {
    const move = pointer('pointermove', target, from.x + ((to.x - from.x) * i) / steps, { kind, y: y0 + ((y1 - y0) * i) / steps })
    cancelled ||= move.defaultPrevented
  }
  if (lift)
    pointer('pointerup', target, to.x, { kind, y: y1 })
  return cancelled
}

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }
}

/** 给 happy-dom 排版：第 i 页的点 10px 宽、在 100 + 16·i，控件从 80 到 280。 */
export function layOutRow(): MockInstance {
  return vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const page = this.getAttribute('data-page')
    if (page != null)
      return rect(100 + 16 * Number(page), 0, 10, 10)
    if (this.getAttribute('role') === 'slider')
      return rect(80, 0, 200, 30)
    return rect(0, 0, 0, 0)
  })
}
