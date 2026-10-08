import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Tooltip from './Tooltip.vue'

enableAutoUnmount(afterEach)

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

function renderTooltip(props: Record<string, unknown> = {}, slot = '<button type="button">Trigger</button>') {
  const wrapper = mount(Tooltip, {
    attachTo: document.body,
    props: { content: 'Helpful text', ...props },
    slots: { default: slot },
  })
  const trigger = document.querySelector('.astryx-tooltip-trigger > *') as HTMLElement
  const bubble = document.querySelector('[role="tooltip"]') as HTMLElement
  return { wrapper, trigger, bubble }
}

function isShown(bubble: HTMLElement): boolean {
  return bubble.style.display !== 'none'
}

describe('tooltip', () => {
  it('renders hidden tooltip content linked by aria-describedby', () => {
    const { trigger, bubble } = renderTooltip()

    expect(bubble.textContent).toContain('Helpful text')
    expect(isShown(bubble)).toBe(false)
    expect(trigger.getAttribute('aria-describedby')).toBe(bubble.id)
  })

  it('shows after the delay on pointer hover and reports openChange', async () => {
    const { wrapper, trigger, bubble } = renderTooltip()

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(199)
    await nextTick()
    expect(isShown(bubble)).toBe(false)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(isShown(bubble)).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[true]])
  })

  it('hides after the bridge delay when the pointer leaves', async () => {
    const { wrapper, trigger, bubble } = renderTooltip({ delay: 0 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(99)
    await nextTick()
    expect(isShown(bubble)).toBe(true)

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(isShown(bubble)).toBe(false)
    expect(wrapper.emitted('openChange')).toEqual([[true], [false]])
  })

  it('hides immediately on mouse pointerdown', async () => {
    const { trigger, bubble } = renderTooltip({ delay: 0 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(0)
    await nextTick()
    trigger.dispatchEvent(new Event('pointerdown'))
    await nextTick()

    expect(isShown(bubble)).toBe(false)
  })

  it('closes on Escape when uncontrolled', async () => {
    const { wrapper, bubble } = renderTooltip({ isDefaultOpen: true })
    await nextTick()
    expect(isShown(bubble)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(isShown(bubble)).toBe(false)
    expect(wrapper.emitted('openChange')?.at(-1)).toEqual([false])
  })

  it('keeps a controlled open tooltip visible and asks the parent on Escape', async () => {
    const { wrapper, trigger, bubble } = renderTooltip({ isOpen: true })
    await nextTick()
    expect(isShown(bubble)).toBe(true)

    trigger.dispatchEvent(new Event('mouseleave'))
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(isShown(bubble)).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(isShown(bubble)).toBe(true)
    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('never shows when disabled', async () => {
    const { trigger, bubble } = renderTooltip({ isEnabled: false, delay: 0 })

    trigger.dispatchEvent(new Event('mouseenter'))
    vi.advanceTimersByTime(1000)
    await nextTick()

    expect(isShown(bubble)).toBe(false)
  })

  it('makes a text-only trigger focusable and marks it for hover indication', async () => {
    const { bubble } = renderTooltip({}, 'Read more')
    const trigger = document.querySelector('.astryx-tooltip-trigger') as HTMLElement
    await nextTick()

    expect(trigger.classList.contains('astryx-tooltip-trigger--text')).toBe(true)
    expect(trigger.tabIndex).toBe(0)
    expect(trigger.classList.contains('astryx-tooltip-trigger--indicated')).toBe(true)
    expect(trigger.getAttribute('aria-describedby')).toBe(bubble.id)
  })

  it('does not mark element triggers for hover indication under auto', () => {
    renderTooltip()

    const wrapper = document.querySelector('.astryx-tooltip-trigger') as HTMLElement
    expect(wrapper.classList.contains('astryx-tooltip-trigger--indicated')).toBe(false)
  })
})
