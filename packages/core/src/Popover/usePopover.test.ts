import type { UsePopoverOptions, UsePopoverReturn } from './usePopover.js'
import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { usePopover } from './usePopover.js'

afterEach(() => {
  document.body.innerHTML = ''
})

function setupPopover(options: UsePopoverOptions = {}) {
  let popover: UsePopoverReturn | undefined
  const trigger = document.createElement('button')
  trigger.type = 'button'
  trigger.textContent = 'Open'
  document.body.append(trigger)
  const surface = document.createElement('div')
  const input = document.createElement('input')
  input.setAttribute('aria-label', 'Name')
  const close = document.createElement('button')
  close.type = 'button'
  close.className = 'close-slot'
  surface.append(input, close)
  document.body.append(surface)

  const wrapper = mount(defineComponent({
    setup() {
      popover = usePopover(options)
      popover.contentRef.value = surface
      popover.triggerRef.value = trigger
      return () => h('div')
    },
  }))
  return { popover: popover!, trigger, surface, input, wrapper }
}

describe('usePopover', () => {
  it('把触发器和内容通过 ARIA 连起来', () => {
    const { popover, trigger } = setupPopover({ dialogLabel: 'Options' })

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBe(popover.id)

    expect(popover.surfaceProps.value.id).toBe(popover.id)
    expect(popover.surfaceProps.value.role).toBe('dialog')
    expect(popover.surfaceProps.value['aria-modal']).toBe('true')
    expect(popover.surfaceProps.value['aria-label']).toBe('Options')
    expect(popover.surfaceProps.value.tabindex).toBe(-1)
  })

  it('点击触发器切换打开状态并各上报一次', async () => {
    const onShow = vi.fn()
    const onHide = vi.fn()
    const { popover, trigger } = setupPopover({ onShow, onHide, hasAutoFocus: false })

    trigger.click()
    await flushPromises()
    expect(popover.isOpen.value).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(onShow).toHaveBeenCalledOnce()

    trigger.click()
    await flushPromises()
    expect(popover.isOpen.value).toBe(false)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('isEnabled 为 false 时点击不打开', async () => {
    const enabled = ref(false)
    const { popover, trigger } = setupPopover({ isEnabled: enabled })

    trigger.click()
    await flushPromises()
    expect(popover.isOpen.value).toBe(false)

    enabled.value = true
    trigger.click()
    await flushPromises()
    expect(popover.isOpen.value).toBe(true)
  })

  it('打开时把焦点移到第一个可聚焦元素，并跳过 closeButtonSelector', async () => {
    const { popover, trigger, input } = setupPopover({ closeButtonSelector: '.close-slot' })

    trigger.click()
    await flushPromises()

    expect(popover.isOpen.value).toBe(true)
    expect(document.activeElement).toBe(input)
  })

  it('role 为 none 时不设对话语义也不抢焦点', async () => {
    const { popover, trigger, input } = setupPopover({ role: 'none' })

    trigger.click()
    await flushPromises()

    expect(popover.surfaceProps.value.role).toBeUndefined()
    expect(popover.surfaceProps.value['aria-modal']).toBeUndefined()
    expect(trigger.getAttribute('aria-haspopup')).toBe('true')
    expect(document.activeElement).not.toBe(input)
  })

  it('escape 关闭，hasEscapeDismiss 为 false 时不关', async () => {
    const escape = setupPopover()
    escape.trigger.click()
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(escape.popover.isOpen.value).toBe(false)

    document.body.innerHTML = ''
    const noEscape = setupPopover({ hasEscapeDismiss: false })
    noEscape.trigger.click()
    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(noEscape.popover.isOpen.value).toBe(true)
  })

  it('点击外部关闭，点击内部保持打开；hasLightDismiss 为 false 时点外面也不关', async () => {
    const { popover, trigger, surface } = setupPopover()
    trigger.click()
    await flushPromises()

    surface.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(popover.isOpen.value).toBe(true)

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(popover.isOpen.value).toBe(false)

    document.body.innerHTML = ''
    const sticky = setupPopover({ hasLightDismiss: false })
    sticky.trigger.click()
    await flushPromises()
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(sticky.popover.isOpen.value).toBe(true)
  })

  it('受控时跟随 isOpen 的变化', async () => {
    const controlled = ref<boolean | undefined>(false)
    const { popover } = setupPopover({ isOpen: controlled, hasAutoFocus: false })

    expect(popover.isOpen.value).toBe(false)

    controlled.value = true
    await nextTick()
    expect(popover.isOpen.value).toBe(true)

    controlled.value = false
    await nextTick()
    expect(popover.isOpen.value).toBe(false)
  })

  it('show / hide / toggle 直接控制开合', async () => {
    const { popover } = setupPopover({ hasAutoFocus: false })

    popover.show()
    expect(popover.isOpen.value).toBe(true)

    popover.toggle()
    expect(popover.isOpen.value).toBe(false)

    popover.toggle()
    expect(popover.isOpen.value).toBe(true)

    popover.hide()
    expect(popover.isOpen.value).toBe(false)
  })

  it('关闭时焦点在浮层里就还给触发器', async () => {
    const { trigger, input } = setupPopover()
    trigger.focus()
    trigger.click()
    await flushPromises()
    expect(document.activeElement).toBe(input)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(document.activeElement).toBe(trigger)
  })

  it('卸载时把触发器原有的属性还原', () => {
    let popover: UsePopoverReturn | undefined
    const trigger = document.createElement('button')
    trigger.setAttribute('aria-haspopup', 'menu')
    trigger.setAttribute('aria-controls', 'existing-menu')
    document.body.append(trigger)

    const wrapper = mount(defineComponent({
      setup() {
        popover = usePopover()
        popover.triggerRef.value = trigger
        return () => h('div')
      },
    }))
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-controls')).toBe(popover!.id)

    wrapper.unmount()
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-controls')).toBe('existing-menu')
  })
})
