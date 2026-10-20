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

  it('keeps seconds in the committed value when hasSeconds is set', async () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: '2026-03-10T10:30:15', hasSeconds: true },
    })
    const time = wrapper.findAll('input')[1]
    expect((time?.element as HTMLInputElement).value).toBe('10:30:15 AM')
    await time?.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-03-10T10:31:15'])
  })

  it('steps the time by timeIncrement minutes', async () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: '2026-03-10T10:30', timeIncrement: 15 },
    })
    await wrapper.findAll('input')[1]?.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-03-10T10:45'])
  })

  it('offers preset times at timeOptionInterval and keeps them inside min and max', async () => {
    const wrapper = mount(DateTimeInput, {
      props: {
        label: 'Meeting time',
        modelValue: '2026-03-10T10:00',
        timeOptionInterval: 60,
        min: '2026-03-10T09:00',
        max: '2026-03-10T12:00',
      },
      attachTo: document.body,
    })
    const time = wrapper.findAll('input')[1]
    await time?.trigger('click')
    const options = [...document.querySelectorAll('[role="option"]')].map(node => node.textContent?.trim())
    expect(options).toEqual(['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'])
    expect(document.querySelector('[role="listbox"]')?.getAttribute('aria-label')).toBe('Time options')
    ;(document.querySelectorAll('[role="option"]')[2] as HTMLElement).click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-03-10T11:00'])
    wrapper.unmount()
  })

  it('uses the timePlaceholder and timeLabel overrides for the time segment', () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: null, timePlaceholder: 'Pick a slot', timeLabel: 'Slot' },
    })
    const time = wrapper.findAll('input')[1]
    expect(time?.attributes('placeholder')).toBe('Pick a slot')
    expect(time?.attributes('aria-label')).toBe('Slot')
  })

  it('keeps both segments focusable while a disabledMessage explains why', async () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: null, isDisabled: true, disabledMessage: 'Ask an admin' },
      attachTo: document.body,
    })
    const inputs = wrapper.findAll('input')
    for (const input of inputs) {
      expect(input.attributes('disabled')).toBeUndefined()
      expect(input.attributes('aria-disabled')).toBe('true')
      expect(input.attributes('aria-describedby')).toContain('disabled')
    }
    wrapper.unmount()
  })

  it('lets the time half change inside the min and max time of day', async () => {
    const wrapper = mount(DateTimeInput, {
      props: { label: 'Meeting time', modelValue: '2026-03-10T10:00', min: '2026-03-10T09:00', max: '2026-03-10T17:00' },
    })
    await wrapper.findAll('input')[1]?.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-03-10T10:01'])
  })
})
