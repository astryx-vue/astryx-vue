import type { SideNavHandle } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import SideNav from './SideNav.vue'
import SideNavItem from './SideNavItem.vue'
import SideNavSection from './SideNavSection.vue'

describe('side-nav', () => {
  it('collapses to an icon rail and restores the labels', async () => {
    const wrapper = mount(SideNav, {
      attachTo: document.body,
      props: { collapsible: true },
      slots: {
        default: () => h(SideNavItem, {
          href: '/home',
          iconClass: 'i-carbon-home',
          label: 'Home',
        }),
      },
    })

    const nav = wrapper.get('nav')
    expect(nav.attributes('aria-label')).toBe('Sidebar')
    expect(nav.attributes('data-collapsed')).toBeUndefined()
    expect(wrapper.get('.astryx-side-nav__heading-row').find('[aria-label="Collapse sidebar"]').exists()).toBe(true)
    expect(wrapper.find('.astryx-side-nav__bottom [aria-label="Collapse sidebar"]').exists()).toBe(false)

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')
    expect(nav.attributes('data-collapsed')).toBe('true')
    expect(wrapper.get('a').attributes('aria-label')).toBe('Home')
    expect(wrapper.find('[aria-label="Expand sidebar"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Expand sidebar"]').trigger('click')
    expect(nav.attributes('data-collapsed')).toBeUndefined()
    expect(wrapper.get('a').text()).toContain('Home')
    wrapper.unmount()
  })

  it('toggles a nested group and keeps the link separate when the item has an address', async () => {
    const wrapper = mount(SideNav, {
      slots: {
        default: () => [
          h(SideNavSection, { title: 'Library' }, () => h(SideNavItem, {
            href: '/files',
            label: 'Files',
          }, () => h(SideNavItem, { href: '/files/recent', label: 'Recent' }))),
        ],
      },
    })

    expect(wrapper.get('[role="group"]').attributes('aria-labelledby')).toBeTruthy()
    const link = wrapper.get('a[href="/files"]')
    const toggle = wrapper.get('[aria-label="Collapse Files"]')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await link.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('true')

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    const controlled = wrapper.get(`#${CSS.escape(toggle.attributes('aria-controls') ?? '')}`)
    expect(controlled.attributes('aria-hidden')).toBe('true')
    expect(controlled.classes()).toContain('astryx-side-nav-item__children--collapsed')
    wrapper.unmount()
  })

  it('follows the collapse hotkey', async () => {
    const wrapper = mount(SideNav, {
      attachTo: document.body,
      props: { collapsible: { hotkey: 'mod+\\' } },
      slots: {
        default: () => h(SideNavItem, { label: 'Home', href: '/home', iconClass: 'i-carbon-home' }),
      },
    })
    await nextTick()
    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: '\\' }))
    await nextTick()
    expect(wrapper.get('nav').attributes('data-collapsed')).toBe('true')
    wrapper.unmount()
  })

  it('resizes from the end edge and hides the handle while collapsed', async () => {
    const wrapper = mount(SideNav, {
      props: {
        collapsible: true,
        resizable: { defaultWidth: 280 },
      },
      slots: {
        default: () => h(SideNavItem, { href: '/home', label: 'Home' }),
      },
    })

    const nav = wrapper.get('nav')
    expect(nav.attributes('style')).toContain('280px')
    const handle = wrapper.get('[role="separator"]')
    expect(handle.attributes('aria-controls')).toBe(nav.attributes('id'))
    expect(handle.attributes('aria-label')).toBe('Resize sidebar')

    await wrapper.get('[aria-label="Collapse sidebar"]').trigger('click')
    expect(nav.attributes('data-collapsed')).toBe('true')
    expect(wrapper.find('[role="separator"]').exists()).toBe(false)
    expect(nav.attributes('style') ?? '').not.toContain('280px')
    wrapper.unmount()
  })

  it('toggles through handleRef', async () => {
    const handle = ref<SideNavHandle | null>(null)
    const wrapper = mount(SideNav, {
      props: { collapsible: true, handleRef: handle },
      slots: {
        default: () => h(SideNavItem, { href: '/home', label: 'Home' }),
      },
    })
    await nextTick()
    handle.value?.collapse()
    await nextTick()
    expect(wrapper.get('nav').attributes('data-collapsed')).toBe('true')
    expect(handle.value?.isCollapsed).toBe(true)
    wrapper.unmount()
  })
})
