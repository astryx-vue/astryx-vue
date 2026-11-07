import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
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

  it('keeps a disabled trigger focusable while a disabledMessage explains why', async () => {
    const wrapper = mount(DateRangeInput, {
      props: {
        label: 'Reporting period',
        modelValue: null,
        isDisabled: true,
        disabledMessage: 'You need the Editor role',
      },
      attachTo: document.body,
    })
    const trigger = wrapper.get<HTMLButtonElement>('.astryx-date-range-trigger')
    expect(trigger.attributes('disabled')).toBeUndefined()
    expect(trigger.attributes('aria-disabled')).toBe('true')
    expect(trigger.attributes('aria-describedby')?.split(' ')).toContain(`${trigger.attributes('id')}-disabled`)
    expect(wrapper.text()).toContain('You need the Editor role')
    trigger.element.focus()
    await wrapper.vm.$nextTick()
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent).toBe('You need the Editor role')
    expect(tooltip?.style.display).not.toBe('none')
    wrapper.unmount()
  })

  it.each([{ isDisabled: true }, { isLoading: true }])('stays focusable but blocks activation while disabled or busy: %o', async (state) => {
    const onClick = vi.fn()
    const wrapper = mount(DateRangeInput, {
      props: { label: 'Reporting period', modelValue: null, onClick, ...state },
      attachTo: document.body,
    })
    const trigger = wrapper.get<HTMLButtonElement>('.astryx-date-range-trigger')
    expect(trigger.attributes('disabled')).toBeUndefined()
    expect(trigger.attributes('aria-disabled')).toBe('true')
    trigger.element.focus()
    expect(document.activeElement).toBe(trigger.element)
    trigger.element.click()
    await trigger.trigger('keydown', { key: 'Enter' })
    await trigger.trigger('keydown', { key: ' ' })
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.querySelector<HTMLElement>('.astryx-popover')?.style.display).toBe('none')
    expect(onClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('keeps an out-of-range preset focusable without allowing selection', async () => {
    const wrapper = mount(DateRangeInput, {
      props: {
        label: 'Report period',
        modelValue: null,
        maxRangeSpan: 1,
        presets: [{ label: 'Last 7 days', getRange: () => ({ start: '2026-03-01', end: '2026-03-07' }) }],
      },
      attachTo: document.body,
    })
    await wrapper.get('.astryx-date-range-trigger').trigger('click')
    const preset = document.querySelector<HTMLButtonElement>('.astryx-date-range-preset')
    expect(preset?.disabled).toBe(false)
    expect(preset?.getAttribute('aria-disabled')).toBe('true')
    preset?.focus()
    expect(document.activeElement).toBe(preset)
    preset?.click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')).toBeUndefined()
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
