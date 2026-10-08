import type { DOMWrapper } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import BottomSheet from './BottomSheet.vue'

enableAutoUnmount(afterEach)

/** The test environment may not implement the modal dialog API. */
function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  if (typeof proto.showModal === 'function')
    return
  Object.defineProperty(proto, 'open', {
    configurable: true,
    get(this: HTMLDialogElement) {
      return this.hasAttribute('open')
    },
    set(this: HTMLDialogElement, value: boolean) {
      if (value)
        this.setAttribute('open', '')
      else
        this.removeAttribute('open')
    },
  })
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

beforeAll(ensureDialogModalApi)

afterEach(() => {
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  vi.restoreAllMocks()
})

function renderSheet(props: Record<string, unknown> = {}, slots: Record<string, () => unknown> = {}) {
  return mount(BottomSheet, {
    attachTo: document.body,
    props: { isOpen: false, label: 'Filters', ...props },
    slots: { default: () => h('p', 'Sheet body'), ...slots },
  })
}

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog') as HTMLDialogElement
}

function panelEl(): HTMLElement {
  return document.querySelector('.astryx-bottom-sheet') as HTMLElement
}

function pointerEvent(type: string, init: { clientY: number, pointerId?: number, timeStamp?: number, pointerType?: string }): Event {
  const pointerId = init.pointerId ?? 1
  let event: Event
  if (typeof PointerEvent === 'function') {
    event = new PointerEvent(type, { bubbles: true, cancelable: true, clientY: init.clientY, pointerId, pointerType: init.pointerType ?? 'mouse' })
  }
  else {
    event = new MouseEvent(type, { bubbles: true, cancelable: true, clientY: init.clientY })
    Object.defineProperty(event, 'pointerId', { value: pointerId })
    Object.defineProperty(event, 'pointerType', { value: init.pointerType ?? 'mouse' })
  }
  if (init.timeStamp != null)
    Object.defineProperty(event, 'timeStamp', { value: init.timeStamp })
  return event
}

function drag(el: Element, from: number, to: number, durationMs = 400): void {
  el.dispatchEvent(pointerEvent('pointerdown', { clientY: from, timeStamp: 100 }))
  window.dispatchEvent(pointerEvent('pointermove', { clientY: (from + to) / 2, timeStamp: 100 + durationMs / 2 }))
  window.dispatchEvent(pointerEvent('pointermove', { clientY: to, timeStamp: 100 + durationMs }))
  window.dispatchEvent(pointerEvent('pointerup', { clientY: to, timeStamp: 100 + durationMs }))
}

function stubPanelHeight(height: number, rect?: { width?: number, height?: number }): void {
  const element = panelEl()
  const box = {
    x: 0,
    y: 0,
    width: rect?.width ?? 640,
    height,
    top: 0,
    left: 0,
    right: rect?.width ?? 640,
    bottom: height,
    toJSON: () => ({}),
  } as DOMRect
  Object.defineProperty(element, 'getBoundingClientRect', { configurable: true, value: () => box })
}

