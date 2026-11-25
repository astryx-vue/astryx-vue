import type { ComplexSelectorTriggerProps } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Button from '../Button/Button.vue'
import ComplexSelector from './ComplexSelector.vue'

enableAutoUnmount(afterEach)

function renderCustom(props: Record<string, unknown>, attrs: Record<string, unknown> = {}) {
  return mount(ComplexSelector, {
    attachTo: document.body,
    props: {
      label: 'Assignee',
      modelValue: null,
      renderTrigger: (trigger: ComplexSelectorTriggerProps) => h(Button, { ...trigger, label: 'Pick' }),
      ...props,
    },
    attrs,
    slots: { default: () => 'Body' },
  })
}

describe('complexSelector 的触发器是 combobox 字段', () => {
  it('内置触发器是 combobox，必填状态落在它上面', () => {
    const wrapper = mount(ComplexSelector, {
      props: { label: 'Assignee', modelValue: null, isRequired: true },
    })
    const trigger = wrapper.get('button.astryx-complex-selector')
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-required')).toBe('true')
    expect(trigger.attributes('aria-haspopup')).toBe('dialog')
  })

  it('自定义触发器拿到 combobox 角色、必填、禁用和名字，Button 作控件时也保留', () => {
    const control = renderCustom({ isRequired: true, isDisabled: true }).get('button')
    expect(control.attributes('role')).toBe('combobox')
    expect(control.attributes('aria-required')).toBe('true')
    expect(control.attributes('aria-disabled')).toBe('true')
    expect(control.attributes('aria-label')).toBe('Assignee')
  })

  it('自定义触发器的忙碌状态在 Button 上保留', () => {
    const control = renderCustom({ isLoading: true }).get('button')
    expect(control.attributes('aria-busy')).toBe('true')
    expect(control.attributes('aria-disabled')).toBeUndefined()
  })

  it('选择器自己的 aria-label 优先，给了 aria-labelledby 就不再加 aria-label', () => {
    expect(renderCustom({}, { 'aria-label': 'Owner' }).get('button').attributes('aria-label')).toBe('Owner')
    expect(renderCustom({}, { 'aria-labelledby': 'heading' }).get('button').attributes('aria-label')).toBeUndefined()
  })
})
