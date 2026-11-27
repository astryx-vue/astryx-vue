/**
 * @file TouchTimeWheels.meridiem.test.ts
 * @input The touch time sheet's wheels under a coarse pointer, driven by the hour column's keys
 * @output Holds the AM/PM column to UIDatePicker: it follows the hour and flips only when the
 *   hour's move passes between 11 and 12, and the hour rows stand for the time a turn onto them makes
 * @position Unit tests of TouchTimeWheels.vue and timeWheelRules.ts
 */

import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, onTestFinished } from 'vitest'
import { nextTick } from 'vue'
import PickerWheel from '../DateInput/PickerWheel.vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents } from '../gestures/__tests__/touchEvents'
import { fakeAnimate } from '../motion/__tests__/fakeWebAnimation'
import { hourAfterTurn } from './timeWheelRules.js'
import TouchTimeWheels from './TouchTimeWheels.vue'

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

function stubAnimations(): void {
  Object.defineProperty(HTMLElement.prototype, 'animate', { configurable: true, value: fakeAnimate().animate })
  onTestFinished(() => {
    delete (HTMLElement.prototype as { animate?: unknown }).animate
  })
}

/** The hour wheel comes to rest on `row`; returns the times the sheet then commits. */
async function turnHour(modelValue: string, row: string, props: Record<string, unknown> = {}): Promise<string[]> {
  stubAnimations()
  const wrapper = mount(TouchTimeWheels, { attachTo: document.body, props: { modelValue, hourFormat: '12h', ...props } })
  await nextTick()
  wrapper.findAllComponents(PickerWheel)[0]!.vm.$emit('update:modelValue', row)
  return wrapper.emitted<string[]>('update:modelValue')?.map(([value]) => value) ?? []
}

describe('hourAfterTurn', () => {
  it('flips the half of the day only across 11 and 12', () => {
    expect(hourAfterTurn(11, 12)).toBe(12)
    expect(hourAfterTurn(23, 12)).toBe(0)
    expect(hourAfterTurn(12, 1)).toBe(13)
    expect(hourAfterTurn(13, 9)).toBe(21)
    expect(hourAfterTurn(12, 9)).toBe(9)
    expect(hourAfterTurn(0, 1)).toBe(1)
    expect(hourAfterTurn(14, 12)).toBe(12)
    expect(hourAfterTurn(14, 14 % 12)).toBe(14)
  })
})

describe('touchTimeWheels 12-hour AM/PM follows the hour', () => {
  it('turns 11 AM to 12 PM', async () => {
    expect(await turnHour('11:30', '12')).toEqual(['12:30'])
  })

  it('keeps PM when 12 PM turns to 1', async () => {
    expect(await turnHour('12:30', '1')).toEqual(['13:30'])
  })

  it('keeps 24-hour hours as they are', async () => {
    expect(await turnHour('11:30', '12', { hourFormat: '24h' })).toEqual(['12:30'])
  })

  it('turns 1 PM to 9 PM and 12 PM to 9 AM', async () => {
    expect(await turnHour('13:30', '9')).toEqual(['21:30'])
    expect(await turnHour('12:30', '9')).toEqual(['09:30'])
  })

  it('disables an hour row by the time a turn onto it makes', async () => {
    // From 11:30 the row 12 stands for 12:30, which the max excludes; row 11 stands for itself.
    stubAnimations()
    const wrapper = mount(TouchTimeWheels, { attachTo: document.body, props: { modelValue: '11:30', hourFormat: '12h', max: '11:59' } })
    await nextTick()
    const rows = wrapper.findAll('[role="listbox"]')[0]!.findAll('[data-disabled]')
    expect(rows.map(row => row.text())).toContain('12')
  })
})