describe('bottom sheet', () => {
  it('stays closed and unlabelled when isOpen is false', () => {
    renderSheet()

    expect(dialogEl().hasAttribute('open')).toBe(false)
    expect(dialogEl().getAttribute('aria-modal')).toBeNull()
  })

  it('opens as a labelled modal dialog', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })

    const dialog = dialogEl()
    expect(dialog.hasAttribute('open')).toBe(true)
    expect(dialog.getAttribute('aria-label')).toBe('Filters')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.classList.contains('astryx-bottom-sheet-dialog--scrim')).toBe(true)
  })

  it('uses alertdialog semantics for the required purpose', async () => {
    const wrapper = renderSheet({ purpose: 'required' })
    await wrapper.setProps({ isOpen: true })

    expect(dialogEl().getAttribute('role')).toBe('alertdialog')
  })

  it('opens non-modally without a scrim', async () => {
    const wrapper = renderSheet({ hasScrim: false })
    await wrapper.setProps({ isOpen: true })

    expect(dialogEl().hasAttribute('open')).toBe(true)
    expect(dialogEl().getAttribute('aria-modal')).toBeNull()
    expect(dialogEl().classList.contains('astryx-bottom-sheet-dialog--scrim')).toBe(false)
  })

  it('lets an aria-label attribute replace the label prop', async () => {
    const wrapper = renderSheet({ 'aria-label': 'Custom name' })
    await wrapper.setProps({ isOpen: true })

    expect(dialogEl().getAttribute('aria-label')).toBe('Custom name')
  })

  it('renders the panel surface, handle, and content box', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })

    expect(wrapper.find('.astryx-bottom-sheet__positioner').exists()).toBe(true)
    expect(wrapper.find('.astryx-bottom-sheet__handle-pill').exists()).toBe(true)
    expect(wrapper.find('.astryx-bottom-sheet__handle').attributes('aria-hidden')).toBe('true')
    expect(wrapper.find('.astryx-bottom-sheet__content').text()).toContain('Sheet body')
  })

  it('closes on Escape and emits the requested state', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })

    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))

    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(wrapper.emitted('update:isOpen')).toEqual([[false]])
  })

  it('keeps an IME composition cancel from dismissing the sheet', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })

    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', isComposing: true, bubbles: true }))

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('blocks Escape and cancel for the required purpose', async () => {
    const wrapper = renderSheet({ purpose: 'required' })
    await wrapper.setProps({ isOpen: true })

    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    const cancel = new Event('cancel', { cancelable: true })
    dialogEl().dispatchEvent(cancel)

    expect(cancel.defaultPrevented).toBe(true)
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('allows Escape but not a scrim click for the form purpose', async () => {
    const wrapper = renderSheet({ purpose: 'form' })
    await wrapper.setProps({ isOpen: true })

    dialogEl().dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(wrapper.emitted('openChange')).toBeUndefined()

    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('closes on a scrim click for the info purpose only', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    dialogEl().dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('ignores clicks on the panel content', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    const body = wrapper.find('.astryx-bottom-sheet__content p').element
    body.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('moves focus into the sheet on open and restores it on close', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open filters'
    document.body.appendChild(trigger)
    trigger.focus()

    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    expect(document.activeElement).toBe(panelEl())

    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(dialogEl().hasAttribute('open')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })

  it('prefers a data-autofocus target and an explicit final focus target', async () => {
    const fallback = document.createElement('button')
    document.body.appendChild(fallback)

    const wrapper = renderSheet(
      { finalFocusRef: fallback },
      { default: () => h('input', { 'data-autofocus': '', 'aria-label': 'Query' }) },
    )
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    expect(document.activeElement?.getAttribute('aria-label')).toBe('Query')

    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(document.activeElement).toBe(fallback)
  })

  it('locks page scrolling for a scrim-backed sheet only', async () => {
    document.body.style.overflow = 'auto'
    const modal = renderSheet()
    await modal.setProps({ isOpen: true })
    expect(document.body.style.overflow).toBe('hidden')
    await modal.setProps({ isOpen: false })
    await flushPromises()
    expect(document.body.style.overflow).toBe('auto')

    const bare = renderSheet({ hasScrim: false })
    await bare.setProps({ isOpen: true })
    expect(document.body.style.overflow).toBe('auto')
  })

  it('renders the panel in flow without a dialog for isInline', async () => {
    const wrapper = renderSheet({ isInline: true, isOpen: true })

    expect(document.querySelector('dialog')).toBeNull()
    expect(wrapper.find('.astryx-bottom-sheet-inline').exists()).toBe(true)
    expect(wrapper.find('.astryx-bottom-sheet').attributes('data-state')).toBe('open')
    expect(wrapper.find('.astryx-bottom-sheet').attributes('aria-modal')).toBeUndefined()
  })

  it('renders nothing for isInline while closed', () => {
    const wrapper = renderSheet({ isInline: true })

    expect(wrapper.find('.astryx-bottom-sheet-inline').exists()).toBe(true)
    expect(wrapper.find('.astryx-bottom-sheet').exists()).toBe(false)
  })

  it('maps the padding step to a spacing token and falls back to the theme', async () => {
    const wrapper = renderSheet({ padding: 1.5 })
    await wrapper.setProps({ isOpen: true })
    const content = wrapper.find('.astryx-bottom-sheet__content')
    expect(content.attributes('style')).toContain('--astryx-spacing-1-5')

    await wrapper.setProps({ padding: 0 })
    expect(content.attributes('style')).toContain('--astryx-spacing-0')

    await wrapper.setProps({ padding: undefined })
    expect(wrapper.find('.astryx-bottom-sheet__content').attributes('style')).toBeUndefined()
  })

  it('renders the named, numeric, and custom height budgets', async () => {
    const wrapper = renderSheet({ height: 'tall' })
    await wrapper.setProps({ isOpen: true })
    expect(panelEl().getAttribute('data-height')).toBe('tall')
    expect(panelEl().getAttribute('style')).toContain('92dvh')

    await wrapper.setProps({ height: 420 })
    expect(panelEl().getAttribute('data-height')).toBe('custom')
    expect(panelEl().getAttribute('style')).toContain('420px')

    await wrapper.setProps({ height: 'min(70vh, 30rem)' })
    expect(panelEl().getAttribute('style')).toContain('min(70vh, 30rem)')

    await wrapper.setProps({ height: 'hug' })
    expect(panelEl().getAttribute('data-height')).toBe('hug')
  })

  it('re-renders props that change while the sheet is open', async () => {
    const wrapper = renderSheet({ height: 'capped', padding: 2 })
    await wrapper.setProps({ isOpen: true })

    await wrapper.setProps({ height: 'hug', padding: 4 })

    expect(panelEl().getAttribute('data-height')).toBe('hug')
    expect(wrapper.find('.astryx-bottom-sheet__content').attributes('style')).toContain('--astryx-spacing-4')
  })

  it('dismisses on a slow pull past the shortest stop and snaps to a detent otherwise', async () => {
    const wrapper = renderSheet({ height: 'tall', snapPoints: [0.5] })
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    stubPanelHeight(600)

    drag(panelEl().querySelector('.astryx-bottom-sheet__handle') as Element, 100, 200)
    await flushPromises()

    expect(wrapper.emitted('snap')?.at(-1)?.[0]).toBe(384)
    expect(panelEl().style.height).toBe('432px')

    drag(panelEl().querySelector('.astryx-bottom-sheet__handle') as Element, 100, 650)
    await flushPromises()

    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('keeps a swipe from dismissing while the purpose protects the sheet', async () => {
    const wrapper = renderSheet({ purpose: 'form', height: 'tall' })
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    stubPanelHeight(600)

    drag(panelEl().querySelector('.astryx-bottom-sheet__handle') as Element, 100, 700)
    await flushPromises()

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('ignores a fast flick upward that follows a tap-sized move', async () => {
    const wrapper = renderSheet({ height: 'tall' })
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    stubPanelHeight(600)

    drag(panelEl().querySelector('.astryx-bottom-sheet__handle') as Element, 100, 110, 5)

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('exposes the panel element and focus methods', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    const exposed = wrapper.vm as unknown as { element: HTMLElement | null, focus: () => void, blur: () => void }
    expect(exposed.element).toBe(panelEl())

    const outside = document.createElement('button')
    document.body.appendChild(outside)
    outside.focus()
    exposed.focus()
    expect(document.activeElement).toBe(panelEl())
    exposed.blur()
    expect(document.activeElement).not.toBe(panelEl())
  })

  it('emits motion events around the entrance and exit', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    expect(wrapper.emitted('motionStart')?.[0]).toEqual(['entering'])
    expect(wrapper.emitted('motionComplete')?.[0]).toEqual(['entering'])

    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(wrapper.emitted('motionStart')?.at(-1)).toEqual(['exiting'])
    expect(wrapper.emitted('motionComplete')?.at(-1)).toEqual(['exiting'])
    expect(panelEl().getAttribute('data-state')).toBe('hidden')
  })

  it('marks the exiting panel and drops the gesture transform while closing', async () => {
    const wrapper = renderSheet({ height: 'tall' })
    await wrapper.setProps({ isOpen: true })
    await flushPromises()

    const panel = wrapper.find('.astryx-bottom-sheet')
    expect(panel.attributes('data-state')).toBe('open')

    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (this: HTMLDialogElement) {
      this.removeAttribute('open')
    })
    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(panel.attributes('data-state')).toBe('hidden')
  })

  it('keeps passthrough attributes on the panel rather than the dialog', async () => {
    const wrapper = renderSheet({ id: 'sheet-surface' })
    await wrapper.setProps({ isOpen: true })

    const panel: DOMWrapper<Element> = wrapper.find('.astryx-bottom-sheet')
    expect(panel.attributes('id')).toBe('sheet-surface')
    expect(dialogEl().getAttribute('id')).toBeNull()
  })
})
