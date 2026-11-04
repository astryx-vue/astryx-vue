import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { resetMenuPress } from '../composables/useMenuPress.js'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuSubMenu from './DropdownMenuSubMenu.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  resetMenuPress()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const Host = defineComponent({
  components: { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu },
  data: () => ({ open: true }),
  template: `
    <button id="close-root" type="button" @click="open = false">Close root</button>
    <DropdownMenu v-model:is-menu-open="open" :button="{ label: 'Actions' }">
      <DropdownMenuSubMenu label="Move to" presentation="flyout">
        <DropdownMenuSubMenu label="Deeper" presentation="flyout">
          <DropdownMenuItem label="Folder" />
        </DropdownMenuSubMenu>
      </DropdownMenuSubMenu>
    </DropdownMenu>
  `,
})

function renderMenu() {
  const wrapper = mount(Host, { attachTo: document.body })
  const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
  const root = document.querySelector<HTMLElement>('.astryx-dropdown-menu:not(.astryx-dropdown-submenu)')!
  return { wrapper, trigger, root }
}

function row(label: string): HTMLElement {
  return [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    .find(item => item.textContent?.includes(label))!
}

function closeRoot(): void {
  document.querySelector<HTMLButtonElement>('#close-root')!.click()
}

describe('dropdownMenuSubMenu 根菜单关闭', () => {
  it('外部关闭根菜单时收好所有子菜单，重开不保留旧状态', async () => {
    const { wrapper, trigger, root } = renderMenu()
    await flushPromises()
    row('Move to').click()
    await flushPromises()
    row('Deeper').click()
    await flushPromises()
    expect(row('Move to').getAttribute('aria-expanded')).toBe('true')
    expect(row('Deeper').getAttribute('aria-expanded')).toBe('true')

    closeRoot()
    await flushPromises()
    expect(root.style.display).toBe('none')
    expect(row('Move to').getAttribute('aria-expanded')).toBe('false')
    expect(row('Deeper').getAttribute('aria-expanded')).toBe('false')
    expect(wrapper.findAllComponents(DropdownMenuSubMenu).map(component => component.emitted('openChange')))
      .toEqual([[[true], [false]], [[true], [false]]])

    trigger.click()
    await flushPromises()
    expect(root.style.display).not.toBe('none')
    expect(row('Move to').getAttribute('aria-expanded')).toBe('false')
    expect(row('Deeper').getAttribute('aria-expanded')).toBe('false')
  })

  it('根菜单关闭会取消尚未到期的悬停打开', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(hover: hover)',
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))
    const { root } = renderMenu()
    await flushPromises()
    const submenu = row('Move to')
    submenu.dispatchEvent(new MouseEvent('mouseenter'))

    closeRoot()
    await flushPromises()
    expect(root.style.display).toBe('none')
    vi.advanceTimersByTime(300)
    await flushPromises()

    expect(submenu.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector<HTMLElement>('.astryx-dropdown-submenu')!.style.display).toBe('none')
  })
})
