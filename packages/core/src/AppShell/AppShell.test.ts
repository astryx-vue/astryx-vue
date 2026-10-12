import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { useAppShellMobile } from '../composables/useAppShellMobile.js'
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

  it('returns inert defaults outside a shell', () => {
    const wrapper = mount(Outside)
    expect(wrapper.get('.enabled').text()).toBe('false')
    expect(wrapper.get('.mobile').text()).toBe('false')
  })
})
