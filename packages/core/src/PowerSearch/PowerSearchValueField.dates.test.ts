import type { FilterValue, OperatorValue } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DateInput from '../DateInput/DateInput.vue'
import DateRangeInput from '../DateRangeInput/DateRangeInput.vue'
import DateTimeInput from '../DateTimeInput/DateTimeInput.vue'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import PowerSearchValueField from './PowerSearchValueField.vue'

// 2026-03-09T15:00:00Z，也就是东京的 3 月 10 日零点。
const tokyoMidnight = Date.UTC(2026, 2, 9, 15) / 1000

function mountField(operatorValue: OperatorValue, filterValue: FilterValue | undefined, timeZone?: string) {
  return mount(PowerSearchValueField, {
    props: { operatorValue, filterValue, messages: powerSearchMessages.en, timeZone },
  })
}

describe('power search value field dates', () => {
  it('edits a calendar day as a date picker, reading and writing it in the zone', () => {
    const wrapper = mountField({ type: 'date_absolute' }, { type: 'date_absolute', unixSeconds: tokyoMidnight }, 'Asia/Tokyo')
    const picker = wrapper.getComponent(DateInput)
    expect(wrapper.findComponent(DateTimeInput).exists()).toBe(false)
    const shown = picker.props('modelValue') as Date
    expect([shown.getFullYear(), shown.getMonth(), shown.getDate()]).toEqual([2026, 2, 10])

    picker.vm.$emit('update:modelValue', new Date(2026, 2, 12))
    expect(wrapper.emitted('change')?.at(-1)).toEqual([{ type: 'date_absolute', unixSeconds: Date.UTC(2026, 2, 11, 15) / 1000 }])
  })

  it('reads and writes the UTC day when no zone is given', () => {
    const wrapper = mountField({ type: 'date_absolute' }, { type: 'date_absolute', unixSeconds: Date.UTC(2026, 2, 9) / 1000 })
    const shown = wrapper.getComponent(DateInput).props('modelValue') as Date
    expect([shown.getFullYear(), shown.getMonth(), shown.getDate()]).toEqual([2026, 2, 9])
    wrapper.getComponent(DateInput).vm.$emit('update:modelValue', new Date(2026, 2, 12))
    expect(wrapper.emitted('change')?.at(-1)).toEqual([{ type: 'date_absolute', unixSeconds: Date.UTC(2026, 2, 12) / 1000 }])
  })

  it('gives isDateOnly: false a date and time field in the zone', () => {
    const wrapper = mountField({ type: 'date_absolute', isDateOnly: false }, { type: 'date_absolute', unixSeconds: tokyoMidnight }, 'Asia/Tokyo')
    const input = wrapper.getComponent(DateTimeInput)
    expect(input.props('modelValue')).toBe('2026-03-10T00:00')
    input.vm.$emit('update:modelValue', '2026-03-10T09:30')
    expect(wrapper.emitted('change')?.at(-1)).toEqual([{ type: 'date_absolute', unixSeconds: Date.UTC(2026, 2, 10, 0, 30) / 1000 }])
  })

  it('reads and writes each end of a range in the zone', () => {
    const wrapper = mountField(
      { type: 'date_range' },
      { type: 'date_range', value: { start: { type: 'ABSOLUTE', unixSeconds: tokyoMidnight }, end: { type: 'ABSOLUTE', unixSeconds: tokyoMidnight + 86399 } } },
      'Asia/Tokyo',
    )
    const range = wrapper.getComponent(DateRangeInput)
    expect(range.props('modelValue')).toEqual({ start: '2026-03-10', end: '2026-03-10' })
    range.vm.$emit('update:modelValue', { start: '2026-03-10', end: '2026-03-12' })
    expect(wrapper.emitted('change')?.at(-1)).toEqual([{
      type: 'date_range',
      value: {
        start: { type: 'ABSOLUTE', unixSeconds: tokyoMidnight },
        end: { type: 'ABSOLUTE', unixSeconds: tokyoMidnight + 3 * 86400 - 1 },
      },
    }])
  })
})
