import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DateTimeInput from './DateTimeInput.vue'

afterEach(() => {
  document.body.innerHTML = ''
})

function expectFocusableDisabled(element: HTMLElement): void {
  expect(element.hasAttribute('disabled')).toBe(false)
  expect(element.getAttribute('aria-disabled')).toBe('true')
  element.focus()
  expect(document.activeElement).toBe(element)
}

describe('dateTimeInput disabled focus', () => {
  it.each([{ isDisabled: true }, { isLoading: true }])('keeps text fields focusable but inert: %o', async (state) => {
    const onClick = vi.fn()
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', modelValue: '2026-03-10T10:30', onClick, ...state },
    })
    const date = wrapper.get<HTMLInputElement>('.astryx-date-input-field')
    const calendar = wrapper.get<HTMLButtonElement>('.astryx-date-input-toggle')
    const time = wrapper.get<HTMLInputElement>('.astryx-time-input-control')
    expectFocusableDisabled(date.element)
    expectFocusableDisabled(calendar.element)
    expectFocusableDisabled(time.element)
    date.element.click()
    calendar.element.click()
    await date.trigger('keydown', { key: 'ArrowDown' })
    await time.trigger('keydown', { key: 'ArrowUp' })
    expect(date.attributes('aria-expanded')).toBe('false')
    expect(document.querySelector<HTMLElement>('.astryx-popover')?.style.display).toBe('none')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(onClick).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('keeps a read-only time field from changing through its shared commit path', async () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', modelValue: '2026-03-10T10:30', isReadOnly: true },
    })
    const time = wrapper.get<HTMLInputElement>('.astryx-time-input-control')
    expect(time.attributes('aria-disabled')).toBeUndefined()
    await time.setValue('11:00 AM')
    await time.trigger('blur')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(time.element.value).toBe('10:30 AM')
    wrapper.unmount()
  })

  it('keeps native fields focusable without allowing edits', () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', modelValue: '2026-03-10T10:30', presentation: 'native', isDisabled: true },
    })
    const date = wrapper.get<HTMLInputElement>('input[type="date"]')
    const time = wrapper.get<HTMLInputElement>('input[type="time"]')
    expectFocusableDisabled(date.element)
    expectFocusableDisabled(time.element)
    expect(date.attributes('readonly')).toBeDefined()
    expect(time.attributes('readonly')).toBeDefined()
    wrapper.unmount()
  })

  it('keeps both touch segments focusable without opening the sheet', async () => {
    const wrapper = mount(DateTimeInput, {
      attachTo: document.body,
      props: { label: 'Meeting', modelValue: '2026-03-10T10:30', presentation: 'bottom-sheet', isLoading: true },
    })
    const segments = wrapper.findAll<HTMLButtonElement>('.astryx-date-touch-segment')
    expect(segments).toHaveLength(2)
    for (const segment of segments) {
      expectFocusableDisabled(segment.element)
      segment.element.click()
    }
    await wrapper.vm.$nextTick()
    expect(document.querySelector('dialog[open]')).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
