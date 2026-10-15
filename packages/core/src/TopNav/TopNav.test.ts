import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import NavHeadingMenu from '../NavMenu/NavHeadingMenu.vue'
import NavHeadingMenuItem from '../NavMenu/NavHeadingMenuItem.vue'
import TopNav from './TopNav.vue'
import TopNavHeading from './TopNavHeading.vue'
import TopNavMegaMenu from './TopNavMegaMenu.vue'
import TopNavMegaMenuFeaturedCard from './TopNavMegaMenuFeaturedCard.vue'
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

  it('splits a heading into linked lines and a menu trigger', async () => {
    const wrapper = mount(TopNavHeading, {
      attachTo: document.body,
      props: {
        heading: 'Console',
        headingHref: '/console',
        subheading: 'Northwind',
        superheading: 'Suite',
        superheadingHref: '/suite',
      },
      slots: {
        menu: () => h(NavHeadingMenu, () => h(NavHeadingMenuItem, { href: '/switch', label: 'Switch' })),
      },
    })

    expect(wrapper.get('a[href="/suite"]').text()).toContain('Suite')
    expect(wrapper.get('a[href="/console"]').text()).toContain('Console')
    expect(wrapper.text()).toContain('Northwind')
    await wrapper.get('[aria-label="Open menu"]').trigger('click')
    await nextTick()
    expect(document.body.textContent).toContain('Switch')
    wrapper.unmount()
  })

  it('shows a decorative image and a separate call to action on a featured card', () => {
    const card = mount(TopNavMegaMenuFeaturedCard, {
      props: {
        description: 'Realtime collaboration.',
        image: '/promo.png',
        linkHref: '/blog',
        linkLabel: 'Read the announcement',
        title: 'What is new',
      },
    })
    const image = card.get('img')
    expect(image.attributes('alt')).toBe('')
    expect(image.attributes('role')).toBe('presentation')
    expect(card.get('a').attributes('href')).toBe('/blog')
    expect(card.get('a').text()).toContain('Read the announcement')
    expect(card.element.tagName).not.toBe('A')

    const linked = mount(TopNavMegaMenuFeaturedCard, {
      props: { href: '/blog', title: 'What is new' },
    })
    expect(linked.element.tagName).toBe('A')
    expect(linked.attributes('href')).toBe('/blog')
  })
})
