import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import DateInput from './DateInput.vue'

describe('dateInput', () => {
  it('renders component', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    expect(wrapper.find('.astryx-date-input').exists()).toBe(true)
  })

  it('formats date value', () => {
    const testDate = new Date(2024, 2, 15)
    const wrapper = mount(DateInput, {
      props: {
        modelValue: testDate,
      },
    })

    const vm = wrapper.vm as any
    expect(vm.inputValue).toBe('2024-03-15')
  })

  it('handles null value', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    expect(vm.inputValue).toBe('')
  })

  it('opens popover on focus', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    vm.openCalendar()
    await nextTick()

    expect(vm.isOpen).toBe(true)
  })

  it('closes popover after selecting date', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    vm.isOpen = true

    vm.onCalendarChange(new Date(2024, 2, 15))
    await nextTick()

    expect(vm.isOpen).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('clears value', async () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: new Date(2024, 2, 15),
        clearable: true,
      },
    })

    const vm = wrapper.vm as any
    vm.onClear(new Event('click'))
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null])
  })

  it('applies disabled prop', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        disabled: true,
      },
    })

    expect(wrapper.props('disabled')).toBe(true)
  })

  it('applies size classes', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        size: 'sm',
      },
    })

    expect(wrapper.find('.astryx-date-input').classes()).toContain('size-sm')
  })

  it('applies status classes', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        status: 'error',
      },
    })

    expect(wrapper.find('.astryx-date-input').classes()).toContain('status-error')
  })

  it('parses date string', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    const parsed = vm.parseDate('2024-03-15')

    expect(parsed).toBeInstanceOf(Date)
    expect(parsed.getFullYear()).toBe(2024)
    expect(parsed.getMonth()).toBe(2)
    expect(parsed.getDate()).toBe(15)
  })

  it('returns null for invalid date string', () => {
    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
      },
    })

    const vm = wrapper.vm as any
    const parsed = vm.parseDate('invalid')

    expect(parsed).toBeNull()
  })

  it('passes props to calendar', () => {
    const min = new Date(2024, 0, 1)
    const max = new Date(2024, 11, 31)

    const wrapper = mount(DateInput, {
      props: {
        modelValue: null,
        min,
        max,
      },
    })

    expect(wrapper.props('min')).toEqual(min)
    expect(wrapper.props('max')).toEqual(max)
  })
})
