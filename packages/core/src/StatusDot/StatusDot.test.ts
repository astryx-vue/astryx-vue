import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StatusDot from './StatusDot.vue'

describe('statusDot', () => {
  it('renders a span with role img and aria-label', () => {
    const wrapper = mount(StatusDot, {
      props: {
        label: 'Online',
        variant: 'success',
      },
    })

    const dot = wrapper.find('.astryx-status-dot')
    expect(dot.exists()).toBe(true)
    expect(dot.element.tagName).toBe('SPAN')
    expect(dot.attributes('role')).toBe('img')
    expect(dot.attributes('aria-label')).toBe('Online')
    expect(dot.attributes('data-variant')).toBe('success')
  })

  it('defaults to neutral variant', () => {
    const wrapper = mount(StatusDot, {
      props: {
        label: 'Offline',
      },
    })

    expect(wrapper.find('.astryx-status-dot').attributes('data-variant')).toBe('neutral')
  })

  it('applies pulsing class when isPulsing is true', () => {
    const wrapper = mount(StatusDot, {
      props: {
        label: 'Live',
        isPulsing: true,
      },
    })

    expect(wrapper.find('.astryx-status-dot').classes()).toContain('astryx-status-dot--pulsing')
  })
})
