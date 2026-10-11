import type { ContextMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ContextMenu from './ContextMenu.vue'
import ContextMenuItem from './ContextMenuItem.vue'
import ContextMenuSubMenu from './ContextMenuSubMenu.vue'
import { resetMenuPress } from './useMenuPress.js'
import { SUBMENU_CLICK_GUARD_MS, SUBMENU_HIDE_DELAY_MS, SUBMENU_REOPEN_SUPPRESS_MS, SUBMENU_SHOW_DELAY_MS } from './useSubmenuHover.js'

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

function rowByLabel(label: string): HTMLElement {
  const row = Array.from(document.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    .find(element => element.querySelector('[data-menu-item-label]')?.textContent?.trim() === label)
  if (row == null)
    throw new Error(`missing menu row ${label}`)
  return row
}

function pointer(target: EventTarget, type: string, init: PointerEventInit = {}): void {
  target.dispatchEvent(new PointerEvent(type, {
    bubbles: type !== 'pointerenter' && type !== 'pointerleave',
    clientX: 0,
    clientY: 0,
    pointerType: 'mouse',
    ...init,
  }))
}

const FLYOUT_RECT = {
  bottom: 200,
  height: 200,
  left: 300,
  right: 500,
  top: 0,
  width: 200,
  x: 300,
  y: 0,
  toJSON: () => ({}),
} as DOMRect

async function hoverOpen(row: HTMLElement): Promise<void> {
  pointer(row, 'pointerenter', { clientX: 20, clientY: 40 })
  await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS)
}

function armFlyoutRect(row: HTMLElement): void {
  vi.spyOn(flyoutOf(row), 'getBoundingClientRect').mockReturnValue(FLYOUT_RECT)
}

/** Leave the row and step outside the safe triangle, the way a real pointer does. */
function leaveRow(row: HTMLElement): void {
  pointer(row, 'pointerleave', { clientX: 250, clientY: 100 })
  pointer(document, 'pointermove', { clientX: 10, clientY: 400 })
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

  it('opens the flyout on a mouse hover after the show delay, without moving focus', async () => {
    vi.useFakeTimers()
    try {
      const { trigger } = renderMenu()
      await open(trigger)

      const row = submenuRow()
      row.focus()
      pointer(row, 'pointerenter')
      await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS - 1)
      expect(flyoutOf(row).style.display).toBe('none')

      await vi.advanceTimersByTimeAsync(1)
      expect(flyoutOf(row).style.display).not.toBe('none')
      // Hover is driving, so focus stays on the row instead of jumping into the flyout.
      expect(document.activeElement).toBe(row)
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('does not open a submenu for a touch pointer', async () => {
    vi.useFakeTimers()
    try {
      const { trigger } = renderMenu()
      await open(trigger)

      const row = submenuRow()
      pointer(row, 'pointerenter', { pointerType: 'touch' })
      await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS)
      expect(flyoutOf(row).style.display).toBe('none')
    }
    finally {
      vi.useRealTimers()
    }
  })

  it('does not open a submenu when the pointer cannot hover', async () => {
    vi.useFakeTimers()
    const matchMedia = window.matchMedia
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
    try {
      const { trigger } = renderMenu()
      await open(trigger)

      const row = submenuRow()
      pointer(row, 'pointerenter', { pointerType: 'mouse' })
      await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS)
      expect(flyoutOf(row).style.display).toBe('none')
    }
    finally {
      window.matchMedia = matchMedia
      vi.useRealTimers()
    }
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

describe('contextMenuSubMenu hover close', () => {
  const NESTED = [
    { label: 'Open' },
    {
      label: 'Move to',
      items: [
        { label: 'Inbox' },
        { label: 'Archive' },
        { label: 'Later', items: [{ label: 'Tomorrow' }, { label: 'Next week' }] },
      ],
    },
    { label: 'Labels', items: [{ label: 'Design' }, { label: 'Engineering' }] },
  ]

  afterEach(() => {
    vi.useRealTimers()
  })

  async function openNested() {
    vi.useFakeTimers()
    const rendered = renderMenu(NESTED)
    await open(rendered.trigger)
    return rendered
  }

  it('closes the previous flyout after the hide delay when the pointer enters a plain sibling row', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    const openRow = rowByLabel('Open')
    await hoverOpen(moveTo)
    armFlyoutRect(moveTo)
    pointer(moveTo, 'pointermove', { clientX: 20, clientY: 40 })
    expect(document.activeElement).toBe(moveTo)

    leaveRow(moveTo)
    pointer(openRow, 'pointerenter', { clientX: 10, clientY: 400 })
    pointer(openRow, 'pointermove', { clientX: 10, clientY: 400 })
    await flushPromises()
    // Highlight moved, but the flyout waits out the same delay as leaving into empty space.
    expect(document.activeElement).toBe(openRow)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS - 1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
  })

  it('opens the next submenu parent after the show delay and closes the previous after the hide delay', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    const labels = rowByLabel('Labels')

    await hoverOpen(moveTo)
    armFlyoutRect(moveTo)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    leaveRow(moveTo)
    pointer(labels, 'pointerenter', { clientX: 10, clientY: 400 })
    await flushPromises()
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    expect(labels.getAttribute('aria-expanded')).toBe('false')

    await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS - 1)
    expect(labels.getAttribute('aria-expanded')).toBe('false')
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    // The new flyout opens at 150ms. The previous one is still inside its 200ms delay.
    await vi.advanceTimersByTimeAsync(1)
    expect(labels.getAttribute('aria-expanded')).toBe('true')
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS - SUBMENU_SHOW_DELAY_MS - 1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
    expect(labels.getAttribute('aria-expanded')).toBe('true')
  })

  it('closes a hover-opened flyout after the hide delay when the pointer leaves and never enters it', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    armFlyoutRect(moveTo)

    pointer(moveTo, 'pointerleave', { clientX: 250, clientY: 100 })
    pointer(document, 'pointermove', { clientX: 250, clientY: 400 })
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS - 1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
  })

  it('keeps the flyout open once the pointer enters it', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    const flyout = flyoutOf(moveTo)

    pointer(moveTo, 'pointerleave', { clientX: 250, clientY: 100 })
    pointer(flyout, 'pointerenter', { clientX: 320, clientY: 40 })
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS + 300)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
  })

  it('keeps a nested flyout and its parent open together, and closes only the nested one after the hide delay', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)

    const later = rowByLabel('Later')
    await hoverOpen(later)
    armFlyoutRect(later)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    expect(later.getAttribute('aria-expanded')).toBe('true')

    leaveRow(later)
    pointer(rowByLabel('Inbox'), 'pointerenter', { clientX: 320, clientY: 20 })
    await flushPromises()
    expect(later.getAttribute('aria-expanded')).toBe('true')
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS)
    expect(later.getAttribute('aria-expanded')).toBe('false')
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
  })

  it('closes a nested flyout when its parent flyout closes', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    const later = rowByLabel('Later')
    await hoverOpen(later)
    armFlyoutRect(moveTo)

    leaveRow(moveTo)
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS)
    await flushPromises()

    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
    expect(later.getAttribute('aria-expanded')).toBe('false')
    expect(flyoutOf(later).style.display).toBe('none')
  })

  it('lets a diagonal path through the safe triangle reach the flyout', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    vi.spyOn(flyoutOf(moveTo), 'getBoundingClientRect').mockReturnValue(FLYOUT_RECT)

    pointer(moveTo, 'pointerleave', { clientX: 250, clientY: 100 })
    for (const [x, y] of [[260, 90], [270, 80], [280, 60], [290, 40]] as const) {
      await vi.advanceTimersByTimeAsync(150)
      pointer(document, 'pointermove', { clientX: x, clientY: y })
    }
    await vi.advanceTimersByTimeAsync(150)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    pointer(flyoutOf(moveTo), 'pointerenter', { clientX: 310, clientY: 40 })
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS + 200)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
  })

  it('holds the flyout while the pointer pauses inside the triangle, then closes after it leaves', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    vi.spyOn(flyoutOf(moveTo), 'getBoundingClientRect').mockReturnValue(FLYOUT_RECT)

    pointer(moveTo, 'pointerleave', { clientX: 250, clientY: 100 })
    pointer(document, 'pointermove', { clientX: 275, clientY: 95 })
    await vi.advanceTimersByTimeAsync(1000)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    pointer(document, 'pointermove', { clientX: 250, clientY: 400 })
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS - 1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
  })

  it('does not close a keyboard-opened flyout when the pointer leaves into empty space', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    moveTo.focus()
    keydownOn(moveTo, 'ArrowRight')
    await flushPromises()
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    pointer(moveTo, 'pointerleave', { clientX: 250, clientY: 100 })
    pointer(document, 'pointermove', { clientX: 250, clientY: 400 })
    pointer(rowByLabel('Labels'), 'pointerenter', { clientX: 10, clientY: 400 })
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS + SUBMENU_SHOW_DELAY_MS)
    // A keyboard open is pinned: the pointer does not dismiss it, even onto a sibling.
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
  })

  it('does not reopen a flyout the pointer is still resting on, until the pointer really leaves', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    armFlyoutRect(moveTo)
    leaveRow(moveTo)
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')

    pointer(moveTo, 'pointerenter', { clientX: 20, clientY: 40 })
    await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
    await vi.advanceTimersByTimeAsync(SUBMENU_REOPEN_SUPPRESS_MS)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')

    pointer(moveTo, 'pointerleave', { clientX: 10, clientY: 8 })
    pointer(moveTo, 'pointerenter', { clientX: 20, clientY: 40 })
    await vi.advanceTimersByTimeAsync(SUBMENU_SHOW_DELAY_MS - 1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
    await vi.advanceTimersByTimeAsync(1)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
  })

  it('pins a hover-opened flyout when it is clicked inside the guard, so leaving no longer closes it', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    armFlyoutRect(moveTo)

    moveTo.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    leaveRow(moveTo)
    await vi.advanceTimersByTimeAsync(SUBMENU_HIDE_DELAY_MS + 50)
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')

    // The confirming click pinned it, so the next click is an ordinary toggle.
    moveTo.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes a hover-opened flyout when it is clicked after the guard window', async () => {
    await openNested()
    const moveTo = rowByLabel('Move to')
    await hoverOpen(moveTo)
    await vi.advanceTimersByTimeAsync(SUBMENU_CLICK_GUARD_MS)
    moveTo.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes the current nested flyout with ArrowLeft and Escape and returns focus to its parent row', async () => {
    const { trigger } = await openNested()
    const moveTo = rowByLabel('Move to')
    moveTo.focus()
    keydownOn(moveTo, 'ArrowRight')
    await flushPromises()

    const later = rowByLabel('Later')
    later.focus()
    keydownOn(later, 'ArrowRight')
    await flushPromises()
    expect(later.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(rowByLabel('Tomorrow'))

    keydownOn(rowByLabel('Tomorrow'), 'ArrowLeft')
    await flushPromises()
    expect(later.getAttribute('aria-expanded')).toBe('false')
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(later)

    keydownOn(later, 'ArrowRight')
    await flushPromises()
    keydownOn(rowByLabel('Tomorrow'), 'Escape')
    await flushPromises()
    expect(later.getAttribute('aria-expanded')).toBe('false')
    expect(moveTo.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(later)

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Escape' }))
    await flushPromises()
    expect(moveTo.getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('.astryx-context-menu')?.style.display).not.toBe('none')
    expect(trigger.isConnected).toBe(true)
  })
})
