import type { FieldSlotProps } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Field from './Field.vue'
import FieldLabel from './FieldLabel.vue'
import FieldStatus from './FieldStatus.vue'

enableAutoUnmount(afterEach)
afterEach(() => {
  document.body.innerHTML = ''
})

describe('field', () => {
  it('provides control IDs and composes description and status for custom controls', () => {
    const wrapper = mount(Field, {
      props: { label: 'Confidence', inputId: 'confidence', description: 'Choose a value', status: { type: 'warning', message: 'Review this value', messageId: 'custom-status' }, statusVariant: 'detached' },
      slots: { default: (field: FieldSlotProps) => h('input', { 'id': field.inputId, 'aria-labelledby': field.labelId, 'aria-describedby': field.describedBy, 'type': 'range' }) },
    })
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('confidence-description custom-status')
    expect(wrapper.get('label').attributes('for')).toBe('confidence')
    expect(wrapper.get('.astryx-field-status').attributes('data-variant')).toBe('detached')
    expect(wrapper.get('#custom-status').text()).toContain('Review this value')
  })

  it('updates associations when descriptions and statuses are removed', async () => {
    const wrapper = mount(Field, { props: { label: 'Custom', inputId: 'custom', description: 'Help', status: { type: 'error', message: 'Error' } }, slots: { default: (field: FieldSlotProps) => h('input', { 'aria-describedby': field.describedBy }) } })
    await wrapper.setProps({ description: undefined, status: undefined })
    expect(wrapper.get('input').attributes('aria-describedby')).toBeUndefined()
    expect(wrapper.find('.astryx-field-status').exists()).toBe(false)
    expect(wrapper.findAll('[aria-live]')).toHaveLength(2)
  })

  it('labels a group using a span instead of a label', () => {
    const wrapper = mount(Field, { props: { label: 'Contact method', inputId: 'contact', labelId: 'contact-label', isGroupLabel: true }, slots: { default: (field: FieldSlotProps) => h('div', { 'role': 'radiogroup', 'aria-labelledby': field.labelId }) } })
    expect(wrapper.find('label').exists()).toBe(false)
    expect(wrapper.get('span#contact-label').text()).toBe('Contact method')
    expect(wrapper.get('[role="radiogroup"]').attributes('aria-labelledby')).toBe('contact-label')
  })
})

describe('fieldLabel', () => {
  it('supports standalone labels, localized indicators and description focus', async () => {
    const input = document.createElement('input')
    input.id = 'name'
    document.body.append(input)
    const wrapper = mount(FieldLabel, { attachTo: document.body, props: { label: '姓名', inputId: 'name', description: '填写真实姓名', isRequired: true, requiredLabel: '必填' } })
    expect(wrapper.get('label').text()).toBe('姓名')
    expect(wrapper.get('.astryx-field-optionality').text()).toBe('必填')
    await wrapper.get('.astryx-field-description').trigger('click')
    expect(document.activeElement).toBe(input)
  })

  it('forwards description clicks to a checkbox without forwarding group clicks', async () => {
    const checkbox = document.createElement('input')
    checkbox.id = 'accept'
    checkbox.type = 'checkbox'
    document.body.append(checkbox)
    const wrapper = mount(FieldLabel, { attachTo: document.body, props: { label: 'Accept', inputId: 'accept', description: 'Terms' } })
    await wrapper.get('.astryx-field-description').trigger('click')
    expect(checkbox.checked).toBe(true)
    await wrapper.setProps({ isGroupLabel: true })
    await wrapper.get('.astryx-field-description').trigger('click')
    expect(checkbox.checked).toBe(true)
  })
})

describe('fieldStatus', () => {
  it('uses persistent assertive and polite regions for initial and changing messages', async () => {
    const wrapper = mount(FieldStatus, { props: { type: 'error', message: 'Required' } })
    await flushPromises()
    expect(wrapper.get('[aria-live="assertive"]').text()).toBe('Required')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('')
    await wrapper.setProps({ type: 'success', message: 'Saved' })
    await flushPromises()
    expect(wrapper.get('[aria-live="assertive"]').text()).toBe('')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('Saved')
    await wrapper.setProps({ message: '' })
    await flushPromises()
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('')
  })

  it('includes a decorative status glyph in detached messages and forwards attrs', () => {
    const wrapper = mount(FieldStatus, { props: { type: 'warning', message: 'Visible publicly', variant: 'detached' }, attrs: { id: 'status', class: 'custom-status' } })
    expect(wrapper.get('#status').classes()).toContain('custom-status')
    expect(wrapper.get('svg').attributes('aria-hidden')).toBe('true')
    expect(wrapper.vm.element?.id).toBe('status')
  })
})
