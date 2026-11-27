/**
 * @file Slider.touch.test.ts
 * @input Slider under a coarse primary pointer, stubbed control geometry,
 *   timed touch and pen events and fake timers
 * @output Holds Slider's touch presentation to UISlider's rules: touch
 *   targets, the travel past the pan's threshold, coincident thumbs, track
 *   taps, the release coast and a cancel's single `changeEnd`
 * @position Unit tests of useSliderTouch.ts and sliderTouchController.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import type { SliderProps, SliderValue } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'
import { nextTick } from 'vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents, touch } from '../gestures/__tests__/touchEvents'
import { projectDistance } from '../motion/projection'
import { slider as UIKIT_SLIDER } from '../motion/uikit/slider'
import Slider from './Slider.vue'

/** The control's stubbed layout: 300 px long at x = 0 (or y = 0). */
const LENGTH = 300

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
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

/** Event timestamps keep increasing: the document's gesture host outlives each test. */
let clock = 1000
const nextStart = (): number => (clock += 10_000)

async function finger(type: 'touchstart' | 'touchmove' | 'touchend', target: Element, x: number, y: number, time: number): Promise<void> {
  touch(type, target, { id: 1, x, y }, time, type === 'touchend')
  await Promise.resolve()
}

/** One pen event (pointer events only: a pen sends no touch events). */
async function pen(type: 'pointerdown' | 'pointermove' | 'pointerup', target: Element, x: number, time: number): Promise<void> {
  const event = new Event(type, { bubbles: true, cancelable: true, composed: true })
  Object.defineProperties(event, {
    pointerId: { value: 7 },
    pointerType: { value: 'pen' },
    isPrimary: { value: true },
    clientX: { value: x },
    clientY: { value: 12 },
    button: { value: type === 'pointermove' ? -1 : 0 },
    buttons: { value: type === 'pointerup' ? 0 : 1 },
    pressure: { value: type === 'pointerup' ? 0 : 0.5 },
    width: { value: 1 },
    height: { value: 1 },
    timeStamp: { value: time },
  })
  target.dispatchEvent(event)
  await Promise.resolve()
}

/** One finger from `from` by `dx`, `dy` in `steps` moves 16 ms apart. */
async function dragThumb(hit: Element, from: { x: number, y: number }, { dx = 0, dy = 0, steps = 10, lift = true } = {}): Promise<void> {
  const start = nextStart()
  await finger('touchstart', hit, from.x, from.y, start)
  let t = start
  for (let i = 1; i <= steps; i++) {
    t += 16
    await finger('touchmove', hit, from.x + (dx * i) / steps, from.y + (dy * i) / steps, t)
  }
  if (lift)
    await finger('touchend', hit, from.x + dx, from.y + dy, t + 4)
}

async function frames(count: number): Promise<void> {
  for (let frame = 0; frame < count; frame++) {
    vi.advanceTimersByTime(16)
    await nextTick()
  }
}

/** Gives every slider control a 300 px layout box. */
function stubControlGeometry(vertical = false, length = LENGTH): void {
  const rect = vertical
    ? { left: 0, top: 0, right: 24, bottom: length, width: 24, height: length }
    : { left: 0, top: 0, right: length, bottom: 24, width: length, height: 24 }
  const original = HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('astryx-slider-control'))
      return { ...rect, x: rect.left, y: rect.top, toJSON: () => rect } as DOMRect
    return original.call(this)
  })
}

/** A running Web Animations stand-in, so a coast lasts its curve. */
function runningAnimations(): void {
  Object.defineProperty(HTMLElement.prototype, 'animate', {
    configurable: true,
    value: () => ({ finished: new Promise<never>(() => {}), cancel: () => {}, startTime: null }) as unknown as Animation,
  })
  onTestFinished(() => {
    delete (HTMLElement.prototype as { animate?: unknown }).animate
  })
}

/** A slider whose owner takes every value it reports (`isControlled` false keeps its own). */
async function renderSlider(props: Partial<SliderProps> = {}, isControlled = true): Promise<VueWrapper> {
  const wrapper: VueWrapper = mount(Slider, {
    attachTo: document.body,
    props: {
      'label': 'Level',
      'valueDisplay': 'none',
      'modelValue': 50 as SliderValue,
      'onUpdate:modelValue': (value: SliderValue) => {
        if (isControlled)
          void wrapper.setProps({ modelValue: value })
      },
      ...props,
    },
  })
  await nextTick()
  return wrapper
}

