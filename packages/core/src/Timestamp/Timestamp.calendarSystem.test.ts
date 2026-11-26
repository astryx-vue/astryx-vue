import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import { formatDateAbsoluteCompact, formatFilterValue } from '../PowerSearch/format.js'
import { formatInstant } from './formatInstant.js'
import Timestamp from './Timestamp.vue'

const DATE = new Date('2026-10-30T12:00:00Z')

describe('timestamp 和 PowerSearch 按历法写日期', () => {
  it('带日期的格式按历法写，system_* 和 unix_seconds 不变', () => {
    expect(formatInstant(DATE, 'date_long', 'en', { timeZone: 'UTC', calendar: 'persian' })).toBe('Aban 8, 1405 AP')
    expect(formatInstant(DATE, 'date_long', 'en', { timeZone: 'UTC' })).toBe('October 30, 2026')
    expect(formatInstant(DATE, 'system_date', 'en', { timeZone: 'UTC', calendar: 'persian' })).toBe('2026-10-30')
    expect(formatInstant(DATE, 'unix_seconds', 'en', { calendar: 'persian' })).toBe(String(DATE.getTime() / 1000))
  })

  it('timestamp 跟着 provider 的历法', () => {
    const wrapper = mount(InternationalizationProvider, {
      props: { locale: 'en', calendar: 'persian' },
      slots: { default: () => h(Timestamp, { value: DATE.toISOString(), format: 'date_long', timezoneID: 'UTC' }) },
    })
    expect(wrapper.text()).toContain('Aban 8, 1405 AP')
  })

  it('powerSearch 的绝对日期值按历法写', () => {
    const seconds = DATE.getTime() / 1000
    expect(formatDateAbsoluteCompact(seconds, 'en', 'UTC', 'persian')).toBe('Aban 8, 1405 AP')
    expect(formatFilterValue(
      { type: 'date_absolute', isDateOnly: true },
      { type: 'date_absolute', unixSeconds: seconds },
      40,
      powerSearchMessages.en,
      'en',
      'UTC',
      'persian',
    )).toBe('Aban 8, 1405 AP')
  })
})
