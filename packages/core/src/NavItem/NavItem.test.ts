import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import NavIcon from './NavIcon.vue'
import NavItem from './NavItem.vue'

const RouterLink = defineComponent({
  name: 'RouterLink',
  props: { to: String, href: String },
  setup(props, { slots }) {
    return () => h('a', { 'data-to': props.to, 'href': props.href }, slots.default?.())
  },
})

describe('nav-item', () => {
  it('renders a link and marks the current page', () => {
    const wrapper = mount(NavItem, {
      props: { href: '/home', isSelected: true, label: 'Home' },
    })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/home')
    expect(link.attributes('aria-current')).toBe('page')
    expect(link.text()).toBe('Home')
  })

  it('renders a button when disabled and exposes only the label for icon buttons', () => {
    const wrapper = mount(NavItem, {
      props: {
        href: '/home',
        iconClass: 'i-carbon-home',
        isDisabled: true,
        isIconOnly: true,
        label: 'Home',
      },
    })
    const button = wrapper.get('button')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.attributes('aria-label')).toBe('Home')
    expect(button.attributes('href')).toBeUndefined()
  })

  it('passes href and to to a custom link component', () => {
    const wrapper = mount(NavItem, {
      props: { as: RouterLink, href: '/inbox', label: 'Inbox' },
    })
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/inbox')
    expect(link.attributes('data-to')).toBe('/inbox')
  })

  it('adds a safe rel when the link opens a new tab', () => {
    const wrapper = mount(NavItem, {
      props: { href: 'https://example.com', label: 'Docs', target: '_blank' },
    })
    expect(wrapper.get('a').attributes('rel')).toContain('noopener')
  })
})

describe('nav-icon', () => {
  it('is an image when labelled and hidden otherwise', () => {
    const named = mount(NavIcon, { props: { iconClass: 'i-carbon-home', label: 'Home' } })
    expect(named.attributes('role')).toBe('img')
    expect(named.attributes('aria-label')).toBe('Home')

    const hidden = mount(NavIcon, { props: { iconClass: 'i-carbon-home' } })
    expect(hidden.attributes('aria-hidden')).toBe('true')
  })
})
