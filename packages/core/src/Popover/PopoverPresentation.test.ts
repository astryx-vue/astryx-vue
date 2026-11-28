import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { COMPACT_TOUCH, installMatchMedia } from '../composables/testing/fakeMatchMedia.js'
import Popover from './Popover.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.unstubAllGlobals()
  document.body.innerHTML = ''
})

const CONTENT = '<button type="button" class="first-action">Rename</button><button type="button">Archive</button>'

function phone() {
  return installMatchMedia(query => query === COMPACT_TOUCH)
}

function render(props: Record<string, unknown> = {}) {
  const wrapper = mount(Popover, {
    attachTo: document.body,
    props: { label: 'Project actions', ...props },
    slots: { default: '<button type="button">Actions</button>', content: CONTENT },
  })
  const trigger = document.querySelector('.astryx-popover-trigger > button') as HTMLButtonElement
  return { wrapper, trigger }
}

const sheetDialog = () => document.querySelector<HTMLDialogElement>('.astryx-bottom-sheet-dialog')
const sheetPanel = () => document.querySelector<HTMLElement>('.astryx-bottom-sheet')
const anchoredSurface = () => document.querySelector<HTMLElement>('.astryx-popover')!

async function settle(): Promise<void> {
  await flushPromises()
  await vi.waitFor(() => {})
  await nextTick()
}

async function openWith(trigger: HTMLElement): Promise<void> {
  trigger.click()
  await settle()
  await vi.waitFor(() => expect(sheetDialog()?.open).toBe(true))
}

describe('popover presentation', () => {
  it('keeps the default popover anchored on a phone', async () => {
    phone()
    const { trigger } = render()
    trigger.click()
    await settle()
    expect(sheetDialog()).toBeNull()
    expect(anchoredSurface().style.display).not.toBe('none')
    expect(anchoredSurface().querySelector('.first-action')).not.toBeNull()
  })

  it('presents an adaptive popover as a labelled bottom sheet on a compact touch screen', async () => {
    phone()
    const { trigger } = render({ presentation: 'adaptive' })
    await openWith(trigger)

    expect(sheetDialog()!.getAttribute('aria-label')).toBe('Project actions')
    expect(sheetPanel()!.querySelector('.first-action')).not.toBeNull()
    // 一次只有一份内容：锚定浮层里是空的。
    expect(anchoredSurface().querySelector('.first-action')).toBeNull()
    expect(anchoredSurface().style.display).toBe('none')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(sheetPanel()!.id)
  })

  it('keeps an adaptive popover anchored on a desktop', async () => {
    installMatchMedia(() => false)
    const { trigger } = render({ presentation: 'adaptive' })
    trigger.click()
    await settle()
    expect(sheetDialog()).toBeNull()
    expect(anchoredSurface().style.display).not.toBe('none')
  })

  it('presents a bottom sheet on any device when asked for one', async () => {
    installMatchMedia(() => false)
    const { trigger } = render({ presentation: 'bottom-sheet', role: 'none' })
    await openWith(trigger)
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
  })

  it('keeps the open sheet when the screen stops being compact', async () => {
    const media = phone()
    const { trigger } = render({ presentation: 'adaptive' })
    await openWith(trigger)

    media.set(() => false)
    await settle()
    expect(sheetDialog()!.open).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('names a sheet without a label by the trigger text', async () => {
    phone()
    const { trigger } = render({ presentation: 'adaptive', label: undefined })
    await openWith(trigger)
    expect(sheetDialog()!.getAttribute('aria-label')).toBe('Actions')
  })

  it('moves focus to the first content control, not the fallback close', async () => {
    phone()
    const { trigger } = render({ presentation: 'adaptive' })
    await openWith(trigger)
    await vi.waitFor(() => expect(document.activeElement?.classList.contains('first-action')).toBe(true))
    expect(sheetPanel()!.querySelector('[data-astryx-popover-fallback-close]')).not.toBeNull()
  })

  it('closes from the trigger and reports each change', async () => {
    phone()
    const { wrapper, trigger } = render({ presentation: 'adaptive' })
    await openWith(trigger)
    trigger.click()
    await settle()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('light-dismisses the sheet with a tap outside whatever hasLightDismiss says', async () => {
    phone()
    const { wrapper, trigger } = render({ presentation: 'adaptive', hasLightDismiss: false })
    await openWith(trigger)
    sheetDialog()!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
  })

  it('lets hasEscapeDismiss turn Escape off for the sheet', async () => {
    phone()
    const { wrapper, trigger } = render({ presentation: 'adaptive', hasEscapeDismiss: false })
    await openWith(trigger)
    sheetDialog()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    expect(sheetDialog()!.open).toBe(true)
  })

  it('closes the sheet on Escape by default', async () => {
    phone()
    const { wrapper, trigger } = render({ presentation: 'adaptive' })
    await openWith(trigger)
    sheetDialog()!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await settle()
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
  })

  it('opens a controlled adaptive popover as a sheet on a phone and closes it through the parent', async () => {
    phone()
    const Host = defineComponent({
      setup() {
        const isOpen = ref(false)
        return () => h('div', [
          h(Popover, {
            label: 'Filters',
            presentation: 'adaptive',
            isOpen: isOpen.value,
            onOpenChange: (next: boolean) => {
              isOpen.value = next
            },
          }, {
            default: () => h('button', { type: 'button', onClick: () => (isOpen.value = true) }, 'Filters'),
            content: () => h('button', { type: 'button' }, 'Apply'),
          }),
        ])
      },
    })
    mount(Host, { attachTo: document.body })
    const trigger = document.querySelector('.astryx-popover-trigger > button') as HTMLButtonElement
    trigger.click()
    await settle()
    await vi.waitFor(() => expect(sheetDialog()?.open).toBe(true))
    expect(anchoredSurface().style.display).toBe('none')

    sheetDialog()!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await settle()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
})
