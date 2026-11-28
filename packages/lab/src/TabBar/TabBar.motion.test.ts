import type { MotionEngine } from '@astryx-vue/core/internal/touch'
import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import TabBarComponent from './TabBar.vue'
import { TabBarItem } from './TabBarItem'
import { itemCenters } from './tabBarModel'
import { tabBar } from './uikitTabBar'

interface RecordedEngine {
  readonly engine: MotionEngine
  readonly set: ReturnType<typeof vi.spyOn>
  readonly animate: ReturnType<typeof vi.spyOn>
}

const engines = vi.hoisted(() => [] as unknown[])
vi.mock('@astryx-vue/core/internal/touch', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@astryx-vue/core/internal/touch')>()
  return {
    ...actual,
    createMotionEngine: ((...args: Parameters<typeof actual.createMotionEngine>) => {
      const engine = actual.createMotionEngine(...args)
      engines.push({ engine, set: vi.spyOn(engine, 'set'), animate: vi.spyOn(engine, 'animate') })
      return engine
    }) as typeof actual.createMotionEngine,
  }
})

const TabBar = TabBarComponent as unknown as Component
const css = readFileSync(resolve(__dirname, '../../styles/tab-bar.css'), 'utf8')

const WIDTH = 400
const HEIGHT = 62
const CENTERS = itemCenters(WIDTH, 4)

const mounted = new Set<VueWrapper>()

function stubMedia({ coarse, reduced }: { coarse: boolean, reduced: boolean }): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? reduced : query.includes('pointer: coarse') ? coarse : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }))
}

/** 胶囊 400px 宽，贴着视口左上角；happy-dom 不排版，尺寸手动给。 */
function layOut(capsule: HTMLElement): void {
  Object.defineProperty(capsule, 'offsetWidth', { value: WIDTH, configurable: true })
  Object.defineProperty(capsule, 'offsetLeft', { value: 0, configurable: true })
  capsule.getBoundingClientRect = () => ({ left: 0, top: 0, right: WIDTH, bottom: HEIGHT, width: WIDTH, height: HEIGHT, x: 0, y: 0, toJSON: () => ({}) })
  capsule.parentElement!.getBoundingClientRect = () => ({ left: 0, top: 0, right: WIDTH, bottom: HEIGHT, width: WIDTH, height: HEIGHT, x: 0, y: 0, toJSON: () => ({}) })
}

async function mountBar(initial = 'home', disabled?: string) {
  engines.length = 0
  const value = ref(initial)
  const onChange = vi.fn()
  const wrapper = mount(defineComponent(() => () => h(TabBar, {
    'modelValue': value.value,
    'onUpdate:modelValue': (next: string) => {
      value.value = next
    },
    onChange,
    'label': 'Sections',
  }, () => ['home', 'library', 'browse', 'profile'].map(tab =>
    h(TabBarItem, { value: tab, label: tab, disabled: tab === disabled })))), { attachTo: document.body })
  mounted.add(wrapper)
  await nextTick()
  const capsule = document.querySelector<HTMLElement>('[role="tablist"]')!
  layOut(capsule)
  const recorded = engines as RecordedEngine[]
  // 透镜按这个顺序建引擎：胶囊、本体、阴影、玻璃、副本，然后是副本里的每一项。
  const [capsuleEngine, body, shadow, glass, copy] = recorded
  return { value, onChange, capsule, engines: { capsule: capsuleEngine!, body: body!, shadow: shadow!, glass: glass!, copy: copy! } }
}

function pointer(type: string, clientX: number, init: PointerEventInit = {}): PointerEvent {
  return new PointerEvent(type, { pointerType: 'touch', pointerId: 1, button: 0, clientX, clientY: HEIGHT / 2, bubbles: true, ...init })
}

function press(capsule: HTMLElement, clientX: number): void {
  capsule.dispatchEvent(pointer('pointerdown', clientX))
}

function release(clientX: number): void {
  window.dispatchEvent(pointer('pointerup', clientX))
}

