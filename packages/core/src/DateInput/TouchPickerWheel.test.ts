/**
 * @file TouchPickerWheel.test.ts
 * @input PickerWheel under a coarse primary pointer, a stubbed 264 px column,
 *   timed touch events, a stand-in for Web Animations and fake timers
 * @output Holds the touch wheel to UIPickerView's motion: the rows follow the
 *   finger, a flick coasts onto the projected row and commits at rest, a slow
 *   release snaps, a drag past an end rubber-bands and springs back, a tap,
 *   a key or an outside value turns the wheel on the settle spring, and under
 *   Reduce Motion a turn lands under the shared dip
 * @position Unit tests of TouchPickerWheel.vue, useTouchWheel.ts and
 *   wheelStrip.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import type { FakeAnimation } from '../motion/__tests__/fakeWebAnimation'
import type { PickerWheelOption } from './wheelOptions'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'
import { nextTick } from 'vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents, touch } from '../gestures/__tests__/touchEvents'
import { fakeAnimate } from '../motion/__tests__/fakeWebAnimation'
import PickerWheel from './PickerWheel.vue'
import { planRelease, WHEEL_ROW_HEIGHT } from './wheelPhysics'

const ROW = WHEEL_ROW_HEIGHT
/** The stubbed column: 264 px tall at y = 0, so the band's centre is at y = 132. */
const BAND_Y = 132

let restoreTouchEvents: () => void = () => {}
let restorePointer: () => void = () => {}
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
  restorePointer = coarsePrimaryPointer()
})
afterAll(() => {
  restorePointer()
  restoreTouchEvents()
})
enableAutoUnmount(afterEach)
/**
 * The gestures' event clock never runs backwards, and it outlives a test: each
 * test's fake clock starts past where the previous one stopped.
 */
let clockEnd = 0
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
  vi.advanceTimersByTime(clockEnd + 10_000)
  const original = HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('astryx-picker-wheel-touch'))
      return { left: 0, top: 0, right: 100, bottom: 264, width: 100, height: 264, x: 0, y: 0, toJSON: () => ({}) } as DOMRect
    return original.call(this)
  })
})
afterEach(() => {
  clockEnd = performance.now()
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

/** Sixty rows; 3 is out of bounds. */
const MINUTES: PickerWheelOption[] = Array.from({ length: 60 }, (_, index) => ({
  value: String(index),
  label: String(index).padStart(2, '0'),
  disabled: index === 3,
}))

/** A Web Animations stand-in, so a played curve lasts its duration. */
function stubAnimations(): FakeAnimation[] {
  const { animate, animations } = fakeAnimate()
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: animate })
  onTestFinished(() => {
    delete (HTMLElement.prototype as { animate?: unknown }).animate
  })
  return animations
}

/** Reduce Motion on, on top of the coarse pointer. */
function reduceMotion(): void {
  const previous = window.matchMedia
  window.matchMedia = ((query: string) => query.includes('prefers-reduced-motion: reduce')
    ? { matches: true, media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }
    : previous.call(window, query)) as typeof window.matchMedia
  onTestFinished(() => {
    window.matchMedia = previous
  })
}

function renderWheel(modelValue = '20', options = MINUTES): VueWrapper {
  const wrapper = mount(PickerWheel, {
    attachTo: document.body,
    props: {
      'label': 'Minute',
      options,
      modelValue,
      'onUpdate:modelValue': (value: string) => wrapper.setProps({ modelValue: value }),
    },
  })
  return wrapper
}

function column(wrapper: VueWrapper): HTMLElement {
  return wrapper.get('.astryx-picker-wheel-touch').element as HTMLElement
}

/** The offset the strip shows at rest, from its inline translate. */
function shownOffset(wrapper: VueWrapper): number {
  const strip = wrapper.get('.astryx-picker-wheel-strip').element as HTMLElement
  const [, y = '0'] = strip.style.translate.split(' ')
  return 0 - Number.parseFloat(y)
}

function emitted(wrapper: VueWrapper): string[] {
  return (wrapper.emitted<string[]>('update:modelValue') ?? []).map(([value]) => value!)
}

function marked(wrapper: VueWrapper): string[] {
  return wrapper.findAll('[data-marked]').map(row => row.text())
}

async function finger(type: 'touchstart' | 'touchmove' | 'touchend', target: Element, y: number): Promise<void> {
  touch(type, target, { id: 1, x: 50, y }, performance.now(), type === 'touchend')
  await Promise.resolve()
}

