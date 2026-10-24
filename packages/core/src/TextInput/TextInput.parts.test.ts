import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import { InputGroup } from '../InputGroup/index.js'
import TextInput from './TextInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  vi.restoreAllMocks()
})

const baseProps = { label: 'Name', modelValue: '' }

describe('textInput 样式分层', () => {
  it('containerClass / containerStyle 落到 Field 外壳，不落到本体和原生 input', () => {
    const wrapper = mount(TextInput, {
      props: { ...baseProps, containerClass: 'box-a', containerStyle: { marginTop: '7px' } },
    })
    const field = wrapper.get('.astryx-field')
    expect(field.classes()).toContain('box-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(wrapper.get('.astryx-text-input').classes()).not.toContain('box-a')
    expect(wrapper.get('input').classes()).not.toContain('box-a')
    expect((wrapper.get('.astryx-text-input').element as HTMLElement).style.marginTop).toBe('')
  })

  it('controlClass / controlStyle 落到本体，不落到外壳和原生 input', () => {
    const wrapper = mount(TextInput, {
      props: { ...baseProps, controlClass: 'ctl-a', controlStyle: { marginBottom: '9px' } },
    })
    const control = wrapper.get('.astryx-text-input')
    expect(control.classes()).toContain('ctl-a')
    expect((control.element as HTMLElement).style.marginBottom).toBe('9px')
    expect(wrapper.get('.astryx-field').classes()).not.toContain('ctl-a')
    expect(wrapper.get('input').classes()).not.toContain('ctl-a')
    expect((wrapper.get('input').element as HTMLElement).style.marginBottom).toBe('')
  })

  it('根上直接写的 class / style 仍落在本体，不丢弃也不警告，并和 controlClass 同时生效', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(TextInput, {
      props: { ...baseProps, controlClass: 'ctl-a', controlStyle: { marginBottom: '9px' } },
      attrs: { class: 'root-a', style: { marginLeft: '3px' } },
    })
    const control = wrapper.get('.astryx-text-input')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect((control.element as HTMLElement).style.marginLeft).toBe('3px')
    expect((control.element as HTMLElement).style.marginBottom).toBe('9px')
    expect(wrapper.get('.astryx-field').classes()).not.toContain('root-a')
    expect(wrapper.get('input').classes()).not.toContain('root-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('id、data-*、aria-*、事件监听落在原生 input 上', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(TextInput, {
      props: { ...baseProps, id: 'caller-id' },
      attrs: { 'data-testid': 'member', 'aria-details': 'details-id', 'onFocus': onFocus },
    })
    const input = wrapper.get('input')
    expect(input.attributes('id')).toBe('caller-id')
    expect(input.attributes('data-testid')).toBe('member')
    expect(input.attributes('aria-details')).toBe('details-id')
    await input.trigger('focus')
    expect(onFocus).toHaveBeenCalled()
    expect(wrapper.get('.astryx-field').attributes('data-testid')).toBeUndefined()
  })

  it('在 InputGroup 里 container* 不生效并警告，control* 照常生效', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(InputGroup, { label: 'Group' }, {
        default: () => h(TextInput, { ...baseProps, containerClass: 'box-a', controlClass: 'ctl-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.find('.astryx-text-input.ctl-a').exists()).toBe(true)
    expect(warn.mock.calls.some(call => String(call[0]).startsWith('TextInput:') && String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('在横向标签的 FormLayout 里 container* 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(TextInput, { ...baseProps, containerClass: 'box-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('没有 container* 时不警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(InputGroup, { label: 'Group' }, { default: () => h(TextInput, baseProps) }),
    })
    mount(Host)
    expect(warn).not.toHaveBeenCalled()
  })
})
