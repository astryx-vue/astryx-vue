import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { resetMenuPress } from '../composables/useMenuPress.js'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuGroup from './DropdownMenuGroup.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  resetMenuPress()
  vi.restoreAllMocks()
})

function row(label: string): HTMLElement {
  return [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')]
    .find(item => item.textContent?.includes(label))!
}

describe('dropdownMenu 数据模式：嵌套 items', () => {
  it('分组里带 items 的行也是子菜单，子菜单里的行可以再嵌套', async () => {
    mount(DropdownMenu, {
      attachTo: document.body,
      props: {
        items: [
          {
            type: 'section',
            title: 'File',
            items: [
              { label: 'Move to', items: [{ label: 'Folder' }, { label: 'Archive', items: [{ label: 'Old' }] }] },
              { label: 'Rename' },
            ],
          },
        ],
      },
    })
    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
    trigger.click()
    await flushPromises()

    const moveTo = row('Move to')
    expect(moveTo.getAttribute('aria-haspopup')).toBe('menu')
    expect(moveTo.closest('[role="group"]')).not.toBeNull()
    expect(row('Rename').hasAttribute('aria-haspopup')).toBe(false)
    expect(row('Archive').getAttribute('aria-haspopup')).toBe('menu')
  })
})

describe('dropdownMenuGroup', () => {
  it('有标题时名字归标题，没有标题时调用方给的 aria-labelledby 才生效', async () => {
    mount(defineComponent({
      render: () => h('div', [
        h('span', { id: 'outer-name' }, 'Outer'),
        h(DropdownMenuGroup, { 'title': 'Titled', 'aria-labelledby': 'outer-name', 'data-testid': 'titled' }),
        h(DropdownMenuGroup, { 'aria-labelledby': 'outer-name', 'data-testid': 'untitled' }),
      ]),
    }), { attachTo: document.body })

    const titled = document.querySelector<HTMLElement>('[data-testid="titled"]')!
    const untitled = document.querySelector<HTMLElement>('[data-testid="untitled"]')!
    expect(titled.getAttribute('aria-labelledby')).toBe(titled.querySelector('[id]')?.id)
    expect(untitled.getAttribute('aria-labelledby')).toBe('outer-name')
  })
})

describe('dropdownMenu 自定义触发器的名字', () => {
  async function openSheet(slotProps: Record<string, unknown>, attrs: Record<string, unknown> = {}) {
    const sheetLabels: string[] = []
    mount(DropdownMenu, {
      attachTo: document.body,
      props: { presentation: 'bottom-sheet', isMenuOpen: false, ...attrs },
      slots: {
        trigger: (triggerProps: object) => h('button', { type: 'button', ...triggerProps, ...slotProps }, 'Account'),
        default: () => h(DropdownMenuItem, { label: 'Profile' }),
      },
    })
    document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger button')!.click()
    await flushPromises()
    await vi.waitFor(() => expect(document.querySelector('.astryx-bottom-sheet-dialog')).not.toBeNull())
    sheetLabels.push(document.querySelector('.astryx-bottom-sheet-dialog')?.getAttribute('aria-label') ?? '')
    return sheetLabels[0]
  }

  it('底部弹层以触发器自己的可访问名称命名，而不是一律叫 Menu', async () => {
    expect(await openSheet({})).toBe('Account')
  })

  it('调用方给了 aria-label 就用它', async () => {
    expect(await openSheet({}, { 'aria-label': 'Account menu' })).toBe('Account menu')
  })
})

describe('dropdownMenu 指针打开', () => {
  it('指针按住时已经点亮的行，在打开这一帧里保持聚焦', async () => {
    mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'First' }, { label: 'Second' }] },
    })
    const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
    // 鼠标按下触发器就打开；按压带着指针滑进菜单点亮第二行，赶在聚焦这一帧之前。
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0 }))
    row('Second').focus()
    await flushPromises()

    expect(surface.style.display).not.toBe('none')
    expect(document.activeElement).toBe(row('Second'))
  })

  it('没有点亮任何行时，指针打开把焦点放在菜单本身', async () => {
    mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'First' }, { label: 'Second' }] },
    })
    const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0 }))
    await flushPromises()

    expect(document.activeElement).toBe(surface)
  })
})

describe('dropdownMenuItem 悬停聚焦', () => {
  it('指针按过之后悬停点亮的行聚焦时不带 :focus-visible', async () => {
    mount(DropdownMenu, {
      attachTo: document.body,
      props: { items: [{ label: 'First' }, { label: 'Second' }] },
    })
    document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!.click()
    await flushPromises()

    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }))
    const second = row('Second')
    const focus = vi.spyOn(second, 'focus')
    second.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, pointerType: 'mouse' }))

    expect(focus).toHaveBeenCalledWith({ preventScroll: true, focusVisible: false })
  })
})
