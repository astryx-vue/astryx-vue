import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import BreadcrumbItem from './BreadcrumbItem.vue'
import Breadcrumbs from './Breadcrumbs.vue'

describe('breadcrumbs', () => {
  it('renders a nav with ordered list', () => {
    const wrapper = mount(Breadcrumbs, {
      slots: {
        default: '<li>Item</li>',
      },
    })

    expect(wrapper.find('nav').exists()).toBe(true)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Breadcrumb')
    expect(wrapper.find('ol').exists()).toBe(true)
  })

  it('uses custom label', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { label: 'Path' },
      slots: { default: '<li>Item</li>' },
    })

    expect(wrapper.find('nav').attributes('aria-label')).toBe('Path')
  })

  it('renders separators between items', () => {
    const wrapper = mount(Breadcrumbs, {
      slots: {
        default: () => [
          h(BreadcrumbItem, { href: '/' }, () => 'Home'),
          h(BreadcrumbItem, { href: '/docs' }, () => 'Docs'),
          h(BreadcrumbItem, { isCurrent: true }, () => 'Current'),
        ],
      },
    })

    const separators = wrapper.findAll('.astryx-breadcrumb-item__separator')
    expect(separators.length).toBe(3)
    expect(separators[0].text()).toBe('/')
  })

  it('marks current page with aria-current', () => {
    const wrapper = mount(Breadcrumbs, {
      slots: {
        default: () => [
          h(BreadcrumbItem, { href: '/' }, () => 'Home'),
          h(BreadcrumbItem, { isCurrent: true }, () => 'Current'),
        ],
      },
    })

    const current = wrapper.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('Current')
  })

  it('renders a button when href is absent and item is not current', () => {
    const wrapper = mount(BreadcrumbItem, {
      slots: { default: 'Action' },
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Action')
  })

  it('emits click event from an item', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BreadcrumbItem, {
      props: { href: '/' },
      attrs: { onClick },
      slots: { default: 'Home' },
    })

    await wrapper.find('a').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('renders the passed link component for a non-current crumb', () => {
    const RouterLink = defineComponent({
      props: { to: { type: String, default: '' } },
      setup(_props, { slots }) {
        return () => h('a', { 'data-router-link': 'true' }, slots.default?.())
      },
    })
    const wrapper = mount(BreadcrumbItem, {
      props: { as: RouterLink, href: '/docs' },
      slots: { default: 'Docs' },
    })

    expect(wrapper.get('[data-router-link="true"]').text()).toBe('Docs')
    expect(wrapper.get('a').attributes('href')).toBe('/docs')
  })

  it('applies variant class to items', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { variant: 'supporting' },
      slots: {
        default: () => h(BreadcrumbItem, { href: '/' }, () => 'Home'),
      },
    })

    expect(wrapper.find('.astryx-breadcrumb-item--variant-supporting').exists()).toBe(true)
  })

  it('follows the variant and separator when they change', async () => {
    const wrapper = mount(Breadcrumbs, {
      props: { variant: 'default', separator: '/' },
      slots: {
        default: () => h(BreadcrumbItem, { href: '/' }, () => 'Home'),
      },
    })

    expect(wrapper.find('.astryx-breadcrumb-item--variant-default').exists()).toBe(true)
    expect(wrapper.find('.astryx-breadcrumb-item__separator').text()).toBe('/')

    await wrapper.setProps({ variant: 'supporting', separator: '>' })

    expect(wrapper.find('.astryx-breadcrumb-item--variant-supporting').exists()).toBe(true)
    expect(wrapper.find('.astryx-breadcrumb-item__separator').text()).toBe('>')
  })

  it('renders a menu trigger and ignores href when menu is set', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Breadcrumbs, {
      slots: {
        default: () => h(BreadcrumbItem, {
          href: '/teams',
          menu: [
            { label: 'Design' },
            { label: 'Engineering' },
            { type: 'divider' },
            { label: 'Data' },
          ],
        }, () => 'Teams'),
      },
    })

    const trigger = wrapper.get('button')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.text()).toContain('Teams')
    expect(wrapper.find('a').exists()).toBe(false)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('keeps aria-current on a current crumb that opens a menu', () => {
    const wrapper = mount(Breadcrumbs, {
      slots: {
        default: () => h(BreadcrumbItem, {
          isCurrent: true,
          menu: [{ label: 'Overview' }],
        }, () => 'Overview'),
      },
    })

    const trigger = wrapper.get('button')
    expect(trigger.attributes('aria-current')).toBe('page')
    expect(trigger.attributes('aria-haspopup')).toBe('menu')
  })
})
