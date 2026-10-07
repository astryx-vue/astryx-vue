import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import CheckboxIndicator from './CheckboxIndicator.vue'

describe('checkboxIndicator', () => {
  it('keeps decorative visuals out of the accessibility tree and tab order', () => {
    const wrapper = mount(CheckboxIndicator, { props: { state: 'checked' }, attrs: { 'aria-hidden': 'false', 'role': 'checkbox', 'tabindex': 0, 'aria-label': 'Not a control', 'contenteditable': true } })
    expect(wrapper.attributes('aria-hidden')).toBe('true')
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
    expect(wrapper.attributes('contenteditable')).toBeUndefined()
  })

  it('supports all states, sizes and disabled visuals', async () => {
    const wrapper = mount(CheckboxIndicator, { props: { state: 'unchecked' } })
    expect(wrapper.attributes('data-state')).toBe('unchecked')
    await wrapper.setProps({ state: 'indeterminate', size: 'sm', isDisabled: true })
    expect(wrapper.attributes()).toMatchObject({ 'data-state': 'indeterminate', 'data-size': 'sm', 'data-disabled': 'true' })
    expect(wrapper.find('input').exists()).toBe(false)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('replaces the default marks with a decorative slot', () => {
    const wrapper = mount(CheckboxIndicator, { props: { state: 'checked' }, slots: { default: '<span class="custom-mark" />' } })
    expect(wrapper.find('.custom-mark').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
  })
})
