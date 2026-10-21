import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { LAYER_MAX_INLINE_SIZE } from '../layer/inlineSize.js'
import Popover from './Popover.vue'

enableAutoUnmount(afterEach)

afterEach(() => {
  document.body.innerHTML = ''
})

const CONTENT = '<input aria-label="Name" /><button type="button">Action</button>'

function renderPopover(props: Record<string, unknown> = {}, content = CONTENT) {
  const wrapper = mount(Popover, {
    attachTo: document.body,
    props: { label: 'Options', ...props },
    slots: {
      default: '<button type="button">Open</button>',
      content,
    },
  })
  const trigger = document.querySelector('.astryx-popover-trigger > button') as HTMLButtonElement
  const surface = document.querySelector('.astryx-popover') as HTMLElement
  return { wrapper, trigger, surface }
}

function isShown(surface: HTMLElement): boolean {
  return surface.style.display !== 'none'
}

describe('popover', () => {
  it('links the trigger to a hidden dialog surface', () => {
    const { trigger, surface } = renderPopover()

    expect(isShown(surface)).toBe(false)
    expect(surface.getAttribute('role')).toBe('dialog')
    expect(surface.getAttribute('aria-modal')).toBe('true')
    expect(surface.getAttribute('aria-label')).toBe('Options')
    expect(surface.getAttribute('tabindex')).toBe('-1')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBe(surface.id)
  })

  it('opens on trigger click, reports openChange and moves focus to the first focusable', async () => {
    const { wrapper, trigger, surface } = renderPopover()

    trigger.click()
    await flushPromises()

    expect(isShown(surface)).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(wrapper.emitted('openChange')).toEqual([[true]])
    expect(document.activeElement).toBe(surface.querySelector('input'))
  })

  it('closes on trigger click when already open', async () => {
    const { wrapper, trigger, surface } = renderPopover()

    trigger.click()
    await flushPromises()
    trigger.click()
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('does not open when disabled', async () => {
    const { wrapper, trigger, surface } = renderPopover({ isEnabled: false })

    trigger.click()
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(wrapper.emitted('openChange')).toBeUndefined()
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const { wrapper, trigger, surface } = renderPopover()

    trigger.click()
    await flushPromises()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
    expect(document.activeElement).toBe(trigger)
  })

  it('ignores Escape when hasEscapeDismiss is false', async () => {
    const { trigger, surface } = renderPopover({ hasEscapeDismiss: false })

    trigger.click()
    await flushPromises()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()

    expect(isShown(surface)).toBe(true)
  })

  it('closes when pressing outside and keeps open for presses inside', async () => {
    const { trigger, surface } = renderPopover()

    trigger.click()
    await flushPromises()
    surface.querySelector('input')!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(isShown(surface)).toBe(true)

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()
    expect(isShown(surface)).toBe(false)
  })

  it('keeps open on outside press when hasLightDismiss is false', async () => {
    const { trigger, surface } = renderPopover({ hasLightDismiss: false })

    trigger.click()
    await flushPromises()
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await flushPromises()

    expect(isShown(surface)).toBe(true)
  })

  it('closes from the built-in close button and labels it', async () => {
    const { wrapper, trigger, surface } = renderPopover({ closeButtonLabel: 'Dismiss' })

    trigger.click()
    await flushPromises()
    const close = surface.querySelector('.astryx-popover__close button') as HTMLButtonElement
    expect(close.textContent).toContain('Dismiss')
    close.click()
    await flushPromises()

    expect(isShown(surface)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('omits the close button when hasCloseButton is false', () => {
    const { surface } = renderPopover({ hasCloseButton: false })

    expect(surface.querySelector('.astryx-popover__close')).toBeNull()
  })

  it('follows the controlled isOpen prop', async () => {
    const { wrapper, surface } = renderPopover({ isOpen: false })

    await wrapper.setProps({ isOpen: true })
    await flushPromises()
    expect(isShown(surface)).toBe(true)

    await wrapper.setProps({ isOpen: false })
    await flushPromises()
    expect(isShown(surface)).toBe(false)
  })

  it('traps Tab inside a modal dialog', async () => {
    const { trigger, surface } = renderPopover({ hasCloseButton: false })

    trigger.click()
    await flushPromises()
    const [first, last] = Array.from(surface.querySelectorAll<HTMLElement>('input, button'))
    last.focus()
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true, composed: true }))
    expect(document.activeElement).toBe(first)

    first.focus()
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true, composed: true }))
    expect(document.activeElement).toBe(last)
  })

  it('does not move focus or set dialog semantics for role none', async () => {
    const { trigger, surface } = renderPopover({ role: 'none' })

    trigger.click()
    await flushPromises()

    expect(surface.getAttribute('role')).toBeNull()
    expect(surface.getAttribute('aria-modal')).toBeNull()
    expect(trigger.getAttribute('aria-haspopup')).toBe('true')
    expect(document.activeElement).not.toBe(surface.querySelector('input'))
  })

  it('applies numeric width and padding tokens', () => {
    const { surface } = renderPopover({ width: 240, padding: 2 })

    expect(surface.style.width).toBe('240px')
    expect(surface.style.getPropertyValue('--_popover-padding')).toBe('var(--astryx-spacing-2)')
  })

  it('caps an explicit width at the shared viewport cap', () => {
    const { surface } = renderPopover({ width: 400 })

    expect(surface.style.width).toBe('400px')
    expect(surface.style.maxWidth).toBe(LAYER_MAX_INLINE_SIZE)
  })

  it('caps its default width at 320px and the viewport', () => {
    const { surface } = renderPopover()

    expect(surface.style.maxWidth).toBe(`min(320px, ${LAYER_MAX_INLINE_SIZE})`)
  })

  it('uses fractional padding tokens with a hyphen', () => {
    const { surface } = renderPopover({ padding: 1.5 })

    expect(surface.style.getPropertyValue('--_popover-padding')).toBe('var(--astryx-spacing-1-5)')
  })

  it('opens from an external anchor element without a trigger wrapper', async () => {
    const anchor = document.createElement('button')
    anchor.type = 'button'
    anchor.textContent = 'External'
    document.body.append(anchor)

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: { label: 'Options', anchor },
      slots: { content: CONTENT },
    })
    await flushPromises()

    expect(wrapper.find('.astryx-popover-trigger').exists()).toBe(false)
    expect(anchor.getAttribute('aria-haspopup')).toBe('dialog')
    expect(anchor.getAttribute('aria-expanded')).toBe('false')

    anchor.click()
    await flushPromises()
    expect(anchor.getAttribute('aria-expanded')).toBe('true')
    expect(wrapper.emitted('openChange')?.[0]).toEqual([true])

    anchor.click()
    await flushPromises()
    expect(anchor.getAttribute('aria-expanded')).toBe('false')

    wrapper.unmount()
    expect(anchor.hasAttribute('aria-haspopup')).toBe(false)
    anchor.remove()
  })
})
