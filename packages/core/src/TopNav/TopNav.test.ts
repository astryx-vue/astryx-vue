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

  it('labels the mega menu panel as a group around the items and the featured card', async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      slots: {
        default: () => h(TopNavMegaMenu, { label: 'Solutions' }, {
          default: () => h(TopNavMegaMenuItem, { href: '/teams', title: 'Teams' }),
          featured: () => h(TopNavMegaMenuFeaturedCard, { title: 'What is new' }),
        }),
      },
    })

    await wrapper.get('.astryx-top-nav-menu__trigger').trigger('click')
    await nextTick()
    const group = document.body.querySelector('[role="group"]')
    expect(group?.getAttribute('aria-label')).toBe('Solutions')
    expect(group?.querySelector('.astryx-top-nav-mega__items')?.textContent).toContain('Teams')
    expect(group?.querySelector('.astryx-top-nav-mega__featured')?.textContent).toContain('What is new')
    wrapper.unmount()
  })

  it('opens the mega menu from the keyboard and walks the items with the arrow keys', async () => {
    const wrapper = mount(TopNav, {
      attachTo: document.body,
      slots: {
        default: () => h(TopNavMegaMenu, { label: 'Solutions' }, () => [
          h(TopNavMegaMenuItem, { href: '/teams', title: 'Teams' }),
          h(TopNavMegaMenuItem, { href: '/charts', title: 'Charts' }),
        ]),
      },
    })

    const trigger = wrapper.get('.astryx-top-nav-menu__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    const items = [...document.body.querySelectorAll<HTMLElement>('.astryx-top-nav-mega-item')]
    expect(items).toHaveLength(2)
    expect(document.activeElement).toBe(items[0])

    items[0]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }))
    expect(document.activeElement).toBe(items[1])

    items[1]?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }))
    expect(document.activeElement).toBe(items[1])

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await nextTick()
    expect(document.body.querySelector('.astryx-top-nav-mega-item')).toBeNull()
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('links the drawer trigger to the items it expands', async () => {
    vi.stubGlobal('matchMedia', () => ({
      addEventListener: () => {},
      matches: true,
      removeEventListener: () => {},
    }))

    const wrapper = mount(TopNav, {
      attachTo: document.body,
      props: { mobileQuery: '(max-width: 600px)' },
      slots: {
        default: () => h(TopNavMegaMenu, { label: 'Solutions' }, () => h(TopNavMegaMenuItem, {
          href: '/teams',
          title: 'Teams',
        })),
      },
    })

    await wrapper.get('[aria-label="Open menu"]').trigger('click')
    await nextTick()
    const drawerTrigger = document.body.querySelector<HTMLElement>('.astryx-top-nav-menu__drawer-trigger')
    const panelId = drawerTrigger?.getAttribute('aria-controls')
    expect(panelId).toBeTruthy()
    expect(document.getElementById(panelId ?? '')?.textContent).toContain('Teams')
    expect(drawerTrigger?.getAttribute('aria-expanded')).toBe('false')

    drawerTrigger?.click()
    await nextTick()
    expect(drawerTrigger?.getAttribute('aria-expanded')).toBe('true')
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

  it('wraps the icon class of a mega menu item in a fixed-size box', () => {
    const wrapper = mount(TopNavMegaMenuItem, { props: { title: 'Deploy', iconClass: 'i-carbon-rocket' } })

    const box = wrapper.get('.astryx-top-nav-mega-item__icon > .astryx-top-nav-mega-item__glyph-box')
    expect(box.get('.astryx-top-nav-mega-item__glyph').classes()).toContain('i-carbon-rocket')
  })
})
