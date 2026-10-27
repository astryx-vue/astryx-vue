import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import MultiSelector from './MultiSelector.vue'

const options = [
  { value: 'read', label: 'Read' },
  { value: 'write', label: 'Write' },
]

describe('multi selector 样式分层', () => {
  it('container 落在外壳，control 和根 class 落在本体', () => {
    const wrapper = mount(MultiSelector, {
      props: { label: 'Access', options, containerClass: 'box-a', controlClass: 'ctl-a' },
      attrs: { class: 'root-a' },
    })
    expect(wrapper.get('.astryx-field').classes()).toContain('box-a')
    const control = wrapper.get('.astryx-multi-selector-control')
    expect(control.classes()).toEqual(expect.arrayContaining(['root-a', 'ctl-a']))
    expect(wrapper.get('button.astryx-multi-selector-trigger').classes()).not.toContain('root-a')
  })

  it('secondary 使用次要触发器，attached 状态脱离控件', () => {
    const wrapper = mount(MultiSelector, {
      props: { label: 'Access', options, variant: 'secondary', status: 'warning', statusMessage: 'Check', statusVariant: 'attached' },
    })
    expect(wrapper.get('.astryx-multi-selector-control').attributes('data-variant')).toBe('secondary')
    expect(wrapper.get('.astryx-field').attributes('data-status-variant')).toBe('detached')
  })

  it('选项操作不改变已选值', async () => {
    const onEdit = vi.fn()
    const wrapper = mount(MultiSelector, {
      attachTo: document.body,
      props: {
        label: 'Access',
        modelValue: ['read'],
        options: [
          { value: 'read', label: 'Read', action: h('button', { type: 'button', onClick: onEdit }, 'Edit') },
          { value: 'write', label: 'Write' },
        ],
      },
    })
    expect(wrapper.get('button.astryx-multi-selector-trigger').attributes('aria-haspopup')).toBe('grid')
    await wrapper.get('button.astryx-multi-selector-trigger').trigger('click')
    await nextTick()
    const edit = document.querySelector('[role="grid"] button')
    edit?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(onEdit).toHaveBeenCalled()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})
