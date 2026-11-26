import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { resetLiveRegionsForTest } from '../composables/internal/announce.js'
import FieldLabel from '../Field/FieldLabel.vue'
import { InfoTip } from './index.js'

enableAutoUnmount(afterEach)

const TIP = 'Billed on the first of each month'

beforeEach(() => {
  vi.useFakeTimers()
  // jsdom 不认 :focus-visible。键盘聚焦在真实浏览器里匹配它，这里替它回答。
  vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector: string) {
    if (selector === ':focus-visible')
      return true
    return Element.prototype.matches.call(this, selector)
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
  resetLiveRegionsForTest()
  document.body.innerHTML = ''
})

function render(props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) {
  const wrapper = mount(InfoTip, {
    attachTo: document.body,
    props: { content: TIP, label: 'About billing', ...props },
    attrs,
  })
  const trigger = document.querySelector('button.astryx-info-tip') as HTMLButtonElement
  const bubble = document.querySelector('[role="tooltip"]') as HTMLElement
  return { wrapper, trigger, bubble }
}

function shows(bubble: HTMLElement): boolean {
  return bubble.style.display !== 'none'
}

function pointer(target: EventTarget, type: string, init: Record<string, unknown> = {}): void {
  const event = new Event(type, { bubbles: true, cancelable: true }) as Event & Record<string, unknown>
  event.pointerType = 'mouse'
  event.button = 0
  Object.assign(event, init)
  target.dispatchEvent(event)
}

function click(trigger: HTMLElement, detail = 1): void {
  pointer(trigger, 'pointerdown')
  pointer(trigger, 'pointerup')
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, detail })
  trigger.dispatchEvent(event)
}

async function flush(ms = 0): Promise<void> {
  vi.advanceTimersByTime(ms)
  await nextTick()
}

async function hover(trigger: HTMLElement, type = 'mouse'): Promise<void> {
  pointer(trigger, 'pointerenter', { pointerType: type })
  trigger.dispatchEvent(new Event('mouseenter'))
  await flush(500)
}

