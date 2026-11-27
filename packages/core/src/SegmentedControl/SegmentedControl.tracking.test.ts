/**
 * @file SegmentedControl.tracking.test.ts
 * @input vitest (happy-dom), SegmentedControl.vue with stubbed segment
 *   geometry, Touch Events from the gesture test helpers, mouse and pen
 *   pointer events, and the real animator wrapped to record what it is asked
 * @output Presses of every pointer on SegmentedControl, from landing to lift:
 *   the finger's lift, the lens a drag carries, the segment a lift commits
 *   (off the control too), Escape, and focus moves during a press
 * @position Testing; segmentedTracking.ts and segmentedSelectionMotion.ts
 *   through SegmentedControl.vue
 */

import type { VueWrapper } from '@vue/test-utils'
import type * as AnimatorModule from '../motion/animator'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { pointerQuery } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents, touch } from '../gestures/__tests__/touchEvents'
import { segmentedControl } from '../motion/uikit/segmented'
import { springs } from '../motion/uikit/springs'
import { BROWSER_CLICK_WAIT_MS } from '../utils/browserClickWait'
import SegmentedControl from './SegmentedControl.vue'
import SegmentedControlItem from './SegmentedControlItem.vue'

interface Call {
  readonly name: string
  readonly args: unknown[]
}

const animators: { element: Element, calls: Call[] }[] = []

vi.mock('../motion/animator', async (importOriginal) => {
  const actual = await importOriginal<typeof AnimatorModule>()
  return {
    ...actual,
    createMotionEngine: (element: HTMLElement, options?: AnimatorModule.AnimatorOptions) => {
      const real = actual.createMotionEngine(element, options)
      const recorded = { element, calls: [] as Call[] }
      animators.push(recorded)
      return new Proxy(real, {
        get(target, key) {
          const value = Reflect.get(target, key) as unknown
          if (typeof value !== 'function')
            return value
          return (...args: unknown[]) => {
            if (['set', 'animate', 'play'].includes(key as string))
              recorded.calls.push({ name: key as string, args })
            return (value as (...a: unknown[]) => unknown).apply(target, args)
          }
        },
      })
    },
  }
})

let restoreTouchEvents: () => void = () => {}
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
})
afterAll(() => {
  restoreTouchEvents()
})
enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  animators.length = 0
  document.body.innerHTML = ''
})

/** The track at the viewport's origin, and each segment's box in it. */
const BOXES: Record<string, { left: number, top: number, width: number, height: number }> = {
  a: { left: 2, top: 2, width: 60, height: 32 },
  b: { left: 64, top: 2, width: 90, height: 32 },
  c: { left: 156, top: 2, width: 40, height: 32 },
}
const centerOf = (value: string): number => BOXES[value]!.left + BOXES[value]!.width / 2
const Y = 18

function rectOf({ left, top, width, height }: { left: number, top: number, width: number, height: number }): DOMRect {
  return { left, top, width, height, x: left, y: top, right: left + width, bottom: top + height, toJSON: () => ({}) } as DOMRect
}

function stubLayout(): void {
  const original = HTMLElement.prototype.getBoundingClientRect
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLElement) {
    if (this.classList.contains('astryx-segmented-control'))
      return rectOf({ left: 0, top: 0, width: 200, height: 36 })
    const box = this.getAttribute('role') === 'radio' ? BOXES[this.dataset.value ?? ''] : undefined
    return box == null ? original.call(this) : rectOf(box)
  })
}

async function renderControl(): Promise<VueWrapper> {
  stubLayout()
  const wrapper: VueWrapper = mount(SegmentedControl, {
    attachTo: document.body,
    props: { 'label': 'View', 'modelValue': 'a', 'onUpdate:modelValue': ((value: string) => { void wrapper.setProps({ modelValue: value }) }) as (...args: unknown[]) => void },
    slots: { default: () => ['a', 'b', 'c'].map(value => h(SegmentedControlItem, { label: value.toUpperCase(), value })) },
  })
  await nextTick()
  return wrapper
}

const segment = (wrapper: VueWrapper, value: string): HTMLElement => wrapper.get(`[data-value="${value}"]`).element as HTMLElement
const lensOf = (wrapper: VueWrapper): HTMLElement => wrapper.get('.astryx-segmented-control__selection:not(.astryx-segmented-control__selection--leaving)').element as HTMLElement
const callsOf = (element: Element, name: string): Call[] => animators.filter(animator => animator.element === element).at(-1)!.calls.filter(call => call.name === name)
const changes = (wrapper: VueWrapper): unknown[] => (wrapper.emitted('change') ?? []).map(([value]) => value)

