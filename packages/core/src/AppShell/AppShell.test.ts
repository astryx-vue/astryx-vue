import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useAppShellMobile } from '../composables/useAppShellMobile.js'
import { provideLayoutContainer, useLayoutContainer, useLayoutDividers } from '../Layout/context.js'
import Layout from '../Layout/Layout.vue'
import SideNav from '../SideNav/SideNav.vue'
import SideNavHeading from '../SideNav/SideNavHeading.vue'
import AppShell from './AppShell.vue'

enableAutoUnmount(afterEach)

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

  it('makes main a keyboard stop only while its content overflows under fill height', async () => {
    const wrapper = mount(AppShell, {
      attachTo: document.body,
      props: { height: 'fill' },
      slots: { default: () => h('p', 'Page Content') },
    })
    const main = wrapper.get('[role="main"]').element as HTMLElement
    const box = { clientWidth: 200, clientHeight: 100, scrollWidth: 200, scrollHeight: 100, scrollTop: 0, scrollLeft: 0 }
    for (const key of Object.keys(box) as (keyof typeof box)[])
      Object.defineProperty(main, key, { configurable: true, get: () => box[key] })
    main.style.overflowX = 'auto'
    main.style.overflowY = 'auto'
    const remeasure = async (): Promise<void> => {
      window.dispatchEvent(new Event('resize'))
      await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
      await nextTick()
    }

    await remeasure()
    expect(main.getAttribute('tabindex')).toBe('-1')

    box.scrollHeight = 400
    await remeasure()
    expect(main.getAttribute('tabindex')).toBe('0')
    expect(main.getAttribute('role')).toBe('main')
    expect(main.getAttribute('aria-label')).toBeNull()

    box.scrollHeight = 100
    await remeasure()
    expect(main.getAttribute('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('does not draw the ring on main when the skip link focuses it', async () => {
    const wrapper = mount(AppShell, { attachTo: document.body, slots: { default: () => h('p', 'Page Content') } })
    await wrapper.get('.astryx-app-shell__skip').trigger('click')
    expect(wrapper.get('[role="main"]').attributes('data-programmatic-focus')).toBe('true')
    wrapper.unmount()
  })

  it('returns inert defaults outside a shell', () => {
    const wrapper = mount(Outside)
    expect(wrapper.get('.enabled').text()).toBe('false')
    expect(wrapper.get('.mobile').text()).toBe('false')
  })

  describe('main id', () => {
    it('gives a second shell on the page its own main id and keeps the first on the fixed one', async () => {
      const first = mount(AppShell, { slots: { default: '<p>One</p>' }, attachTo: document.body })
      const second = mount(AppShell, { slots: { default: '<p>Two</p>' }, attachTo: document.body })
      await nextTick()
      const firstId = first.get('[role="main"]').attributes('id')
      const secondId = second.get('[role="main"]').attributes('id')
      expect(firstId).toBe('astryx-app-shell-main')
      expect(secondId).not.toBe(firstId)
      expect(second.get('.astryx-app-shell__skip').attributes('href')).toBe(`#${secondId}`)
      first.unmount()
      second.unmount()
    })

    it('gives a shell nested in another shell its own main id', async () => {
      const Inner = { components: { AppShell }, template: '<AppShell><p>Inner</p></AppShell>' }
      const outer = mount(AppShell, { slots: { default: h(Inner) }, attachTo: document.body })
      await nextTick()
      const ids = outer.findAll('[role="main"]').map(node => node.attributes('id'))
      expect(ids).toHaveLength(2)
      expect(new Set(ids).size).toBe(2)
      expect(ids[0]).toBe('astryx-app-shell-main')
      outer.unmount()
    })

    it('hands the fixed id on once the first shell unmounts', async () => {
      const first = mount(AppShell, { slots: { default: '<p>One</p>' }, attachTo: document.body })
      first.unmount()
      const next = mount(AppShell, { slots: { default: '<p>Two</p>' }, attachTo: document.body })
      await nextTick()
      expect(next.get('[role="main"]').attributes('id')).toBe('astryx-app-shell-main')
      next.unmount()
    })
  })

  it('is a layout root: an ancestor Layout\'s divider default stops at the shell', () => {
    const Probe = defineComponent({
      setup() {
        const dividers = useLayoutDividers()
        return { dividers }
      },
      template: '<i class="probe">{{ String(dividers) }}</i>',
    })
    const Outer = defineComponent({
      components: { AppShell, Layout, Probe },
      template: '<Layout default-has-dividers><AppShell><template #mobileNav><Probe /></template></AppShell></Layout>',
    })
    const wrapper = mount(Outer)
    expect(wrapper.get('.probe').text()).toBe('undefined')
  })

  it('also stops the container a Card or Dialog names, so the shell\'s header and footer take none', () => {
    const Probe = defineComponent({
      setup() {
        return { container: useLayoutContainer() }
      },
      template: '<i class="probe">{{ String(container) }}</i>',
    })
    const Host = defineComponent({
      setup(_, { slots }) {
        provideLayoutContainer('card')
        return () => h('div', slots.default?.())
      },
    })
    const wrapper = mount(Host, {
      slots: { default: () => h(AppShell, null, { mobileNav: () => h(Probe) }) },
    })
    expect(wrapper.get('.probe').text()).toBe('null')
  })
})
