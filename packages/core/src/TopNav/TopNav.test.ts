import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import TopNav from './TopNav.vue'
import TopNavMegaMenu from './TopNavMegaMenu.vue'
import TopNavMegaMenuItem from './TopNavMegaMenuItem.vue'
import TopNavMenu from './TopNavMenu.vue'

describe('top-nav', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('opens a menu from the bar and a mega menu panel', async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      slots: {
        default: () => [
          h(TopNavMenu, {
            items: [{ href: '/analytics', label: 'Analytics' }],
            label: 'Product',
          }),
          h(TopNavMegaMenu, { label: 'Solutions' }, () => h(TopNavMegaMenuItem, {
            href: '/teams',
            title: 'Teams',
          })),
        ],
      },
    })

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Top navigation')
    const triggers = wrapper.findAll('button')
    await triggers[0].trigger('click')
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')?.textContent).toContain('Analytics')

    await triggers[1].trigger('click')
    await nextTick()
    expect(document.body.textContent).toContain('Teams')
    wrapper.unmount()
  })

  it('moves the start slot into the mobile drawer when the query matches', async () => {
    vi.stubGlobal('matchMedia', () => ({
      addEventListener: () => {},
      matches: true,
      removeEventListener: () => {},
    }))

    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: {
        default: () => h(TopNavMenu, {
          items: [{ label: 'Analytics' }],
          label: 'Product',
        }),
      },
    })
    await nextTick()
    expect(wrapper.get('nav').text()).not.toContain('Product')
    expect(wrapper.find('[aria-label="Open menu"]').exists()).toBe(true)

    await wrapper.get('[aria-label="Open menu"]').trigger('click')
    await nextTick()
    const dialog = document.body.querySelector('dialog')
    expect(dialog?.hasAttribute('open')).toBe(true)
    expect(dialog?.textContent).toContain('Product')
    wrapper.unmount()
  })
})
