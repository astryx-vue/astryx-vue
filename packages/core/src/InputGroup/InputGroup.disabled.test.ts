import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Button from '../Button/Button.vue'
import DateInput from '../DateInput/DateInput.vue'
import MultiSelector from '../MultiSelector/MultiSelector.vue'
import NumberInput from '../NumberInput/NumberInput.vue'
import Selector from '../Selector/Selector.vue'
import TextInput from '../TextInput/TextInput.vue'
import TimeInput from '../TimeInput/TimeInput.vue'
import Typeahead from '../Typeahead/Typeahead.vue'
import InputGroup from './InputGroup.vue'

const options = [{ value: 'a', label: 'A' }]

/** 组内控件的主语义元素，以及它自己的禁用写法。 */
const members: Array<{ name: string, render: (own: boolean) => ReturnType<typeof h>, control: string }> = [
  { name: 'TextInput', render: own => h(TextInput, { label: 'Text', modelValue: 'x', isDisabled: own }), control: 'input' },
  { name: 'NumberInput', render: own => h(NumberInput, { label: 'Number', modelValue: 1, isDisabled: own }), control: 'input' },
  { name: 'DateInput', render: own => h(DateInput, { label: 'Date', modelValue: null, disabled: own }), control: 'input' },
  { name: 'TimeInput', render: own => h(TimeInput, { label: 'Time', modelValue: null, isDisabled: own }), control: 'input' },
  { name: 'Typeahead', render: own => h(Typeahead as Component, { label: 'Search', modelValue: null, searchSource: () => [], disabled: own }), control: 'input' },
  { name: 'Selector', render: own => h(Selector as Component, { label: 'Pick', modelValue: null, options, disabled: own }), control: '[role="combobox"]' },
  { name: 'MultiSelector', render: own => h(MultiSelector as Component, { label: 'Pick many', modelValue: [], options, disabled: own }), control: '[role="combobox"]' },
  { name: 'Button', render: own => h(Button, { label: 'Go', isDisabled: own }), control: 'button' },
]

function isDisabled(element: Element): boolean {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true'
}

describe('InputGroup disabled state', () => {
  it.each(members)('disables a grouped $name', async ({ render, control }) => {
    const wrapper = mount(InputGroup, {
      props: { label: 'Group', disabled: true },
      slots: { default: () => render(false) },
    })

    expect(wrapper.get('[role="group"]').attributes('aria-disabled')).toBe('true')
    expect(isDisabled(wrapper.get(control).element)).toBe(true)

    await wrapper.setProps({ disabled: false })
    expect(wrapper.get('[role="group"]').attributes('aria-disabled')).toBeUndefined()
    expect(isDisabled(wrapper.get(control).element)).toBe(false)
  })

  it.each(members)('keeps a $name that disabled itself disabled in an enabled group', ({ render, control }) => {
    const wrapper = mount(InputGroup, {
      props: { label: 'Group' },
      slots: { default: () => render(true) },
    })

    expect(isDisabled(wrapper.get(control).element)).toBe(true)
  })

  it('blocks a Button addon action and drops the input from form submission', async () => {
    const clickAction = vi.fn()
    const wrapper = mount(InputGroup, {
      props: { label: 'Group', disabled: true },
      slots: {
        default: () => h(TextInput, { label: 'URL', modelValue: 'https://example.com', htmlName: 'url' }),
        after: () => h(Button, { label: 'Clear', clickAction }),
      },
    })

    await wrapper.get('button').trigger('click')
    expect(clickAction).not.toHaveBeenCalled()
    expect(wrapper.get('input').attributes('name')).toBeUndefined()
  })

  it('passes an outer group’s disabled state to a nested group', () => {
    const wrapper = mount(InputGroup, {
      props: { label: 'Outer', disabled: true },
      slots: {
        default: () => h(InputGroup, { label: 'Inner' }, {
          default: () => h(TextInput, { label: 'Text', modelValue: '' }),
        }),
      },
    })
    const groups = wrapper.findAll('[role="group"]')

    expect(groups).toHaveLength(2)
    expect(groups.every(group => group.attributes('aria-disabled') === 'true')).toBe(true)
    expect(wrapper.get('input').attributes('disabled')).toBeDefined()
  })
})
