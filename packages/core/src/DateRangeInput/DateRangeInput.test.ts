import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DateRangeInput from './DateRangeInput.vue'

describe('date range input', () => {
  it('applies a preset and clears the range', async () => {
    const wrapper = mount(DateRangeInput, {
      props: {
        label: 'Report period',
        modelValue: null,
        presets: [{ label: 'Last 7 days', getRange: () => ({ start: '2026-03-01', end: '2026-03-07' }) }],
      },
      attachTo: document.body,
    })
    await wrapper.get('.astryx-date-range-trigger').trigger('click')
    const preset = document.querySelector<HTMLButtonElement>('.astryx-date-range-preset')
    expect(preset).not.toBeNull()
    preset?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([{ start: '2026-03-01', end: '2026-03-07' }])
    await wrapper.setProps({ modelValue: { start: '2026-03-01', end: '2026-03-07' } })
    await wrapper.get('button[class*="clear"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    wrapper.unmount()
  })

  it('commits a range on the second day click', async () => {
    const wrapper = mount(DateRangeInput, {
      props: { label: 'Report period', modelValue: null, monthCount: 1 },
      attachTo: document.body,
    })
    await wrapper.get('.astryx-date-range-trigger').trigger('click')
    const days = [...document.querySelectorAll<HTMLButtonElement>('.astryx-calendar-cell:not(.is-disabled)')]
    expect(days.length).toBeGreaterThan(2)
    days[0]?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    days[2]?.click()
    await wrapper.vm.$nextTick()
    const committed = wrapper.emitted('update:modelValue')?.[0]?.[0] as { start: string, end: string }
    expect(committed.start <= committed.end).toBe(true)
    wrapper.unmount()
  })
})