/** Event timestamps keep increasing: the document's gesture host outlives each test. */
let clock = 1000
const nextStart = (): number => (clock += 10_000)

async function finger(type: 'touchstart' | 'touchmove' | 'touchend', target: Element, x: number, y: number, time: number): Promise<void> {
  touch(type, target, { id: 1, x, y }, time, type === 'touchend')
  await nextTick()
}

/** A finger from `from` on `target` to (`x`, `y`) in ten moves, 16 ms apart; it stays down unless `lift`. */
async function fingerDrag(target: Element, from: number, x: number, y = Y, lift = true): Promise<void> {
  let t = nextStart()
  await finger('touchstart', target, from, Y, t)
  for (let i = 1; i <= 10; i++) {
    t += 16
    await finger('touchmove', target, from + ((x - from) * i) / 10, Y + ((y - Y) * i) / 10, t)
  }
  if (lift)
    await finger('touchend', target, x, y, t + 4)
}

/** One mouse or pen pointer event. */
function pointer(type: 'pointerdown' | 'pointermove' | 'pointerup', pointerType: 'mouse' | 'pen', target: Element, x: number, time: number): void {
  const event = new Event(type, { bubbles: true, cancelable: true, composed: true })
  Object.defineProperties(event, {
    pointerId: { value: pointerType === 'pen' ? 7 : 1 },
    pointerType: { value: pointerType },
    isPrimary: { value: true },
    clientX: { value: x },
    clientY: { value: Y },
    button: { value: type === 'pointermove' ? -1 : 0 },
    buttons: { value: type === 'pointerup' ? 0 : 1 },
    pressure: { value: type === 'pointerup' ? 0 : 0.5 },
    width: { value: 1 },
    height: { value: 1 },
    timeStamp: { value: time },
  })
  target.dispatchEvent(event)
}

async function pointerDrag(pointerType: 'mouse' | 'pen', target: Element, from: number, to: number): Promise<void> {
  let t = nextStart()
  pointer('pointerdown', pointerType, target, from, t)
  for (let i = 1; i <= 10; i++) {
    t += 16
    pointer('pointermove', pointerType, target, from + ((to - from) * i) / 10, t)
  }
  pointer('pointerup', pointerType, target, to, t + 4)
  await nextTick()
}

/** Lets every motion land and its promises run. */
async function settled(): Promise<void> {
  for (let i = 0; i < 10; i++) {
    vi.advanceTimersByTime(200)
    await Promise.resolve()
    await nextTick()
  }
}