/** One finger at `y` moving by `dy` in `steps` moves 16 ms apart, lifted unless `lift` is false. */
async function drag(target: Element, y: number, dy: number, { steps = 8, lift = true } = {}): Promise<void> {
  await finger('touchstart', target, y)
  for (let i = 1; i <= steps; i++) {
    vi.advanceTimersByTime(16)
    await finger('touchmove', target, y + (dy * i) / steps)
  }
  if (lift)
    await finger('touchend', target, y + dy)
}

async function advance(ms: number): Promise<void> {
  vi.advanceTimersByTime(ms)
  await nextTick()
}

describe('touchPickerWheel under a finger', () => {
  it('is a listbox that parks the committed row under the band at once', async () => {
    stubAnimations()
    const wrapper = renderWheel('20')
    await nextTick()
    const listbox = column(wrapper)
    expect(listbox.getAttribute('role')).toBe('listbox')
    expect(listbox.getAttribute('aria-label')).toBe('Minute')
    const active = document.getElementById(listbox.getAttribute('aria-activedescendant')!)
    expect(active?.textContent?.trim()).toBe('20')
    expect(active?.getAttribute('aria-selected')).toBe('true')
    expect(shownOffset(wrapper)).toBe(20 * ROW)
    expect(marked(wrapper)).toEqual(['20'])
    // A downward pull on the wheel is its own, never the sheet's.
    expect(listbox.hasAttribute('data-astryx-owns-pan')).toBe(true)
  })

  it('follows the finger, rubber-bands past the first row, and springs back without a commit', async () => {
    stubAnimations()
    const wrapper = renderWheel('0')
    await nextTick()
    const target = column(wrapper)
    // Up by 56 px: the rows follow, two rows on, and the band marks row 2.
    await drag(target, BAND_Y, -56, { lift: false })
    expect(shownOffset(wrapper)).toBeCloseTo(56 - 10, 0)
    // Held still before the lift: no velocity, so it snaps onto row 2.
    vi.advanceTimersByTime(200)
    await finger('touchend', target, BAND_Y - 56)
    await advance(2000)
    expect(emitted(wrapper)).toEqual(['2'])
    expect(shownOffset(wrapper)).toBe(2 * ROW)
    // Down past the first row: the band gives less than the finger travels.
    const before = emitted(wrapper).length
    await drag(target, BAND_Y, 200, { lift: false })
    const shown = shownOffset(wrapper)
    expect(shown).toBeLessThan(0)
    expect(shown).toBeGreaterThan(-200)
    await finger('touchend', target, BAND_Y + 200)
    await advance(3000)
    expect(shownOffset(wrapper)).toBe(0)
    expect(emitted(wrapper).slice(before).every(value => value === '0')).toBe(true)
  })

  it('coasts a flick onto the projected row and commits it once, at rest', async () => {
    stubAnimations()
    const wrapper = renderWheel('20')
    await nextTick()
    await drag(column(wrapper), 200, -120, { steps: 6 })
    // While it coasts nothing commits and no row carries the band's mark.
    await advance(100)
    expect(emitted(wrapper)).toEqual([])
    expect(marked(wrapper)).toEqual([])
    await advance(4000)
    const values = emitted(wrapper)
    expect(values).toHaveLength(1)
    const rest = Number(values[0])
    // A 750 px/s flick goes well past the rows the finger dragged.
    expect(rest).toBeGreaterThan(20 + 120 / ROW + 2)
    expect(shownOffset(wrapper)).toBe(rest * ROW)
    expect(marked(wrapper)).toEqual([String(rest).padStart(2, '0')])
  })

  it('snaps a slow release onto the nearest row, and turns on past a disabled one', async () => {
    stubAnimations()
    const wrapper = renderWheel('5')
    await nextTick()
    // Two rows up, slowly, then held still: row 3 is under the band, out of bounds.
    await drag(column(wrapper), 200, 2 * ROW, { steps: 28 })
    await advance(3000)
    expect(emitted(wrapper)).toEqual(['4'])
    expect(shownOffset(wrapper)).toBe(4 * ROW)
  })

  it('plans a release as UIKit does: the coast keeps the velocity and stops on the projected row', () => {
    const plan = planRelease(20 * ROW, 900, { rowHeight: ROW, rowCount: 60 })
    expect(plan.kind).toBe('coast')
    expect(plan.curve.velocity(0)).toBeCloseTo(900, 6)
    expect(plan.curve.to).toBe(plan.index * ROW)
  })

  it('turns onto a tapped row on the settle spring and commits it on arrival', async () => {
    stubAnimations()
    const wrapper = renderWheel('20')
    await nextTick()
    const target = column(wrapper)
    await finger('touchstart', target, BAND_Y + 2 * ROW)
    vi.advanceTimersByTime(40)
    await finger('touchend', target, BAND_Y + 2 * ROW)
    await advance(16)
    expect(emitted(wrapper)).toEqual([])
    expect(marked(wrapper)).toEqual([])
    await advance(2000)
    expect(emitted(wrapper)).toEqual(['22'])
    expect(shownOffset(wrapper)).toBe(22 * ROW)
  })

  it('commits a key at once and turns the wheel there on the settle spring; two presses move two rows', async () => {
    stubAnimations()
    const wrapper = renderWheel('1')
    await nextTick()
    const listbox = wrapper.get('[role="listbox"]')
    await listbox.trigger('keydown', { key: 'ArrowDown' })
    await listbox.trigger('keydown', { key: 'ArrowDown' })
    // 1 → 2 → 4: the keys skip row 3, which is out of bounds.
    expect(emitted(wrapper)).toEqual(['2', '4'])
    expect(marked(wrapper)).toEqual([])
    // The turn lasts the settle spring's time for three rows, well under a second.
    await advance(1000)
    expect(shownOffset(wrapper)).toBe(4 * ROW)
    expect(marked(wrapper)).toEqual(['04'])
    await listbox.trigger('keydown', { key: 'End' })
    await listbox.trigger('keydown', { key: 'Home' })
    expect(emitted(wrapper)).toEqual(['2', '4', '59', '0'])
  })

  it('steps one row per mouse wheel notch', async () => {
    stubAnimations()
    const wrapper = renderWheel('10')
    await nextTick()
    column(wrapper).dispatchEvent(new WheelEvent('wheel', { deltaY: 1, deltaMode: 1, bubbles: true, cancelable: true }))
    expect(emitted(wrapper)).toEqual(['11'])
  })

  it('turns onto a value set from outside instead of jumping there', async () => {
    stubAnimations()
    const wrapper = renderWheel('20')
    await nextTick()
    await wrapper.setProps({ modelValue: '25' })
    await nextTick()
    expect(marked(wrapper)).toEqual([])
    expect(shownOffset(wrapper)).toBe(20 * ROW)
    await advance(2000)
    expect(shownOffset(wrapper)).toBe(25 * ROW)
    expect(marked(wrapper)).toEqual(['25'])
    expect(emitted(wrapper)).toEqual([])
  })
})

