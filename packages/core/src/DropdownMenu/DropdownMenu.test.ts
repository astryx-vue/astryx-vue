import type { DropdownMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuDivider from './DropdownMenuDivider.vue'
import DropdownMenuGroup from './DropdownMenuGroup.vue'
import DropdownMenuItem from './DropdownMenuItem.vue'
import DropdownMenuSubMenu from './DropdownMenuSubMenu.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

function items(): DropdownMenuOption[] {
  return [
    { label: 'Edit project', icon: 'wrench', onClick: vi.fn() },
    { label: 'Duplicate project', icon: 'copy', onClick: vi.fn() },
    { label: 'Archive project', isDisabled: true, onClick: vi.fn() },
    { label: 'Delete project', variant: 'destructive', onClick: vi.fn() },
    { label: 'Dismiss', onClick: vi.fn() },
  ]
}

function renderMenu(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(DropdownMenu, {
    attachTo: document.body,
    props: { items: items(), ...props },
    slots,
  })
  const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
  const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
  return { wrapper, trigger, surface }
}

function rows(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.astryx-dropdown-menu [role="menuitem"]'))
}

function enabledRows(): HTMLElement[] {
  return rows().filter(row => row.getAttribute('aria-disabled') !== 'true')
}

function isShown(surface: HTMLElement): boolean {
  return surface.style.display !== 'none'
}

async function press(surface: HTMLElement, key: string, init: KeyboardEventInit = {}): Promise<void> {
  surface.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key, ...init }))
  await flushPromises()
}