describe('segmentedControl under a finger', () => {
  let query: ReturnType<typeof pointerQuery>
  beforeEach(() => {
    query = pointerQuery(true)
  })
  afterEach(() => query.restore())

  it('lifts the selected surface by liftGrowth on the lift spring, and sets it back down after the release', async () => {
    const wrapper = await renderControl()
    const lens = lensOf(wrapper)
    const t = nextStart()
    await finger('touchstart', segment(wrapper, 'a'), centerOf('a'), Y, t)
    const [growX, growY] = segmentedControl.liftGrowth
    const lift = callsOf(lens, 'animate').find(call => 'scaleX' in (call.args[0] as object))
    expect(lift?.args[0]).toEqual({ scaleX: (60 + growX) / 60, scaleY: (32 + growY) / 32 })
    expect(lift?.args[1]).toMatchObject({ spring: segmentedControl.lift })
    expect(lens.hasAttribute('data-lifted')).toBe(true)
    await finger('touchend', segment(wrapper, 'a'), centerOf('a'), Y, t + 80)
    const settle = callsOf(lens, 'animate').at(-1)!
    expect(settle.args[0]).toEqual({ scaleX: 1, scaleY: 1 })
    expect(settle.args[1]).toMatchObject({ spring: segmentedControl.lift })
    await settled()
    expect(lens.hasAttribute('data-lifted')).toBe(false)
    expect(changes(wrapper)).toEqual([])
  })

  it('a drag from the selected segment carries the lens on the finger-tracking spring and commits where it lifts', async () => {
    const wrapper = await renderControl()
    const lens = lensOf(wrapper)
    await fingerDrag(segment(wrapper, 'a'), centerOf('a'), 110, Y, false)
    const chase = callsOf(lens, 'animate').filter(call => (call.args[1] as { spring?: unknown }).spring === springs.fingerTracking).at(-1)
    expect(chase?.args[0]).toEqual({ x: 110 - centerOf('a') })
    expect(changes(wrapper)).toEqual([])
    await finger('touchend', segment(wrapper, 'a'), 110, Y, nextStart())
    expect(changes(wrapper)).toEqual(['b'])
  })

  it('the lens reaches at most dragOvershoot past the end segments', async () => {
    const wrapper = await renderControl()
    const lens = lensOf(wrapper)
    await fingerDrag(segment(wrapper, 'a'), centerOf('a'), 400, Y, false)
    const chase = callsOf(lens, 'animate').filter(call => (call.args[1] as { spring?: unknown }).spring === springs.fingerTracking).at(-1)
    expect(chase?.args[0]).toEqual({ x: centerOf('c') + segmentedControl.dragOvershoot - centerOf('a') })
  })

  it('a drag that leaves the control above keeps choosing by its horizontal position', async () => {
    const wrapper = await renderControl()
    await fingerDrag(segment(wrapper, 'a'), centerOf('a'), 180, -90)
    expect(changes(wrapper)).toEqual(['c'])
  })

  it('a drag from an unselected segment commits the segment it lifts on and paints it while it would', async () => {
    const wrapper = await renderControl()
    await fingerDrag(segment(wrapper, 'b'), centerOf('b'), 180, Y, false)
    expect(segment(wrapper, 'c').getAttribute('data-astryx-press')).toBe('on')
    await finger('touchend', segment(wrapper, 'b'), 180, Y, nextStart())
    expect(changes(wrapper)).toEqual(['c'])
  })

  it('a tap commits through the click, and a held finger the browser sends no click for still selects', async () => {
    const wrapper = await renderControl()
    const t = nextStart()
    await finger('touchstart', segment(wrapper, 'b'), centerOf('b'), Y, t)
    await finger('touchend', segment(wrapper, 'b'), centerOf('b'), Y, t + 60)
    expect(changes(wrapper)).toEqual([])
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    await nextTick()
    expect(changes(wrapper)).toEqual(['b'])
  })

  it('a focus move the press causes selects nothing; the lift decides', async () => {
    const wrapper = await renderControl()
    const t = nextStart()
    await finger('touchstart', segment(wrapper, 'b'), centerOf('b'), Y, t)
    segment(wrapper, 'b').dispatchEvent(new FocusEvent('focusin', { bubbles: true, relatedTarget: segment(wrapper, 'a') }))
    await nextTick()
    expect(changes(wrapper)).toEqual([])
    touch('touchcancel', segment(wrapper, 'b'), { id: 1, x: centerOf('b'), y: Y }, t + 40, true)
    await nextTick()
    expect(changes(wrapper)).toEqual([])
  })

  it('escape during a drag commits nothing and springs the lens back', async () => {
    const wrapper = await renderControl()
    const lens = lensOf(wrapper)
    await fingerDrag(segment(wrapper, 'a'), centerOf('a'), 180, Y, false)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await finger('touchend', segment(wrapper, 'a'), 180, Y, nextStart())
    await settled()
    expect(changes(wrapper)).toEqual([])
    expect(lens.style.left).toBe('2px')
    expect(lens.hasAttribute('data-lifted')).toBe(false)
  })
})

describe('segmentedControl under a fine pointer', () => {
  for (const pointerType of ['mouse', 'pen'] as const) {
    it(`a ${pointerType} drags the lens on the pointer itself and commits where it lets go`, async () => {
      const wrapper = await renderControl()
      const lens = lensOf(wrapper)
      await pointerDrag(pointerType, segment(wrapper, 'a'), centerOf('a'), 120)
      const follows = callsOf(lens, 'set').filter(call => Object.keys(call.args[0] as object).join() === 'x')
      expect(follows.at(-1)?.args[0]).toEqual({ x: 120 - centerOf('a') })
      expect(callsOf(lens, 'animate').filter(call => 'scaleX' in (call.args[0] as object) && (call.args[1] as { spring?: unknown }).spring === segmentedControl.lift)).toHaveLength(0)
      expect(changes(wrapper)).toEqual(['b'])
    })
  }
})
