import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import ComplexSelector from './ComplexSelector.vue'

describe('complex selector 样式分层', () => {
  it('根 class 和 container 落在外壳，control 落在按钮', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Range', modelValue: 'week', triggerLabel: 'Week', containerClass: 'box-a', controlClass: 'ctl-a' },
      attrs: { class: 'root-a', style: { marginTop: '4px' } },
      slots: { default: () => 'body' },
    })
    const field = wrapper.get('.astryx-field')
    expect(field.classes()).toEqual(expect.arrayContaining(['root-a', 'box-a']))
    expect((field.element as HTMLElement).style.marginTop).toBe('4px')
    const button = wrapper.get('button.astryx-complex-selector')
    expect(button.classes()).toContain('ctl-a')
    expect(button.classes()).not.toContain('root-a')
    expect(warn).not.toHaveBeenCalled()
  })

  it('secondary 无边框，禁用光标是 default，attached 状态脱离控件', () => {
    const wrapper = mount(ComplexSelector, {
      props: {
        label: 'Range',
        modelValue: 'week',
        triggerLabel: 'Week',
        variant: 'secondary',
        status: { type: 'error', message: 'Bad' },
        statusVariant: 'attached',
      },
      slots: { default: () => 'body' },
    })
    const button = wrapper.get('button.astryx-complex-selector')
    expect(button.attributes('data-variant')).toBe('secondary')
    expect(button.attributes('data-status')).toBeUndefined()
    expect(wrapper.get('.astryx-field').attributes('data-status-variant')).toBe('detached')
  })

  it('自定义触发器收到 container 或 control 时给出开发警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const Host = defineComponent({
      components: { ComplexSelector },
      setup() {
        return () => h(ComplexSelector, {
          label: 'Range',
          modelValue: 'week',
          containerClass: 'box-a',
          renderTrigger: (props: { id: string }) => h('button', { id: props.id, type: 'button' }, 'Open'),
        }, { default: () => 'body' })
      },
    })
    mount(Host)
    expect(warn.mock.calls.some(call => String(call[0]).includes('custom trigger'))).toBe(true)
  })
})
