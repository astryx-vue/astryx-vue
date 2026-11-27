import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import KanbanBoard from './kanban-board.vue'

function firstCard(): HTMLElement {
  return document.querySelector<HTMLElement>('.board-card')!
}

function pointer(type: string, target: EventTarget, pointerType: string, x: number, y: number) {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX: x, clientY: y })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  target.dispatchEvent(event)
}

describe('kanban-board dragging', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('lifts a card with the mouse at once and keeps it mounted but hidden in its column', async () => {
    const wrapper = mount(KanbanBoard, { attachTo: document.body })
    const card = firstCard()
    pointer('pointerdown', card, 'mouse', 10, 10)
    pointer('pointermove', window, 'mouse', 40, 40)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.floating-card')).not.toBeNull()
    expect(card.isConnected).toBe(true)
    expect(card.classList.contains('board-card--carried')).toBe(true)
    pointer('pointerup', window, 'mouse', 40, 40)
    await wrapper.vm.$nextTick()
    expect(card.classList.contains('board-card--carried')).toBe(false)
    wrapper.unmount()
  })

  it('lifts a card for a finger only after a long press', async () => {
    const wrapper = mount(KanbanBoard, { attachTo: document.body })
    const card = firstCard()
    pointer('pointerdown', card, 'touch', 10, 10)
    pointer('pointermove', window, 'touch', 12, 12)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.floating-card')).toBeNull()
    await vi.advanceTimersByTimeAsync(800)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.floating-card')).not.toBeNull()
    pointer('pointerup', window, 'touch', 12, 12)
    wrapper.unmount()
  })

  it('treats a finger that moves before the long press as a scroll, not a lift', async () => {
    const wrapper = mount(KanbanBoard, { attachTo: document.body })
    const card = firstCard()
    pointer('pointerdown', card, 'touch', 10, 10)
    pointer('pointermove', window, 'touch', 10, 80)
    await vi.advanceTimersByTimeAsync(800)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.floating-card')).toBeNull()
    wrapper.unmount()
  })

  it('stops the board from scrolling while a finger carries a card', async () => {
    const wrapper = mount(KanbanBoard, { attachTo: document.body })
    const card = firstCard()
    pointer('pointerdown', card, 'touch', 10, 10)
    await vi.advanceTimersByTimeAsync(800)
    const move = new Event('touchmove', { bubbles: true, cancelable: true })
    card.dispatchEvent(move)
    expect(move.defaultPrevented).toBe(true)
    pointer('pointerup', window, 'touch', 10, 10)
    const after = new Event('touchmove', { bubbles: true, cancelable: true })
    card.dispatchEvent(after)
    expect(after.defaultPrevented).toBe(false)
    wrapper.unmount()
  })
})
