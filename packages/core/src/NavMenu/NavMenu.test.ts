import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import NavDisclosure from './NavDisclosure.vue'
import NavMenu from './NavMenu.vue'
import NavMenuItem from './NavMenuItem.vue'

function items() {
  return [
    h(NavMenuItem, { label: 'Profile' }),
    h(NavMenuItem, { label: 'Settings' }),
  ]
}

describe('nav-menu', () => {
  it('moves with the arrow keys, matches a typed prefix, and closes on Escape', async () => {
    const wrapper = mount(NavMenu, {
      attachTo: document.body,
      props: { label: 'Account' },
      slots: { default: () => items() },
    })
    const menuItems = wrapper.findAll('[role="menuitem"]')
    expect(wrapper.attributes('role')).toBe('menu')
    expect(menuItems[0].attributes('tabindex')).toBe('-1')

    ;(menuItems[0].element as HTMLElement).focus()
    await menuItems[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(menuItems[1].element)

    await menuItems[1].trigger('keydown', { key: 'p' })
    expect(document.activeElement).toBe(menuItems[0].element)

    await menuItems[0].trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('opens from the trigger with ArrowDown and closes after choosing an item', async () => {
    const Host = defineComponent({
      components: { NavDisclosure, NavMenu, NavMenuItem },
      template: `
        <NavDisclosure label="Account">
          <template #trigger="{ isOpen }">
            <button type="button">{{ isOpen ? 'Open' : 'Closed' }}</button>
          </template>
          <template #default="{ close, focusRequest }">
            <NavMenu label="Account" :focus-request="focusRequest" @close="close">
              <NavMenuItem label="Profile" />
              <NavMenuItem label="Settings" />
            </NavMenu>
          </template>
        </NavDisclosure>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })

    await wrapper.get('button').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const menu = document.body.querySelector('[role="menu"]')
    expect(menu).not.toBeNull()
    expect(document.activeElement?.textContent).toContain('Profile')

    const settings = [...(menu?.querySelectorAll('[role="menuitem"]') ?? [])].find(item => item.textContent?.includes('Settings'))
    settings?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(document.body.querySelector('[role="menu"]')).toBeNull()
    wrapper.unmount()
  })
})
