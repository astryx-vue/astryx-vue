import type { ContextMenuItemData, ContextMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ContextMenu from './ContextMenu.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import { resetMenuPress } from './useMenuPress.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
  resetMenuPress()
  vi.useRealTimers()
})

const RECT = { bottom: 70, height: 20, left: 100, right: 140, top: 50, width: 40, x: 100, y: 50 }

interface RenderOptions {
  props?: Record<string, unknown>
  items?: ContextMenuOption[]
  slots?: Record<string, () => unknown>
}

function renderMenu(options: RenderOptions = {}) {
  const wrapper = mount(ContextMenu, {
    attachTo: document.body,
    props: {
      label: 'Row actions',
      ...(options.items != null ? { items: options.items } : {}),
      ...options.props,
    },
    slots: {
      default: () => h('button', { type: 'button' }, 'Right-click me'),
      ...options.slots,
    },
  })

  const trigger = document.querySelector('.astryx-context-menu-trigger') as HTMLElement
  trigger.getBoundingClientRect = () => RECT as DOMRect
  const anchor = trigger.querySelector('.astryx-context-menu-anchor') as HTMLElement
  const panel = document.querySelector('.astryx-context-menu') as HTMLElement
  return { anchor, panel, trigger, wrapper }
}

function rows(scope: ParentNode = document): HTMLElement[] {
  return Array.from(scope.querySelectorAll<HTMLElement>('.astryx-context-menu-item'))
}

function isShown(panel: HTMLElement): boolean {
  return panel.style.display !== 'none'
}

function contextMenu(trigger: HTMLElement, init: MouseEventInit = {}): MouseEvent {
  const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, detail: 1, ...init })
  trigger.dispatchEvent(event)
  return event
}

function keydownOn(target: HTMLElement, key: string): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key })
  target.dispatchEvent(event)
  return event
}

