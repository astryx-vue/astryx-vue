import { mount } from '@vue/test-utils'

import { describe, expect, it } from 'vitest'
import Skeleton from './Skeleton.vue'

describe('skeleton', () => {
  it('renders a decorative placeholder with upstream defaults', () => {
    const wrapper = mount(Skeleton)

    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('converts numeric dimensions to pixels', () => {
    const wrapper = mount(Skeleton, {
      props: {
        height: 48,
        width: 240,
      },
    })

    expect(wrapper.element.style.width).toBe('240px')
    expect(wrapper.element.style.height).toBe('48px')
  })

  it('preserves CSS dimension values', () => {
    const wrapper = mount(Skeleton, {
      props: {
        height: '1.25rem',
        width: '75%',
      },
    })

    expect(wrapper.element.style.width).toBe('75%')
    expect(wrapper.element.style.height).toBe('1.25rem')
  })

  it('stagger-delays animation by 100ms for each index', () => {
    const wrapper = mount(Skeleton, {
      props: {
        index: 4,
      },
    })

    expect(wrapper.element.style.animationDelay).toBe('1400ms')
  })

  it('allows the aria-hidden default to be overridden', () => {
    const wrapper = mount(Skeleton, {
      attrs: {
        'aria-hidden': false,
      },
    })

    expect(wrapper.attributes('aria-hidden')).toBe('false')
  })
})
