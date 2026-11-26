/**
 * @file usePressTracker.test.ts
 * @input Vue components using usePressTracker, and touch and pointer events
 *   dispatched on their elements
 * @output The composable reports UIControl events, reads its options as they
 *   are now, follows the element behind its ref, keeps a press through an
 *   option change, and calls back nothing from a disable, a release or an
 *   unmount
 * @position Unit tests of packages/core/src/gestures/usePressTracker.ts
 */

import type { Ref } from 'vue'
import type { ControlEvent } from '../PressTracker'
import type { SelectionLock } from '../recognizerOptions'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, reactive, ref } from 'vue'
import { lockSelection } from '../../utils/selectionLock'
import { getGestureHost } from '../GestureHost'
import { TapGestureRecognizer } from '../TapGestureRecognizer'
import { useGestureRecognizer } from '../useGestureRecognizer'
import { usePressTracker } from '../usePressTracker'
import { coarsePrimaryPointer, pointerQuery } from './pointerQuery'
import { exposeTouchEvents, touch } from './touchEvents'

function byTestId(id: string): HTMLElement {
  return document.querySelector(`[data-testid="${id}"]`) as HTMLElement
}

function boundsOf(element: HTMLElement, width: number, height: number): void {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({ left: 0, top: 0, right: width, bottom: height, width, height, x: 0, y: 0, toJSON: () => ({}) }),
  })
}

interface ButtonState {
  isDisabled: boolean
  cancelTravel?: number
  isBraking?: () => boolean
  selectionLock?: SelectionLock
  highlightDelay?: 'inScrollers' | 'always' | 'never'
}

/** A button tracked with the options `state` holds as they are now. */
function button(
  events: ControlEvent[],
  state: ButtonState = reactive({ isDisabled: false }),
  highlights: boolean[] = [],
  testId = 'button',
) {
  return defineComponent({
    setup() {
      const node = ref<HTMLButtonElement | null>(null)
      usePressTracker(node, {
        onControlEvent: event => events.push(event),
        onHighlightChange: isHighlighted => highlights.push(isHighlighted),
        get cancelTravel() {
          return state.cancelTravel
        },
        get isBraking() {
          return state.isBraking
        },
        get selectionLock() {
          return state.selectionLock
        },
        get highlightDelay() {
          return state.highlightDelay
        },
        isEnabled: () => !state.isDisabled,
      })
      return () => h('button', { 'ref': node, 'data-testid': testId, 'type': 'button' }, 'Go')
    },
  })
}

let restoreTouchEvents: () => void = () => {}

// A phone: the host attaches only where the primary pointer is coarse.
let restorePointer: () => void = () => {}
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
})
beforeEach(() => {
  restorePointer = coarsePrimaryPointer()
})
afterEach(() => {
  restorePointer()
  vi.useRealTimers()
  document.body.innerHTML = ''
})
afterAll(() => {
  restoreTouchEvents()
})