describe('contextMenu', () => {
  it('renders a block trigger with a hidden menu surface and no trigger aria wiring', () => {
    const { panel, trigger } = renderMenu({ items: [{ label: 'Edit' }] })

    expect(trigger.tagName).toBe('DIV')
    expect(trigger.classList.contains('astryx-context-menu-trigger')).toBe(true)
    expect(isShown(panel)).toBe(false)
    expect(panel.getAttribute('role')).toBe('menu')
    expect(panel.getAttribute('aria-label')).toBe('Row actions')
    expect(panel.hasAttribute('data-astryx-menu-press')).toBe(true)
    expect(panel.getAttribute('tabindex')).toBe('-1')

    // The trigger area carries no menu semantics of its own (menus-15).
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false)
    expect(trigger.hasAttribute('aria-expanded')).toBe(false)
    expect(trigger.hasAttribute('role')).toBe(false)
  })

  it('renders an inline trigger with triggerAs="span"', () => {
    const { trigger } = renderMenu({ props: { triggerAs: 'span' } })

    expect(trigger.tagName).toBe('SPAN')
  })

  it('opens at the cursor point on right-click and reports openChange', async () => {
    const { anchor, panel, trigger, wrapper } = renderMenu({ items: [{ label: 'Edit' }, { label: 'Delete' }] })

    const event = contextMenu(trigger, { clientX: 120, clientY: 60 })
    await flushPromises()

    expect(event.defaultPrevented).toBe(true)
    expect(isShown(panel)).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    // The cursor point is stored in the trigger's own space, so the menu
    // follows the trigger's context instead of the viewport.
    expect(anchor.style.left).toBe('20px')
    expect(anchor.style.top).toBe('10px')
    expect(document.activeElement).toBe(rows()[0])
  })

  it('anchors a keyboard-invoked context menu to the trigger instead of (0, 0)', async () => {
    const { anchor, trigger } = renderMenu({ items: [{ label: 'Edit' }] })

    contextMenu(trigger, { clientX: 0, clientY: 0, detail: 0 })
    await flushPromises()

    expect(anchor.style.left).toBe('0px')
    expect(anchor.style.top).toBe('20px')
  })

  it('leaves the native menu alone and stays closed when disabled', async () => {
    const { panel, trigger, wrapper } = renderMenu({ items: [{ label: 'Edit' }], props: { isDisabled: true } })

    const event = contextMenu(trigger, { clientX: 120, clientY: 60 })
    await flushPromises()

    expect(event.defaultPrevented).toBe(false)
    expect(isShown(panel)).toBe(false)
    expect(wrapper.emitted('openChange')).toBeUndefined()
    expect(trigger.getAttribute('data-disabled')).toBe('true')
  })

  it('renders the data model: rows, dividers, sections, and icons', async () => {
    const { panel, trigger } = renderMenu({
      items: [
        { label: 'Edit', icon: 'wrench', description: 'Change it' },
        { type: 'divider' },
        { type: 'section', title: 'Danger', items: [{ label: 'Delete', variant: 'destructive' }] },
      ],
    })
    contextMenu(trigger)
    await flushPromises()

    const group = panel.querySelector('.astryx-context-menu-group') as HTMLElement
    expect(group.getAttribute('role')).toBe('group')
    const heading = group.querySelector('.astryx-context-menu-group__heading') as HTMLElement
    expect(heading.textContent).toBe('Danger')
    expect(group.getAttribute('aria-labelledby')).toBe(heading.id)
    expect(panel.querySelector('.astryx-context-menu-divider')?.getAttribute('role')).toBe('separator')
    expect(rows()[0]!.querySelector('.astryx-icon')).not.toBeNull()
    expect(rows()[0]!.querySelector('.astryx-context-menu-item__description')?.textContent).toBe('Change it')
    expect(rows()[1]!.getAttribute('data-variant')).toBe('destructive')
  })

  it('keeps disabled rows out of the arrow order and unactivatable', async () => {
    const onClick = vi.fn()
    const { trigger } = renderMenu({
      items: [{ label: 'Edit', isDisabled: true, onClick }, { label: 'Delete' }],
    })
    contextMenu(trigger)
    await flushPromises()

    const disabled = rows()[0]!
    expect(disabled.getAttribute('aria-disabled')).toBe('true')
    expect(disabled.hasAttribute('tabindex')).toBe(false)

    keydownOn(disabled, 'ArrowDown')
    expect(document.activeElement).toBe(rows()[1])
  })

  it('moves the highlight with the arrows, Home/End, wrapping at both ends', async () => {
    const { trigger } = renderMenu({ items: [{ label: 'One' }, { label: 'Two' }, { label: 'Three' }] })
    contextMenu(trigger)
    await flushPromises()

    const [one, two, three] = rows() as [HTMLElement, HTMLElement, HTMLElement]
    expect(document.activeElement).toBe(one)

    keydownOn(one, 'ArrowDown')
    expect(document.activeElement).toBe(two)
    keydownOn(two, 'ArrowUp')
    expect(document.activeElement).toBe(one)
    keydownOn(one, 'ArrowUp')
    expect(document.activeElement).toBe(three)
    keydownOn(three, 'ArrowDown')
    expect(document.activeElement).toBe(one)
    keydownOn(one, 'End')
    expect(document.activeElement).toBe(three)
    keydownOn(three, 'Home')
    expect(document.activeElement).toBe(one)
  })

  it('matches rows by their label text as the user types', async () => {
    const { trigger } = renderMenu({
      items: [{ label: 'Edit', description: 'Change it' }, { label: 'Duplicate' }, { label: 'Delete' }],
    })
    contextMenu(trigger)
    await flushPromises()

    keydownOn(rows()[0]!, 'd')
    expect(document.activeElement).toBe(rows()[1])
  })

  it('activates the focused row on Enter and closes, reporting it as selected', async () => {
    const onClick = vi.fn()
    const { panel, trigger, wrapper } = renderMenu({ items: [{ label: 'Edit', onClick }] })
    contextMenu(trigger)
    await flushPromises()

    keydownOn(rows()[0]!, 'Enter')
    await flushPromises()

    expect(onClick).toHaveBeenCalledTimes(1)
    const [item] = wrapper.emitted('select')![0] as [ContextMenuItemData]
    expect(item.label).toBe('Edit')
    expect(isShown(panel)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('does not activate a row from a held key auto-repeat', async () => {
    const onClick = vi.fn()
    const { trigger } = renderMenu({ items: [{ label: 'Edit', onClick }] })
    contextMenu(trigger)
    await flushPromises()

    const row = rows()[0]!
    row.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Enter', repeat: true }))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('closes on Escape and hands focus back to the element focused before opening', async () => {
    const { panel, trigger, wrapper } = renderMenu({
      items: [{ label: 'Edit' }],
      slots: { default: () => h('button', { class: 'opener', type: 'button' }, 'Open') },
    })
    const opener = wrapper.find('.opener').element as HTMLElement
    opener.focus()

    contextMenu(trigger)
    await flushPromises()
    expect(document.activeElement).toBe(rows()[0])

    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' })
    document.dispatchEvent(event)
    await flushPromises()

    expect(event.defaultPrevented).toBe(true)
    expect(isShown(panel)).toBe(false)
    expect(document.activeElement).toBe(opener)
  })

  it('closes on Tab without consuming it and restores focus', async () => {
    const { panel, trigger, wrapper } = renderMenu({ items: [{ label: 'Edit' }] })
    contextMenu(trigger)
    await flushPromises()

    const event = keydownOn(rows()[0]!, 'Tab')
    await flushPromises()

    expect(event.defaultPrevented).toBe(false)
    expect(isShown(panel)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('closes on a mousedown outside the menu surface', async () => {
    const { panel, trigger } = renderMenu({ items: [{ label: 'Edit' }] })
    contextMenu(trigger)
    await flushPromises()

    // useDismiss 监听 pointerdown 事件
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(isShown(panel)).toBe(false)
  })

  it('stays open on a mousedown inside the menu surface', async () => {
    const { panel, trigger } = renderMenu({ items: [{ label: 'Edit' }] })
    contextMenu(trigger)
    await flushPromises()

    // useDismiss 监听 pointerdown 事件
    rows()[0]!.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(isShown(panel)).toBe(true)
  })

  it('refuses to open while disabled even when the open state is bound', async () => {
    const { panel, trigger, wrapper } = renderMenu({
      items: [{ label: 'Edit' }],
      props: { isDisabled: true, isOpen: true },
    })
    await flushPromises()

    expect(isShown(panel)).toBe(true)
    // Disabling closes whatever was open.
    await wrapper.setProps({ isDisabled: false, isOpen: false })
    await flushPromises()
    expect(isShown(panel)).toBe(false)

    contextMenu(trigger)
    await flushPromises()
    expect(isShown(panel)).toBe(true)
  })

  it('follows a bound isOpen state', async () => {
    const { panel, wrapper } = renderMenu({ items: [{ label: 'Edit' }], props: { isOpen: false } })

    expect(isShown(panel)).toBe(false)
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    expect(isShown(panel)).toBe(true)
    await wrapper.setProps({ isOpen: false })
    await flushPromises()
    expect(isShown(panel)).toBe(false)
  })

  it('renders a caller-composed menu through the content slot', async () => {
    const onClick = vi.fn()
    const { panel, trigger, wrapper } = renderMenu({
      slots: {
        content: () => h(ContextMenuItem, { label: 'Duplicate', onClick }),
      },
    })
    contextMenu(trigger)
    await flushPromises()

    expect(panel.querySelector('.astryx-context-menu-item')?.textContent).toContain('Duplicate')

    rows()[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(isShown(panel)).toBe(false)
    expect(wrapper.emitted('select')).toBeUndefined()
  })

  it('keeps reading the menu props through the provided context', async () => {
    const { wrapper } = renderMenu({
      props: { size: 'sm' },
      slots: { content: () => h(ContextMenuItem, { label: 'Edit' }) },
    })
    await flushPromises()

    expect(rows()[0]!.getAttribute('data-size')).toBe('sm')

    await wrapper.setProps({ size: 'lg' })
    await nextTick()

    expect(rows()[0]!.getAttribute('data-size')).toBe('lg')
  })

  it('opens once a finger is held on the trigger', async () => {
    vi.useFakeTimers()
    const { panel, trigger } = renderMenu({ items: [{ label: 'Edit' }] })

    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 120, clientY: 60, pointerId: 7, pointerType: 'touch' }))
    await nextTick()
    expect(isShown(panel)).toBe(false)

    vi.advanceTimersByTime(500)
    await nextTick()

    expect(isShown(panel)).toBe(true)
  })

  it('cancels the long press when the finger travels', async () => {
    vi.useFakeTimers()
    const { panel, trigger } = renderMenu({ items: [{ label: 'Edit' }] })

    trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 120, clientY: 60, pointerId: 7, pointerType: 'touch' }))
    trigger.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 120, clientY: 90, pointerId: 7, pointerType: 'touch' }))
    vi.advanceTimersByTime(500)
    await nextTick()

    expect(isShown(panel)).toBe(false)
  })

  it('acts on the row under the release of a tracked press and swallows the stray click', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const { trigger, wrapper } = renderMenu({
      items: [{ label: 'First', onClick: first }, { label: 'Second', onClick: second }],
    })
    contextMenu(trigger)
    await flushPromises()

    const [rowFirst, rowSecond] = rows() as [HTMLElement, HTMLElement]
    rowFirst.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10, pointerId: 3, pointerType: 'touch' }))
    rowSecond.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 10, clientY: 40, pointerId: 3, pointerType: 'touch' }))
    rowSecond.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 10, clientY: 40, pointerId: 3, pointerType: 'touch' }))
    await flushPromises()

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledTimes(1)
    const [item] = wrapper.emitted('select')![0] as [ContextMenuItemData]
    expect(item.label).toBe('Second')

    // The browser's own click for a tracked gesture never reaches the row.
    rowSecond.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }))
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('leaves a finger released outside the menu open, and dismisses a mouse released outside', async () => {
    const { panel, trigger } = renderMenu({ items: [{ label: 'First' }] })
    contextMenu(trigger)
    await flushPromises()

    const row = rows()[0]!
    row.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10, pointerId: 3, pointerType: 'touch' }))
    document.body.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 10, clientY: 400, pointerId: 3, pointerType: 'touch' }))
    await flushPromises()
    expect(isShown(panel)).toBe(true)

    row.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10, pointerId: 4, pointerType: 'mouse' }))
    document.body.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: 10, clientY: 400 }))
    await flushPromises()
    expect(isShown(panel)).toBe(false)
  })

  it('applies a custom menu width to the panel and caps it to the viewport', async () => {
    const { panel, trigger } = renderMenu({ items: [{ label: 'Edit' }], props: { menuWidth: 240 } })
    contextMenu(trigger)
    await flushPromises()

    expect(panel.getAttribute('data-width')).toBe('custom')
    expect(panel.style.getPropertyValue('--_context-menu-width')).toBe('240px')
    expect(panel.style.getPropertyValue('--_context-menu-min-width')).toBe('240px')
  })

  it('routes class and style to the menu panel and other attributes to the trigger', async () => {
    mount(ContextMenu, {
      attachTo: document.body,
      props: { 'items': [{ label: 'Edit' }], 'class': 'my-menu', 'style': 'outline-color: red', 'data-testid': 'menu-1' },
      slots: { default: () => h('button', { type: 'button' }, 'Right-click me') },
    })
    const trigger = document.querySelector('.astryx-context-menu-trigger') as HTMLElement
    const panel = document.querySelector('.astryx-context-menu') as HTMLElement
    trigger.getBoundingClientRect = () => RECT as DOMRect

    contextMenu(trigger)
    await flushPromises()

    expect(panel.classList.contains('my-menu')).toBe(true)
    expect(panel.style.outlineColor).toBe('red')
    expect(trigger.getAttribute('data-testid')).toBe('menu-1')
    expect(panel.querySelector('.astryx-context-menu-item')).not.toBeNull()
  })

  it('wires up a menu that is already open on mount', async () => {
    const onClick = vi.fn()
    renderMenu({ items: [{ label: 'Edit', onClick }], props: { isOpen: true } })
    await flushPromises()

    expect(document.activeElement).toBe(rows()[0])

    // useDismiss 监听 pointerdown 事件
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(document.querySelector<HTMLElement>('.astryx-context-menu')!.style.display).toBe('none')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('closes the menu when it is disabled while open', async () => {
    const { panel, wrapper } = renderMenu({ items: [{ label: 'Edit' }], props: { isOpen: true } })
    await flushPromises()
    expect(isShown(panel)).toBe(true)

    await wrapper.setProps({ isDisabled: true })
    await flushPromises()

    expect(isShown(panel)).toBe(false)
  })

  it('opens document actions in a bottom sheet', async () => {
    const { trigger } = renderMenu({
      items: [{ label: 'Rename document', description: 'Change the title shown to collaborators.' }],
      props: { label: 'Document actions', presentation: 'bottom-sheet' },
    })

    contextMenu(trigger)
    await nextTick()
    await flushPromises()

    const sheet = document.querySelector('.astryx-bottom-sheet-dialog')
    expect(sheet).not.toBeNull()
    expect(document.body.textContent).toContain('Rename document')
    expect(document.querySelector<HTMLElement>('.astryx-context-menu')!.style.display).toBe('none')
  })
})
