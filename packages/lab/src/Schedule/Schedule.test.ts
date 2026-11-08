import type { ScheduleViewSelectorOption } from './plugins.js'
import type { CalendarEvent, ScheduleView } from './types.js'
import { plainDateToISO } from '@astryx-vue/core'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { createEventFromISO } from './CalendarEvent.js'
import { sortEvents } from './dateMath.js'
import { createScheduleDayView } from './dayView.js'
import { formatDayNumber } from './format.js'
import { createScheduleListView } from './listView.js'
import { createScheduleMonthlyView } from './monthlyView.js'
import { useSchedulePaginationPlugin, useScheduleViewSelectorPlugin } from './plugins.js'
import Schedule from './Schedule.vue'
import { createScheduleWeeklyView } from './weeklyView.js'
import { createZonedDateTime } from './zonedDateTime.js'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
})

const MAY_AFTERNOON = Date.UTC(2026, 4, 13, 15, 30)

function event(id: string, start: string, end: string, category?: string): CalendarEvent {
  return createEventFromISO({ id, title: id, category, start, end })
}

function renderSchedule(options: {
  view?: ScheduleView
  events?: CalendarEvent[] | ((start: number, end: number) => Promise<ReadonlyArray<CalendarEvent>>)
  date?: number
  plugins?: ScheduleView['options'] extends never ? never : unknown
  onChangeDate?: (date: number) => void
} = {}) {
  return mount(Schedule, {
    attachTo: document.body,
    props: {
      view: options.view ?? createScheduleMonthlyView(),
      events: options.events ?? [],
      date: options.date ?? MAY_AFTERNOON,
      timezoneID: 'UTC',
      onChangeDate: options.onChangeDate,
      plugins: options.plugins as never,
    },
  })
}

describe('createEventFromISO', () => {
  it('creates an all-day event from date-only strings and an instant from a time', () => {
    const day = createEventFromISO({ id: 'offsite', title: 'Offsite', start: '2026-05-11', end: '2026-05-13' })
    const timed = createEventFromISO({
      id: 'sync',
      title: 'Sync',
      start: '2026-05-13T16:00:00.000Z',
      end: '2026-05-13T16:30:00.000Z',
    })
    expect(day.start).toEqual({ year: 2026, month: 5, day: 11 })
    expect(day.end).toEqual({ year: 2026, month: 5, day: 13 })
    expect(timed.start).toBe(Date.parse('2026-05-13T16:00:00.000Z'))
    expect(timed.end).toBe(Date.parse('2026-05-13T16:30:00.000Z'))
  })

  it('keeps the day numeral and drops a locale day suffix', () => {
    const day = { year: 2026, month: 11, day: 1 }
    expect(formatDayNumber(day, 'zh-CN')).toBe('1')
    expect(formatDayNumber(day, 'en')).toBe('1')
  })
})

