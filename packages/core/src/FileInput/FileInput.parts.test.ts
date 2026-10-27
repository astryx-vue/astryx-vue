import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { FormLayout } from '../FormLayout/index.js'
import { InputGroup } from '../InputGroup/index.js'
import FileInput from './FileInput.vue'

enableAutoUnmount(afterEach)
afterEach(() => vi.restoreAllMocks())

const baseProps = { label: 'Resume', modelValue: null }

describe('fileInput 样式分层', () => {
  it('container* 落到 Field，control* 和根 class 落到本体，都不落到 file input', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(FileInput, {
      props: {
        ...baseProps,
        containerClass: 'box-a',
        containerStyle: { marginTop: '7px' },
        controlClass: 'ctl-a',
        controlStyle: { marginBottom: '9px' },
      },
      attrs: { class: 'root-a', style: { marginLeft: '3px' } },
    })
    const field = wrapper.get('.astryx-field')
    const control = wrapper.get('.astryx-file-input')
    expect(field.classes()).toContain('box-a')
    expect((field.element as HTMLElement).style.marginTop).toBe('7px')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect((control.element as HTMLElement).style.marginLeft).toBe('3px')
    expect((control.element as HTMLElement).style.marginBottom).toBe('9px')
    expect(wrapper.get('input[type="file"]').classes()).not.toContain('root-a')
    expect(wrapper.get('input[type="file"]').classes()).not.toContain('ctl-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('id、data-* 和点击落在触发按钮上', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FileInput, {
      props: { ...baseProps, id: 'resume' },
      attrs: { 'data-testid': 'resume-trigger', 'onClick': onClick },
    })
    const trigger = wrapper.get('button.astryx-file-input-trigger')
    expect(trigger.attributes('id')).toBe('resume')
    expect(trigger.attributes('data-testid')).toBe('resume-trigger')
    expect(wrapper.get('input[type="file"]').attributes('data-testid')).toBeUndefined()
    await trigger.trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('在 InputGroup 和横向标签里 container* 不生效并警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mount(defineComponent({
      render: () => h(InputGroup, { label: 'Group' }, {
        default: () => h(FileInput, { ...baseProps, containerClass: 'box-a', controlClass: 'ctl-a' }),
      }),
    }))
    mount(defineComponent({
      render: () => h(FormLayout, { direction: 'horizontal-labels' }, {
        default: () => h(FileInput, { ...baseProps, containerClass: 'box-b' }),
      }),
    }))
    expect(warn.mock.calls.filter(call => String(call[0]).includes('no Field box renders'))).toHaveLength(2)
  })
})
