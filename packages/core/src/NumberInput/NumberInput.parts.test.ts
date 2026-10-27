import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import { InputGroup } from '../InputGroup/index.js'
import NumberInput from './NumberInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

const baseProps = { label: 'Quantity', modelValue: 1 }

describe('numberInput 样式分层', () => {
  it('container* 落到 Field，control* 落到本体，都不落到 input', () => {
    const wrapper = mount(NumberInput, {
      props: {
        ...baseProps,
        containerClass: 'box-a',
        containerStyle: { marginTop: '7px' },
        controlClass: 'ctl-a',
        controlStyle: { marginBottom: '9px' },
      },
    })
    const field = wrapper.get('.astryx-field')
    const control = wrapper.get('.astryx-number-input')
    expect(field.classes()).toContain('box-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(control.classes()).toContain('ctl-a')
    expect((control.element as HTMLElement).style.marginBottom).toBe('9px')
    expect(wrapper.get('input[type="text"]').classes()).not.toContain('ctl-a')
    expect(wrapper.get('input[type="text"]').classes()).not.toContain('box-a')
  })

  it('根上的 class / style 仍落在本体，不警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(NumberInput, {
      props: { ...baseProps, controlClass: 'ctl-a' },
      attrs: { class: 'root-a', style: { marginLeft: '3px' } },
    })
    const control = wrapper.get('.astryx-number-input')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a', 'size-md']))
    expect((control.element as HTMLElement).style.marginLeft).toBe('3px')
    expect(wrapper.get('.astryx-field').classes()).not.toContain('root-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('id、data-* 和事件落在 input 上', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(NumberInput, {
      props: { ...baseProps, id: 'qty' },
      attrs: { 'data-testid': 'qty-input', 'onFocus': onFocus },
    })
    const input = wrapper.get('input[type="text"]')
    expect(input.attributes('id')).toBe('qty')
    expect(input.attributes('data-testid')).toBe('qty-input')
    await input.trigger('focus')
    expect(onFocus).toHaveBeenCalled()
  })

  it('没有标签外壳时 container* 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(NumberInput, {
      props: { modelValue: 1, isLabelHidden: true, containerClass: 'box-a', controlClass: 'ctl-a' },
    })
    expect(wrapper.find('.astryx-field').exists()).toBe(false)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.get('.astryx-number-input').classes()).toContain('ctl-a')
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
  })

  it('在 InputGroup 里 container* 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      render: () => h(InputGroup, { label: 'Group' }, {
        default: () => h(NumberInput, { ...baseProps, containerClass: 'box-a', controlClass: 'ctl-a' }),
      }),
    })
    const wrapper = mount(Host)
    expect(wrapper.find('.box-a').exists()).toBe(false)
    expect(wrapper.find('.astryx-number-input.ctl-a').exists()).toBe(true)
    expect(warn.mock.calls.some(call => String(call[0]).includes('no Field box renders'))).toBe(true)
    mount(defineComponent({
      render: () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(NumberInput, { ...baseProps, containerStyle: { margin: '1px' } }),
      }),
    }))
    expect(warn.mock.calls.filter(call => String(call[0]).includes('no Field box renders')).length).toBeGreaterThanOrEqual(2)
  })
})
