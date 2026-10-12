import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { formatInstant } from './formatInstant.js'
import { formatRelativeTime } from './formatRelativeTime.js'
import Timestamp from './Timestamp.vue'
import { formatTooltipLines } from './tooltipEntries.js'

const DATE = new Date('2026-02-19T17:00:00Z')

describe('timestamp formatting', () => {
  it('formats absolute instants in a named zone', () => {
    expect(formatInstant(DATE, 'system_date_time', 'en', { timeZone: 'UTC' })).toBe('2026-02-19 17:00:00')
    expect(formatInstant(DATE, 'unix_seconds', 'en')).toBe('1771520400')
    expect(formatInstant(DATE, 'date', 'en', { timeZone: 'UTC' })).toContain('2026')
  })

  it('treats a few seconds ago as now and one day ago as yesterday', () => {
    const now = new Date('2026-02-19T17:00:00Z')
    expect(formatRelativeTime(new Date(now.getTime() - 5_000), now, 'en', 'long')).toBe('now')
    expect(formatRelativeTime(new Date(now.getTime() - 86_400_000), now, 'en', 'long')).toBe('yesterday')
  })

  it('marks a named tooltip zone and leaves an unknown zone on the viewer clock', () => {
    const lines = formatTooltipLines(DATE, [
      { format: 'system_date_time', label: 'UTC', timezoneID: 'UTC' },
      { format: 'system_date_time', label: 'Broken', timezoneID: 'Not/AZone' },
    ], 'en')
    expect(lines[0]?.value).toBe('2026-02-19 17:00:00')
    expect(lines[1]?.value).toMatch(/^\d{4}-\d{2}-\d{2} /)
    expect(lines.every(line => line.isCopyable === false)).toBe(true)
  })
})

describe('timestamp', () => {
  it('renders a time element and nothing for an invalid value', () => {
    const wrapper = mount(Timestamp, {
      props: { value: '2026-02-19T17:00:00Z', format: 'unix_seconds', hasTooltip: false },
    })
    expect(wrapper.get('time').attributes('datetime')).toBe('2026-02-19T17:00:00.000Z')
    expect(wrapper.text()).toBe('1771520400')

    const invalid = mount(Timestamp, { props: { value: 'not-a-date' } })
    expect(invalid.find('time').exists()).toBe(false)
  })

  it('uses a relative phrase inside the auto window', () => {
    const now = Math.floor(Date.now() / 1000)
    const wrapper = mount(Timestamp, {
      props: { value: now - 120, format: 'relative', hasTooltip: false, color: 'primary' },
    })
    expect(wrapper.get('time').attributes('aria-label')).toBeTruthy()
    expect(wrapper.text().toLowerCase()).toContain('minute')
  })
})
