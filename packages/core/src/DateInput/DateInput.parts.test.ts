import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import { InputGroup } from '../InputGroup/index.js'
import DateInput from './DateInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

const baseProps = { label: 'Due', modelValue: null, presentation: 'popover' as const }

describe('dateInput 样式分层', () => {
  it('containerClass 落在字段外壳，不落在本体和输入框上', () => {
    const wrapper = mount(DateInput, {
      props: { ...baseProps, containerClass: 'box-a', containerStyle: { marginTop: '7px' } },
    })
    const field = wrapper.get('.astryx-field')
    expect(field.classes()).toContain('box-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(wrapper.get('.astryx-date-input').classes()).not.toContain('box-a')
    expect(wrapper.get('input').classes()).not.toContain('box-a')
  })

  it('controlClass 落在本体，并和根上的 class 一起生效', () => {
    const wrapper = mount(DateInput, {
      props: { ...baseProps, controlClass: 'ctl-a' },
      attrs: { class: 'root-a' },
    })
    const control = wrapper.get('.astryx-date-input')
    expect(control.classes()).toEqual(expect.arrayContaining(['ctl-a', 'root-a']))
    expect(wrapper.get('.astryx-field').classes()).not.toContain('ctl-a')
    expect(wrapper.get('input').classes()).not.toContain('ctl-a')
  })

  it('调用者的 id 和 aria-describedby 落在输入框上，并接上组件自己的描述', () => {
    const wrapper = mount(DateInput, {
      props: { ...baseProps, id: 'due', description: 'Pick a weekday' },
      attrs: { 'aria-describedby': 'caller-desc' },
    })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('due')
    expect(wrapper.get('label').attributes('for')).toBe('due')
    const ids = input.attributes('aria-describedby')?.split(' ') ?? []
    expect(ids).toContain('caller-desc')
    expect(ids.length).toBeGreaterThan(1)
  })

  it('在 InputGroup 里 containerClass 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(InputGroup, { label: 'Group' }, {
        default: () => h(DateInput, { ...baseProps, containerClass: 'box-a', controlClass: 'ctl-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.find('.astryx-date-input.ctl-a').exists()).toBe(true)
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('在横向标签的 FormLayout 里 containerClass 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(DateInput, { ...baseProps, containerClass: 'box-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('labelHidden 和 isLabelHidden 都会藏起标签', () => {
    const oldName = mount(DateInput, { props: { ...baseProps, labelHidden: true } })
    expect(oldName.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
    const current = mount(DateInput, { props: { ...baseProps, isLabelHidden: true } })
    expect(current.get('.astryx-field-label-group').attributes('data-hidden')).toBe('true')
  })

  it('系统日期控件同样把 controlClass 放在本体上', () => {
    const wrapper = mount(DateInput, {
      props: { ...baseProps, presentation: 'native', controlClass: 'ctl-a', containerClass: 'box-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    expect(wrapper.get('.astryx-date-input').classes()).toContain('ctl-a')
    expect(wrapper.get('input').attributes('type')).toBe('date')
    expect(wrapper.get('input').classes()).not.toContain('ctl-a')
  })
})
