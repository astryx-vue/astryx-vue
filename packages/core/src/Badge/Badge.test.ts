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

  it('renders a label prop and exposes the full string as the title', () => {
    const wrapper = mount(Badge, {
      props: {
        label: 'Unfulfilled',
        variant: 'warning',
      },
    })

    expect(wrapper.text()).toBe('Unfulfilled')
    expect(wrapper.attributes('title')).toBe('Unfulfilled')
    expect(wrapper.attributes('data-variant')).toBe('warning')
    expect(wrapper.find('.astryx-badge__label').exists()).toBe(true)
  })

  it('stringifies a numeric label and skips the title for an empty string', () => {
    const numbered = mount(Badge, { props: { label: 3 } })
    expect(numbered.text()).toBe('3')
    expect(numbered.attributes('title')).toBe('3')

    const empty = mount(Badge, { props: { label: '' } })
    expect(empty.attributes('title')).toBeUndefined()
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
