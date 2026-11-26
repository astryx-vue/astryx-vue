import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import HoverCard from './HoverCard.vue'

enableAutoUnmount(afterEach)

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function pointerEvent(type: string, pointerType: string): Event {
  const event = new Event(type, { bubbles: true })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  return event
}

function render(props: Record<string, unknown> = {}, trigger = '<button type="button">Trigger</button>') {
  const wrapper = mount(HoverCard, {
    attachTo: document.body,
    props: { content: 'Additional details', ...props },
    slots: { default: trigger },
  })
  const surface = document.querySelector('.astryx-hover-card') as HTMLElement
  return { surface, wrapper, trigger: document.querySelector('.astryx-hover-card__trigger > *') as HTMLElement }
}

function isShown(surface: HTMLElement): boolean {
  return surface.style.display !== 'none'
}

describe('hoverCard focus rules', () => {
  it('opens when focus lands inside a trigger that is focusable at that moment', async () => {
    const { surface, trigger } = render({}, '<div tabindex="-1"><button type="button" tabindex="-1">Item</button></div>')
    const item = trigger.querySelector('button') as HTMLElement

    // 漫游 tabindex：成员挂监听时是 -1，轮到它时才变成 Tab 停靠点。
    trigger.tabIndex = 0
    item.focus()
    vi.advanceTimersByTime(0)
    await nextTick()

    expect(isShown(surface)).toBe(true)
  })

  it('does not open on focus inside a trigger that is not focusable', async () => {
    const { surface, trigger } = render({}, '<div><button type="button">Item</button></div>')

    ;(trigger.querySelector('button') as HTMLElement).focus()
    await nextTick()

    expect(isShown(surface)).toBe(false)
  })

  it('opens on focus anywhere inside the trigger when focusTrigger is "always"', async () => {
    const { surface, trigger } = render({ focusTrigger: 'always' }, '<div><button type="button">Item</button></div>')

    ;(trigger.querySelector('button') as HTMLElement).focus()
    await nextTick()

    expect(isShown(surface)).toBe(true)
  })

  it('stays closed on focus while a controlled isOpen is false', async () => {
    const { surface, trigger } = render({ isOpen: false })

    trigger.focus()
    await nextTick()

    expect(isShown(surface)).toBe(false)
  })

  it('cancels a pending hover open when a pen lands', async () => {
    const { surface, trigger } = render()

    trigger.dispatchEvent(new MouseEvent('mouseenter'))
    trigger.dispatchEvent(pointerEvent('pointerdown', 'pen'))
    vi.advanceTimersByTime(1000)
    await nextTick()

    expect(isShown(surface)).toBe(false)
  })

  it('wires a trigger element that replaced the old one without a render here', async () => {
    const { surface, wrapper } = render()
    const host = wrapper.get('.astryx-hover-card__trigger').element
    const replacement = document.createElement('button')
    replacement.textContent = 'New'
    host.replaceChildren(replacement)
    await nextTick()
    await Promise.resolve()

    replacement.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(300)
    await nextTick()

    expect(isShown(surface)).toBe(true)
    expect(replacement.getAttribute('aria-describedby')).toBe(surface.id)
  })
})
