import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import Link from './Link.vue'

const RouterLink = defineComponent({
  name: 'RouterLink',
  props: { to: String, href: String },
  setup(props, { slots }) {
    return () => h('a', { 'data-to': props.to, 'href': props.href }, slots.default?.())
  },
})

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

  it('adds the standalone class and a tooltip', () => {
    const wrapper = mount(Link, {
      attachTo: document.body,
      props: {
        href: 'https://github.com',
        isStandalone: true,
        tooltip: 'Visit our GitHub repository',
      },
      slots: { default: 'GitHub' },
    })

    expect(wrapper.get('a').classes()).toContain('astryx-link--standalone')
    expect(document.body.textContent).toContain('Visit our GitHub repository')
    wrapper.unmount()
  })

  it('renders a custom link and separates the accessible name from the visible text', () => {
    const wrapper = mount(Link, {
      props: {
        as: RouterLink,
        href: '/inbox',
        label: 'Inbox',
        maxLines: 1,
        size: 'sm',
        weight: 'semibold',
      },
      slots: { default: () => h('span', { class: 'i-carbon-email' }) },
    })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/inbox')
    expect(link.attributes('data-to')).toBe('/inbox')
    expect(link.attributes('aria-label')).toBe('Inbox')
    expect(link.classes()).toContain('astryx-link--size-sm')
    expect(link.classes()).toContain('astryx-link--weight-semibold')
    expect(link.get('.astryx-link__label').classes()).toContain('astryx-link__label--single')
  })

  it('limits the label to the requested number of lines', () => {
    const wrapper = mount(Link, {
      props: { href: '/notes', maxLines: 2 },
      slots: { default: 'Field notes from the harbor survey, including the tide table.' },
    })
    const label = wrapper.get('.astryx-link__label')
    expect(wrapper.get('a').classes()).toContain('astryx-link--lines')
    expect(label.classes()).toContain('astryx-link__label--clamp')
    expect(label.attributes('style')).toContain('--astryx-link-max-lines: 2')
  })

  it('announces that an external link opens in a new tab', () => {
    const wrapper = mount(Link, {
      props: { href: 'https://example.com', isExternalLink: true, newTabLabel: '新标签页' },
      slots: { default: 'Example' },
    })
    expect(wrapper.text()).toContain('新标签页')
    expect(wrapper.get('.astryx-link__external').attributes('aria-hidden')).toBe('true')
  })

  it('forwards referrerPolicy as the referrerpolicy attribute', () => {
    const wrapper = mount(Link, { props: { href: '/docs', referrerPolicy: 'no-referrer' }, slots: { default: 'Docs' } })
    expect(wrapper.get('a').attributes('referrerpolicy')).toBe('no-referrer')

    const plain = mount(Link, { props: { href: '/docs' }, slots: { default: 'Docs' } })
    expect(plain.get('a').attributes('referrerpolicy')).toBeUndefined()
  })
})
