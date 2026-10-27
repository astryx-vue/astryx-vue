import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Selector from './Selector.vue'

const options = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
]

describe('selector 样式分层', () => {
  it('container 落在字段外壳，control 和根上的 class 落在本体，不落到按钮', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Selector, {
      props: { label: 'Fruit', options, containerClass: 'box-a', controlClass: 'ctl-a' },
      attrs: { class: 'root-a', style: { marginLeft: '3px' } },
    })
    const field = wrapper.get('.astryx-field')
    const control = wrapper.get('.astryx-selector-field')
    expect(field.classes()).toContain('box-a')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect((control.element as HTMLElement).style.marginLeft).toBe('3px')
    expect(wrapper.get('button.astryx-selector-trigger').classes()).not.toContain('root-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('secondary 无边框，并把 attached 状态收成独立说明', () => {
    const wrapper = mount(Selector, {
      props: { label: 'Fruit', options, variant: 'secondary', status: 'error', statusMessage: 'Pick one', statusVariant: 'attached' },
    })
    const control = wrapper.get('.astryx-selector-field')
    expect(control.attributes('data-variant')).toBe('secondary')
    expect(wrapper.get('.astryx-field').attributes('data-status-variant')).toBe('detached')
  })

  it('带操作的选项把弹出层锁成网格，点操作不改选择', async () => {
    const onEdit = vi.fn()
    const wrapper = mount(Selector, {
      attachTo: document.body,
      props: {
        label: 'Fruit',
        options: [
          { value: 'a', label: 'Apple', action: h('button', { type: 'button', onClick: onEdit }, 'Edit') },
          { value: 'b', label: 'Banana' },
        ],
      },
    })
    expect(wrapper.get('button.astryx-selector-trigger').attributes('aria-haspopup')).toBe('grid')
    await wrapper.get('button.astryx-selector-trigger').trigger('click')
    await nextTick()
    const grid = document.querySelector('[role="grid"]')
    expect(grid).not.toBeNull()
    expect(grid?.querySelectorAll('[role="row"]')).toHaveLength(2)
    expect(grid?.querySelectorAll('[role="gridcell"]')).toHaveLength(4)
    const edit = grid?.querySelector('button')
    edit?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(onEdit).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
