/**
 * @file Switch.touch.test.ts
 * @input vitest (happy-dom), Switch.vue under a coarse primary pointer, Touch
 *   Events from the gesture test helpers
 * @output Switch's touch presentation as a finger meets it: the thumb lifts
 *   and its shadow fades in at the press, a drag that flips commits once, and
 *   a held finger the browser sends no click for still toggles
 * @position Testing; Switch.vue wired to useSwitchTouch.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import type * as AnimatorModule from '../motion/animator'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents, touch } from '../gestures/__tests__/touchEvents'
import { BROWSER_CLICK_WAIT_MS } from '../utils/browserClickWait'
import Switch from './Switch.vue'

interface Call {
  readonly name: string
  readonly args: unknown[]
}

/** What each animator was asked, by element and pseudo-element. */
const animators: { element: Element, pseudoElement: string | undefined, calls: Call[] }[] = []

vi.mock('../motion/animator', async (importOriginal) => {
  const actual = await importOriginal<typeof AnimatorModule>()
  return {
    ...actual,
    createMotionEngine: (element: Element, options: { pseudoElement?: string } = {}) => {
      const fake = { element, pseudoElement: options.pseudoElement, calls: [] as Call[] }
      animators.push(fake)
      const record = (name: string) => (...args: unknown[]) => {
        fake.calls.push({ name, args })
        return { finished: Promise.resolve(), started: new Promise<number>(() => {}) }
      }
      return {
        element,
        get: () => 0,
        getVelocity: () => 0,
        set: record('set'),
        animate: record('animate'),
        play: record('play'),
        rebase: record('rebase'),
        decay: record('decay'),
        stop: record('stop'),
        atRest: async () => new Promise<void>(() => {}),
        reducedMotion: () => 'off',
        dispose: () => {},
      }
    },
  }
})

function callsOf(element: Element, pseudoElement?: string): Call[] {
  return animators.find(animator => animator.element === element && animator.pseudoElement === pseudoElement)?.calls ?? []
}

// A phone: the gesture host reads fingers from Touch Events and the switch
// takes its touch presentation. Set before any switch mounts, since the host
// outlives a test.
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
afterEach(() => {
  animators.length = 0
  document.body.innerHTML = ''
})

let clock = 10_000

function renderSwitch(): { wrapper: VueWrapper<InstanceType<typeof Switch>>, control: HTMLElement, input: HTMLInputElement, thumb: HTMLElement } {
  const wrapper: VueWrapper<InstanceType<typeof Switch>> = mount(Switch, {
    attachTo: document.body,
    props: {
      'label': 'Notify',
      'modelValue': false,
      'onUpdate:modelValue': (value) => { void wrapper.setProps({ modelValue: value }) },
    },
  })
  const control = wrapper.get<HTMLElement>('.astryx-switch-control').element
  // The control's box as a browser lays out the md switch.
  control.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 0, width: 40, height: 24 })
  return {
    wrapper,
    control,
    input: wrapper.get<HTMLInputElement>('input[type="checkbox"]').element,
    thumb: wrapper.get<HTMLElement>('.astryx-switch-thumb').element,
  }
}

/** One finger event, then the microtask the browser runs before the next. */
async function finger(type: string, target: Element, x: number): Promise<void> {
  clock += 16
  touch(type, target, { id: 1, x, y: 12 }, clock, type === 'touchend')
  await Promise.resolve()
}

const wait = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

describe('switch under a finger', () => {
  it('rests its colour layer and shadow from the stylesheet, promoting nothing', async () => {
    const { wrapper, thumb } = renderSwitch()
    await nextTick()
    const track = wrapper.get('.astryx-switch-track').element
    for (const calls of [callsOf(track, '::after'), callsOf(thumb, '::after')])
      expect(calls[0]).toEqual({ name: 'set', args: [{ opacity: 0 }, { promote: false }] })
  })

  it('lifts the thumb at the press and fades its shadow in', async () => {
    const { control, thumb } = renderSwitch()
    await nextTick()
    await finger('touchstart', control, 8)
    await finger('touchmove', control, 8 + 12)
    // The thumb grows past its box on both axes.
    const lift = callsOf(thumb).find(call => call.name === 'animate' && 'scaleX' in (call.args[0] as object))
    const scale = lift?.args[0] as { scaleX: number, scaleY: number }
    expect(scale.scaleX).toBeGreaterThan(1)
    expect(scale.scaleY).toBeGreaterThan(1)
    expect(callsOf(thumb, '::after').find(call => call.name === 'animate')?.args[0]).toEqual({ opacity: 1 })
    await finger('touchcancel', control, 20)
  })

  it('commits a drag that flipped once, swallowing the browser\'s late click', async () => {
    const { wrapper, control, input } = renderSwitch()
    await nextTick()
    await finger('touchstart', control, 6)
    for (const x of [12, 18, 24, 30, 36])
      await finger('touchmove', control, x)
    await finger('touchend', control, 36)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    // The browser's click of the same lift arrives late.
    input.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    expect(input.checked).toBe(true)
  })

  it('toggles a held finger the browser sends no click for, once the click window passes', async () => {
    const { wrapper, control } = renderSwitch()
    await nextTick()
    await finger('touchstart', control, 10)
    await finger('touchend', control, 10)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    await wait(BROWSER_CLICK_WAIT_MS + 50)
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })
})
