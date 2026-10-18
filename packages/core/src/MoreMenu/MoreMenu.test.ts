import type { MoreMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import MoreMenu from './MoreMenu.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

const ITEMS: MoreMenuOption[] = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { label: 'Delete', variant: 'destructive' },
]

function renderMenu(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(MoreMenu, {
    attachTo: document.body,
    props: { items: ITEMS, ...props },
    slots,
  })

  const trigger = () => wrapper.get('.astryx-more-menu button').element as HTMLButtonElement
  const root = () => wrapper.get('.astryx-more-menu').element as HTMLElement
  const menu = (index = 0) => document.querySelectorAll<HTMLElement>('.astryx-more-menu__panel')[index] ?? null
  const menus = () => Array.from(document.querySelectorAll<HTMLElement>('.astryx-more-menu__panel'))
  const rows = (index = 0) => Array.from(menu(index)?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
  const row = (label: string) => rows().find(candidate => candidate.textContent?.includes(label)) ?? null

  return { menu, menus, root, row, rows, trigger, wrapper }
}

function pressOn(element: HTMLElement, detail = 1): void {
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, detail }))
}

function keydown(element: HTMLElement, key: string, init: KeyboardEventInit = {}): void {
  element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...init }))
}

describe('moreMenu', () => {
  it('renders an icon-only trigger named by label and wired to a menu it has not opened yet', () => {
    const { menu, trigger } = renderMenu()

    expect(trigger().getAttribute('aria-label')).toBe('More options')
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(trigger().getAttribute('aria-controls')).toMatch(/^astryx-more-menu-/)
    expect(trigger().querySelector('.astryx-icon')).toBeTruthy()
    expect(menu()).toBeNull()
  })

  it('uses the label prop for the trigger name and the menu name', async () => {
    const { menu, trigger } = renderMenu({ label: 'Row actions' })

    expect(trigger().getAttribute('aria-label')).toBe('Row actions')

    pressOn(trigger())
    await flushPromises()

    expect(menu()?.getAttribute('role')).toBe('menu')
    expect(menu()?.getAttribute('aria-label')).toBe('Row actions')
  })

  it('replaces the trigger artwork through the icon slot', () => {
    const { trigger } = renderMenu({}, { icon: () => h('svg', { 'data-test': 'custom' }) })

    expect(trigger().querySelector('[data-test="custom"]')).toBeTruthy()
    expect(trigger().querySelector('.astryx-icon')).toBeNull()
  })

  it('opens on a pointer click, reports it, and keeps rows unhighlighted', async () => {
    const { menu, rows, trigger, wrapper } = renderMenu()

    pressOn(trigger())
    await flushPromises()

    expect(menu()?.getAttribute('role')).toBe('menu')
    expect(rows().map(element => element.textContent?.trim())).toEqual(['Edit', 'Duplicate', 'Delete'])
    expect(rows().every(element => element.getAttribute('role') === 'menuitem')).toBe(true)
    expect(trigger().getAttribute('aria-expanded')).toBe('true')
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    // A pointer open highlights no row: focus sits on the menu container.
    expect(document.activeElement).toBe(menu())
  })

  it('opens from the keyboard onto the first row, and from ArrowUp onto the last', async () => {
    const first = renderMenu()

    keydown(first.trigger(), 'ArrowDown')
    await flushPromises()

    expect(document.activeElement).toBe(first.rows()[0])
    expect(first.wrapper.emitted('openChange')).toEqual([[true]])

    document.body.innerHTML = ''

    const second = renderMenu()
    keydown(second.trigger(), 'ArrowUp')
    await flushPromises()

    expect(document.activeElement).toBe(second.rows()[2])
  })

  it('walks rows with arrows, wraps, and jumps with Home and End', async () => {
    const { menu, rows, trigger } = renderMenu({ items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Archive' }] })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()
    expect(document.activeElement).toBe(rows()[0])

    keydown(menu() as HTMLElement, 'ArrowDown')
    expect(document.activeElement).toBe(rows()[1])

    keydown(menu() as HTMLElement, 'ArrowUp')
    expect(document.activeElement).toBe(rows()[0])

    keydown(menu() as HTMLElement, 'ArrowUp')
    expect(document.activeElement).toBe(rows()[2])

    keydown(menu() as HTMLElement, 'Home')
    expect(document.activeElement).toBe(rows()[0])

    keydown(menu() as HTMLElement, 'End')
    expect(document.activeElement).toBe(rows()[2])
  })

  it('jumps to a row by its label as the user types', async () => {
    const { menu, row, trigger } = renderMenu({
      items: [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Archive' }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    keydown(menu() as HTMLElement, 'a')
    expect(document.activeElement).toBe(row('Archive'))

    keydown(menu() as HTMLElement, 'd')
    expect(document.activeElement).toBe(row('Duplicate'))
  })

  it('skips disabled rows and takes them out of the arrow path', async () => {
    const { menu, rows, trigger } = renderMenu({
      items: [{ label: 'Edit' }, { label: 'Duplicate', isDisabled: true }, { label: 'Archive' }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    expect(rows()[1].getAttribute('aria-disabled')).toBe('true')
    expect(rows()[1].hasAttribute('tabindex')).toBe(false)

    keydown(menu() as HTMLElement, 'ArrowDown')
    expect(document.activeElement).toBe(rows()[2])
  })

  it('runs a row action on Enter, closes, and returns focus to the trigger', async () => {
    let edits = 0
    const { menu, rows, trigger, wrapper } = renderMenu({
      items: [{ label: 'Edit', onClick: () => { edits += 1 } }, { label: 'Duplicate' }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    keydown(rows()[0], 'Enter')
    await flushPromises()

    expect(edits).toBe(1)
    expect(menu()).toBeNull()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger())
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('leaves the menu open for a row that keeps it open itself', async () => {
    const { menu, rows, trigger } = renderMenu({
      items: [{ label: 'Copy', hasCloseOnSelect: false }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    pressOn(rows()[0])
    await flushPromises()

    expect(menu()).not.toBeNull()
  })

  it('closes on Escape from inside the menu and returns focus to the trigger', async () => {
    const { menu, trigger } = renderMenu()

    pressOn(trigger())
    await flushPromises()

    keydown(document.body, 'Escape')
    await flushPromises()

    expect(menu()).toBeNull()
    expect(document.activeElement).toBe(trigger())
  })

  it('closes on Escape from the trigger while the menu is open', async () => {
    const { menu, trigger } = renderMenu()

    pressOn(trigger())
    await flushPromises()

    keydown(trigger(), 'Escape')
    await flushPromises()

    expect(menu()).toBeNull()
  })

  it('closes on Tab and leaves the key to its default action', async () => {
    const { menu, trigger } = renderMenu()

    pressOn(trigger())
    await flushPromises()

    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab' })
    menu()?.dispatchEvent(event)
    await flushPromises()

    expect(event.defaultPrevented).toBe(false)
    expect(menu()).toBeNull()
  })

  it('dismisses a mouse release off the menu, and keeps a finger release from doing it', async () => {
    const { menu, trigger } = renderMenu()

    pressOn(trigger())
    await flushPromises()

    document.body.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' }))
    await flushPromises()
    expect(menu()).not.toBeNull()

    document.body.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }))
    await flushPromises()
    expect(menu()).toBeNull()
  })

  it('dismisses on a tap outside and keeps a press inside', async () => {
    const { menu, rows, trigger } = renderMenu()

    pressOn(trigger())
    await flushPromises()

    pressOn(rows()[0] as HTMLElement)
    await flushPromises()

    const reopened = renderMenu()
    pressOn(reopened.trigger())
    await flushPromises()
    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()

    expect(reopened.menu()).toBeNull()
    expect(menu()).toBeNull()
  })

  it('toggles shut from the trigger and does not open while disabled', async () => {
    const { menu, trigger } = renderMenu()

    pressOn(trigger())
    await flushPromises()
    expect(menu()).not.toBeNull()

    pressOn(trigger())
    await flushPromises()
    expect(menu()).toBeNull()

    document.body.innerHTML = ''

    const disabled = renderMenu({ isDisabled: true })
    pressOn(disabled.trigger())
    await flushPromises()

    expect(disabled.menu()).toBeNull()
    expect(disabled.trigger().getAttribute('aria-disabled')).toBe('true')

    keydown(disabled.trigger(), 'ArrowDown')
    await flushPromises()

    expect(disabled.menu()).toBeNull()
  })

  it('marks the trigger open state for styling', async () => {
    const { root, trigger } = renderMenu()

    expect(root().getAttribute('data-open')).toBeNull()

    pressOn(trigger())
    await flushPromises()

    expect(root().getAttribute('data-open')).toBe('true')
  })

  it('renders dividers, groups with headings, descriptions, hints, and destructive rows', async () => {
    const { menu, trigger } = renderMenu({
      items: [
        {
          type: 'section',
          id: 'edit',
          title: 'Edit',
          items: [
            { label: 'Rename', description: 'Change the title', endContent: '⌘R', icon: 'wrench' },
            { label: 'Duplicate', icon: 'copy' },
          ],
        },
        { type: 'divider' },
        { label: 'Delete', variant: 'destructive' },
      ],
    })

    pressOn(trigger())
    await flushPromises()

    const panel = menu() as HTMLElement
    const group = panel.querySelector<HTMLElement>('[role="group"]')
    expect(group?.getAttribute('aria-label')).toBe('Edit')
    expect(group?.querySelectorAll('[role="menuitem"]').length).toBe(2)
    expect(panel.querySelector('.astryx-more-menu__heading')?.textContent?.trim()).toBe('Edit')
    expect(panel.querySelector('[role="separator"]')).toBeTruthy()
    expect(panel.querySelector('.astryx-more-menu__item-description')?.textContent?.trim()).toBe('Change the title')
    expect(panel.querySelector('.astryx-more-menu__item-hint')?.textContent?.trim()).toBe('⌘R')
    expect(panel.querySelector('.astryx-more-menu__item--destructive')).toBeTruthy()
    expect(panel.querySelectorAll('.astryx-icon').length).toBe(2)
  })

  it('renders an address as a real link row', async () => {
    const { menu, trigger } = renderMenu({
      items: [{ label: 'Docs', href: 'https://example.com', target: '_blank', rel: 'author' }],
    })

    pressOn(trigger())
    await flushPromises()

    const link = menu()?.querySelector<HTMLAnchorElement>('[role="menuitem"]')
    expect(link?.tagName).toBe('A')
    expect(link?.getAttribute('href')).toBe('https://example.com')
    expect(link?.getAttribute('rel')).toBe('author noopener noreferrer')
  })

  it('opens a flyout on ArrowRight and closes only that flyout on Escape', async () => {
    const { menus, row, rows, trigger } = renderMenu({
      items: [{ label: 'Edit' }, { label: 'Move to', items: [{ label: 'Inbox' }, { label: 'Archive' }] }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    const submenuRow = row('Move to') as HTMLElement
    expect(submenuRow.getAttribute('aria-haspopup')).toBe('menu')
    expect(submenuRow.getAttribute('aria-expanded')).toBe('false')

    submenuRow.focus()
    keydown(submenuRow, 'ArrowRight')
    await flushPromises()

    expect(menus().length).toBe(2)
    expect(submenuRow.getAttribute('aria-expanded')).toBe('true')
    const flyout = menus()[1]
    expect(flyout.getAttribute('aria-labelledby')).toBe(submenuRow.id)
    expect(document.activeElement).toBe(flyout.querySelector('[role="menuitem"]'))

    keydown(flyout, 'Escape')
    await flushPromises()

    expect(menus().length).toBe(1)
    expect(document.activeElement).toBe(submenuRow)
    expect(rows().length).toBe(2)
  })

  it('closes the whole menu when a flyout row acts', async () => {
    let archived = 0
    const { menus, row, trigger } = renderMenu({
      items: [{ label: 'Move to', items: [{ label: 'Inbox' }, { label: 'Archive', onClick: () => { archived += 1 } }] }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    const submenuRow = row('Move to') as HTMLElement
    submenuRow.focus()
    keydown(submenuRow, 'ArrowRight')
    await flushPromises()
    await vi.waitFor(() => expect(menus().length).toBe(2))

    const flyoutRow = Array.from(menus()[1].querySelectorAll<HTMLElement>('[role="menuitem"]'))
      .find(element => element.textContent?.includes('Archive')) as HTMLElement
    flyoutRow.focus()
    keydown(flyoutRow, 'Enter')
    await flushPromises()

    expect(archived).toBe(1)
    expect(menus().length).toBe(0)
    expect(document.activeElement).toBe(trigger())
  })

  it('opens a flyout after a hover pause and closes it when the pointer leaves', async () => {
    vi.useFakeTimers()
    try {
      const { menus, row, trigger } = renderMenu({
        items: [{ label: 'Move to', items: [{ label: 'Inbox' }] }],
      })

      keydown(trigger(), 'ArrowDown')
      await nextTick()

      const submenuRow = row('Move to') as HTMLElement
      expect(menus().length).toBe(1)

      submenuRow.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }))
      await vi.advanceTimersByTimeAsync(200)

      expect(menus().length).toBe(2)
      // Hover does not steal focus from the row it is over.
      expect(document.activeElement).not.toBe(menus()[1])

      submenuRow.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }))
      await vi.advanceTimersByTimeAsync(400)

      expect(menus().length).toBe(1)
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('collapses an open flyout from its own row and returns on ArrowLeft', async () => {
    const { menus, row, trigger } = renderMenu({
      items: [{ label: 'Move to', items: [{ label: 'Inbox' }] }],
    })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    const submenuRow = row('Move to') as HTMLElement
    submenuRow.focus()
    keydown(submenuRow, 'ArrowRight')
    await flushPromises()

    keydown(menus()[1], 'ArrowLeft')
    await flushPromises()
    expect(menus().length).toBe(1)
    expect(document.activeElement).toBe(submenuRow)

    pressOn(submenuRow)
    await flushPromises()
    expect(menus().length).toBe(2)

    pressOn(submenuRow)
    await flushPromises()
    expect(menus().length).toBe(1)
    expect(document.activeElement).toBe(submenuRow)

    // An assistive activation reopens the flyout onto its first row.
    pressOn(submenuRow, 0)
    await flushPromises()
    expect(menus().length).toBe(2)
    expect(document.activeElement).toBe(menus()[1].querySelector('[role="menuitem"]'))
  })

  it('binds the open state with v-model:isMenuOpen', async () => {
    const { menu, rows, trigger, wrapper } = renderMenu({ isMenuOpen: false })

    expect(menu()).toBeNull()

    await wrapper.setProps({ isMenuOpen: true })
    await flushPromises()

    expect(menu()).not.toBeNull()
    // A controlled open from outside lands on the first row, the way a keyboard
    // open does.
    expect(document.activeElement).toBe(rows()[0])

    keydown(menu() as HTMLElement, 'Escape')
    await flushPromises()

    expect(wrapper.emitted('update:isMenuOpen')).toEqual([[false]])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps the row density in step with the size prop, including in a flyout', async () => {
    const { menu, menus, row, trigger, wrapper } = renderMenu({
      size: 'md',
      items: [{ label: 'Move to', items: [{ label: 'Inbox' }] }],
    })

    pressOn(trigger())
    await flushPromises()
    expect(menu()?.getAttribute('data-size')).toBe('md')

    const submenuRow = row('Move to') as HTMLElement
    submenuRow.focus()
    keydown(submenuRow, 'ArrowRight')
    await flushPromises()
    expect(menus()[1].getAttribute('data-size')).toBe('md')

    await wrapper.setProps({ size: 'lg' })
    await flushPromises()

    expect(menu()?.getAttribute('data-size')).toBe('lg')
    expect(menus()[1].getAttribute('data-size')).toBe('lg')
  })

  it('renders the surface in place as an inline preview without moving focus', async () => {
    const { menu, root, trigger } = renderMenu({ isInline: true, isMenuOpen: true })
    await flushPromises()

    expect(root().querySelector('.astryx-more-menu__panel')).toBe(menu())
    expect(root().contains(menu())).toBe(true)
    expect(document.body.querySelector('.astryx-more-menu__panel')).toBe(menu())
    expect(document.activeElement).not.toBe(menu())
    expect(document.activeElement).not.toBe(trigger())
  })

  it('presents a bottom sheet with dialog semantics and drills into a submenu', async () => {
    const { menu, trigger } = renderMenu({
      presentation: 'bottom-sheet',
      items: [
        { label: 'Rename' },
        { label: 'Move to', items: [{ label: 'Inbox' }, { label: 'Archive' }] },
      ],
    })

    expect(trigger().getAttribute('aria-haspopup')).toBe('dialog')
    expect(menu()).toBeNull()

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    const sheet = document.querySelector<HTMLElement>('.astryx-more-menu__sheet')
    expect(sheet?.getAttribute('role')).toBe('dialog')
    expect(sheet?.getAttribute('aria-modal')).toBe('true')
    expect(sheet?.getAttribute('aria-label')).toBe('More options')
    expect(document.activeElement?.textContent?.trim()).toBe('Rename')

    expect(sheet?.querySelector('.astryx-more-menu__sheet-back')).toBeNull()

    const drillRow = Array.from(sheet?.querySelectorAll<HTMLElement>('[data-astryx-sheet-row]') ?? [])
      .find(element => element.textContent?.includes('Move to')) as HTMLElement
    drillRow.querySelector<HTMLElement>('button')?.click()
    await flushPromises()

    expect(document.querySelector('.astryx-more-menu__sheet-title')?.textContent?.trim()).toBe('Move to')
    expect(document.querySelector('.astryx-more-menu__sheet-back')).toBeTruthy()

    keydown(document.querySelector('.astryx-more-menu__sheet') as HTMLElement, 'Escape')
    await flushPromises()

    expect(document.querySelector('.astryx-more-menu__sheet')).not.toBeNull()
    expect(document.querySelector('.astryx-more-menu__sheet-title')?.textContent?.trim()).toBe('More options')

    keydown(document.querySelector('.astryx-more-menu__sheet') as HTMLElement, 'Escape')
    await flushPromises()

    expect(document.querySelector('.astryx-more-menu__sheet')).toBeNull()
    expect(document.activeElement).toBe(trigger())
  })

  it('keeps Tab inside the open sheet', async () => {
    const { trigger } = renderMenu({ presentation: 'bottom-sheet' })

    keydown(trigger(), 'ArrowDown')
    await flushPromises()

    const sheet = document.querySelector<HTMLElement>('.astryx-more-menu__sheet') as HTMLElement
    const controls = Array.from(sheet.querySelectorAll<HTMLElement>('.astryx-more-menu__sheet-list button'))
    expect(controls.length).toBe(3)

    controls[2].focus()
    keydown(sheet, 'Tab')
    expect(document.activeElement).toBe(controls[0])

    keydown(sheet, 'Tab', { shiftKey: true })
    expect(document.activeElement).toBe(controls[2])
  })

  it('closes the sheet when the scrim is pressed', async () => {
    const { trigger } = renderMenu({ presentation: 'bottom-sheet' })

    pressOn(trigger())
    await flushPromises()

    document.querySelector<HTMLElement>('.astryx-more-menu__scrim')?.click()
    await flushPromises()

    expect(document.querySelector('.astryx-more-menu__sheet')).toBeNull()
  })

  it('exposes the trigger element and keeps the tooltip off while open', async () => {
    const { trigger, wrapper } = renderMenu()

    const exposed = wrapper.vm as unknown as { element: HTMLElement | null, focus: () => void }
    expect(exposed.element).toBe(trigger())

    pressOn(trigger())
    await flushPromises()

    expect(document.querySelector('.astryx-button-tooltip')).toBeNull()
  })
})