describe('infoTip', () => {
  it('renders a named button with the default accessible name', () => {
    const { trigger } = render({ label: undefined })
    expect(trigger.type).toBe('button')
    expect(trigger.getAttribute('aria-label')).toBe('More information')
  })

  it('uses a custom label as the accessible name', () => {
    const { trigger } = render()
    expect(trigger.getAttribute('aria-label')).toBe('About billing')
  })

  it('links the trigger to the tooltip layer via aria-describedby', () => {
    const { trigger, bubble } = render()
    expect(trigger.getAttribute('aria-describedby')).toContain(bubble.id)
    expect(bubble.textContent).toContain(TIP)
  })

  it('draws its touch target through the shared hit area, not a fixed inset', () => {
    const wrapper = mount(InfoTip, { props: { content: 'Help' } })
    expect(wrapper.get('button').classes()).toContain('astryx-touch-hit-area')
    const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/info-tip.css'), 'utf8')
    expect(css).not.toContain('inset: -12px')
  })

  it('exposes the button as its element', () => {
    const { wrapper, trigger } = render()
    expect((wrapper.vm as unknown as { element: HTMLElement }).element).toBe(trigger)
  })

  it('draws the info icon at each size, sm by default', () => {
    expect(render().trigger.querySelector('.astryx-icon')?.getAttribute('data-size')).toBe('sm')
    document.body.innerHTML = ''
    for (const size of ['xsm', 'md', 'lg'] as const) {
      const { wrapper, trigger } = render({ size })
      expect(trigger.querySelector('.astryx-icon')?.getAttribute('data-size')).toBe(size)
      wrapper.unmount()
      document.body.innerHTML = ''
    }
  })

  it('renders slotted content in place of the content prop', () => {
    const wrapper = mount(InfoTip, {
      attachTo: document.body,
      props: { label: 'About' },
      slots: { content: () => h('b', 'Rich help') },
    })
    expect(document.querySelector('[role="tooltip"] b')?.textContent).toBe('Rich help')
    wrapper.unmount()
  })

  it('passes data-* and class to the button and keeps its own name', () => {
    const { trigger } = render({}, { 'data-testid': 'tip', 'class': 'extra', 'aria-label': 'Hijacked' })
    expect(trigger.getAttribute('data-testid')).toBe('tip')
    expect(trigger.classList.contains('extra')).toBe(true)
    expect(trigger.getAttribute('aria-label')).toBe('About billing')
  })

  it('shows on hover and hides after the pointer leaves', async () => {
    const { trigger, bubble } = render()
    await hover(trigger)
    expect(shows(bubble)).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    trigger.dispatchEvent(new Event('mouseleave'))
    await flush(200)
    expect(shows(bubble)).toBe(false)
  })

  it('shows on keyboard focus', async () => {
    const { trigger, bubble } = render()
    trigger.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(shows(bubble)).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('closes on Escape', async () => {
    const { trigger, bubble } = render()
    await hover(trigger)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(shows(bubble)).toBe(false)
  })

  describe('a press pins the help', () => {
    it('a click pins it and the next click closes it', async () => {
      const { trigger, bubble } = render()
      click(trigger)
      await nextTick()
      expect(shows(bubble)).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      click(trigger)
      await nextTick()
      expect(shows(bubble)).toBe(false)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('stays pinned when the pointer leaves', async () => {
      const { trigger, bubble } = render()
      click(trigger)
      trigger.dispatchEvent(new Event('mouseleave'))
      await flush(1000)
      expect(shows(bubble)).toBe(true)
    })

    it('enter and Space (a click with no pointer) pin and close it', async () => {
      const { trigger, bubble } = render()
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
      await nextTick()
      expect(shows(bubble)).toBe(true)
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
      await nextTick()
      expect(shows(bubble)).toBe(false)
    })

    it('a touch tap pins it though the trigger is a button, and a second tap closes it', async () => {
      const { trigger, bubble } = render()
      const tap = (): void => {
        pointer(trigger, 'pointerenter', { pointerType: 'touch' })
        pointer(trigger, 'pointerdown', { pointerType: 'touch' })
        pointer(trigger, 'pointerup', { pointerType: 'touch' })
        trigger.dispatchEvent(new Event('mouseenter'))
        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
      }
      tap()
      await nextTick()
      expect(shows(bubble)).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      tap()
      await nextTick()
      expect(shows(bubble)).toBe(false)
    })

    it('a mouse press on a hover preview keeps it shown, and only its click pins it', async () => {
      const { trigger, bubble } = render()
      await hover(trigger)
      pointer(trigger, 'pointerdown')
      await nextTick()
      expect(shows(bubble)).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      pointer(trigger, 'pointerup')
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
      await nextTick()
      expect(shows(bubble)).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      click(trigger)
      await nextTick()
      expect(shows(bubble)).toBe(false)
    })

    it('a press on a preview that ends off the button and the help ends the hold and closes it', async () => {
      const { trigger, bubble } = render()
      await hover(trigger)
      pointer(trigger, 'pointerdown')
      trigger.dispatchEvent(new Event('mouseleave'))
      pointer(document.body, 'pointerup')
      await flush(500)
      expect(shows(bubble)).toBe(false)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('after such a press, Enter and Space still pin and close it', async () => {
      const { trigger, bubble } = render()
      await hover(trigger)
      pointer(trigger, 'pointerdown')
      pointer(document.body, 'pointerup')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
      await nextTick()
      expect(shows(bubble)).toBe(true)
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      trigger.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 0 }))
      await nextTick()
      expect(shows(bubble)).toBe(false)
    })

    it('a right or middle press on a preview does not hold it', async () => {
      const { trigger, bubble } = render()
      for (const button of [2, 1]) {
        await hover(trigger)
        expect(shows(bubble)).toBe(true)
        pointer(trigger, 'pointerdown', { button })
        pointer(trigger, 'pointerup', { button })
        trigger.dispatchEvent(new Event('mouseleave'))
        await flush(500)
        expect(shows(bubble)).toBe(false)
        expect(trigger.getAttribute('aria-expanded')).toBe('false')
      }
    })

    it('escape closes a pinned tooltip', async () => {
      const { trigger, bubble } = render()
      click(trigger)
      await nextTick()
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
      await nextTick()
      expect(shows(bubble)).toBe(false)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('a press outside closes it, and a press on the tooltip keeps it', async () => {
      const { trigger, bubble } = render()
      const elsewhere = document.createElement('p')
      document.body.append(elsewhere)
      click(trigger)
      await nextTick()
      pointer(bubble, 'pointerdown')
      await nextTick()
      expect(shows(bubble)).toBe(true)
      pointer(elsewhere, 'pointerdown')
      await nextTick()
      expect(shows(bubble)).toBe(false)
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    })

    it('a scroll outside closes it', async () => {
      const { trigger, bubble } = render()
      const elsewhere = document.createElement('div')
      document.body.append(elsewhere)
      click(trigger)
      await nextTick()
      elsewhere.dispatchEvent(new Event('scroll'))
      await nextTick()
      expect(shows(bubble)).toBe(false)
    })

    it('focus moving outside closes it, and focus moving to no element keeps it', async () => {
      const { trigger, bubble } = render()
      const next = document.createElement('button')
      document.body.append(next)
      click(trigger)
      await nextTick()
      trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
      await nextTick()
      expect(shows(bubble)).toBe(true)
      trigger.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: next }))
      await nextTick()
      expect(shows(bubble)).toBe(false)
    })
  })

  describe('trigger state', () => {
    it('carries aria-expanded while pinned and aria-controls while it shows', async () => {
      const { trigger, bubble } = render()
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.hasAttribute('aria-controls')).toBe(false)
      click(trigger)
      await nextTick()
      expect(trigger.getAttribute('aria-expanded')).toBe('true')
      expect(trigger.getAttribute('aria-controls')).toBe(bubble.id)
      expect(trigger.getAttribute('aria-describedby')).toContain(bubble.id)
      click(trigger)
      await nextTick()
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.hasAttribute('aria-controls')).toBe(false)
    })

    it('announces its text once when it pins, and nothing for a preview', async () => {
      const { trigger } = render()
      const live = (): string => document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? ''
      await hover(trigger)
      vi.advanceTimersToNextFrame?.()
      expect(live()).toBe('')
      click(trigger)
      await nextTick()
      await nextTick()
      vi.advanceTimersByTime(50)
      expect(live()).toBe(TIP)
    })
  })

  describe('a press stops at its button', () => {
    it('a clickable row around it does not activate, while document still sees the press', async () => {
      const onRow = vi.fn()
      const onPage = vi.fn()
      document.addEventListener('pointerdown', onPage, true)
      const row = document.createElement('div')
      row.addEventListener('click', onRow)
      document.body.append(row)
      const wrapper = mount(InfoTip, { attachTo: row, props: { content: TIP, label: 'About billing' } })
      const trigger = row.querySelector('button') as HTMLButtonElement
      click(trigger)
      click(trigger)
      await nextTick()
      expect(onRow).not.toHaveBeenCalled()
      expect(onPage).toHaveBeenCalledTimes(2)
      document.removeEventListener('pointerdown', onPage, true)
      wrapper.unmount()
    })

    it('a click inside a label does not operate the labelled control', () => {
      const label = document.createElement('label')
      label.innerHTML = '<input type="checkbox" /> Email me'
      document.body.append(label)
      const wrapper = mount(InfoTip, { attachTo: label, props: { content: TIP, label: 'About billing' } })
      click(label.querySelector('button') as HTMLButtonElement)
      expect((label.querySelector('input') as HTMLInputElement).checked).toBe(false)
      wrapper.unmount()
    })
  })

  it('field labels draw their tooltip through InfoTip with a name built from the label', () => {
    const wrapper = mount(FieldLabel, {
      attachTo: document.body,
      props: { label: 'Auto-save', inputId: 'auto', labelTooltip: 'Saves every minute' },
    })
    const trigger = wrapper.get('button.astryx-info-tip')
    expect(trigger.attributes('aria-label')).toBe('About Auto-save')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('Saves every minute')
  })
})
