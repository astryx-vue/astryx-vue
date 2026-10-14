import type { DropdownMenuOption } from './types.js'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { Button } from '../Button/index.js'
import DropdownMenu from './DropdownMenu.vue'
import DropdownMenuCheckboxItem from './DropdownMenuCheckboxItem.vue'
import DropdownMenuRadioGroup from './DropdownMenuRadioGroup.vue'
import DropdownMenuRadioItem from './DropdownMenuRadioItem.vue'
import DropdownMenuSubMenu from './DropdownMenuSubMenu.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

async function open(trigger: HTMLElement): Promise<HTMLElement> {
  trigger.click()
  await flushPromises()
  const surface = document.querySelector<HTMLElement>('[role="menu"]')!
  return surface
}

describe('dropdown menu checkbox and radio rows', () => {
  it('toggles a checkbox row without closing the menu', async () => {
    const showArchived = ref(false)
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuCheckboxItem },
      setup() {
        return { showArchived }
      },
      template: `
        <DropdownMenu :button="{ label: 'View' }">
          <DropdownMenuCheckboxItem v-model="showArchived" label="Show archived" />
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const surface = await open(wrapper.get('button').element)

    const row = document.querySelector<HTMLElement>('[role="menuitemcheckbox"]')!
    expect(row.getAttribute('aria-checked')).toBe('false')
    expect(row.tabIndex).toBe(-1)
    row.click()
    await flushPromises()

    expect(showArchived.value).toBe(true)
    expect(row.getAttribute('aria-checked')).toBe('true')
    expect(row.querySelector('.astryx-checkbox-indicator')?.getAttribute('data-state')).toBe('checked')
    expect(surface.style.display).not.toBe('none')
  })

  it('closes after a checkbox toggle when asked, and ignores a disabled row', async () => {
    const checked = ref(false)
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuCheckboxItem },
      setup() {
        return { checked }
      },
      template: `
        <DropdownMenu :button="{ label: 'View' }">
          <DropdownMenuCheckboxItem v-model="checked" has-close-on-select label="Pinned" />
          <DropdownMenuCheckboxItem :model-value="false" is-disabled label="Locked" />
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await open(wrapper.get('button').element)

    const locked = [...document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')]
      .find(row => row.textContent?.includes('Locked'))!
    expect(locked.getAttribute('aria-disabled')).toBe('true')
    locked.click()
    await flushPromises()
    expect(document.querySelector('[role="menu"]')?.getAttribute('style') ?? '').not.toContain('display: none')

    const pinned = [...document.querySelectorAll<HTMLElement>('[role="menuitemcheckbox"]')]
      .find(row => row.textContent?.includes('Pinned'))!
    pinned.click()
    await flushPromises()
    expect(checked.value).toBe(true)
    expect(document.querySelector<HTMLElement>('[role="menu"]')!.style.display).toBe('none')
  })

  it('selects one radio and closes, unless the group stays open', async () => {
    const sort = ref<string | undefined>('newest')
    const density = ref('comfortable')
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem },
      setup() {
        return { density, sort }
      },
      template: `
        <DropdownMenu :button="{ label: 'Sort' }">
          <DropdownMenuRadioGroup v-model="sort" label="Sort by">
            <DropdownMenuRadioItem value="newest" label="Newest" />
            <DropdownMenuRadioItem value="oldest" label="Oldest" />
          </DropdownMenuRadioGroup>
          <DropdownMenuRadioGroup v-model="density" label="Density" :has-close-on-select="false">
            <DropdownMenuRadioItem value="comfortable" label="Comfortable" />
            <DropdownMenuRadioItem value="compact" label="Compact" />
          </DropdownMenuRadioGroup>
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await open(wrapper.get('button').element)

    const groups = document.querySelectorAll('[role="group"]')
    expect(groups[0]?.getAttribute('aria-label')).toBe('Sort by')
    const oldest = document.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="false"]')!
    expect(document.querySelector('[role="menuitemradio"][aria-checked="true"] .astryx-dropdown-menu-radio')?.getAttribute('data-checked')).toBe('checked')

    const compact = [...document.querySelectorAll<HTMLElement>('[role="menuitemradio"]')]
      .find(row => row.textContent?.includes('Compact'))!
    compact.click()
    await flushPromises()
    expect(density.value).toBe('compact')
    expect(document.querySelector<HTMLElement>('[role="menu"]')!.style.display).not.toBe('none')

    oldest.click()
    await flushPromises()
    expect(sort.value).toBe('oldest')
    expect(document.querySelector<HTMLElement>('[role="menu"]')!.style.display).toBe('none')
  })

  it('refuses a radio row outside its group', () => {
    expect(() => mount(DropdownMenuRadioItem, { props: { label: 'Newest', value: 'newest' } })).toThrow(/DropdownMenuRadioGroup/)
  })

  it('renders checkbox and radio rows from the data API', async () => {
    const onCheck = vi.fn()
    const onSort = vi.fn()
    const items: DropdownMenuOption[] = [
      { type: 'checkbox', label: 'Show archived', checked: true, onChange: onCheck },
      {
        type: 'radio',
        label: 'Sort by',
        value: 'name',
        hasCloseOnSelect: false,
        onChange: onSort,
        items: [
          { value: 'name', label: 'Name' },
          { value: 'date', label: 'Date' },
        ],
      },
    ]
    const wrapper = mount(DropdownMenu, {
      attachTo: document.body,
      props: { button: { label: 'View' }, items },
    })
    await open(wrapper.get('button').element)

    const checkbox = document.querySelector<HTMLElement>('[role="menuitemcheckbox"]')!
    expect(checkbox.getAttribute('aria-checked')).toBe('true')
    checkbox.click()
    await flushPromises()
    expect(onCheck).toHaveBeenCalledWith(false)
    expect(document.querySelector('[role="menu"]')?.getAttribute('style')).not.toContain('display: none')

    const date = [...document.querySelectorAll<HTMLElement>('[role="menuitemradio"]')].find(row => row.textContent?.includes('Date'))!
    date.click()
    await flushPromises()
    expect(onSort).toHaveBeenCalledWith('date')
  })

  it('toggles the focused checkbox from the keyboard and leaves the menu open', async () => {
    const enabled = ref(false)
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuCheckboxItem },
      setup() {
        return { enabled }
      },
      template: `
        <DropdownMenu :button="{ label: 'View' }">
          <DropdownMenuCheckboxItem v-model="enabled" label="Grid" />
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const surface = await open(wrapper.get('button').element)
    const row = document.querySelector<HTMLElement>('[role="menuitemcheckbox"]')!
    row.focus()
    surface.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }))
    await flushPromises()
    expect(enabled.value).toBe(true)
    expect(surface.style.display).not.toBe('none')
  })
})

