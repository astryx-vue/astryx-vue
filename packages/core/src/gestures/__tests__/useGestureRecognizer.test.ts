/**
 * @file useGestureRecognizer.test.ts
 * @input Vue components using useGestureRecognizer, and touch events
 *   dispatched on their elements
 * @output The composable keeps one recognizer per component, attaches before
 *   the first touch, runs the listener without rendering per move, follows
 *   a replaced element, and reports nothing from a sync, a replaced node or
 *   an unmount
 * @position Unit tests of packages/core/src/gestures/useGestureRecognizer.ts
 */

import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { PanGestureRecognizer } from '../PanGestureRecognizer'
import { TapGestureRecognizer } from '../TapGestureRecognizer'
import { TOUCH_ACTION_ATTRIBUTE } from '../touchActionRule'
import { useGestureRecognizer } from '../useGestureRecognizer'
import { coarsePrimaryPointer, pointerQuery } from './pointerQuery'
import { exposeTouchEvents, touch } from './touchEvents'

function byTestId(id: string): HTMLElement {
  return document.querySelector(`[data-testid="${id}"]`) as HTMLElement
}

let renders = 0

/** A horizontal pan on a div, enabled while `isEnabled` holds. */
function draggable(
  onPan: (recognizer: PanGestureRecognizer) => void,
  isEnabled: Ref<boolean> = ref(true),
  onRecognizer?: (recognizer: PanGestureRecognizer) => void,
) {
  return defineComponent({
    setup() {
      const surface = ref<HTMLElement | null>(null)
      const pan = useGestureRecognizer(
        surface,
        () => new PanGestureRecognizer({ direction: 'horizontal' }),
        onPan,
        { isEnabled },
      )
      onRecognizer?.(pan)
      return () => {
        renders += 1
        return h('div', { 'ref': surface, 'data-testid': 'surface' })
      }
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
  renders = 0
  document.body.innerHTML = ''
})
afterAll(() => {
  restoreTouchEvents()
})

describe('useGestureRecognizer', () => {
  it('drives the listener with no render per move', () => {
    const seen: string[] = []
    const wrapper = mount(draggable((recognizer) => {
      seen.push(`${recognizer.state}:${recognizer.translation().x}`)
    }), { attachTo: document.body })
    const surface = byTestId('surface')
    expect(renders).toBe(1)
    touch('touchstart', surface, { id: 1, x: 0, y: 0 }, 0)
    for (let x = 6; x <= 36; x += 6) {
      touch('touchmove', surface, { id: 1, x, y: 0 }, x * 2)
    }
    touch('touchend', surface, { id: 1, x: 36, y: 0 }, 80, true)
    // The 10 px hysteresis is left out of the translation, as in UIKit.
    expect(seen).toEqual([
      'began:2',
      'changed:8',
      'changed:14',
      'changed:20',
      'changed:26',
      'ended:26',
    ])
    expect(renders).toBe(1)
    wrapper.unmount()
  })

  it('keeps one recognizer for the component\'s life, across renders', async () => {
    const identities = new Set<PanGestureRecognizer>()
    const label = ref('a')
    const Labelled = defineComponent({
      setup() {
        const surface = ref<HTMLElement | null>(null)
        identities.add(useGestureRecognizer(surface, () => new PanGestureRecognizer({ direction: 'horizontal' })))
        return () => h('div', { 'ref': surface, 'data-testid': 'surface' }, label.value)
      },
    })
    const wrapper = mount(Labelled, { attachTo: document.body })
    label.value = 'b'
    await nextTick()
    expect(byTestId('surface').textContent).toBe('b')
    expect(identities.size).toBe(1)
    wrapper.unmount()
  })

  it('cancels a gesture in flight when it is disabled, without calling the listener from the sync', () => {
    const states: string[] = []
    // A listener of the recognizer's own, outside the composable, hears the
    // cancel.
    const heard: string[] = []
    let pan: PanGestureRecognizer | null = null
    const isEnabled = ref(true)
    const wrapper = mount(draggable(r => states.push(r.state), isEnabled, (r) => {
      pan = r
      r.addListener(current => heard.push(current.state))
    }), { attachTo: document.body })
    const surface = byTestId('surface')
    touch('touchstart', surface, { id: 3, x: 0, y: 0 }, 0)
    touch('touchmove', surface, { id: 3, x: 30, y: 0 }, 16)
    isEnabled.value = false
    // Disabling cancels the gesture; its attachment then goes (FR24), which
    // leaves the recognizer at rest. The composable reports nothing from the
    // sync.
    expect(heard).toContain('cancelled')
    expect(pan!.state).not.toBe('changed')
    expect(states).toEqual(['began'])
    touch('touchend', surface, { id: 3, x: 30, y: 0 }, 32, true)
    expect(states).toEqual(['began'])
    wrapper.unmount()
  })

  it('reports cancelled to a handler that disables the recognizer itself, from that handler', () => {
    const states: string[] = []
    let pan: PanGestureRecognizer | null = null
    const wrapper = mount(draggable(r => states.push(r.state), ref(true), (r) => {
      pan = r
    }), { attachTo: document.body })
    const surface = byTestId('surface')
    touch('touchstart', surface, { id: 6, x: 0, y: 0 }, 0)
    touch('touchmove', surface, { id: 6, x: 30, y: 0 }, 16)
    // A handler (here, the test) turns it off: UIKit's .cancelled, at once.
    pan!.setEnabled(false)
    expect(states).toEqual(['began', 'cancelled'])
    touch('touchend', surface, { id: 6, x: 30, y: 0 }, 32, true)
    wrapper.unmount()
  })

  it('attaches nothing while disabled: no touch-action, no gesture (FR24)', () => {
    const states: string[] = []
    const isEnabled = ref(true)
    const wrapper = mount(draggable(r => states.push(r.state), isEnabled), { attachTo: document.body })
    const surface = byTestId('surface')
    expect(surface.hasAttribute(TOUCH_ACTION_ATTRIBUTE)).toBe(true)
    isEnabled.value = false
    // Disabling detaches: the host takes its touch-action off the element.
    expect(surface.hasAttribute(TOUCH_ACTION_ATTRIBUTE)).toBe(false)
    touch('touchstart', surface, { id: 6, x: 0, y: 0 }, 0)
    touch('touchmove', surface, { id: 6, x: 30, y: 0 }, 16)
    touch('touchend', surface, { id: 6, x: 30, y: 0 }, 32, true)
    expect(states).toEqual([])
    isEnabled.value = true
    touch('touchstart', surface, { id: 8, x: 0, y: 0 }, 100)
    touch('touchmove', surface, { id: 8, x: 30, y: 0 }, 116)
    expect(states).toContain('began')
    touch('touchend', surface, { id: 8, x: 30, y: 0 }, 132, true)
    wrapper.unmount()
  })

  it('attaches to a node rendered after mount, and follows a node swapped behind the same ref', async () => {
    const states: string[] = []
    const as = ref<'none' | 'div' | 'span'>('none')
    const Swappable = defineComponent({
      setup() {
        const node = ref<HTMLElement | null>(null)
        useGestureRecognizer(node, () => new PanGestureRecognizer({ direction: 'horizontal' }), r => states.push(r.state))
        return () => as.value === 'none' ? null : h(as.value, { 'ref': node, 'data-testid': 'node' })
      },
    })
    const wrapper = mount(Swappable, { attachTo: document.body })
    as.value = 'div'
    await nextTick()
    const first = byTestId('node')
    touch('touchstart', first, { id: 1, x: 0, y: 0 }, 0)
    touch('touchmove', first, { id: 1, x: 30, y: 0 }, 16)
    touch('touchend', first, { id: 1, x: 30, y: 0 }, 32, true)
    expect(states).toContain('began')
    states.length = 0
    as.value = 'span'
    await nextTick()
    const second = byTestId('node')
    expect(second).not.toBe(first)
    touch('touchstart', first, { id: 2, x: 0, y: 0 }, 100)
    touch('touchmove', first, { id: 2, x: 30, y: 0 }, 116)
    touch('touchend', first, { id: 2, x: 30, y: 0 }, 132, true)
    expect(states).toEqual([])
    touch('touchstart', second, { id: 3, x: 0, y: 0 }, 200)
    touch('touchmove', second, { id: 3, x: 30, y: 0 }, 216)
    expect(states).toContain('began')
    touch('touchend', second, { id: 3, x: 30, y: 0 }, 232, true)
    wrapper.unmount()
  })

  it('ends a gesture in flight when the node is replaced, without calling the listener', async () => {
    const states: string[] = []
    const heard: string[] = []
    const key = ref('first')
    const Keyed = defineComponent({
      setup() {
        const node = ref<HTMLElement | null>(null)
        const pan = useGestureRecognizer(node, () => new PanGestureRecognizer({ direction: 'horizontal' }), r => states.push(r.state))
        pan.addListener(current => heard.push(current.state))
        return () => h('div', { 'key': key.value, 'ref': node, 'data-testid': key.value })
      },
    })
    const wrapper = mount(Keyed, { attachTo: document.body })
    const first = byTestId('first')
    touch('touchstart', first, { id: 4, x: 0, y: 0 }, 0)
    touch('touchmove', first, { id: 4, x: 30, y: 0 }, 16)
    expect(states).toEqual(['began'])
    key.value = 'second'
    await nextTick()
    expect(heard).toContain('cancelled')
    expect(states).toEqual(['began'])
    wrapper.unmount()
  })

  it('ends a gesture in flight on unmount without calling the listener, and detaches', () => {
    const states: string[] = []
    const heard: string[] = []
    const wrapper = mount(draggable(r => states.push(r.state), ref(true), (r) => {
      r.addListener(current => heard.push(current.state))
    }), { attachTo: document.body })
    const surface = byTestId('surface')
    expect(surface.hasAttribute(TOUCH_ACTION_ATTRIBUTE)).toBe(true)
    touch('touchstart', surface, { id: 5, x: 0, y: 0 }, 0)
    touch('touchmove', surface, { id: 5, x: 30, y: 0 }, 16)
    expect(states).toEqual(['began'])
    wrapper.unmount()
    expect(heard).toContain('cancelled')
    expect(states).toEqual(['began'])
    expect(surface.hasAttribute(TOUCH_ACTION_ATTRIBUTE)).toBe(false)
    touch('touchstart', surface, { id: 6, x: 0, y: 0 }, 100)
    touch('touchmove', surface, { id: 6, x: 30, y: 0 }, 116)
    expect(states).toEqual(['began'])
  })

  it('reports a recognizer that required the disabled one to fail after the sync, not inside it, in its recognized state', async () => {
    const states: string[] = []
    const onSingle = vi.fn((recognizer: TapGestureRecognizer) => {
      states.push(recognizer.state)
    })
    const isDoubleEnabled = ref(true)
    const Taps = defineComponent({
      setup() {
        const surface = ref<HTMLElement | null>(null)
        const double = useGestureRecognizer(surface, () => new TapGestureRecognizer({ numberOfTapsRequired: 2 }), undefined, { isEnabled: isDoubleEnabled })
        const single = useGestureRecognizer(surface, () => new TapGestureRecognizer(), onSingle)
        single.requireToFail(double)
        return () => h('div', { 'ref': surface, 'data-testid': 'taps' })
      },
    })
    const wrapper = mount(Taps, { attachTo: document.body })
    const surface = byTestId('taps')
    touch('touchstart', surface, { id: 1, x: 5, y: 5 }, 0)
    touch('touchend', surface, { id: 1, x: 5, y: 5 }, 40, true)
    // The single tap waits for the double tap to fail.
    expect(onSingle).not.toHaveBeenCalled()
    // Turning the double tap off fails it in the sync; the single tap
    // waiting on it recognizes in a pass just after, so its caller hears it
    // outside the sync, reading the recognized state.
    isDoubleEnabled.value = false
    expect(onSingle).not.toHaveBeenCalled()
    await Promise.resolve()
    expect(states).toEqual(['ended'])
    wrapper.unmount()
  })

  it('serves a mouse press under a fine pointer on an action group (family:action-groups FR5; spec:AST-094 FR43)', () => {
    restorePointer()
    restorePointer = pointerQuery(false).restore
    const states: string[] = []
    const Group = defineComponent({
      setup() {
        const surface = ref<HTMLElement | null>(null)
        useGestureRecognizer(surface, () => new PanGestureRecognizer({ direction: 'horizontal' }), r => states.push(r.state), { actionGroup: true })
        return () => h('div', { 'ref': surface, 'data-testid': 'group' })
      },
    })
    const wrapper = mount(Group, { attachTo: document.body })
    const group = byTestId('group')
    const mouse = (type: string, x: number, time: number) => {
      const event = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        composed: true,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        clientX: x,
        clientY: 5,
        button: 0,
        buttons: type === 'pointerup' ? 0 : 1,
      })
      Object.defineProperty(event, 'timeStamp', { value: time })
      group.dispatchEvent(event)
    }
    mouse('pointerdown', 0, 0)
    mouse('pointermove', 30, 16)
    mouse('pointermove', 40, 32)
    mouse('pointerup', 40, 48)
    expect(states).toContain('began')
    expect(states).toContain('ended')
    wrapper.unmount()
  })
})
