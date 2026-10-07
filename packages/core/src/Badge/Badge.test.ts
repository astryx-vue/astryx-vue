import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import Badge from './Badge.vue'

describe('badge', () => {
  it('renders its label in a span with the neutral variant by default', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Active',
      },
    })

    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.text()).toBe('Active')
    expect(wrapper.attributes('data-variant')).toBe('neutral')
  })

  it('renders leading content through the icon slot', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'Synced',
        icon: '<span data-testid="badge-icon">check</span>',
      },
    })

    expect(wrapper.find('[data-testid="badge-icon"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('check')
    expect(wrapper.text()).toContain('Synced')
  })
})