describe('dropdown menu header, footer, and submenu form', () => {
  it('keeps the header and footer outside the menu and tabs from a row to the header', async () => {
    const Host = defineComponent({
      components: { Button, DropdownMenu },
      template: `
        <DropdownMenu :button="{ label: 'Labels' }">
          <template #header>
            <input aria-label="Filter labels" />
          </template>
          <template #default>
            <button role="menuitem" tabindex="-1" type="button">Bug</button>
          </template>
          <template #footer>
            <button type="button">Create label</button>
          </template>
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const surface = await open(wrapper.get('button').element)
    const menu = document.querySelector<HTMLElement>('[role="menu"]')!
    expect(menu.querySelector('input')).toBeNull()
    expect(menu.querySelector('button')).not.toBeNull()
    expect(document.querySelector('[aria-label="Filter labels"]')).not.toBeNull()
    expect(menu.closest('.astryx-dropdown-menu-popover')).not.toBeNull()

    const row = menu.querySelector<HTMLElement>('[role="menuitem"]')!
    row.focus()
    row.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: 'Tab', shiftKey: true }))
    await nextTick()
    expect(document.activeElement).toBe(document.querySelector('input'))
    expect(surface.style.display).not.toBe('none')
    expect(menu.style.display).not.toBe('none')
  })

  it('shows a spinner instead of the caret and sizes the flyout', async () => {
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuSubMenu },
      template: `
        <DropdownMenu :button="{ label: 'Actions' }">
          <DropdownMenuSubMenu has-spinner label="Loading" :menu-width="240" presentation="flyout">
            <span role="menuitem" tabindex="-1">Later</span>
          </DropdownMenuSubMenu>
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const surface = await open(wrapper.get('button').element)
    const row = surface.querySelector<HTMLElement>('[aria-haspopup="menu"]')!
    expect(row.querySelector('.astryx-spinner')).not.toBeNull()
    expect(row.querySelector('.astryx-icon--chevron-right')).toBeNull()
    row.click()
    await flushPromises()
    const flyout = document.querySelector<HTMLElement>('.astryx-dropdown-submenu')!
    expect(flyout.style.minWidth).toContain('240px')
  })

  it('drills into the same menu and comes back', async () => {
    const Host = defineComponent({
      components: { DropdownMenu, DropdownMenuSubMenu },
      template: `
        <DropdownMenu :button="{ label: 'Actions' }">
          <DropdownMenuSubMenu label="Move to" presentation="drill-in">
            <span role="menuitem" tabindex="-1">Projects</span>
          </DropdownMenuSubMenu>
        </DropdownMenu>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const surface = await open(wrapper.get('button').element)
    const row = surface.querySelector<HTMLElement>('[aria-haspopup="menu"]')!
    row.click()
    await flushPromises()

    const menus = [...document.querySelectorAll<HTMLElement>('[role="menu"]')]
    const drill = menus.find(menu => menu.classList.contains('astryx-dropdown-menu-drill'))!
    expect(drill.hidden).toBe(false)
    expect(drill.textContent).toContain('Back to Actions')
    expect(drill.textContent).toContain('Projects')
    expect(document.querySelector('.astryx-dropdown-menu-tree')?.hasAttribute('hidden')).toBe(true)

    const back = [...drill.querySelectorAll<HTMLElement>('[role="menuitem"]')].find(item => item.textContent?.includes('Back'))!
    back.click()
    await flushPromises()
    expect(document.querySelector('.astryx-dropdown-menu-tree')?.hasAttribute('hidden')).toBe(false)
  })
})
