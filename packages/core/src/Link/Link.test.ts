import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import Link from './Link.vue'

describe('link', () => {
  it('renders an anchor with href', () => {
    const wrapper = mount(Link, {
      props: {
        href: '/docs',
      },
      slots: {
        default: 'Documentation',
      },
    })

    const anchor = wrapper.find('a')
    expect(anchor.exists()).toBe(true)
    expect(anchor.attributes('href')).toBe('/docs')
    expect(anchor.text()).toBe('Documentation')
  })

  it('renders a button when href is absent', () => {
    const wrapper = mount(Link, {
      slots: {
        default: 'Action',
      },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Action')
  })

  it('adds target and rel for external links', () => {
    const wrapper = mount(Link, {
      props: {
        href: 'https://example.com',
        isExternalLink: true,
      },
      slots: {
        default: 'External',
      },
    })

    const anchor = wrapper.find('a')
    expect(anchor.attributes('target')).toBe('_blank')
    expect(anchor.attributes('rel')).toContain('noopener')
    expect(anchor.attributes('rel')).toContain('noreferrer')
    expect(anchor.find('.astryx-link__external').exists()).toBe(true)
  })

  it('applies color and underline classes', () => {
    const wrapper = mount(Link, {
      props: {
        href: '/',
        color: 'secondary',
        hasUnderline: true,
      },
      slots: {
        default: 'Link',
      },
    })

    const anchor = wrapper.find('a')
    expect(anchor.classes()).toContain('astryx-link--color-secondary')
    expect(anchor.classes()).toContain('astryx-link--underlined')
  })

  it('prevents navigation when disabled', () => {
    const onClick = vi.fn()
    const wrapper = mount(Link, {
      props: {
        href: '/',
        isDisabled: true,
        onClick,
      },
      slots: {
        default: 'Disabled',
      },
    })

    const anchor = wrapper.find('a')
    expect(anchor.classes()).toContain('astryx-link--disabled')
    expect(anchor.attributes('aria-disabled')).toBe('true')
  })
})
