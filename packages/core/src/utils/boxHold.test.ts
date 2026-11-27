/**
 * @file boxHold.test.ts
 * @input vitest (happy-dom), CheckboxInput and Radio with the shared press
 *   controller, finger pointer events and fake timers
 * @output A finger held on a control's box: the row refuses a text
 *   selection, a still long press activates the control when the browser
 *   sends no click, and travel, a cancelled lift, a cancelled contextmenu, a
 *   second finger or a long press that acted activates nothing
 * @position Unit tests of utils/boxHold.ts through
 *   composables/internal/pressFeedback.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import CheckboxInput from '../CheckboxInput/CheckboxInput.vue'
import { PRESS_BOX_ATTRIBUTE } from '../composables/internal/pressBox'
import { useLongPress } from '../composables/useLongPress'
import { LONG_PRESS_DURATION_MS } from '../motion/uikit/longPress'
import Radio from '../Radio/Radio.vue'
import { BROWSER_CLICK_WAIT_MS } from './browserClickWait'

enableAutoUnmount(afterEach)
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] })
})
afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

let pointerId = 10

function finger(type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel', target: Element, id: number, x = 10, y = 10): PointerEvent {
  const event = new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch', clientX: x, clientY: y, isPrimary: true })
  target.dispatchEvent(event)
  return event
}

/** A finger held on `target` for `ms`, then lifted where it landed unless it travels. */
function hold(target: Element, ms: number, { travel = 0 } = {}): number {
  const id = ++pointerId
  finger('pointerdown', target, id)
  vi.advanceTimersByTime(ms)
  if (travel > 0)
    finger('pointermove', target, id, 10 + travel, 10)
  return id
}

function lift(target: Element, id: number, x = 10): void {
  finger('pointerup', target, id, x, 10)
}

async function renderCheckbox(props: Record<string, unknown> = {}): Promise<VueWrapper> {
  const wrapper: VueWrapper = mount(CheckboxInput, {
    attachTo: document.body,
    props: { 'modelValue': false, 'label': 'Subscribe', 'onUpdate:modelValue': (value: unknown) => { void wrapper.setProps({ modelValue: value }) }, ...props },
  })
  await nextTick()
  return wrapper
}

const boxOf = (wrapper: VueWrapper): Element => wrapper.get(`[${PRESS_BOX_ATTRIBUTE}]`).element
const toggles = (wrapper: VueWrapper): unknown[] => (wrapper.emitted('update:modelValue') ?? []).map(([value]) => value)

/** 浏览器自己发的点击：可信，带一次点按的 detail。 */
function browserClick(target: Element): void {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })
  Object.defineProperty(event, 'isTrusted', { value: true })
  target.dispatchEvent(event)
}

/** 测试环境按 iOS WebKit 算，选区锁写在行内样式上。 */
const refusesSelection = (element: Element): boolean => (element as HTMLElement).style.getPropertyValue('user-select') === 'none'

/** 对照：一次停着的长按，浏览器没发点击，控件自己被激活。 */
function stillLongPressWithoutClick(box: Element): void {
  lift(box, hold(box, LONG_PRESS_DURATION_MS + 50))
  vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
}

