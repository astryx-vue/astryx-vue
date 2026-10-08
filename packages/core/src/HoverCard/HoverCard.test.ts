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

function domRect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect
}

function renderHoverCard(props: Record<string, unknown> = {}, slots: Record<string, string> = {}) {
  const wrapper = mount(HoverCard, {
    attachTo: document.body,
    props: { content: 'Additional details', ...props },
    slots: { default: '<button type="button">Trigger</button>', ...slots },
  })
  const trigger = document.querySelector('.astryx-hover-card__trigger > *') as HTMLElement
  const surface = document.querySelector('.astryx-hover-card') as HTMLElement
  return { surface, trigger, wrapper }
}

function isShown(surface: HTMLElement): boolean {
  return surface.style.display !== 'none'
}

// Opening runs through the watcher, the positioning `nextTick`, and the render
// it schedules, so a single tick is not enough to observe the positioned DOM.
async function settle(): Promise<void> {
  await nextTick()
  await nextTick()
  await nextTick()
}

describe('hoverCard', () => {
  it('renders a hidden group surface described by the trigger', () => {
    const { trigger, surface } = renderHoverCard()

    expect(document.body.contains(surface)).toBe(true)
    expect(trigger.contains(surface)).toBe(false)
    expect(surface.textContent).toContain('Additional details')
    expect(surface.getAttribute('role')).toBe('group')
    expect(surface.hasAttribute('aria-label')).toBe(false)
    expect(isShown(surface)).toBe(false)
    expect(trigger.getAttribute('aria-describedby')).toBe(surface.id)
    expect(trigger.hasAttribute('aria-haspopup')).toBe(false)
  })

  it('exposes a labelled card as a dialog the trigger advertises', async () => {
    const { surface, trigger } = renderHoverCard({ delay: 0, label: 'Project details' })

    expect(surface.getAttribute('role')).toBe('dialog')
    expect(surface.getAttribute('aria-label')).toBe('Project details')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.hasAttribute('aria-controls')).toBe(false)

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('aria-controls')).toBe(surface.id)
  })

  it('omits aria-expanded on a trigger whose role does not support it', () => {
    const { trigger } = renderHoverCard({ label: 'Project details' }, { default: '<span>Hover me</span>' })

    expect(trigger.tagName).toBe('SPAN')
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.hasAttribute('aria-expanded')).toBe(false)
  })

  it('preserves and restores popup attributes the trigger already carried', async () => {
    const { surface, trigger, wrapper } = renderHoverCard(
      { delay: 0, label: 'Project details' },
      { default: '<button type="button" aria-haspopup="menu" aria-controls="existing-menu">Trigger</button>' },
    )

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog')
    expect(trigger.getAttribute('aria-controls')).toBe('existing-menu')

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    expect(trigger.getAttribute('aria-controls')).toBe(`existing-menu ${surface.id}`)

    wrapper.unmount()
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu')
    expect(trigger.getAttribute('aria-controls')).toBe('existing-menu')
  })

  it('shows after the delay on hover and reports openChange', async () => {
    const { surface, trigger, wrapper } = renderHoverCard()

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(299)
    await nextTick()
    expect(isShown(surface)).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(isShown(surface)).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[true]])
  })

  it('hides after the hide delay when the pointer leaves', async () => {
    const { surface, trigger, wrapper } = renderHoverCard({ delay: 0 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(199)
    await nextTick()
    expect(isShown(surface)).toBe(true)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(isShown(surface)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('stays open while the pointer travels from the trigger into the card', async () => {
    const { surface, trigger } = renderHoverCard({ delay: 0 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(150)
    await nextTick()
    expect(isShown(surface)).toBe(true)

    surface.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(isShown(surface)).toBe(true)

    surface.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(isShown(surface)).toBe(false)
  })

  it('opens immediately on keyboard focus and stays open while focus is inside', async () => {
    const { surface, trigger } = renderHoverCard({ label: 'Details' }, { content: '<button type="button">Inside</button>' })

    trigger.focus()
    await nextTick()
    expect(isShown(surface)).toBe(true)

    const inside = surface.querySelector('button') as HTMLElement
    inside.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: trigger }))
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(isShown(surface)).toBe(true)

    trigger.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }))
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(isShown(surface)).toBe(false)
  })

  it('never opens on focus when focusTrigger is "never"', async () => {
    const { surface, trigger } = renderHoverCard({ focusTrigger: 'never' })

    trigger.focus()
    await nextTick()

    expect(isShown(surface)).toBe(false)
  })

  it('closes on Escape, reports it, and restores focus to the trigger', async () => {
    const { surface, trigger, wrapper } = renderHoverCard(
      { isDefaultOpen: true, label: 'Details' },
      { content: '<button type="button">Inside</button>' },
    )
    await nextTick()
    expect(isShown(surface)).toBe(true)

    const inside = surface.querySelector('button') as HTMLElement
    inside.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(isShown(surface)).toBe(false)
    expect(document.activeElement).toBe(trigger)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('does not reopen the card on the focus Escape hands back to the trigger', async () => {
    const { surface, trigger } = renderHoverCard({ isDefaultOpen: true, label: 'Details' })
    await nextTick()

    trigger.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()
    expect(isShown(surface)).toBe(false)

    trigger.blur()
    trigger.focus()
    await nextTick()
    expect(isShown(surface)).toBe(true)
  })

  it('asks a controlled card to close on Escape without hiding it', async () => {
    const { surface, trigger, wrapper } = renderHoverCard({ isOpen: true })

    await nextTick()
    expect(isShown(surface)).toBe(true)

    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(isShown(surface)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(isShown(surface)).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('applies a controlled isOpen change after mount', async () => {
    const wrapper = mount(HoverCard, {
      attachTo: document.body,
      props: { content: 'Additional details', isOpen: false },
      slots: { default: '<button type="button">Trigger</button>' },
    })
    const surface = document.querySelector('.astryx-hover-card') as HTMLElement
    expect(isShown(surface)).toBe(false)

    await wrapper.setProps({ isOpen: true })
    await nextTick()

    expect(isShown(surface)).toBe(true)
  })

  it('never opens while disabled', async () => {
    const { surface, trigger } = renderHoverCard({ isEnabled: false, delay: 0 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(isShown(surface)).toBe(false)

    trigger.focus()
    await nextTick()
    expect(isShown(surface)).toBe(false)
  })

  it('shows on mount when isDefaultOpen is set', async () => {
    const { surface, wrapper } = renderHoverCard({ isDefaultOpen: true })

    await nextTick()
    expect(isShown(surface)).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[true]])
  })

  it('makes a text-only trigger focusable and marks it for hover indication', async () => {
    renderHoverCard({}, { default: 'Hover me' })
    await nextTick()

    const wrapper = document.querySelector('.astryx-hover-card__trigger') as HTMLElement
    const surface = document.querySelector('.astryx-hover-card') as HTMLElement

    expect(wrapper.classList.contains('astryx-hover-card__trigger--text')).toBe(true)
    expect(wrapper.classList.contains('astryx-hover-card__trigger--indicated')).toBe(true)
    expect(wrapper.tabIndex).toBe(0)
    expect(wrapper.getAttribute('aria-describedby')).toBe(surface.id)
  })

  it('leaves an element trigger unmarked for hover indication', () => {
    renderHoverCard()

    const wrapper = document.querySelector('.astryx-hover-card__trigger') as HTMLElement
    expect(wrapper.classList.contains('astryx-hover-card__trigger--indicated')).toBe(false)
    expect(wrapper.tabIndex).toBe(-1)
  })

  it('honours hasHoverIndication false on a text trigger', async () => {
    renderHoverCard({ hasHoverIndication: false }, { default: 'Hover me' })
    await nextTick()

    const wrapper = document.querySelector('.astryx-hover-card__trigger') as HTMLElement
    expect(wrapper.classList.contains('astryx-hover-card__trigger--indicated')).toBe(false)
  })

  it('honours hasHoverIndication true on a text trigger', async () => {
    renderHoverCard({ hasHoverIndication: true }, { default: 'Hover me' })
    await nextTick()

    const wrapper = document.querySelector('.astryx-hover-card__trigger') as HTMLElement
    expect(wrapper.classList.contains('astryx-hover-card__trigger--indicated')).toBe(true)
  })

  it('forwards attributes to the trigger wrapper', () => {
    renderHoverCard({ 'class': 'my-card', 'data-testid': 'card' })

    const wrapper = document.querySelector('.astryx-hover-card__trigger') as HTMLElement
    expect(wrapper.classList.contains('astryx-hover-card__trigger')).toBe(true)
    expect(wrapper.classList.contains('my-card')).toBe(true)
    expect(wrapper.getAttribute('data-testid')).toBe('card')
  })

  it('renders the content slot in place of the content prop', () => {
    const { surface } = renderHoverCard({ content: 'Prop text' }, { content: '<p>Slot text</p>' })

    expect(surface.textContent).toContain('Slot text')
    expect(surface.textContent).not.toContain('Prop text')
  })

  it('repositions when placement changes after mount', async () => {
    const { surface, trigger, wrapper } = renderHoverCard({ delay: 0, placement: 'start' })
    trigger.getBoundingClientRect = () => domRect(300, 100, 100, 20)

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await settle()

    expect(surface.getAttribute('data-placement')).toBe('start')
    expect(surface.style.left).toBe('96px')

    await wrapper.setProps({ placement: 'below' })
    await nextTick()

    expect(surface.getAttribute('data-placement')).toBe('below')
    expect(surface.style.left).toBe('150px')
  })

  describe('touch', () => {
    it('opens on a tap of a trigger that performs no action', async () => {
      const { surface, wrapper } = renderHoverCard({}, { default: 'Hover me' })
      await nextTick()
      const trigger = document.querySelector('.astryx-hover-card__trigger') as HTMLElement

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()

      expect(isShown(surface)).toBe(true)
      expect(wrapper.emitted('openChange')).toEqual([[true]])
    })

    it('keeps its tap on a trigger that performs an action', async () => {
      const { surface, trigger } = renderHoverCard()

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()

      expect(isShown(surface)).toBe(false)
    })

    it('opens on a tap of an action trigger when touchTrigger is "tap"', async () => {
      const { surface, trigger } = renderHoverCard({ touchTrigger: 'tap' })

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()

      expect(isShown(surface)).toBe(true)
    })

    it('never opens on touch when touchTrigger is "none"', async () => {
      const { surface } = renderHoverCard({ touchTrigger: 'none' }, { default: 'Hover me' })
      await nextTick()
      const trigger = document.querySelector('.astryx-hover-card__trigger') as HTMLElement

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()

      expect(isShown(surface)).toBe(false)
    })

    it('closes on a second tap of the trigger and on a tap outside', async () => {
      const { surface } = renderHoverCard({}, { default: 'Hover me' })
      await nextTick()
      const trigger = document.querySelector('.astryx-hover-card__trigger') as HTMLElement

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()
      expect(isShown(surface)).toBe(true)

      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()
      expect(isShown(surface)).toBe(false)

      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()
      expect(isShown(surface)).toBe(true)

      const outside = document.createElement('div')
      document.body.append(outside)
      outside.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()
      expect(isShown(surface)).toBe(false)
    })

    it('does not dismiss a tap-opened card on a mouse press', async () => {
      const { surface } = renderHoverCard({}, { default: 'Hover me' })
      await nextTick()
      const trigger = document.querySelector('.astryx-hover-card__trigger') as HTMLElement

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()
      expect(isShown(surface)).toBe(true)

      const outside = document.createElement('div')
      document.body.append(outside)
      outside.dispatchEvent(pointerEvent('pointerdown', 'mouse'))
      await nextTick()
      expect(isShown(surface)).toBe(true)
    })

    it('still opens on keyboard focus after a tap', async () => {
      const { surface, trigger } = renderHoverCard()

      trigger.dispatchEvent(pointerEvent('pointerenter', 'touch'))
      trigger.dispatchEvent(pointerEvent('pointerdown', 'touch'))
      await nextTick()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
      trigger.focus()
      await nextTick()

      expect(isShown(surface)).toBe(true)
    })
  })
})
