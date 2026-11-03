import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import Drawer from './Drawer.vue'
import DrawerHeader from './DrawerHeader.vue'

function openDrawer(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  return mount(Drawer, {
    attachTo: document.body,
    props: { isOpen: true, label: 'Filters', ...props },
    slots: { default: 'Body content', ...slots },
  })
}

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog.astryx-drawer') as HTMLDialogElement
}

describe('drawer', () => {
  it('pins the panel to the logical end by default', async () => {
    const wrapper = openDrawer()
    await nextTick()
    const dialog = dialogEl()
    expect(dialog).not.toBeNull()
    expect(dialog.className).toContain('astryx-drawer--end')
    expect(dialog.getAttribute('aria-label')).toBe('Filters')
    expect(dialog.open).toBe(true)
    wrapper.unmount()
  })

  it('pins to the logical start when asked', async () => {
    const wrapper = openDrawer({ placement: 'start' })
    await nextTick()
    expect(dialogEl().className).toContain('astryx-drawer--start')
    wrapper.unmount()
  })

  it('emits openChange(false) on Escape for the info purpose', async () => {
    const wrapper = openDrawer()
    await nextTick()
    const event = new Event('cancel', { cancelable: true })
    dialogEl().dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[false]])
    wrapper.unmount()
  })

  it('ignores Escape and a bubbled cancel for the required purpose', async () => {
    const wrapper = openDrawer({ purpose: 'required' })
    await nextTick()
    dialogEl().dispatchEvent(new Event('cancel', { cancelable: true }))
    expect(wrapper.emitted('openChange')).toBeUndefined()

    const inner = dialogEl().querySelector('.astryx-drawer-body') as HTMLElement
    inner.dispatchEvent(new Event('cancel', { bubbles: true, cancelable: true }))
    expect(wrapper.emitted('openChange')).toBeUndefined()
    wrapper.unmount()
  })

  it('shows the close button when the header listens for openChange', async () => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Filters' },
      slots: { default: () => h(DrawerHeader, { title: 'Filters', onOpenChange: () => {} }) },
    })
    await nextTick()
    expect(document.querySelector('.astryx-drawer .astryx-dialog-header button')).not.toBeNull()
    wrapper.unmount()
  })

  it('is named by the header title', async () => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Filters' },
      slots: { default: () => h(DrawerHeader, { title: 'Filters' }) },
    })
    await nextTick()
    const dialog = dialogEl()
    expect(dialog.getAttribute('aria-label')).toBe('Filters')
    expect(dialog.querySelector('.astryx-dialog-header')?.textContent).toContain('Filters')
    wrapper.unmount()
  })

  it('hides the header close button when nobody listens for it', async () => {
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Filters' },
      slots: { default: () => h(DrawerHeader, { title: 'Filters' }) },
    })
    await nextTick()
    expect(document.querySelector('.astryx-drawer .astryx-dialog-header button')).toBeNull()
    wrapper.unmount()
  })

  it('shows the header close button only when asked, and reports it', async () => {
    const plain = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Filters' },
      slots: { default: () => h(DrawerHeader, { title: 'Filters', hasCloseButton: false }) },
    })
    await nextTick()
    expect(document.querySelector('.astryx-drawer .astryx-dialog-header button')).toBeNull()
    plain.unmount()

    const closed: boolean[] = []
    const wrapper = mount(Drawer, {
      attachTo: document.body,
      props: { isOpen: true, label: 'Filters' },
      slots: {
        default: () => h(DrawerHeader, {
          title: 'Filters',
          hasCloseButton: true,
          onOpenChange: (open: boolean) => closed.push(open),
        }),
      },
    })
    await nextTick()
    const close = document.querySelector<HTMLButtonElement>('.astryx-drawer .astryx-dialog-header button')!
    expect(close).not.toBeNull()
    close.click()
    await nextTick()
    expect(closed).toEqual([false])
    wrapper.unmount()
  })
})
