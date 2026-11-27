/**
 * @file Switch.pointer.test.ts
 * @input vitest (happy-dom), Switch.vue under a fine primary pointer, mouse
 *   Pointer Events
 * @output Switch's gestures for a mouse: a drag that flips commits, and a
 *   press released outside leaves the switch alone
 * @position Testing; Switch.vue wired to useSwitchTouch.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Switch from './Switch.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

let clock = 10_000

function renderSwitch(): { wrapper: VueWrapper<InstanceType<typeof Switch>>, control: HTMLElement } {
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
  return { wrapper, control }
}

/** One mouse event, then the microtask the browser runs before the next. */
async function mouse(type: string, target: EventTarget, x: number, y = 12): Promise<void> {
  clock += 16
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    pointerId: 1,
    pointerType: 'mouse',
    clientX: x,
    clientY: y,
    buttons: type === 'pointerup' ? 0 : 1,
  })
  Object.defineProperty(event, 'timeStamp', { value: clock })
  target.dispatchEvent(event)
  await Promise.resolve()
}

describe('switch under a mouse', () => {
  it('commits a drag that flipped, and leaves the switch alone when the press is released outside', async () => {
    const { wrapper, control } = renderSwitch()
    await nextTick()
    await mouse('pointerdown', control, 6)
    for (const x of [12, 18, 24, 30, 36])
      await mouse('pointermove', control, x)
    await mouse('pointermove', document.body, 36, 300)
    await mouse('pointerup', document.body, 36, 300)
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 350))
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await mouse('pointerdown', control, 6)
    for (const x of [12, 18, 24, 30, 36])
      await mouse('pointermove', control, x)
    await mouse('pointerup', control, 36)
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })
})
