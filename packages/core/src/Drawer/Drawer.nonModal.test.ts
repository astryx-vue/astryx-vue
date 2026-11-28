import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import { resetModalOutletsForTests, useActiveModalOutlet, useTopLayerEntries } from '../layer/modalOutlet.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import Drawer from './Drawer.vue'

enableAutoUnmount(afterEach)

const nativeMatches = Element.prototype.matches

/**
 * 测试环境没有 Popover API：用一个最小的替身记下谁进了顶层。
 * `focusVisible` 为真时把程序焦点也算作可见焦点（测试环境不实现 :focus-visible）。
 */
function installPopoverStandIn({ focusVisible = false } = {}): { shown: Element[] } {
  const shown: Element[] = []
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>
  proto.showPopover = function (this: HTMLElement) {
    if (shown.includes(this))
      throw new DOMException('already showing', 'InvalidStateError')
    shown.push(this)
  }
  proto.hidePopover = function (this: HTMLElement) {
    const index = shown.indexOf(this)
    if (index !== -1)
      shown.splice(index, 1)
  }
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector: string) {
    if (selector === ':popover-open')
      return shown.includes(this)
    if (focusVisible && selector === ':focus-visible')
      return this === document.activeElement
    return nativeMatches.call(this, selector)
  })
  return { shown }
}

function removePopoverStandIn(): void {
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>
  delete proto.showPopover
  delete proto.hidePopover
}

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog.astryx-drawer') as HTMLDialogElement
}

beforeEach(() => {
  resetDismissStackForTests()
  resetModalOutletsForTests()
})

afterEach(() => {
  removePopoverStandIn()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

describe('drawer without a scrim', () => {
  it('enters the top layer as a manual popover, not as a modal', async () => {
    const { shown } = installPopoverStandIn()
    const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
    mount(Drawer, { attachTo: document.body, props: { isOpen: true, label: 'Details', hasScrim: false } })
    await nextTick()
    const dialog = dialogEl()
    expect(dialog.getAttribute('popover')).toBe('manual')
    expect(shown).toContain(dialog)
    expect(showModal).not.toHaveBeenCalled()
    expect(dialog.hasAttribute('aria-modal')).toBe(false)
    expect(document.documentElement.style.overflow).not.toBe('hidden')
  })

  it('tells the global hosts it entered the top layer, so toasts re-enter above it', async () => {
    installPopoverStandIn()
    const entries = useTopLayerEntries()
    const before = entries.value
    mount(Drawer, { attachTo: document.body, props: { isOpen: true, label: 'Details', hasScrim: false } })
    await nextTick()
    expect(entries.value).toBe(before + 1)
  })

  it('does not become the modal outlet; a modal drawer does until its exit starts', async () => {
    installPopoverStandIn()
    const outlet = useActiveModalOutlet()
    const plain = mount(Drawer, { attachTo: document.body, props: { isOpen: true, label: 'Details', hasScrim: false } })
    await nextTick()
    expect(outlet.value).toBeNull()
    plain.unmount()

    const modal = mount(Drawer, { attachTo: document.body, props: { isOpen: true, label: 'Details' } })
    await nextTick()
    expect(outlet.value).toBe(dialogEl())
    await modal.setProps({ isOpen: false })
    await nextTick()
    expect(outlet.value).toBeNull()
  })

  it('closes on Escape through the shared layer stack, unless the purpose is required', async () => {
    installPopoverStandIn()
    const wrapper = mount(Drawer, { attachTo: document.body, props: { isOpen: true, label: 'Details', hasScrim: false } })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }))
    expect(wrapper.emitted('openChange')).toEqual([[false]])

    await wrapper.setProps({ purpose: 'required' })
    await nextTick()
    const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true })
    document.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('does not close on a press on the page beside it', async () => {
    installPopoverStandIn()
    const outside = document.createElement('button')
    document.body.append(outside)
    const wrapper = mount(Drawer, { attachTo: document.body, props: { isOpen: true, label: 'Details', hasScrim: false } })
    await nextTick()
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
    outside.click()
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('lets a keyboard-opened first control show its tooltip inside the drawer', async () => {
    installPopoverStandIn({ focusVisible: true })
    const isOpen = ref(false)
    mount(defineComponent({
      setup: () => () => h(Drawer, { isOpen: isOpen.value, label: 'Details', hasScrim: false }, {
        default: () => h(Tooltip, { content: 'Close details', delay: 0 }, {
          default: () => h('button', { 'data-autofocus': '' }, 'Close'),
        }),
      }),
    }), { attachTo: document.body })
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    isOpen.value = true
    await nextTick()
    const button = dialogEl().querySelector('button')!
    expect(document.activeElement).toBe(button)
    await vi.waitFor(() => {
      expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Close details')
    })
    const tooltip = document.querySelector('[role="tooltip"]')
    // 挂在抽屉里面，跟着它待在顶层，不会被它盖住。
    expect(dialogEl().contains(tooltip)).toBe(true)
  })
})

describe('drawer that unmounts while open', () => {
  it.each([true, false])('returns focus to its opener (hasScrim %s)', async (hasScrim) => {
    installPopoverStandIn()
    const opener = document.createElement('button')
    document.body.append(opener)
    opener.focus()
    const isMounted = ref(true)
    mount(defineComponent({
      setup: () => () => h('div', isMounted.value
        ? [h(Drawer, { isOpen: true, label: 'Details', hasScrim }, { default: () => h('button', { 'data-autofocus': '' }, 'Inside') })]
        : []),
    }), { attachTo: document.body })
    await nextTick()
    expect(document.activeElement?.textContent).toBe('Inside')
    isMounted.value = false
    await nextTick()
    await Promise.resolve()
    expect(document.activeElement).toBe(opener)
  })

  it('leaves focus alone when it already moved to the page', async () => {
    installPopoverStandIn()
    const opener = document.createElement('button')
    const elsewhere = document.createElement('input')
    document.body.append(opener, elsewhere)
    opener.focus()
    const isMounted = ref(true)
    mount(defineComponent({
      setup: () => () => h('div', isMounted.value
        ? [h(Drawer, { isOpen: true, label: 'Details', hasScrim: false }, { default: () => h('button', { 'data-autofocus': '' }, 'Inside') })]
        : []),
    }), { attachTo: document.body })
    await nextTick()
    elsewhere.focus()
    isMounted.value = false
    await nextTick()
    await Promise.resolve()
    expect(document.activeElement).toBe(elsewhere)
  })
})
