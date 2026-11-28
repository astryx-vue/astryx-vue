import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { resetMenuPress } from '../composables/useMenuPress.js'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuSubMenu from './DropdownMenuSubMenu.vue'

const { announce } = vi.hoisted(() => ({ announce: vi.fn() }))

vi.mock('../composables/internal/announce.js', async importOriginal => ({
  ...await importOriginal<typeof import('../composables/internal/announce.js')>(),
  useAnnouncer: () => announce,
}))

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  resetMenuPress()
  announce.mockClear()
  vi.useRealTimers()
})

const Host = defineComponent({
  components: { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu },
  props: { delay: { type: Number, default: undefined }, hideDelay: { type: Number, default: undefined }, hasSpinner: Boolean },
  template: `
    <DropdownMenu :button="{ label: 'Actions' }">
      <DropdownMenuSubMenu label="Move to" presentation="flyout" :delay="delay" :hide-delay="hideDelay" :has-spinner="hasSpinner">
        <DropdownMenuItem label="Folder" />
      </DropdownMenuSubMenu>
    </DropdownMenu>
  `,
})

function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(Host, { attachTo: document.body, props })
  const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
  const root = document.querySelector<HTMLElement>('.astryx-dropdown-menu:not(.astryx-dropdown-submenu)')!
  return { wrapper, trigger, root }
}

function row(label: string): HTMLElement {
  return [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    .find(item => item.textContent?.includes(label))!
}

function keydown(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }))
}

describe('dropdownMenuSubMenu: Tab', () => {
  it('飞出层里按 Tab 关掉整个菜单，不只是这一层', async () => {
    const { trigger, root } = render()
    trigger.click()
    await flushPromises()
    row('Move to').click()
    await flushPromises()
    expect(row('Move to').getAttribute('aria-expanded')).toBe('true')

    const folder = row('Folder')
    folder.focus()
    keydown(folder, 'Tab')
    await flushPromises()

    expect(root.style.display).toBe('none')
    expect(row('Move to').getAttribute('aria-expanded')).toBe('false')
  })
})

describe('dropdownMenuSubMenu: delay 与 hideDelay', () => {
  it('悬停等到 delay 才打开，离开等到 hideDelay 才关', async () => {
    vi.useFakeTimers()
    const { trigger } = render({ delay: 400, hideDelay: 600 })
    trigger.click()
    await vi.advanceTimersByTimeAsync(0)
    const moveTo = row('Move to')

    moveTo.dispatchEvent(new MouseEvent('mouseenter', { bubbles: false }))
    await vi.advanceTimersByTimeAsync(399)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    moveTo.dispatchEvent(new MouseEvent('mouseleave', { bubbles: false }))
    await vi.advanceTimersByTimeAsync(599)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
  })
})

describe('dropdownMenuSubMenu: 忙碌', () => {
  it('转圈是装饰，菜单显示出来后播报一次加载中', async () => {
    const { trigger } = render({ hasSpinner: true })
    expect(announce).not.toHaveBeenCalled()

    trigger.click()
    await flushPromises()
    await new Promise(resolve => requestAnimationFrame(resolve))

    expect(row('Move to').querySelector('[aria-hidden="true"] .astryx-spinner')).not.toBeNull()
    expect(announce).toHaveBeenCalledTimes(1)
    expect(announce.mock.calls[0]![0]).toBe('Loading')
  })
})