describe('dropdownMenu', () => {
  it('wires the default trigger button to a hidden menu surface', () => {
    const { trigger, surface } = renderMenu()

    expect(trigger.textContent).toContain('Menu')
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBe(surface.id)
    expect(surface.getAttribute('role')).toBe('menu')
    expect(surface.getAttribute('aria-label')).toBe('Menu')
    expect(surface.getAttribute('tabindex')).toBe('-1')
    expect(isShown(surface)).toBe(false)
  })

  it('opens the menu inside a bottom sheet', async () => {
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: {
        presentation: 'bottom-sheet',
        button: { label: 'Project actions' },
        items: [{ label: 'Edit project' }],
      },
    })

    await wrapper.get('button').trigger('click')
    await nextTick()
    await flushPromises()

    expect(document.body.textContent).toContain('Edit project')
    expect(document.querySelector('.astryx-dropdown-menu.is-sheet')).not.toBeNull()
    wrapper.unmount()
  })

  it('shows a chevron on a labelled trigger', () => {
    const { trigger } = renderMenu()

    expect(trigger.querySelector('.astryx-icon')).not.toBeNull()
  })

  it('drops the chevron and names the control on an icon-only trigger', () => {
    const { trigger } = renderMenu({ button: { isIconOnly: true, label: 'Actions' } })

    expect(trigger.querySelector('.astryx-icon')).toBeNull()
    expect(trigger.getAttribute('aria-label')).toBe('Actions')
  })

  it('opens on a trigger click and renders the data-mode rows', async () => {
    const { wrapper, trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()

    expect(isShown(surface)).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(rows().map(row => row.textContent?.trim())).toEqual([
      'Edit project',
      'Duplicate project',
      'Archive project',
      'Delete project',
      'Dismiss',
    ])
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    expect(wrapper.emitted('click')).toEqual([[]])
  })

  it('toggles closed on a second trigger click', async () => {
    const { wrapper, trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()
    trigger.click()
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('opens on ArrowDown with the first row and on ArrowUp with the last', async () => {
    const { trigger, surface } = renderMenu()

    trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }))
    await flushPromises()

    expect(isShown(surface)).toBe(true)
    expect(document.activeElement).toBe(enabledRows()[0])

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await flushPromises()

    trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }))
    await flushPromises()

    expect(document.activeElement).toBe(enabledRows().at(-1))
  })

  it('opens on Enter without the activation click toggling it straight back', async () => {
    const { trigger, surface } = renderMenu()

    trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }))
    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()

    expect(isShown(surface)).toBe(true)
    expect(document.activeElement).toBe(enabledRows()[0])
  })

  it('walks the rows with ArrowDown and ArrowUp, skipping the disabled row and wrapping', async () => {
    const { trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()
    // A click with no pointer detail is a synthesized (assistive) activation,
    // so the menu opens the way a keyboard open does.
    expect(document.activeElement).toBe(enabledRows()[0])

    await press(surface, 'ArrowDown')
    expect(document.activeElement).toBe(enabledRows()[1])

    await press(surface, 'ArrowDown')
    expect(document.activeElement).toBe(enabledRows()[2])

    await press(surface, 'ArrowDown')
    expect(document.activeElement).toBe(enabledRows()[3])

    await press(surface, 'ArrowDown')
    expect(document.activeElement).toBe(enabledRows()[0])

    await press(surface, 'ArrowUp')
    expect(document.activeElement).toBe(enabledRows()[3])
  })

  it('jumps to the first and last enabled row with Home and End', async () => {
    const { trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()

    await press(surface, 'End')
    expect(document.activeElement).toBe(enabledRows().at(-1))

    await press(surface, 'Home')
    expect(document.activeElement).toBe(enabledRows()[0])
  })

  it('focuses the next row whose label starts with the typed letter and cycles on a repeat', async () => {
    const { trigger, surface } = renderMenu({
      items: [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Delete' },
      ],
    })

    trigger.click()
    await flushPromises()
    expect(document.activeElement?.textContent?.trim()).toBe('Edit')

    await press(surface, 'd')
    expect(document.activeElement?.textContent?.trim()).toBe('Duplicate')

    await press(surface, 'd')
    expect(document.activeElement?.textContent?.trim()).toBe('Delete')

    await press(surface, 'd')
    expect(document.activeElement?.textContent?.trim()).toBe('Duplicate')
  })

  it('matches the row label rather than the row as a whole', async () => {
    const { trigger, surface } = renderMenu({
      items: [
        { label: 'Duplicate', description: 'Copy of the project' },
        { label: 'Delete', endContent: 'D' },
        { label: 'Edit' },
      ],
    })

    trigger.click()
    await flushPromises()
    await press(surface, 'e')

    expect(document.activeElement?.textContent?.trim()).toContain('Edit')
  })

  it('never types ahead to a disabled row', async () => {
    const { trigger, surface } = renderMenu({
      items: [
        { label: 'Duplicate' },
        { label: 'Delete', isDisabled: true },
        { label: 'Download' },
      ],
    })

    trigger.click()
    await flushPromises()

    await press(surface, 'd')
    expect(document.activeElement?.textContent?.trim()).toBe('Download')

    await press(surface, 'd')
    expect(document.activeElement?.textContent?.trim()).toBe('Duplicate')
  })

  it('activates the focused row with Enter and Space, then closes', async () => {
    const edit = vi.fn()
    const duplicate = vi.fn()
    const { trigger, surface } = renderMenu({
      items: [
        { label: 'Edit', onClick: edit },
        { label: 'Duplicate', onClick: duplicate },
      ],
    })

    trigger.click()
    await flushPromises()
    await press(surface, 'Enter')
    expect(edit).toHaveBeenCalledTimes(1)
    expect(isShown(surface)).toBe(false)

    trigger.click()
    await flushPromises()
    await press(surface, 'ArrowDown')
    await press(surface, ' ')
    expect(duplicate).toHaveBeenCalledTimes(1)
    expect(isShown(surface)).toBe(false)
  })

  it('never activates on the auto-repeat of the key that opened the menu', async () => {
    const edit = vi.fn()
    const { trigger, surface } = renderMenu({ items: [{ label: 'Edit', onClick: edit }] })

    trigger.click()
    await flushPromises()

    await press(surface, 'Enter', { repeat: true })
    expect(edit).not.toHaveBeenCalled()
    expect(isShown(surface)).toBe(true)
  })

  it('closes on Tab so the page keeps the tab order', async () => {
    const { trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()
    await press(surface, 'Tab')

    expect(isShown(surface)).toBe(false)
  })

  it('closes on Escape and returns focus to the trigger', async () => {
    const { wrapper, trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()
    await press(surface, 'ArrowDown')
    expect(document.activeElement).not.toBe(trigger)

    document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }))
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('dismisses on a press outside and stays open for a press inside', async () => {
    const { trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()

    surface.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(isShown(surface)).toBe(true)

    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(isShown(surface)).toBe(false)
  })

  it('leaves focus alone when an outside press landed on another control', async () => {
    const { trigger, surface } = renderMenu()
    const outside = document.createElement('input')
    document.body.append(outside)

    trigger.click()
    await flushPromises()
    await press(surface, 'ArrowDown')

    outside.focus()
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(document.activeElement).toBe(outside)
  })

  it('skips a disabled row: inert, never focused, never activating', async () => {
    const onClick = vi.fn()
    const { trigger, surface } = renderMenu({ items: [{ label: 'Archive', isDisabled: true, onClick }] })

    trigger.click()
    await flushPromises()

    const row = rows()[0]!
    expect(row.getAttribute('aria-disabled')).toBe('true')
    expect(row.getAttribute('tabindex')).toBeNull()

    row.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()

    expect(onClick).not.toHaveBeenCalled()
    expect(isShown(surface)).toBe(true)
  })

  it('keeps the menu open when a row opts out of closing', async () => {
    const onClick = vi.fn()
    const { trigger, surface } = renderMenu({ items: [{ label: 'Copy', hasCloseOnSelect: false, onClick }] })

    trigger.click()
    await flushPromises()
    rows()[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(isShown(surface)).toBe(true)
  })

  it('closes and returns focus to the trigger when a row is picked with the pointer', async () => {
    const onClick = vi.fn()
    const { trigger, surface } = renderMenu({ items: [{ label: 'Edit', onClick }] })

    trigger.click()
    await flushPromises()
    rows()[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(isShown(surface)).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('applies a controlled open state and does not move focus for a menu mounted open', async () => {
    const Host = defineComponent({
      components: { DropdownMenu },
      setup() {
        const isOpen = ref(true)
        return { isOpen, items: [{ label: 'Edit' }] }
      },
      template: '<DropdownMenu v-model:is-menu-open="isOpen" :items="items" />',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!

    expect(isShown(surface)).toBe(true)
    // Nobody asked for this open, so it must not drag focus into the menu.
    expect(document.activeElement).not.toBe(rows()[0])

    wrapper.vm.isOpen = false
    await flushPromises()
    expect(isShown(surface)).toBe(false)
  })

  it('leaves the surface closed when the controller refuses the open', async () => {
    const Host = defineComponent({
      components: { DropdownMenu },
      setup() {
        const isOpen = ref(false)
        return { isOpen, items: [{ label: 'Edit' }] }
      },
      template: '<DropdownMenu :is-menu-open="isOpen" :items="items" @update:is-menu-open="() => {}" />',
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!

    trigger.click()
    await flushPromises()

    expect(wrapper.findComponent(DropdownMenu).emitted('update:isMenuOpen')).toEqual([[true]])
    expect(isShown(document.querySelector<HTMLElement>('.astryx-dropdown-menu')!)).toBe(false)
  })

  it('drives the open state through v-model:is-menu-open', async () => {
    const Host = defineComponent({
      components: { DropdownMenu },
      setup() {
        const isOpen = ref(false)
        return { isOpen, items: [{ label: 'Edit' }] }
      },
      template: '<DropdownMenu v-model:is-menu-open="isOpen" :items="items" />',
    })
    const wrapper = mount(Host, { attachTo: document.body })

    const trigger = document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!
    trigger.click()
    await flushPromises()

    expect(wrapper.vm.isOpen).toBe(true)
    expect(isShown(document.querySelector<HTMLElement>('.astryx-dropdown-menu')!)).toBe(true)
  })

  it('positions a menu that mounts already open', async () => {
    const rect = {
      bottom: 120,
      height: 32,
      left: 10,
      right: 90,
      top: 88,
      width: 80,
      x: 10,
      y: 88,
      toJSON: () => ({}),
    } as DOMRect
    const original = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function () {
      return rect
    }

    try {
      const Host = defineComponent({
        components: { DropdownMenu },
        setup() {
          const isOpen = ref(true)
          return { isOpen, items: [{ label: 'Edit' }] }
        },
        template: '<DropdownMenu v-model:is-menu-open="isOpen" :items="items" />',
      })
      mount(Host, { attachTo: document.body })
      await flushPromises()

      const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!
      // Trigger bottom (120) plus the 4px gap.
      expect(surface.style.top).toBe('124px')
      expect(surface.style.left).toBe('10px')
    }
    finally {
      HTMLElement.prototype.getBoundingClientRect = original
    }
  })

  it('focuses the menu surface itself on a pointer open, so no row reads as pre-selected', async () => {
    const { trigger, surface } = renderMenu()

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    await flushPromises()

    expect(document.activeElement).toBe(surface)
  })

  it('treats a synthesized trigger click as a keyboard open', async () => {
    const { trigger, surface } = renderMenu()

    trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
    await flushPromises()

    expect(isShown(surface)).toBe(true)
    expect(document.activeElement).toBe(enabledRows()[0])
  })

  it('keeps rows following the trigger size after mount instead of freezing at the first value', async () => {
    const { wrapper, trigger } = renderMenu({ button: { label: 'Actions', size: 'sm' } })

    trigger.click()
    await flushPromises()
    expect(rows()[0]!.getAttribute('data-menu-size')).toBe('sm')

    await wrapper.setProps({ button: { label: 'Actions', size: 'lg' } })
    await nextTick()

    expect(rows()[0]!.getAttribute('data-menu-size')).toBe('lg')
  })

  it('renders sections and dividers in data mode', async () => {
    const { trigger } = renderMenu({
      items: [
        { type: 'section', title: 'Project', items: [{ label: 'Rename' }, { label: 'Duplicate' }] },
        { type: 'divider' },
        { label: 'Delete', variant: 'destructive' },
      ],
    })

    trigger.click()
    await flushPromises()

    const group = document.querySelector<HTMLElement>('.astryx-dropdown-menu [role="group"]')!
    expect(group).not.toBeNull()
    expect(group.getAttribute('aria-labelledby')).toBe(
      group.querySelector('.astryx-dropdown-menu-section-heading')!.id,
    )
    expect(document.querySelectorAll('.astryx-dropdown-menu-divider')).toHaveLength(1)
    expect(rows()).toHaveLength(3)
    expect(rows()[2]!.getAttribute('data-variant')).toBe('destructive')
  })

  it('renders compound content from the default slot', async () => {
    const { trigger } = renderMenu({ items: undefined }, {
      default: () => [
        h(DropdownMenuGroup, { title: 'History' }, { default: () => h(DropdownMenuItem, { label: 'Restore' }) }),
        h(DropdownMenuDivider),
        h(DropdownMenuItem, { label: 'Delete', variant: 'destructive' }),
      ],
    })

    trigger.click()
    await flushPromises()

    expect(document.querySelector('.astryx-dropdown-menu-section-heading')?.textContent?.trim()).toBe('History')
    expect(rows().map(row => row.textContent?.trim())).toEqual(['Restore', 'Delete'])
  })

  it('renders a link row as one anchor carrying role menuitem and leaves a modified click to the browser', async () => {
    const onClick = vi.fn()
    // happy-dom follows a real anchor's address, which this test does not need.
    const stopNavigation = (event: Event): void => event.preventDefault()
    document.addEventListener('click', stopNavigation, true)

    try {
      const { trigger, surface } = renderMenu({
        items: [{ label: 'Open docs', href: '#docs', onClick, target: '_blank' }],
      })

      trigger.click()
      await flushPromises()

      const row = rows()[0]!
      expect(row.tagName).toBe('A')
      expect(row.getAttribute('href')).toBe('#docs')
      expect(row.getAttribute('rel')).toBe('noopener noreferrer')

      row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, metaKey: true }))
      await flushPromises()
      expect(onClick).not.toHaveBeenCalled()
      expect(isShown(surface)).toBe(false)

      trigger.click()
      await flushPromises()
      rows()[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await flushPromises()
      expect(onClick).toHaveBeenCalledTimes(1)
    }
    finally {
      document.removeEventListener('click', stopNavigation, true)
    }
  })

  it('lifts the height cap and applies an explicit width to the surface', async () => {
    const { trigger, surface } = renderMenu({ menuMaxHeight: 480, menuWidth: 240 })

    trigger.click()
    await flushPromises()

    expect(surface.style.minWidth).toContain('240px')
    expect(surface.style.maxWidth).toBe('calc(100vw - 16px)')
    expect(surface.style.getPropertyValue('--_dropdown-menu-max-block')).toContain('480px')
  })

  it('caps the height at 300px by default and never grows past the viewport', async () => {
    const { trigger, surface } = renderMenu()

    trigger.click()
    await flushPromises()

    expect(surface.style.getPropertyValue('--_dropdown-menu-max-block')).toBe('min(300px, calc(100dvh - 16px))')
    expect(surface.style.maxWidth).toContain('calc(100vw - 16px)')
  })

  it('takes an intrinsic width keyword as the preferred width still capped by the viewport', async () => {
    const { trigger, surface } = renderMenu({ menuWidth: 'max-content' })

    trigger.click()
    await flushPromises()

    expect(surface.style.width).toBe('max-content')
    expect(surface.style.maxWidth).toBe('calc(100vw - 16px)')
  })

  it('routes native attributes to the menu surface and keeps aria-controls consistent', () => {
    const { trigger, surface } = renderMenu({ class: 'my-menu', id: 'project-menu' })

    expect(surface.classList.contains('my-menu')).toBe(true)
    expect(surface.id).toBe('project-menu')
    expect(trigger.getAttribute('aria-controls')).toBe('project-menu')
  })

  it('names the menu after a custom trigger through aria-labelledby', async () => {
    const Host = defineComponent({
      components: { DropdownMenu },
      setup() {
        return { items: [{ label: 'Edit' }] }
      },
      template: `
        <DropdownMenu :items="items">
          <template #trigger="triggerProps">
            <button type="button" class="custom-trigger" v-bind="triggerProps">More actions</button>
          </template>
        </DropdownMenu>
      `,
    })
    mount(Host, { attachTo: document.body })

    const trigger = document.querySelector<HTMLButtonElement>('.custom-trigger')!
    const surface = document.querySelector<HTMLElement>('.astryx-dropdown-menu')!

    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBe(surface.id)
    expect(surface.getAttribute('aria-labelledby')).toBe(trigger.id)
    expect(surface.getAttribute('aria-label')).toBeNull()

    trigger.click()
    await flushPromises()

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(isShown(surface)).toBe(true)
    expect(document.activeElement).toBe(enabledRows()[0])
  })

  it('opens a submenu flyout from its row', async () => {
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu },
      template: `
        <DropdownMenu :button="{ label: 'Actions' }">
          <DropdownMenuSubMenu label="Move to">
            <DropdownMenuItem label="Projects" />
          </DropdownMenuSubMenu>
        </DropdownMenu>
      `,
    })
    mount(Host, { attachTo: document.body })
    document.querySelector<HTMLButtonElement>('.astryx-dropdown-menu-trigger > .astryx-button')!.click()
    await flushPromises()
    const row = [...document.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(item => item.textContent?.includes('Move to'))
    row?.click()
    await flushPromises()
    await nextTick()
    expect(document.body.textContent).toContain('Projects')
    const flyout = document.querySelector('.astryx-dropdown-submenu')
    expect(flyout).not.toBeNull()
    expect((flyout as HTMLElement).style.display).not.toBe('none')
  })
})
