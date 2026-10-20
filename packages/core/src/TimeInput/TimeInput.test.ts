import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { provideAstryxLocale } from '../locale/index.js'
import TimeInput from './TimeInput.vue'

describe('time input', () => {
  it('shows a 12-hour value and steps with the arrow keys', async () => {
    const wrapper = mount(TimeInput, {
      props: {
        'label': 'Appointment slot',
        'modelValue': '09:00',
        'increment': 15,
        'hasClear': true,
        'onUpdate:modelValue': value => wrapper.setProps({ modelValue: value as string | null }),
      },
    })
    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('9:00 AM')
    await input.trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['09:15'])
    await input.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['09:00'])
  })

  it('keeps a typed time inside min and max', async () => {
    const wrapper = mount(TimeInput, {
      props: { label: 'Dinner reservation', modelValue: '18:00', min: '17:00', max: '22:00' },
    })
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: 'ArrowUp' })
    await wrapper.setProps({ modelValue: '22:00' })
    await input.trigger('keydown', { key: 'ArrowUp' })
    const updates = wrapper.emitted('update:modelValue') ?? []
    expect(updates.at(-1)).not.toEqual(['22:15'])
    expect(updates.some(entry => entry[0] === '22:15')).toBe(false)
  })

  it('uses the Chinese placeholder', () => {
    const Parent = defineComponent({
      setup() {
        provideAstryxLocale('zh-CN')
        return () => h(TimeInput, { label: '时间', modelValue: null })
      },
    })
    const wrapper = mount(Parent)
    expect(wrapper.get('input').attributes('placeholder')).toBe('选择时间')
  })

  it('does not change a disabled value', async () => {
    const wrapper = mount(TimeInput, { props: { label: 'Disabled field', modelValue: '10:00', isDisabled: true } })
    await wrapper.get('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('shows the labelTooltip through the field label', () => {
    const wrapper = mount(TimeInput, {
      props: { label: 'Start time', modelValue: null, labelTooltip: 'Local time zone' },
    })
    expect(wrapper.html()).toContain('Local time zone')
    wrapper.unmount()
  })

  it('keeps the field focusable while a disabledMessage explains why', async () => {
    const wrapper = mount(TimeInput, {
      props: { label: 'Start time', modelValue: '10:00', isDisabled: true, disabledMessage: 'You need the Editor role' },
      attachTo: document.body,
    })
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeUndefined()
    expect(input.attributes('readonly')).toBe('')
    expect(input.attributes('aria-disabled')).toBe('true')
    expect(input.attributes('aria-describedby')).toContain('disabled')
    input.element.focus()
    await wrapper.vm.$nextTick()
    const tooltip = document.querySelector<HTMLElement>('[role="tooltip"]')
    expect(tooltip?.textContent).toBe('You need the Editor role')
    expect(tooltip?.style.display).not.toBe('none')
    wrapper.unmount()
  })

  it('locks the field and shows a spinner while isLoading', async () => {
    const wrapper = mount(TimeInput, { props: { label: 'Start time', modelValue: '10:00', isLoading: true } })
    expect(wrapper.find('.astryx-spinner').exists()).toBe(true)
    expect(wrapper.get('input').attributes('readonly')).toBe('')
    await wrapper.get('input').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
