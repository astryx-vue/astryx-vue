import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RadioIndicator from './RadioIndicator.vue'

describe('radioIndicator', () => {
  it('draws a circle in both states and a dot only when chosen', () => {
    const open = mount(RadioIndicator, { props: { state: 'unchecked', size: 'sm' } })
    expect(open.attributes('data-state')).toBe('unchecked')
    expect(open.attributes('data-size')).toBe('sm')
    expect(open.find('.astryx-radio-indicator-dot').exists()).toBe(false)
    expect(open.attributes('aria-hidden')).toBe('true')

    const chosen = mount(RadioIndicator, { props: { state: 'checked' } })
    expect(chosen.find('.astryx-radio-indicator-dot').exists()).toBe(true)
  })

  it('keeps forwarded accessibility attributes off the graphic', () => {
    const wrapper = mount(RadioIndicator, {
      props: { state: 'checked' },
      attrs: { 'role': 'radio', 'aria-checked': 'true', 'tabindex': 0 },
    })
    expect(wrapper.attributes('role')).toBeUndefined()
    expect(wrapper.attributes('aria-checked')).toBeUndefined()
    expect(wrapper.attributes('tabindex')).toBeUndefined()
  })

  it('renders slot content instead of the dot', () => {
    const wrapper = mount(RadioIndicator, {
      props: { state: 'checked' },
      slots: { default: '<span class="pending" />' },
    })
    expect(wrapper.find('.pending').exists()).toBe(true)
    expect(wrapper.find('.astryx-radio-indicator-dot').exists()).toBe(false)
  })
})
