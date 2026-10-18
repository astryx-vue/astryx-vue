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

  it('renders a caller supplied icon inside the dot, hidden from screen readers', () => {
    const wrapper = mount(StatusDot, {
      props: { label: 'Online', variant: 'success' },
      slots: { icon: '<svg class="mark" />' },
    })

    const icon = wrapper.get('.astryx-status-dot__icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
    expect(icon.find('.mark').exists()).toBe(true)
    expect(wrapper.get('.astryx-status-dot').attributes('aria-label')).toBe('Online')
  })

  it('wraps the dot in a tooltip when tooltip text is given', async () => {
    const wrapper = mount(StatusDot, {
      attachTo: document.body,
      props: { label: 'Degraded', tooltip: 'Degraded service', variant: 'warning' },
    })

    await wrapper.get('.astryx-status-dot').trigger('mouseenter')
    await new Promise(resolve => setTimeout(resolve, 50))
    expect(document.body.textContent).toContain('Degraded service')
    wrapper.unmount()
  })
})