function tab(name: string): HTMLElement {
  return [...document.querySelectorAll<HTMLElement>('[role="tab"]')].find(element => element.textContent?.trim() === name)!
}

const springOf = (call: unknown[]): unknown => (call[1] as { spring?: unknown } | undefined)?.spring
function callsTo(recorded: RecordedEngine, key: string): unknown[][] {
  return (recorded.animate.mock.calls as unknown[][]).filter(call => key in (call[0] as object))
}

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'animate', { value: undefined, configurable: true })
})

afterEach(() => {
  for (const wrapper of mounted)
    wrapper.unmount()
  mounted.clear()
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

afterAll(() => {
  delete (HTMLElement.prototype as Partial<HTMLElement>).animate
})

describe('tabBar lens under a finger', () => {
  it('lifts the lens toward the finger on the UIKit springs, and settles it on release', async () => {
    stubMedia({ coarse: true, reduced: false })
    const { capsule, engines, onChange } = await mountBar()
    press(capsule, CENTERS[2]!)
    await nextTick()
    const travel = callsTo(engines.body, 'x')
    expect(travel[0]?.[0]).toEqual({ x: CENTERS[2]! - CENTERS[0]! })
    expect(springOf(travel[0]!)).toBe(tabBar.lensTravel)
    expect(springOf(callsTo(engines.body, 'scaleX')[0]!)).toBe(tabBar.lift)
    expect(callsTo(engines.shadow, 'opacity')[0]?.[0]).toEqual({ opacity: 1 })
    expect(callsTo(engines.glass, 'opacity')[0]?.[0]).toEqual({ opacity: 1 })
    const flex = callsTo(engines.capsule, 'scale')
    expect(flex[0]?.[0]).toEqual({ scale: tabBar.flexScale })
    expect(springOf(flex[0]!)).toBe(tabBar.flexPress)
    expect(document.querySelector('[data-tab-bar-copy]')).not.toBeNull()

    engines.body.animate.mockClear()
    engines.capsule.animate.mockClear()
    release(CENTERS[2]!)
    // 浏览器松手后补发的点击被吞掉，同一个标签不会选两次。
    tab('browse').click()
    await nextTick()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('browse')
    const settle = callsTo(engines.body, 'x')[0]!
    expect(springOf(settle)).toBe(tabBar.lensSettle)
    expect(settle[2]).toMatchObject({ touchRelease: true })
    const unflex = callsTo(engines.capsule, 'scale')[0]!
    expect(unflex[0]).toEqual({ scale: 1 })
    expect(springOf(unflex)).toBe(tabBar.flexRelease)
    await vi.waitFor(() => expect(document.querySelector('[data-tab-bar-copy]')).toBeNull(), { timeout: 3000 })
  })

  it('chases a dragging finger on the track spring', async () => {
    stubMedia({ coarse: true, reduced: false })
    const { capsule, engines } = await mountBar()
    press(capsule, CENTERS[0]!)
    engines.body.animate.mockClear()
    window.dispatchEvent(pointer('pointermove', CENTERS[1]!))
    expect(springOf(callsTo(engines.body, 'x')[0]!)).toBe(tabBar.lensTrack)
    release(CENTERS[1]!)
  })

  it('under Reduce Motion puts the lens under the finger at once, shows the lifted look at once, and draws the copy while held', async () => {
    stubMedia({ coarse: true, reduced: true })
    const { capsule, engines } = await mountBar()
    press(capsule, CENTERS[2]!)
    await nextTick()
    expect(engines.body.set).toHaveBeenCalledWith({ x: CENTERS[2]! - CENTERS[0]! })
    expect(callsTo(engines.body, 'x')).toHaveLength(0)
    expect(engines.shadow.set).toHaveBeenCalledWith({ opacity: 1 })
    expect(engines.glass.set).toHaveBeenCalledWith({ opacity: 1 })
    expect(callsTo(engines.shadow, 'opacity')).toHaveLength(0)
    // 不缩放：没有抬起的放大，胶囊也不弹。
    expect(callsTo(engines.body, 'scaleX')).toHaveLength(0)
    expect(engines.capsule.animate).not.toHaveBeenCalled()
    expect(document.querySelector('[data-tab-bar-copy]')).not.toBeNull()
    release(CENTERS[2]!)
    // 松手时抬起的样子淡出。
    expect(callsTo(engines.shadow, 'opacity').at(-1)?.[0]).toEqual({ opacity: 0 })
  })

  it('paints the held tab when nothing is selected, and clears it on release', async () => {
    stubMedia({ coarse: true, reduced: false })
    const { capsule, engines } = await mountBar('none')
    press(capsule, CENTERS[1]!)
    expect(tab('library').hasAttribute('data-tab-bar-pressed')).toBe(true)
    window.dispatchEvent(pointer('pointermove', CENTERS[3]!))
    expect(tab('library').hasAttribute('data-tab-bar-pressed')).toBe(false)
    expect(tab('profile').hasAttribute('data-tab-bar-pressed')).toBe(true)
    release(CENTERS[3]!)
    expect(tab('profile').hasAttribute('data-tab-bar-pressed')).toBe(false)
    expect(engines.body.animate).not.toHaveBeenCalled()
  })

  it('moves nothing for a finger on a disabled tab until it drags off', async () => {
    stubMedia({ coarse: true, reduced: false })
    const { capsule, engines, onChange } = await mountBar('home', 'browse')
    press(capsule, CENTERS[2]!)
    expect(engines.body.animate).not.toHaveBeenCalled()
    expect(document.querySelector('[data-tab-bar-copy]')).toBeNull()
    release(CENTERS[2]!)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('leaves a mouse press to the button click', async () => {
    stubMedia({ coarse: false, reduced: false })
    const { capsule, engines } = await mountBar()
    capsule.dispatchEvent(pointer('pointerdown', CENTERS[2]!, { pointerType: 'mouse' }))
    expect(engines.body.animate).not.toHaveBeenCalled()
    expect(document.querySelector('[data-tab-bar-copy]')).toBeNull()
  })

  it('slides the lens from rest on the travel spring when the app changes the selection', async () => {
    stubMedia({ coarse: true, reduced: false })
    const { value, engines } = await mountBar()
    value.value = 'profile'
    await nextTick()
    await nextTick()
    expect(engines.body.set).toHaveBeenCalledWith({ x: CENTERS[0]! - CENTERS[3]! })
    const slide = callsTo(engines.body, 'x').at(-1)!
    expect(slide[0]).toEqual({ x: 0 })
    expect(springOf(slide)).toBe(tabBar.lensTravel)
  })
})

describe('tabBar motion styles', () => {
  const rule = (selector: string): string => {
    const start = css.indexOf(`${selector} {`)
    return css.slice(start, css.indexOf('}', start))
  }

  it('fades the pressed paint on the theme’s exit duration and curve, capped under Reduce Motion', () => {
    expect(rule('.astryx-tab-bar__item-box::before')).toContain('transition-duration: var(--astryx-duration-exit)')
    expect(rule('.astryx-tab-bar__item-box::before')).toContain('transition-timing-function: var(--astryx-ease-exit)')
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.astryx-tab-bar__item-box::before \{\s*transition-duration: min\(var\(--astryx-duration-exit\), 200ms\)/)
    expect(rule('.astryx-tab-bar-item[data-tab-bar-pressed] .astryx-tab-bar__item-box::before')).toContain('transition-duration: 0s')
  })

  it('slides the mouse lens on the theme’s medium duration and standard curve, and not under a finger or Reduce Motion', () => {
    expect(rule('.astryx-tab-bar__lens')).toContain('transition-duration: var(--astryx-duration-medium)')
    expect(rule('.astryx-tab-bar__lens')).toContain('transition-timing-function: var(--astryx-ease-standard)')
    expect(css).toMatch(/@media \(pointer: coarse\), \(prefers-reduced-motion: reduce\) \{\s*\.astryx-tab-bar__lens \{\s*transition-duration: 0s/)
  })
})