describe('box hold', () => {
  it('marks the box of an enabled checkbox only', async () => {
    expect((await renderCheckbox()).find(`.astryx-checkbox-control[${PRESS_BOX_ATTRIBUTE}]`).exists()).toBe(true)
    expect((await renderCheckbox({ isDisabled: true })).find(`[${PRESS_BOX_ATTRIBUTE}]`).exists()).toBe(false)
  })

  it('a finger held on the box refuses a text selection in its row until it lifts', async () => {
    const wrapper = await renderCheckbox()
    const row = wrapper.get('.astryx-checkbox-row').element
    const id = hold(boxOf(wrapper), 100)
    expect([refusesSelection(row), refusesSelection(boxOf(wrapper))]).toEqual([true, true])
    lift(boxOf(wrapper), id)
    expect([refusesSelection(row), refusesSelection(boxOf(wrapper))]).toEqual([false, false])
  })

  it('off iOS the held row cancels selectstart instead', async () => {
    vi.spyOn(Object.getPrototypeOf(CSS) as typeof CSS, 'supports').mockReturnValue(false)
    const wrapper = await renderCheckbox()
    const row = wrapper.get('.astryx-checkbox-row').element
    const selectStart = (): boolean => {
      const event = new Event('selectstart', { bubbles: true, cancelable: true })
      row.dispatchEvent(event)
      return event.defaultPrevented
    }
    const id = hold(boxOf(wrapper), 100)
    expect([selectStart(), refusesSelection(row)]).toEqual([true, false])
    lift(boxOf(wrapper), id)
    expect(selectStart()).toBe(false)
    vi.restoreAllMocks()
  })

  it('a still long press checks the box when the browser sends no click', async () => {
    const wrapper = await renderCheckbox()
    const id = hold(boxOf(wrapper), LONG_PRESS_DURATION_MS + 50)
    lift(boxOf(wrapper), id)
    expect(toggles(wrapper)).toEqual([])
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(toggles(wrapper)).toEqual([true])
  })

  it('the browser\'s own click after the hold is the only activation', async () => {
    const wrapper = await renderCheckbox()
    const id = hold(boxOf(wrapper), LONG_PRESS_DURATION_MS + 50)
    lift(boxOf(wrapper), id)
    browserClick(wrapper.get('input').element)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(toggles(wrapper)).toEqual([true])
    stillLongPressWithoutClick(boxOf(wrapper))
    expect(toggles(wrapper)).toEqual([true, false])
  })

  it('a tap keeps its native click: nothing clicks in its stead', async () => {
    const wrapper = await renderCheckbox()
    const id = hold(boxOf(wrapper), 80)
    lift(boxOf(wrapper), id)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(toggles(wrapper)).toEqual([])
    stillLongPressWithoutClick(boxOf(wrapper))
    expect(toggles(wrapper)).toEqual([true])
  })

  it('travel, a cancel or a second finger activates nothing', async () => {
    const wrapper = await renderCheckbox()
    const box = boxOf(wrapper)
    const travelled = hold(box, LONG_PRESS_DURATION_MS + 50, { travel: 80 })
    lift(box, travelled, 90)
    const cancelled = hold(box, LONG_PRESS_DURATION_MS + 50)
    finger('pointercancel', box, cancelled)
    const first = hold(box, LONG_PRESS_DURATION_MS + 50)
    finger('pointerdown', box, ++pointerId)
    lift(box, first)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(toggles(wrapper)).toEqual([])
    stillLongPressWithoutClick(box)
    expect(toggles(wrapper)).toEqual([true])
  })

  it('a lift whose touchend a handler cancelled, or whose contextmenu opened a menu, activates nothing', async () => {
    const wrapper = await renderCheckbox()
    const box = boxOf(wrapper)
    const id = hold(box, LONG_PRESS_DURATION_MS + 50)
    lift(box, id)
    const touchEnd = new Event('touchend', { bubbles: true, cancelable: true })
    touchEnd.preventDefault()
    box.dispatchEvent(touchEnd)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    const menuHold = hold(box, 100)
    const menu = new Event('contextmenu', { bubbles: true, cancelable: true })
    menu.preventDefault()
    box.dispatchEvent(menu)
    vi.advanceTimersByTime(LONG_PRESS_DURATION_MS)
    lift(box, menuHold)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(toggles(wrapper)).toEqual([])
    stillLongPressWithoutClick(box)
    expect(toggles(wrapper)).toEqual([true])
  })

  it('a hold whose long press acted gets no click at all', async () => {
    const wrapper = await renderCheckbox()
    const box = boxOf(wrapper)
    // 行上的长按（比如右键菜单）在手指按着时起了作用。
    const longPress = useLongPress({ onLongPress: () => {} })
    longPress.start({ x: 10, y: 10 })
    const id = hold(box, LONG_PRESS_DURATION_MS + 50)
    lift(box, id)
    // The browser's late click is swallowed by the guard.
    browserClick(wrapper.get('input').element)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(toggles(wrapper)).toEqual([])
  })

  it('a still long press on a radio\'s circle picks the option', async () => {
    const wrapper = mount(Radio, { attachTo: document.body, props: { value: 'a', label: 'Option A' } })
    await nextTick()
    const circle = wrapper.get(`.astryx-radio-indicator[${PRESS_BOX_ATTRIBUTE}]`).element
    const input = wrapper.get<HTMLInputElement>('input').element
    const id = hold(circle, LONG_PRESS_DURATION_MS + 50)
    lift(circle, id)
    expect(input.checked).toBe(false)
    vi.advanceTimersByTime(BROWSER_CLICK_WAIT_MS + 1)
    expect(input.checked).toBe(true)
  })
})
