import type { CalendarEvent } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { createEventFromISO } from './CalendarEvent.js'
import { createScheduleMonthlyView } from './monthlyView.js'
import Schedule from './Schedule.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

const MAY_AFTERNOON = Date.UTC(2026, 4, 13, 15, 30)

function event(id: string, day: string): CalendarEvent {
  return createEventFromISO({ id, title: id, start: `${day}T16:00:00.000Z`, end: `${day}T16:30:00.000Z` })
}

function renderMonth(events: CalendarEvent[]) {
  return mount(Schedule, {
    attachTo: document.body,
    props: {
      view: createScheduleMonthlyView({ renderPopover: item => h('p', `${item.title} details`) }),
      events,
      date: MAY_AFTERNOON,
      timezoneID: 'UTC',
    },
  })
}

/** 像浏览器那样按下一个按钮：先 pointerdown，再 click。 */
async function press(button: HTMLElement): Promise<void> {
  button.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
  button.click()
  await nextTick()
  await nextTick()
}

function moreButtons(): HTMLButtonElement[] {
  return [...document.querySelectorAll<HTMLButtonElement>('.astryx-schedule__more')]
}

function openDialog(): HTMLElement | null {
  return [...document.querySelectorAll<HTMLElement>('.astryx-popover')]
    .find(element => element.style.display !== 'none') ?? null
}

const busyWednesday = ['Alpha', 'Bravo', 'Charlie', 'Delta'].map(id => event(id, '2026-05-13'))
const busyFriday = ['Echo', 'Foxtrot', 'Golf', 'Hotel'].map(id => event(id, '2026-05-15'))

describe('schedule month popover presses', () => {
  it('opens another day’s list with one press while a list is open', async () => {
    renderMonth([...busyWednesday, ...busyFriday])
    await nextTick()
    const [wednesday, friday] = moreButtons()
    await press(wednesday!)
    expect(wednesday!.getAttribute('aria-expanded')).toBe('true')
    await press(friday!)
    expect(wednesday!.getAttribute('aria-expanded')).toBe('false')
    expect(friday!.getAttribute('aria-expanded')).toBe('true')
    expect(openDialog()?.textContent).toContain('Echo')
  })

  it('shows the day’s list again when its "+N more" is pressed while a handed event is open', async () => {
    renderMonth(busyWednesday)
    await nextTick()
    const [more] = moreButtons()
    await press(more!)
    const bravo = openDialog()!.querySelector<HTMLButtonElement>('[aria-label^="Bravo"]')!
    bravo.click()
    await nextTick()
    expect(openDialog()?.textContent).toContain('Bravo details')
    expect(more!.getAttribute('aria-expanded')).toBe('true')

    await press(more!)
    expect(more!.getAttribute('aria-expanded')).toBe('true')
    expect(openDialog()?.textContent).not.toContain('Bravo details')
    expect(openDialog()?.textContent).toContain('Delta')
  })

  it('closes when the open "+N more" is pressed again', async () => {
    renderMonth(busyWednesday)
    await nextTick()
    const [more] = moreButtons()
    await press(more!)
    await press(more!)
    expect(more!.getAttribute('aria-expanded')).toBe('false')
  })
})
