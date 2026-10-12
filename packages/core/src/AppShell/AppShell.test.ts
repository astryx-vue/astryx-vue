import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { useAppShellMobile } from '../composables/useAppShellMobile.js'
import SideNav from '../SideNav/SideNav.vue'
import SideNavHeading from '../SideNav/SideNavHeading.vue'
import AppShell from './AppShell.vue'

const Outside = defineComponent({
  setup() {
    const shell = useAppShellMobile()
    return { shell }
  },
  template: '<span class="enabled">{{ shell.isMobileNavEnabled }}</span><span class="mobile">{{ shell.isMobile }}</span>',
})

describe('app shell', () => {
  it('renders a skip link, main landmark, and side navigation', () => {
    const wrapper = mount(AppShell, {
      props: { contentPadding: 6, variant: 'elevated' },
      slots: {
        sideNav: '<nav>App Shell</nav>',
        default: '<p>Page Content</p>',
      },
      attrs: { style: 'height: 100%' },
    })

    const skip = wrapper.get('.astryx-app-shell__skip')
    expect(skip.attributes('href')).toBe('#astryx-app-shell-main')
    expect(skip.text()).toBe('Skip to content')
    const main = wrapper.get('[role="main"]')
    expect(main.attributes('id')).toBe('astryx-app-shell-main')
    expect(main.attributes('tabindex')).toBe('-1')
    expect(main.text()).toContain('Page Content')
    expect(wrapper.get('.astryx-layout-panel').text()).toContain('App Shell')
    expect(wrapper.attributes('data-variant')).toBe('elevated')
  })

  it('shows the side nav title and open navigation control below the breakpoint', () => {
    const original = window.matchMedia
    window.matchMedia = vi.fn(() => ({
      matches: true,
      media: '(width < 768px)',
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia

    const wrapper = mount(AppShell, {
      props: { contentPadding: 6 },
      slots: {
        sideNav: () => h(SideNav, null, {
          header: () => h(SideNavHeading, { heading: 'App Shell' }),
          default: () => h('a', { href: '#' }, 'Dashboard'),
        }),
        default: () => h('p', 'Page Content'),
      },
    })

    const bar = wrapper.get('.astryx-app-shell__mobile-bar')
    expect(bar.text()).toContain('App Shell')
    expect(bar.text()).not.toContain('Dashboard')
    expect(bar.get('button').attributes('aria-label')).toBe('Open navigation')
    expect(wrapper.find('.astryx-app-shell__sidenav').exists()).toBe(false)
    expect(wrapper.get('.astryx-mobile-nav').text()).toContain('Dashboard')
    wrapper.unmount()
    window.matchMedia = original
  })

  it('returns inert defaults outside a shell', () => {
    const wrapper = mount(Outside)
    expect(wrapper.get('.enabled').text()).toBe('false')
    expect(wrapper.get('.mobile').text()).toBe('false')
  })
})
