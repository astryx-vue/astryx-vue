import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import SideNav from './SideNav.vue'
import SideNavCollapseButton from './SideNavCollapseButton.vue'
import SideNavItem from './SideNavItem.vue'

describe('sideNavCollapseButton', () => {
  it('renders the shared ghost button at the size its container cascades', () => {
    const inside = mount(SideNav, {
      props: { collapsible: true },
      slots: { default: () => h(SideNavItem, { href: '/home', label: 'Home' }) },
    })
    const button = inside.get('.astryx-side-nav-collapse')
    expect(button.classes()).toContain('astryx-button')
    expect(button.attributes('data-variant')).toBe('ghost')
    expect(button.attributes('data-size')).toBe('sm')
    expect(button.attributes('data-icon-only')).toBe('true')
    expect(button.attributes('aria-label')).toBe('Collapse sidebar')
    inside.unmount()
  })

  it('carries the chevron in the icon slot and flips it when collapsed', async () => {
    const wrapper = mount(SideNavCollapseButton, { props: { isCollapsed: false } })
    const icon = wrapper.get('.astryx-button__icon')
    expect(icon.find('.astryx-side-nav-collapse__mirror').exists()).toBe(true)
    expect(wrapper.get('.astryx-side-nav-collapse__chevron').classes())
      .not
      .toContain('astryx-side-nav-collapse__chevron--collapsed')

    await wrapper.setProps({ isCollapsed: true })
    expect(wrapper.get('.astryx-side-nav-collapse__chevron').classes())
      .toContain('astryx-side-nav-collapse__chevron--collapsed')
    wrapper.unmount()
  })

  it('drives a controlled collapsible config handed in from outside', async () => {
    const onCollapsedChange = vi.fn()
    const wrapper = mount(SideNavCollapseButton, {
      props: { collapsible: { isCollapsed: false, onCollapsedChange } },
    })

    expect(wrapper.get('.astryx-side-nav-collapse').attributes('aria-label')).toBe('Collapse sidebar')
    expect(wrapper.get('.astryx-side-nav-collapse').attributes('aria-expanded')).toBe('true')

    await wrapper.get('.astryx-side-nav-collapse').trigger('click')
    expect(onCollapsedChange).toHaveBeenCalledWith(true)
    wrapper.unmount()
  })

  it('reads the collapsed state and accessible name from the config it is given', () => {
    const wrapper = mount(SideNavCollapseButton, {
      props: { collapsible: { isCollapsed: true, onCollapsedChange: () => {} } },
    })

    expect(wrapper.get('.astryx-side-nav-collapse').attributes('aria-label')).toBe('Expand sidebar')
    expect(wrapper.get('.astryx-side-nav-collapse').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('lets the controlled config outrank the isCollapsed model', async () => {
    const onCollapsedChange = vi.fn()
    const wrapper = mount(SideNavCollapseButton, {
      props: { isCollapsed: false, collapsible: { isCollapsed: true, onCollapsedChange } },
    })

    expect(wrapper.get('.astryx-side-nav-collapse').attributes('aria-label')).toBe('Expand sidebar')

    await wrapper.get('.astryx-side-nav-collapse').trigger('click')
    expect(onCollapsedChange).toHaveBeenCalledWith(false)
    expect(wrapper.emitted('update:isCollapsed')).toBeUndefined()
    wrapper.unmount()
  })

  it('turns into a text button when a label is given and honours size', async () => {
    const wrapper = mount(SideNavCollapseButton, { props: { isCollapsed: false, label: 'Hide rail' } })
    const button = wrapper.get('.astryx-side-nav-collapse')

    expect(button.attributes('data-size')).toBe('md')
    expect(button.attributes('data-icon-only')).toBeUndefined()
    expect(button.attributes('aria-label')).toBeUndefined()
    expect(button.text()).toContain('Hide rail')

    await wrapper.setProps({ size: 'lg' })
    expect(wrapper.get('.astryx-side-nav-collapse').attributes('data-size')).toBe('lg')
    wrapper.unmount()
  })

  it('stays hidden outside a collapsible sidebar with no state to read', () => {
    const wrapper = mount(SideNavCollapseButton)
    expect(wrapper.find('button').exists()).toBe(false)
  })
})
