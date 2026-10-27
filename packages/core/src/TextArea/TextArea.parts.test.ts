import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import { InputGroup } from '../InputGroup/index.js'
import TextArea from './TextArea.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

const baseProps = { label: 'Bio', modelValue: '' }

describe('textArea 样式分层', () => {
  it('container* 落到 Field，control* 落到本体，都不落到 textarea', () => {
    const wrapper = mount(TextArea, {
      props: {
        ...baseProps,
        containerClass: 'box-a',
        containerStyle: { marginTop: '7px' },
        controlClass: 'ctl-a',
        controlStyle: { marginBottom: '9px' },
      },
    })
    const field = wrapper.get('.astryx-field')
    const control = wrapper.get('.astryx-text-area')
    expect(field.classes()).toContain('box-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(control.classes()).toContain('ctl-a')
    expect((control.element as HTMLElement).style.marginBottom).toBe('9px')
    expect(control.classes()).not.toContain('box-a')
    expect(wrapper.get('textarea').classes()).not.toContain('ctl-a')
    expect(wrapper.get('textarea').classes()).not.toContain('box-a')
  })

  it('根上的 class / style 仍落在本体，和 control* 一起生效，也不警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(TextArea, {
      props: { ...baseProps, controlClass: 'ctl-a' },
      attrs: { class: 'root-a', style: { marginLeft: '3px' } },
    })
    const control = wrapper.get('.astryx-text-area')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect((control.element as HTMLElement).style.marginLeft).toBe('3px')
    expect(wrapper.get('.astryx-field').classes()).not.toContain('root-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('id、data-* 和事件落在 textarea 上', async () => {
    const onFocus = vi.fn()
    const wrapper = mount(TextArea, {
      props: { ...baseProps, id: 'bio-id' },
      attrs: { 'data-testid': 'bio', 'onFocus': onFocus },
    })
    const textarea = wrapper.get('textarea')
    expect(textarea.attributes('id')).toBe('bio-id')
    expect(textarea.attributes('data-testid')).toBe('bio')
    await textarea.trigger('focus')
    expect(onFocus).toHaveBeenCalled()
  })

  it('在 InputGroup 和横向标签里 container* 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Grouped = defineComponent({
      render: () => h(InputGroup, { label: 'Group' }, {
        default: () => h(TextArea, { ...baseProps, containerClass: 'box-a', controlClass: 'ctl-a' }),
      }),
    })
    const grouped = mount(Grouped)
    expect(grouped.find('.box-a').exists()).toBe(false)
    expect(grouped.find('.astryx-text-area.ctl-a').exists()).toBe(true)

    const Horizontal = defineComponent({
      render: () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(TextArea, { ...baseProps, containerClass: 'box-b' }),
      }),
    })
    mount(Horizontal)
    expect(warn.mock.calls.filter(call => String(call[0]).includes('no Field box renders'))).toHaveLength(2)
  })
})
