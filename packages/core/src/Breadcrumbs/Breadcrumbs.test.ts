import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
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

  it('applies variant class to items', () => {
    const wrapper = mount(Breadcrumbs, {
      props: { variant: 'supporting' },
      slots: {
        default: () => h(BreadcrumbItem, { href: '/' }, () => 'Home'),
      },
    })

    expect(wrapper.find('.astryx-breadcrumb-item--variant-supporting').exists()).toBe(true)
  })
})
