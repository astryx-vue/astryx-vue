import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useLayerMountTarget } from '../composables/useLayerMountTarget.js'
import { useActiveModalOutlet } from '../layer/modalOutlet.js'
import Dialog from './Dialog.vue'
import DialogHeader from './DialogHeader.vue'
import { ensureDialogModalApi } from './testUtils.js'

enableAutoUnmount(afterEach)

beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
})

function renderDialog(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(Dialog, {
    attachTo: document.body,
    props: { isOpen: false, ...props },
    slots: { default: () => h('p', 'Body'), ...slots },
  })
}

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog') as HTMLDialogElement
}

describe('dialog', () => {
  it('stays closed when isOpen is false', () => {
    renderDialog()

    expect(dialogEl().hasAttribute('open')).toBe(false)
  })

  it('opens as a modal when mounted with isOpen true', () => {
    renderDialog({ isOpen: true })

    expect(dialogEl().hasAttribute('open')).toBe(true)
    expect(dialogEl().getAttribute('aria-modal')).toBe('true')
  })

  it('carries the layer text reset class on both of its roots', () => {
    const modal = renderDialog({ isOpen: true })
    expect(dialogEl().classList.contains('astryx-layer')).toBe(true)
    modal.unmount()

    renderDialog({ isOpen: true, isInline: true })
    expect(document.querySelector('.astryx-dialog--inline')?.classList.contains('astryx-layer')).toBe(true)
  })

  it('focuses the header title as the default target', async () => {
    renderDialog({ isOpen: true }, { default: () => h(DialogHeader, { title: 'Delete project' }) })
    await flushPromises()

    expect(document.activeElement?.classList.contains('astryx-dialog-header__title')).toBe(true)
  })

  it('prefers an explicit data-autofocus target over the header title', async () => {
    renderDialog({ isOpen: true }, {
      default: () => [
        h(DialogHeader, { title: 'Rename' }),
        h('input', { 'data-autofocus': '', 'aria-label': 'Name' }),
      ],
    })
    await flushPromises()

    expect(document.activeElement?.getAttribute('aria-label')).toBe('Name')
  })

  it('names the dialog after the header title', async () => {
    const wrapper = renderDialog({ isOpen: true }, { default: () => h(DialogHeader, { title: 'Delete project' }) })
    await flushPromises()

    const title = wrapper.find('.astryx-dialog-header__title').element as HTMLElement
    expect(dialogEl().getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('lets an explicit aria-label replace the header name', async () => {
    const wrapper = renderDialog({ 'isOpen': true, 'aria-label': 'Custom name' }, {
      default: () => h(DialogHeader, { title: 'Delete project' }),
    })
    await flushPromises()

    expect(dialogEl().getAttribute('aria-label')).toBe('Custom name')
    expect(dialogEl().getAttribute('aria-labelledby')).toBeNull()
    expect(wrapper.find('.astryx-dialog-header__title').exists()).toBe(true)
  })

  it('emits openChange(false) on cancel for info and form purposes', async () => {
    for (const purpose of ['info', 'form'] as const) {
      const wrapper = renderDialog({ isOpen: true, purpose })
      const event = new Event('cancel', { cancelable: true })
      dialogEl().dispatchEvent(event)

      expect(event.defaultPrevented).toBe(true)
      expect(wrapper.emitted('openChange')).toEqual([[false]])
      wrapper.unmount()
    }
  })

  it('blocks cancel for the required purpose and uses alertdialog semantics', () => {
    const wrapper = renderDialog({ isOpen: true, purpose: 'required' })
    const event = new Event('cancel', { cancelable: true })
    dialogEl().dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('openChange')).toBeUndefined()
    expect(dialogEl().getAttribute('role')).toBe('alertdialog')
  })

  it('emits openChange(false) on backdrop click for info only', () => {
    const info = renderDialog({ isOpen: true, purpose: 'info' })
    dialogEl().dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(info.emitted('openChange')).toEqual([[false]])
    info.unmount()

    const form = renderDialog({ isOpen: true, purpose: 'form' })
    dialogEl().dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(form.emitted('openChange')).toBeUndefined()
  })

  it('ignores clicks on dialog content', () => {
    const wrapper = renderDialog({ isOpen: true })
    wrapper.find('p').element.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('restores focus to the trigger when closed', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = renderDialog({ isOpen: false })
    await wrapper.setProps({ isOpen: true })
    expect(dialogEl().hasAttribute('open')).toBe(true)

    await wrapper.setProps({ isOpen: false })
    expect(dialogEl().hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('locks body scroll while open and restores it on close', async () => {
    document.body.style.overflow = 'auto'
    const wrapper = renderDialog({ isOpen: false })

    await wrapper.setProps({ isOpen: true })
    expect(document.body.style.overflow).toBe('hidden')

    await wrapper.setProps({ isOpen: false })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('renders inline content without a modal dialog', () => {
    const wrapper = renderDialog({ isOpen: true, isInline: true })

    expect(document.querySelector('dialog')).toBeNull()
    expect(wrapper.find('.astryx-dialog--inline').exists()).toBe(true)
    expect(wrapper.text()).toContain('Body')
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('renders nothing for inline content when closed', () => {
    const wrapper = renderDialog({ isOpen: false, isInline: true })

    expect(wrapper.find('.astryx-dialog--inline').exists()).toBe(false)
  })

  it('applies numeric width and max height in pixels', () => {
    renderDialog({ isOpen: true, width: 320, maxHeight: 480 })

    expect(dialogEl().style.width).toBe('320px')
    expect(dialogEl().style.maxHeight).toBe('480px')
  })

  it('marks the fullscreen variant without an inline width', () => {
    renderDialog({ isOpen: true, variant: 'fullscreen' })

    expect(dialogEl().classList.contains('astryx-dialog--fullscreen')).toBe(true)
    expect(dialogEl().getAttribute('data-variant')).toBe('fullscreen')
    expect(dialogEl().style.width).toBe('')
  })

  it('applies a static top offset from position', () => {
    renderDialog({ isOpen: true, position: { top: 24 } })

    expect(dialogEl().style.top).toBe('24px')
    expect(Number.parseFloat(dialogEl().style.margin)).toBe(0)
  })

  it('maps numeric padding to the spacing token', () => {
    const wrapper = renderDialog({ isOpen: true, padding: 2 })

    expect(wrapper.find('.astryx-dialog__inner').element.getAttribute('style')).toContain('--astryx-spacing-2')
  })

  it('maps fractional padding to a hyphenated token', () => {
    const wrapper = renderDialog({ isOpen: true, padding: 1.5 })

    expect(wrapper.find('.astryx-dialog__inner').element.getAttribute('style')).toContain('--astryx-spacing-1-5')
  })
})

describe('dialog as a layer host', () => {
  const MountProbe = defineComponent({
    setup() {
      const mountTarget = useLayerMountTarget()
      const activeModal = useActiveModalOutlet()
      return () => h('div', {
        'data-mount': mountTarget.value?.className ?? 'none',
        'data-modal': activeModal.value?.tagName ?? 'none',
      })
    },
  })

  it('offers its own layer mount point to the content', async () => {
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { isOpen: true },
      slots: { default: () => h(MountProbe) },
    })
    await nextTick()

    const probe = wrapper.get('[data-mount]')
    expect(probe.attributes('data-mount')).toBe('astryx-dialog__layer-host')
    // 挂载点在对话框里面，浮层才会一起进原生模态层。
    const host = document.querySelector('.astryx-dialog__layer-host')
    expect(dialogEl().contains(host)).toBe(true)
  })

  it('registers itself as the modal outlet while open and drops it on close', async () => {
    const wrapper = mount(Dialog, {
      attachTo: document.body,
      props: { isOpen: false },
      slots: { default: () => h(MountProbe) },
    })

    expect(wrapper.get('[data-modal]').attributes('data-modal')).toBe('none')

    await wrapper.setProps({ isOpen: true })
    await nextTick()
    expect(wrapper.get('[data-modal]').attributes('data-modal')).toBe('DIALOG')

    await wrapper.setProps({ isOpen: false })
    await nextTick()
    expect(wrapper.get('[data-modal]').attributes('data-modal')).toBe('none')
  })
})