describe('usePressTracker', () => {
  it('gives the host no listener while the control is disabled (FR24)', () => {
    // The host listens through the window's input stream (utils/inputStream).
    const add = vi.spyOn(window, 'addEventListener')
    const remove = vi.spyOn(window, 'removeEventListener')
    const state = reactive<ButtonState>({ isDisabled: true })
    const wrapper = mount(button([], state), { attachTo: document.body })
    const added = (): number => add.mock.calls.filter(([type]) => type === 'touchstart').length
    expect(added()).toBe(0)
    state.isDisabled = false
    expect(added()).toBe(1)
    state.isDisabled = true
    expect(remove.mock.calls.filter(([type]) => type === 'touchstart')).toHaveLength(1)
    wrapper.unmount()
    add.mockRestore()
    remove.mockRestore()
  })

  it('ends a press whose control, the only enabled one, is disabled under the finger: nothing reports from the sync or at the lift', () => {
    const events: ControlEvent[] = []
    const state = reactive<ButtonState>({ isDisabled: false })
    const wrapper = mount(button(events, state), { attachTo: document.body })
    const target = byTestId('button')
    touch('touchstart', target, { id: 11, x: 1, y: 1 }, 0)
    expect(events).toEqual(['touchDown'])
    state.isDisabled = true
    expect(events).toEqual(['touchDown'])
    touch('touchend', target, { id: 11, x: 1, y: 1 }, 50, true)
    expect(events).toEqual(['touchDown'])
    wrapper.unmount()
  })

  it('ends a press whose control is disabled under the finger while another control keeps the host listening: the lift reports nothing', () => {
    const events: ControlEvent[] = []
    const state = reactive<ButtonState>({ isDisabled: false })
    const Button = button(events, state)
    const Other = button([], reactive({ isDisabled: false }), [], 'other')
    const wrapper = mount(defineComponent({ setup: () => () => [h(Button), h(Other)] }), { attachTo: document.body })
    const target = byTestId('button')
    touch('touchstart', target, { id: 12, x: 1, y: 1 }, 0)
    expect(events).toEqual(['touchDown'])
    state.isDisabled = true
    expect(events).toEqual(['touchDown'])
    // A disabled control tracks no touch: the lift is no touchUpInside.
    touch('touchend', target, { id: 12, x: 1, y: 1 }, 50, true)
    expect(events).toEqual(['touchDown'])
    wrapper.unmount()
  })

  it('reports UIControl events for a tap', () => {
    const events: ControlEvent[] = []
    const wrapper = mount(button(events), { attachTo: document.body })
    const target = byTestId('button')
    touch('touchstart', target, { id: 5, x: 1, y: 1 }, 0)
    touch('touchend', target, { id: 5, x: 1, y: 1 }, 50, true)
    expect(events).toEqual(['touchDown', 'touchUpInside'])
    wrapper.unmount()
  })

  it('locks selection and the callout for each press of a control whose hold acts, given the lock (spec:AST-094 FR41)', () => {
    // happy-dom's CSS.supports answers true to every query, which reads as
    // iOS WebKit; this models another engine, where the lock refuses a
    // selection by cancelling selectstart.
    const css = globalThis.CSS
    Object.defineProperty(globalThis, 'CSS', { configurable: true, value: { ...css, supports: () => false } })
    const wrapper = mount(button([], reactive({ isDisabled: false, selectionLock: lockSelection })), { attachTo: document.body })
    const target = byTestId('button')
    const refuses = (): boolean => {
      const event = new Event('selectstart', { bubbles: true, cancelable: true })
      target.dispatchEvent(event)
      return event.defaultPrevented
    }
    touch('touchstart', target, { id: 3, x: 1, y: 1 }, 0)
    expect(refuses()).toBe(true)
    touch('touchend', target, { id: 3, x: 1, y: 1 }, 50, true)
    expect(refuses()).toBe(false)
    wrapper.unmount()
    Object.defineProperty(globalThis, 'CSS', { configurable: true, value: css })
  })

  it('takes an option changed after mount from the next touch', () => {
    const events: ControlEvent[] = []
    const state = reactive<ButtonState>({ isDisabled: false })
    const wrapper = mount(button(events, state), { attachTo: document.body })
    state.cancelTravel = 5
    const target = byTestId('button')
    touch('touchstart', target, { id: 7, x: 1, y: 1 }, 0)
    touch('touchmove', target, { id: 7, x: 1, y: 11 }, 16)
    expect(events).toEqual(['touchDown', 'touchCancel'])
    touch('touchend', target, { id: 7, x: 1, y: 11 }, 50, true)
    wrapper.unmount()
  })

  it('ends a held press on unmount without calling back', () => {
    const events: ControlEvent[] = []
    const highlights: boolean[] = []
    const wrapper = mount(button(events, reactive({ isDisabled: false }), highlights), { attachTo: document.body })
    touch('touchstart', byTestId('button'), { id: 9, x: 1, y: 1 }, 0)
    const seenHighlights = [...highlights]
    const seenEvents = [...events]
    wrapper.unmount()
    expect(highlights).toEqual(seenHighlights)
    expect(events).toEqual(seenEvents)
  })

  it('gives a press tracker a mouse press where the primary pointer is fine (spec:AST-094 FR43, DEC-21)', () => {
    restorePointer()
    restorePointer = pointerQuery(false).restore
    const held: ControlEvent[] = []
    const inactive: ControlEvent[] = []
    const stepper = (events: ControlEvent[], testId: string) => defineComponent({
      setup() {
        const node = ref<HTMLButtonElement | null>(null)
        usePressTracker(node, { onControlEvent: event => events.push(event) })
        return () => h('button', { 'ref': node, 'data-testid': testId, 'type': 'button' }, '+')
      },
    })
    const Held = stepper(held, 'held')
    const Other = stepper(inactive, 'other')
    const wrapper = mount(defineComponent({ setup: () => () => [h(Held), h(Other)] }), { attachTo: document.body })
    const mouse = (type: string, target: Element, id: number): void => {
      target.dispatchEvent(new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId: id,
        pointerType: 'mouse',
        clientX: 5,
        clientY: 5,
        button: 0,
        buttons: type === 'pointerdown' ? 1 : 0,
      }))
    }
    const first = byTestId('held')
    boundsOf(first, 44, 44)
    mouse('pointerdown', first, 1)
    mouse('pointerup', first, 1)
    // A mouse press is a press (DEC-21).
    expect(held).toEqual(['touchDown', 'touchUpInside'])
    const other = byTestId('other')
    boundsOf(other, 44, 44)
    mouse('pointerdown', other, 2)
    mouse('pointerup', other, 2)
    expect(inactive).toEqual(['touchDown', 'touchUpInside'])
    wrapper.unmount()
  })

  it('passes the caller\'s isBraking through to the tracker', () => {
    const events: ControlEvent[] = []
    const isBraking = vi.fn(() => true)
    const wrapper = mount(button(events, reactive({ isDisabled: false, isBraking })), { attachTo: document.body })
    const target = byTestId('button')
    touch('touchstart', target, { id: 8, x: 1, y: 1 }, 0)
    touch('touchend', target, { id: 8, x: 1, y: 1 }, 50, true)
    expect(isBraking).toHaveBeenCalled()
    expect(events).toEqual([])
    wrapper.unmount()
  })

  it('presses nothing for a touch that brakes a scroll', () => {
    const events: ControlEvent[] = []
    const wrapper = mount(button(events), { attachTo: document.body })
    const target = byTestId('button')
    const brake = vi.spyOn(getGestureHost(document), 'isScrollBraking').mockReturnValue(true)
    touch('touchstart', target, { id: 7, x: 1, y: 1 }, 0)
    touch('touchend', target, { id: 7, x: 1, y: 1 }, 50, true)
    expect(events).toEqual([])
    brake.mockRestore()
    wrapper.unmount()
  })

  it.each([
    ['alone', false],
    ['with a single tap waiting on it', true],
  ])('ends a press that waits on an ancestor double tap after, not inside, the isEnabled sync that turns it off (%s)', async (_name, hasSingle) => {
    const events: (ControlEvent | 'highlight' | 'unhighlight')[] = []
    const isDoubleEnabled = ref(true)
    const PressInTaps = defineComponent({
      setup() {
        const outer = ref<HTMLElement | null>(null)
        const inner = ref<HTMLButtonElement | null>(null)
        const double = useGestureRecognizer(outer, () => new TapGestureRecognizer({ numberOfTapsRequired: 2 }), undefined, { isEnabled: isDoubleEnabled })
        const single = useGestureRecognizer(outer, () => new TapGestureRecognizer(), undefined, { isEnabled: hasSingle })
        single.requireToFail(double)
        usePressTracker(inner, {
          onControlEvent: event => events.push(event),
          onHighlightChange: isHighlighted => events.push(isHighlighted ? 'highlight' : 'unhighlight'),
        })
        return () => h('div', { ref: outer }, [h('button', { 'ref': inner, 'data-testid': 'press', 'type': 'button' })])
      },
    })
    const wrapper = mount(PressInTaps, { attachTo: document.body })
    const target = byTestId('press')
    touch('touchstart', target, { id: 21, x: 1, y: 1 }, 0)
    touch('touchend', target, { id: 21, x: 1, y: 1 }, 40, true)
    const before = [...events]
    // Turning the double tap off fails it in the sync: whatever that arena
    // pass resolves for the press reaches no caller callback.
    isDoubleEnabled.value = false
    expect(events).toEqual(before)
    // Just after it, the press ends and un-highlights: nothing is left
    // highlighted.
    await Promise.resolve()
    expect(events.slice(before.length)).toEqual(['touchUpInside', 'unhighlight'])
    wrapper.unmount()
  })

  it('keeps the tracker\'s own ancestor veto when the caller gives none: a single tap by its kind, nothing else with the same counts', () => {
    let tracker: ReturnType<typeof usePressTracker> | null = null
    const wrapper = mount(defineComponent({
      setup() {
        const node = ref<HTMLButtonElement | null>(null)
        tracker = usePressTracker(node)
        return () => h('button', { ref: node, type: 'button' }, 'Go')
      },
    }), { attachTo: document.body })
    expect(tracker!.allowsAncestorRecognizer(new TapGestureRecognizer({}))).toBe(false)
    // A discrete recognizer that is not a tap, carrying the same counts.
    const notATap = { kind: 'swipe', isDiscrete: true, numberOfTapsRequired: 1, numberOfTouchesRequired: 1, view: null }
    expect(tracker!.allowsAncestorRecognizer(notATap)).toBe(true)
    wrapper.unmount()
  })
})