describe('schedule views', () => {
  it('builds month, week, day, and list ranges from the anchor date', () => {
    const zoned = createZonedDateTime(MAY_AFTERNOON, 'UTC')
    const month = createScheduleMonthlyView().getDateRange(zoned)
    const week = createScheduleWeeklyView({ weekStartsOn: 0 }).getDateRange(zoned)
    const day = createScheduleDayView().getDateRange(zoned)
    const list = createScheduleListView({ days: 7 }).getDateRange(zoned)
    expect(plainDateToISO(month[0].toPlainDate())).toBe('2026-04-26')
    expect(plainDateToISO(month[1].toPlainDate())).toBe('2026-06-07')
    expect(plainDateToISO(week[0].toPlainDate())).toBe('2026-05-10')
    expect(plainDateToISO(week[1].toPlainDate())).toBe('2026-05-17')
    expect(plainDateToISO(day[0].toPlainDate())).toBe('2026-05-13')
    expect(plainDateToISO(day[1].toPlainDate())).toBe('2026-05-14')
    expect(plainDateToISO(list[0].toPlainDate())).toBe('2026-05-13')
    expect(plainDateToISO(list[1].toPlainDate())).toBe('2026-05-20')
    expect(createScheduleMonthlyView().getPreviousDateRange(zoned).label).toBe('Previous month')
    expect(createScheduleWeeklyView().getNextDateRange(zoned).label).toBe('Next week')
  })

  it('filters array events to the active range and sorts by start', () => {
    const events = [
      event('later', '2026-05-13T18:00:00.000Z', '2026-05-13T19:00:00.000Z'),
      event('old', '2026-01-02T12:00:00.000Z', '2026-01-02T13:00:00.000Z'),
      event('offsite', '2026-05-11', '2026-05-13'),
    ]
    renderSchedule({ events, view: createScheduleDayView() })
    expect(document.body.textContent).toContain('later')
    expect(document.body.textContent).toContain('offsite')
    expect(document.body.textContent).not.toContain('old')
    expect(sortEvents(events, 'UTC').map(item => item.id)).toEqual(['old', 'offsite', 'later'])
  })

  it('asks an async loader for the visible range and shows nothing until it resolves', async () => {
    const view = createScheduleWeeklyView()
    const zoned = createZonedDateTime(MAY_AFTERNOON, 'UTC')
    const [start, end] = view.getDateRange(zoned)
    let resolveLoad: (events: CalendarEvent[]) => void = () => {}
    const seen: Array<[number, number]> = []
    renderSchedule({
      view,
      events: (rangeStart, rangeEnd) => {
        seen.push([rangeStart, rangeEnd])
        return new Promise((resolve) => {
          resolveLoad = resolve
        })
      },
    })
    await nextTick()
    expect(seen).toEqual([[start.instant, end.instant]])
    expect(document.body.textContent).not.toContain('Standup')
    resolveLoad([event('Standup', '2026-05-13T16:00:00.000Z', '2026-05-13T16:30:00.000Z')])
    await flushPromises()
    expect(document.body.textContent).toContain('Standup')
  })

  it('pages with onChangeDate, keeping the time of day, and Today uses now', async () => {
    const view = createScheduleMonthlyView()
    const zoned = createZonedDateTime(MAY_AFTERNOON, 'UTC')
    const current = view.getDateRange(zoned)
    const previous = view.getPreviousDateRange(zoned)
    const expected = MAY_AFTERNOON + previous.range[0].instant - current[0].instant
    const dates: number[] = []
    renderSchedule({ view, onChangeDate: date => dates.push(date) })
    document.querySelector<HTMLButtonElement>('[aria-label="Previous month"]')?.click()
    await nextTick()
    expect(dates).toEqual([expected])
    expect(new Date(expected).getUTCHours()).toBe(15)
    expect(new Date(expected).getUTCMinutes()).toBe(30)
    const now = Date.UTC(2026, 10, 7, 9, 0)
    vi.spyOn(Date, 'now').mockReturnValue(now)
    const today = [...document.querySelectorAll('button')].find(button => button.textContent?.trim() === 'Today')
    today?.click()
    await nextTick()
    expect(dates.at(-1)).toBe(now)
  })

  it('switches the painted view and reports the selected view', async () => {
    const month = createScheduleMonthlyView()
    const list = createScheduleListView()
    const picked: string[] = []
    const wrapper = renderSchedule({
      view: month,
      plugins: [
        useSchedulePaginationPlugin(),
        useScheduleViewSelectorPlugin([
          { view: month, label: 'Month' },
          { view: list, label: 'List' },
        ] as ScheduleViewSelectorOption[], {
          onChangeView: (view) => {
            picked.push(view === list ? 'list' : 'month')
            void wrapper.setProps({ view: view as ScheduleView })
          },
        }),
      ],
    })
    expect(document.querySelector('[role="table"]')).not.toBeNull()
    const menuButton = [...document.querySelectorAll('button')].find(button => button.textContent?.includes('Month'))
    menuButton?.click()
    await nextTick()
    const listItem = [...document.querySelectorAll('[role="menuitem"], [role="option"], button')].find(item => item.textContent?.trim() === 'List')
    listItem?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(picked).toContain('list')
    expect(document.querySelector('.astryx-schedule__list')).not.toBeNull()
    wrapper.unmount()
  })

  it('scrolls the month table from the keyboard and opens an event popover', async () => {
    const view = createScheduleMonthlyView({
      renderPopover: () => h('p', 'Event details'),
    })
    renderSchedule({
      view,
      events: [event('Standup', '2026-05-13T16:00:00.000Z', '2026-05-13T17:00:00.000Z', 'Work')],
      plugins: [],
    })
    const table = document.querySelector<HTMLElement>('[role="table"]')
    expect(table?.getAttribute('tabindex')).toBe('0')
    table?.focus()
    table?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    expect(table?.scrollLeft).toBe(48)
    const chip = document.querySelector<HTMLButtonElement>('[data-schedule-month-chip]')
    expect(chip?.getAttribute('aria-haspopup')).toBe('dialog')
    chip?.click()
    await nextTick()
    expect(document.body.textContent).toContain('Event details')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
  })
})