const thumbs = (wrapper: VueWrapper): HTMLElement[] => wrapper.findAll('[role="slider"]').map(thumb => thumb.element as HTMLElement)
const controlOf = (wrapper: VueWrapper): HTMLElement => wrapper.get('.astryx-slider-control').element as HTMLElement
const changes = (wrapper: VueWrapper): unknown[] => (wrapper.emitted('change') ?? []).map(([value]) => value)
const ends = (wrapper: VueWrapper): unknown[] => (wrapper.emitted('changeEnd') ?? []).map(([value]) => value)

describe('slider touch presentation (UISlider tracking)', () => {
  it('gives each thumb a 48 px touch target that stops halfway to the other range thumb', async () => {
    const wrapper = await renderSlider({ modelValue: [20, 80] })
    const [low, high] = thumbs(wrapper)
    expect(low!.style.getPropertyValue('--_slider-hit-top')).toBe('-14px')
    expect(low!.style.getPropertyValue('--_slider-hit-start')).toBe('-14px')
    expect(low!.style.getPropertyValue('--_slider-hit-end')).toContain('clamp(0px, (0.6 * (100cqi - 20px) - 20px) / 2, 14px)')
    expect(high!.style.getPropertyValue('--_slider-hit-start')).toContain('clamp(')
    expect(high!.style.getPropertyValue('--_slider-hit-end')).toBe('-14px')
    // No element of its own: the thumb's ::before draws it.
    expect(low!.children).toHaveLength(0)
  })

  it('leaves a finger on the track to the tap, while a mouse press there still moves the value', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider()
    const control = controlOf(wrapper)
    control.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, pointerType: 'touch', clientX: 280, clientY: 12 }))
    control.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 1, pointerType: 'touch' }))
    expect(changes(wrapper)).toEqual([])
    control.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 2, pointerType: 'mouse', clientX: 280, clientY: 12, button: 0 }))
    control.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 2, pointerType: 'mouse' }))
    expect(changes(wrapper)).toEqual([96])
  })

  it('moves the value by the travel past the 10 px threshold over the track length, never jumping to the finger', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider()
    const [thumb] = thumbs(wrapper)
    await dragThumb(thumb!, { x: 150, y: 12 }, { dx: 70, lift: false })
    await nextTick()
    // (70 − 10) px of 300 px is 20 % of the range.
    expect(thumb!.getAttribute('aria-valuenow')).toBe('70')
    expect(changes(wrapper)[0]).toBe(51)
    expect(thumb!.dataset.dragging).toBe('true')
  })

  it('vertical: an upward drag raises the value', async () => {
    stubControlGeometry(true)
    const wrapper = await renderSlider({ orientation: 'vertical' })
    const [thumb] = thumbs(wrapper)
    await dragThumb(thumb!, { x: 12, y: 150 }, { dy: -40, lift: false })
    await nextTick()
    expect(thumb!.getAttribute('aria-valuenow')).toBe(String(50 + Math.round(((40 - 10) / LENGTH) * 100)))
  })

  it('coincident range thumbs: the first movement picks the thumb that can follow it', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider({ modelValue: [40, 40] })
    const [low, high] = thumbs(wrapper)
    await dragThumb(high!, { x: 120, y: 12 }, { dx: -40, lift: false })
    await nextTick()
    expect(low!.getAttribute('aria-valuenow')).toBe('30')
    expect(high!.getAttribute('aria-valuenow')).toBe('40')
  })

  it('a tap on the thumb changes nothing and reports one changeEnd', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider()
    const [thumb] = thumbs(wrapper)
    const start = nextStart()
    await finger('touchstart', thumb!, 150, 12, start)
    await finger('touchend', thumb!, 150, 12, start + 60)
    vi.advanceTimersByTime(500)
    expect(changes(wrapper)).toEqual([])
    expect(ends(wrapper)).toEqual([50])
  })

  it('sets the value from a tap on the track when the finger lifts (WCAG 2.5.7)', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider()
    const control = controlOf(wrapper)
    const start = nextStart()
    await finger('touchstart', control, 250, 12, start)
    expect(changes(wrapper)).toEqual([])
    await finger('touchend', control, 250, 12, start + 80)
    await frames(100)
    // (250 − 10) / (300 − 20) of the range.
    expect(changes(wrapper).at(-1)).toBe(86)
    expect(ends(wrapper)).toEqual([86])
    expect(thumbs(wrapper)[0]!.getAttribute('aria-valuenow')).toBe('86')
  })

  it('takes a pen on a thumb as it takes a finger, and ends its drag where it lifts', async () => {
    stubControlGeometry()
    runningAnimations()
    const wrapper = await renderSlider({ modelValue: 20 })
    const [thumb] = thumbs(wrapper)
    const t = nextStart()
    await pen('pointerdown', thumb!, 60, t)
    for (let i = 1; i <= 10; i++)
      await pen('pointermove', thumb!, 60 + 6 * i, t + 16 * i)
    const liftValue = 20 + Math.round(((60 - 10) / LENGTH) * 100)
    expect(changes(wrapper).at(-1)).toBe(liftValue)
    await pen('pointerup', thumb!, 120, t + 16 * 11)
    expect(ends(wrapper)).toEqual([liftValue])
    await frames(120)
    expect(thumb!.getAttribute('aria-valuenow')).toBe(String(liftValue))
    expect(ends(wrapper)).toEqual([liftValue])
    expect(thumb!.style.translate).toBe('')
  })

  it('pans a thumb under a mouse too: no jump to the press, no lift, and the drag ends where it lets go', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider()
    const [thumb] = thumbs(wrapper)
    const mouse = async (type: string, x: number): Promise<void> => {
      thumb!.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 3, pointerType: 'mouse', isPrimary: true, clientX: x, clientY: 12, button: type === 'pointermove' ? -1 : 0, buttons: type === 'pointerup' ? 0 : 1 }))
      await Promise.resolve()
    }
    await mouse('pointerdown', 140)
    expect(changes(wrapper)).toEqual([])
    for (let i = 1; i <= 10; i++)
      await mouse('pointermove', 140 + 6 * i)
    await nextTick()
    // (60 − 10) px of 300 px.
    expect(thumb!.getAttribute('aria-valuenow')).toBe('67')
    expect(thumb!.style.scale).toBe('')
    await mouse('pointerup', 200)
    expect(ends(wrapper)).toEqual([67])
  })

  it('moves the thumb under the finger off the render path, even when the owner keeps its value', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider({}, false)
    const [thumb] = thumbs(wrapper)
    await dragThumb(thumb!, { x: 150, y: 12 }, { dx: 60, lift: false })
    await nextTick()
    expect(changes(wrapper).at(-1)).toBe(67)
    expect(thumb!.getAttribute('aria-valuenow')).toBe('50')
    // It stands at 67's place along the 280 px travel, written straight to its translate.
    expect(Number.parseFloat(thumb!.style.translate)).toBeCloseTo(0.67 * 280, 1)
  })

  it('a release coasts to 0.4 of the momentum projection, then changeEnd reports once', async () => {
    stubControlGeometry()
    runningAnimations()
    const wrapper = await renderSlider({ modelValue: 20 })
    const [thumb] = thumbs(wrapper)
    // 10 moves of 6 px, 16 ms apart: 375 px/s at the lift.
    await dragThumb(thumb!, { x: 60, y: 12 }, { dx: 60 })
    const liftValue = 20 + Math.round(((60 - 10) / LENGTH) * 100)
    const target = Math.round(liftValue + ((UIKIT_SLIDER.releaseProjectionShare * projectDistance(6 / 0.016, UIKIT_SLIDER.releaseProjectionRate)) / LENGTH) * 100)
    expect(target).toBeGreaterThan(liftValue)
    expect(ends(wrapper)).toEqual([])
    await frames(120)
    expect(thumb!.getAttribute('aria-valuenow')).toBe(String(target))
    expect(changes(wrapper).at(-1)).toBe(target)
    expect(ends(wrapper)).toEqual([target])
    // Handed back to the stylesheet: no inline translate is left.
    expect(thumb!.style.translate).toBe('')
  })

  it('cancels a drag when the slider is disabled mid-drag: changeEnd fires once, with the value the owner kept', async () => {
    stubControlGeometry()
    const wrapper = await renderSlider({}, false)
    const [thumb] = thumbs(wrapper)
    await dragThumb(thumb!, { x: 150, y: 12 }, { dx: 60, lift: false })
    expect(changes(wrapper).length).toBeGreaterThan(0)
    const changed = changes(wrapper).length
    await wrapper.setProps({ isDisabled: true })
    await Promise.resolve()
    expect(ends(wrapper)).toEqual([50])
    expect(changes(wrapper)).toHaveLength(changed)
    await finger('touchend', thumb!, 210, 12, clock + 500)
    expect(ends(wrapper)).toEqual([50])
  })
})
