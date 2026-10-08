import type { ContextMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ContextMenu from './ContextMenu.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuSubMenu from './ContextMenuSubMenu.vue'
import { resetMenuPress } from './useMenuPress.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  resetMenuPress()
})

const ITEMS: ContextMenuOption[] = [
  { label: 'More tools', items: [{ label: 'Inspect', icon: 'search' }, { label: 'Measure' }] },
  { label: 'After' },
]

function renderMenu(items: ContextMenuOption[] = ITEMS) {
  const wrapper = mount(ContextMenu, {
    attachTo: document.body,
    props: { items },
    slots: { default: () => h('button', { type: 'button' }, 'Right-click me') },
  })
  const trigger = document.querySelector('.astryx-context-menu-trigger') as HTMLElement
  trigger.getBoundingClientRect = () => ({ bottom: 70, height: 20, left: 100, right: 140, top: 50, width: 40, x: 100, y: 50 }) as DOMRect
  const panel = document.querySelector('.astryx-context-menu') as HTMLElement
  return { panel, trigger, wrapper }
}

async function open(trigger: HTMLElement): Promise<void> {
  trigger.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, detail: 1, clientX: 120, clientY: 60 }))
  await flushPromises()
}

function submenuRow(): HTMLElement {
  return document.querySelector('.astryx-context-menu-item--submenu') as HTMLElement
}

function flyoutOf(row: HTMLElement): HTMLElement {
  return document.getElementById(row.getAttribute('aria-controls') ?? '') as HTMLElement
}

function rowsOf(scope: HTMLElement): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(':scope > .astryx-context-menu-item'))
}

function keydownOn(target: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key })
  target.dispatchEvent(event)
  return event
}

describe('contextMenuSubMenu', () => {
  it('renders a nested row as a submenu row with a hidden flyout', async () => {
    const { trigger } = renderMenu()
    await open(trigger)

    const row = submenuRow()
    expect(row.getAttribute('aria-haspopup')).toBe('menu')
    expect(row.getAttribute('aria-expanded')).toBe('false')
    expect(row.style.display).toBe('')
    expect(flyoutOf(row).style.display).toBe('none')
    expect(row.querySelector('.astryx-context-menu-item__chevron')).not.toBeNull()
  })

  it('opens the flyout with ArrowRight and moves focus into it', async () => {
    const { trigger, wrapper } = renderMenu()
    await open(trigger)

    const row = submenuRow()
    row.focus()
    const event = keydownOn(row, 'ArrowRight')
    await flushPromises()

    expect(event.defaultPrevented).toBe(true)
    expect(row.getAttribute('aria-expanded')).toBe('true')
    const flyout = flyoutOf(row)
    expect(flyout.style.display).not.toBe('none')
    expect(flyout.getAttribute('role')).toBe('menu')
    expect(flyout.getAttribute('aria-label')).toBe('More tools')
    expect(rowsOf(flyout).map(item => item.textContent?.trim())).toEqual(['Inspect', 'Measure'])
    expect(document.activeElement).toBe(rowsOf(flyout)[0])
    expect(wrapper.emitted('openChange')).toEqual([[true]])
  })

  it('opens the flyout from Enter instead of activating the row', async () => {
    const { wrapper, trigger } = renderMenu([{ label: 'More tools', onClick: vi.fn(), items: [{ label: 'Inspect' }] }])
    await open(trigger)

    const row = submenuRow()
    keydownOn(row, 'Enter')
    await flushPromises()

    expect(flyoutOf(row).style.display).not.toBe('none')
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('opens the flyout on a mouse hover', async () => {
    const { trigger } = renderMenu()
    await open(trigger)

    const row = submenuRow()
    row.dispatchEvent(new PointerEvent('pointerenter', { bubbles: false, pointerType: 'mouse' }))
    await flushPromises()

    expect(flyoutOf(row).style.display).not.toBe('none')
  })

  it('never opens a disabled submenu', async () => {
    const { trigger } = renderMenu([{ label: 'More tools', isDisabled: true, items: [{ label: 'Inspect' }] }])
    await open(trigger)

    const row = submenuRow()
    keydownOn(row, 'ArrowRight')
    await flushPromises()

    expect(flyoutOf(row).style.display).toBe('none')
    expect(row.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes the flyout with ArrowLeft and hands focus back to its row', async () => {
    const { trigger } = renderMenu()
    await open(trigger)

    const row = submenuRow()
    row.focus()
    keydownOn(row, 'ArrowRight')
    await flushPromises()

    const flyout = flyoutOf(row)
    const first = rowsOf(flyout)[0] as HTMLElement
    const event = keydownOn(first, 'ArrowLeft')
    await flushPromises()

    expect(event.defaultPrevented).toBe(true)
    expect(flyout.style.display).toBe('none')
    expect(row.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(row)
  })

  it('keeps Escape at the flyout level and closes the menu from the panel level', async () => {
    const { panel, trigger, wrapper } = renderMenu()
    await open(trigger)

    const row = submenuRow()
    row.focus()
    keydownOn(row, 'ArrowRight')
    await flushPromises()

    const flyout = flyoutOf(row)
    keydownOn(rowsOf(flyout)[0] as HTMLElement, 'Escape')
    await flushPromises()

    expect(flyout.style.display).toBe('none')
    expect(panel.style.display).not.toBe('none')
    expect(wrapper.emitted('openChange')).toEqual([[true]])

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }))
    await flushPromises()

    expect(panel.style.display).toBe('none')
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('activates a flyout row, reports it as selected, and closes the whole menu', async () => {
    const onClick = vi.fn()
    const { panel, trigger, wrapper } = renderMenu([{ label: 'More tools', items: [{ label: 'Inspect', onClick }] }])
    await open(trigger)

    const row = submenuRow()
    row.focus()
    keydownOn(row, 'ArrowRight')
    await flushPromises()

    const flyout = flyoutOf(row)
    keydownOn(rowsOf(flyout)[0] as HTMLElement, 'Enter')
    await flushPromises()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(panel.style.display).toBe('none')
    const [item] = wrapper.emitted('select')![0] as [{ label: string }]
    expect(item.label).toBe('Inspect')
  })

  it('closes the flyout when the highlight moves to a sibling row', async () => {
    const { trigger } = renderMenu()
    await open(trigger)

    const row = submenuRow()
    row.focus()
    keydownOn(row, 'ArrowRight')
    await flushPromises()
    const flyout = flyoutOf(row)

    keydownOn(row, 'ArrowDown')
    await flushPromises()

    expect(flyout.style.display).toBe('none')
  })

  it('renders the flyout rows from the default slot for a caller-composed submenu', async () => {
    const onClick = vi.fn()
    const wrapper = mount(ContextMenu, {
      attachTo: document.body,
      slots: {
        default: () => h('button', { type: 'button' }, 'Right-click me'),
        content: () => h(ContextMenuSubMenu, { label: 'More tools' }, {
          default: () => h(ContextMenuItem, { label: 'Inspect', onClick }),
        }),
      },
    })
    const trigger = document.querySelector('.astryx-context-menu-trigger') as HTMLElement
    await open(trigger)

    const row = submenuRow()
    expect(row.textContent).toContain('More tools')
    row.focus()
    keydownOn(row, 'ArrowRight')
    await flushPromises()

    const flyout = flyoutOf(row)
    const items = rowsOf(flyout)
    expect(items.map(item => item.textContent?.trim())).toEqual(['Inspect'])

    items[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})
