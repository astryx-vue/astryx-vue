import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DateTimeInput from './DateTimeInput.vue'

describe('date time input', () => {
  it('splits an ISO value across the date and time fields', () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: '2026-03-10T10:30' },
    })
    const inputs = wrapper.findAll('input')
    expect((inputs[0]?.element as HTMLInputElement).value).toBe('March 10, 2026')
    expect((inputs[1]?.element as HTMLInputElement).value).toBe('10:30 AM')
  })

  it('clears both parts', async () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: '2026-03-10T10:30', hasClear: true },
    })
    await wrapper.get('button[class*="clear"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })
})