describe('usePressTracker follows its element and its options', () => {
  /** A button tracked through a ref, rendered while `isShown` holds. */
  function laterButton(isShown: Ref<boolean>, events: ControlEvent[], state: ButtonState, highlights: boolean[] = []) {
    const Inner = button(events, state, highlights, 'stepper')
    return defineComponent({ setup: () => () => isShown.value ? h(Inner) : null })
  }

  it('tracks a node rendered after mount, and a node the same ref names after a swap', async () => {
    const events: ControlEvent[] = []
    const which = ref<'none' | 'a' | 'b'>('none')
    const Swapped = defineComponent({
      setup() {
        const node = ref<HTMLButtonElement | null>(null)
        usePressTracker(node, { onControlEvent: event => events.push(event) })
        return () => which.value === 'none'
          ? null
          : h('button', { 'key': which.value, 'ref': node, 'data-testid': which.value, 'type': 'button' })
      },
    })
    const wrapper = mount(Swapped, { attachTo: document.body })
    which.value = 'a'
    await nextTick()
    const a = byTestId('a')
    touch('touchstart', a, { id: 1, x: 2, y: 2 }, 0)
    touch('touchend', a, { id: 1, x: 2, y: 2 }, 60, true)
    expect(events).toEqual(['touchDown', 'touchUpInside'])
    events.length = 0
    which.value = 'b'
    await nextTick()
    const b = byTestId('b')
    // The lift is judged against the swapped node's bounds.
    boundsOf(b, 100, 40)
    touch('touchstart', b, { id: 2, x: 10, y: 10 }, 100)
    touch('touchmove', b, { id: 2, x: 400, y: 400 }, 116)
    touch('touchend', b, { id: 2, x: 400, y: 400 }, 132, true)
    expect(events).toContain('touchDown')
    expect(events).toContain('touchUpOutside')
    expect(events).not.toContain('touchUpInside')
    wrapper.unmount()
  })

  it('takes a highlight delay changed after mount from the next touch', () => {
    vi.useFakeTimers()
    const highlights: boolean[] = []
    const state = reactive<ButtonState>({ isDisabled: false, highlightDelay: 'never' })
    const wrapper = mount(laterButton(ref(true), [], state, highlights), { attachTo: document.body })
    state.highlightDelay = 'always'
    const target = byTestId('stepper')
    touch('touchstart', target, { id: 1, x: 2, y: 2 }, 0)
    // 'always' waits the content-touch delay before highlighting.
    expect(highlights).toEqual([])
    touch('touchend', target, { id: 1, x: 2, y: 2 }, 400, true)
    wrapper.unmount()
  })

  it('keeps a press in progress through an option change', () => {
    const events: ControlEvent[] = []
    const highlights: boolean[] = []
    const state = reactive<ButtonState>({ isDisabled: false })
    const wrapper = mount(button(events, state, highlights), { attachTo: document.body })
    const target = byTestId('button')
    touch('touchstart', target, { id: 6, x: 1, y: 1 }, 0)
    expect(highlights).toEqual([true])
    state.cancelTravel = 50
    // Still pressed: the tracker was not rebuilt or disposed.
    expect(highlights).toEqual([true])
    touch('touchend', target, { id: 6, x: 1, y: 1 }, 50, true)
    expect(events).toEqual(['touchDown', 'touchUpInside'])
    wrapper.unmount()
  })

  it('ends its press without calling back when its element goes, and presses a new element', async () => {
    const events: ControlEvent[] = []
    const highlights: boolean[] = []
    const isShown = ref(true)
    const wrapper = mount(laterButton(isShown, events, reactive({ isDisabled: false }), highlights), { attachTo: document.body })
    touch('touchstart', byTestId('stepper'), { id: 13, x: 1, y: 1 }, 0)
    expect(highlights).toEqual([true])
    isShown.value = false
    await nextTick()
    expect(highlights).toEqual([true])
    expect(events).toEqual(['touchDown'])
    isShown.value = true
    await nextTick()
    const target = byTestId('stepper')
    touch('touchstart', target, { id: 14, x: 1, y: 1 }, 100)
    touch('touchend', target, { id: 14, x: 1, y: 1 }, 150, true)
    expect(events).toEqual(['touchDown', 'touchDown', 'touchUpInside'])
    wrapper.unmount()
  })

  it('reads trackingExpansion as it is now: a smaller one takes effect mid-press', () => {
    const events: ControlEvent[] = []
    const expansion = ref(70)
    const wrapper = mount(defineComponent({
      setup() {
        const node = ref<HTMLButtonElement | null>(null)
        usePressTracker(node, { onControlEvent: event => events.push(event), trackingExpansion: expansion })
        return () => h('button', { 'ref': node, 'data-testid': 'tracked', 'type': 'button' }, 'Go')
      },
    }), { attachTo: document.body })
    const target = byTestId('tracked')
    boundsOf(target, 100, 40)
    touch('touchstart', target, { id: 15, x: 10, y: 10 }, 0)
    // 30 px below the bottom edge: inside a 70 px expansion.
    touch('touchmove', target, { id: 15, x: 10, y: 70 }, 16)
    expect(events).not.toContain('touchDragExit')
    expansion.value = 10
    // The same point is outside a 10 px expansion, mid-press.
    touch('touchmove', target, { id: 15, x: 10, y: 71 }, 32)
    expect(events).toContain('touchDragExit')
    touch('touchend', target, { id: 15, x: 10, y: 71 }, 48, true)
    expect(events).toContain('touchUpOutside')
    wrapper.unmount()
  })
})
