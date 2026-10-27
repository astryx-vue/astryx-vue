import type { DOMWrapper } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import { pushLayer, resetDismissStackForTests } from '../layer/dismissStack.js'
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
  resetDismissStackForTests()
  resetInteractionModalityForTest()
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
    expect(dialog.querySelector('.astryx-bottom-sheet')?.classList.contains('astryx-layer')).toBe(true)
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
    const css = readFileSync(join(process.cwd(), 'packages/core/styles/bottom-sheet.css'), 'utf8')
    const contentRule = css.slice(css.indexOf('.astryx-bottom-sheet__content {'))
    expect(contentRule).toContain('--container-padding-inline-start: var(--_sheet-pad-inline-start)')
    expect(contentRule).toContain('--container-padding-block-end: var(--_sheet-pad-block-end)')
    expect(contentRule).toContain('var(--astryx-bottom-sheet-padding-inline-start, var(--astryx-bottom-sheet-padding-inline, var(--astryx-bottom-sheet-padding, var(--astryx-spacing-4, 1rem)))')
    expect(contentRule).toContain('var(--astryx-bottom-sheet-padding-block-start, var(--astryx-bottom-sheet-padding, var(--astryx-spacing-4, 1rem)))')
    expect(contentRule).toContain('padding-inline: var(--container-padding-inline-start) var(--container-padding-inline-end)')
    expect(contentRule).toContain('padding-block: var(--container-padding-block-start) var(--container-padding-block-end)')
    expect(contentRule).toContain('--layout-padding-outer-x: var(--_sheet-pad-inline-start)')
    expect(contentRule).toContain('--layout-padding-inner-y: var(--_sheet-pad-block-start)')
    expect(contentRule).toContain('[data-padding=\'1.5\']')
    expect(contentRule).toContain('var(--astryx-spacing-1-5, 6px)')
    expect(contentRule).toContain('[data-padding=\'0\']')
    expect(contentRule).toContain('var(--astryx-spacing-0, 0px)')
    expect(contentRule).toContain('--_sheet-pad-inline-start: var(--_sheet-padding-step)')

    const layerCss = readFileSync(join(process.cwd(), 'packages/core/styles/layer.css'), 'utf8')
    expect(layerCss).toContain('--container-padding-inline-start: 0px')

    const wrapper = renderSheet({ padding: 1.5 })
    await wrapper.setProps({ isOpen: true })
    const content = wrapper.find('.astryx-bottom-sheet__content')
    expect(content.attributes('data-padding')).toBe('1.5')
    expect(panelEl().classList.contains('astryx-layer')).toBe(true)

    await wrapper.setProps({ padding: 0 })
    expect(content.attributes('data-padding')).toBe('0')

    await wrapper.setProps({ padding: undefined })
    expect(wrapper.find('.astryx-bottom-sheet__content').attributes('data-padding')).toBeUndefined()
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
    expect(wrapper.find('.astryx-bottom-sheet__content').attributes('data-padding')).toBe('4')
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

  it('lets a layer above the sheet take Escape first', async () => {
    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    const nested = vi.fn()
    const stop = pushLayer({
      token: {},
      depth: 5,
      dismissOnPointerOutside: false,
      dismissOnEscape: 'close',
      onDismiss: nested,
    })

    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(nested).toHaveBeenCalledOnce()
    expect(wrapper.emitted('openChange')).toBeUndefined()

    stop()
    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('ignores Escape outside a non-modal sheet', async () => {
    const wrapper = renderSheet({ hasScrim: false })
    await wrapper.setProps({ isOpen: true })

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('openChange')).toBeUndefined()

    dialogEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('returns focus without a ring after a pointer close', async () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open filters'
    document.body.appendChild(trigger)
    trigger.focus()
    const focus = vi.spyOn(trigger, 'focus')

    const wrapper = renderSheet()
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    document.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }))

    await wrapper.setProps({ isOpen: false })
    await flushPromises()

    expect(document.activeElement).toBe(trigger)
    expect(focus).toHaveBeenCalled()
    expect(focus.mock.calls.at(-1)?.[0]).toMatchObject({ focusVisible: false })
  })

  it('does not drag the sheet while a nested scroller can still move', async () => {
    const wrapper = renderSheet({ height: 'tall' }, {
      default: () => h('div', { class: 'nested' }, [h('div', { style: 'height: 200px' }, 'tall')]),
    })
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    stubPanelHeight(600)

    const nested = wrapper.find('.nested').element as HTMLElement
    Object.defineProperty(nested, 'scrollHeight', { configurable: true, value: 200 })
    Object.defineProperty(nested, 'clientHeight', { configurable: true, value: 40 })
    Object.defineProperty(nested, 'scrollTop', { configurable: true, value: 20 })

    nested.dispatchEvent(pointerEvent('pointerdown', { clientY: 100 }))
    window.dispatchEvent(pointerEvent('pointermove', { clientY: 220 }))
    window.dispatchEvent(pointerEvent('pointerup', { clientY: 220 }))
    await flushPromises()

    expect(wrapper.emitted('snap')).toBeUndefined()
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('drops a drag when a second finger lands', async () => {
    const wrapper = renderSheet({ height: 'tall', snapPoints: [0.5] })
    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    stubPanelHeight(600)

    const handle = panelEl().querySelector('.astryx-bottom-sheet__handle') as Element
    handle.dispatchEvent(pointerEvent('pointerdown', { clientY: 100, pointerId: 1, timeStamp: 100 }))
    window.dispatchEvent(pointerEvent('pointermove', { clientY: 180, pointerId: 1, timeStamp: 160 }))
    handle.dispatchEvent(pointerEvent('pointerdown', { clientY: 180, pointerId: 2, timeStamp: 180 }))
    window.dispatchEvent(pointerEvent('pointerup', { clientY: 520, pointerId: 1, timeStamp: 240 }))
    await flushPromises()

    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('keeps passthrough attributes on the panel rather than the dialog', async () => {
    const wrapper = renderSheet({ id: 'sheet-surface' })
    await wrapper.setProps({ isOpen: true })

    const panel: DOMWrapper<Element> = wrapper.find('.astryx-bottom-sheet')
    expect(panel.attributes('id')).toBe('sheet-surface')
    expect(dialogEl().getAttribute('id')).toBeNull()
  })
})
