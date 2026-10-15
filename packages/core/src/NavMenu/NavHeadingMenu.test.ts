import type { NavMenuFocusRequest } from './context.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { navMenuFocusKey } from './context.js'
import NavHeadingMenu from './NavHeadingMenu.vue'
import NavHeadingMenuItem from './NavHeadingMenuItem.vue'

const RouterLink = defineComponent({
  name: 'RouterLink',
  props: { to: String, href: String },
  setup(props, { slots }) {
    return () => h('a', { 'data-to': props.to, 'href': props.href }, slots.default?.())
  },
})

describe('nav heading menu', () => {
  it('renders a menu and skips a disabled item', async () => {
    const onClick = vi.fn()
    const wrapper = mount(NavHeadingMenu, {
      attachTo: document.body,
      props: { minWidth: 280, size: 'lg' },
      slots: {
        default: () => [
          h(NavHeadingMenuItem, { label: 'Dashboard', href: '/dashboard' }),
          h(NavHeadingMenuItem, { description: 'View metrics', label: 'Analytics', onClick }),
          h(NavHeadingMenuItem, { isDisabled: true, label: 'Archived', onClick }),
        ],
      },
    })

    const menu = wrapper.get('[role="menu"]')
    expect(menu.classes()).toContain('astryx-nav-menu--lg')
    expect(menu.attributes('style')).toContain('280px')
    const items = wrapper.findAll('[role="menuitem"]')
    expect(items).toHaveLength(3)
    expect(items[0].element.tagName).toBe('A')
    expect(items[0].attributes('href')).toBe('/dashboard')
    expect(items[1].element.tagName).toBe('DIV')
    expect(items[1].text()).toContain('View metrics')
    expect(items[2].attributes('aria-disabled')).toBe('true')

    await items[2].trigger('click')
    expect(onClick).not.toHaveBeenCalled()

    const first = items[0].element as HTMLElement
    first.focus()
    await items[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[1].element)
    await items[1].trigger('keydown', { key: 'Enter' })
    expect(onClick).toHaveBeenCalledOnce()
    wrapper.unmount()
  })

  it('uses a custom link component and focuses the requested item', async () => {
    const focus = ref<NavMenuFocusRequest>('first')
    const wrapper = mount(NavHeadingMenu, {
      attachTo: document.body,
      global: {
        provide: {
          [navMenuFocusKey as symbol]: focus,
        },
      },
      slots: {
        default: () => [
          h(NavHeadingMenuItem, { as: RouterLink, href: '/docs', label: 'Docs' }),
          h(NavHeadingMenuItem, { label: 'Settings' }),
        ],
      },
    })
    await nextTick()
    const items = wrapper.findAll('[role="menuitem"]')
    expect(items[0].attributes('data-to')).toBe('/docs')
    expect(document.activeElement).toBe(items[0].element)
    wrapper.unmount()
  })
})