describe('touchPickerWheel under Reduce Motion', () => {
  it('lands a key turn under the dip: the rows move when the fade-out ends, then fade back in', async () => {
    const animations = stubAnimations()
    reduceMotion()
    const wrapper = renderWheel('10')
    await nextTick()
    const strip = wrapper.get('.astryx-picker-wheel-strip').element
    await wrapper.get('[role="listbox"]').trigger('keydown', { key: 'ArrowDown' })
    expect(emitted(wrapper)).toEqual(['11'])
    const fadeOut = animations.find(animation => animation.keyframes[0]?.opacity === 1)
    expect(fadeOut).toBeDefined()
    expect(fadeOut!.keyframes.at(-1)?.opacity).toBe(0)
    expect(fadeOut!.options.duration).toBe(100)
    // However late the frame, the rows stay put until the fade-out ends.
    await advance(1000)
    expect(shownOffset(wrapper)).toBe(10 * ROW)
    fadeOut!.finish()
    await Promise.resolve()
    await nextTick()
    expect(shownOffset(wrapper)).toBe(11 * ROW)
    const fadeIn = animations.find(animation => animation.keyframes[0]?.opacity === 0)
    expect(fadeIn?.keyframes.at(-1)?.opacity).toBe(1)
    void strip
    await advance(100)
    expect(marked(wrapper)).toEqual(['11'])
  })

  it('keeps a flick\'s coast moving, as scrolling does under Reduce Motion', async () => {
    const animations = stubAnimations()
    reduceMotion()
    const wrapper = renderWheel('20')
    await nextTick()
    await drag(column(wrapper), 200, -120, { steps: 6 })
    expect(animations.some(animation => animation.keyframes[0]?.opacity === 1 && animation.keyframes.at(-1)?.opacity === 0)).toBe(false)
    await advance(100)
    expect(emitted(wrapper)).toEqual([])
    await advance(4000)
    expect(Number(emitted(wrapper)[0])).toBeGreaterThan(24)
  })
})
