import type { SnapPaging } from '../composables/internal/snapPagingValue.js'
import type { CarouselHandle } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { makeSnapPaging } from '../composables/internal/snapPagingValue.js'
import { layOutRow, swipe } from '../composables/testing/fakeSnapRow.js'
import { useSnapPaging } from '../composables/useSnapPaging.js'
import Carousel from './Carousel.vue'
import { useCarouselScroller } from './useCarouselScroll.js'

enableAutoUnmount(afterEach)

const advance = (ms: number) => vi.advanceTimersByTime(ms)
const TEN = { width: 300, items: Array.from({ length: 10 }).fill(100) as number[] }

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ matches: false, media: query }) as MediaQueryList)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

async function mountRow(hasSnap: boolean | SnapPaging = useSnapPaging()) {
  const wrapper = mount(Carousel, {
    attachTo: document.body,
    props: { hasSnap, label: 'Row' },
    slots: { default: () => TEN.items.map((_, i) => h('div', `Item ${i + 1}`)) },
  })
  const scroller = wrapper.get<HTMLElement>('.astryx-carousel__scroller').element
  layOutRow(scroller, TEN)
  scroller.dispatchEvent(new Event('scroll'))
  advance(16)
  await nextTick()
  const button = (side: 'start' | 'end') => wrapper.get<HTMLButtonElement>(`.astryx-carousel__pill--${side} button`).element
  const isDisabled = (side: 'start' | 'end') => button(side).getAttribute('aria-disabled') === 'true'
  const handle = wrapper.vm as unknown as CarouselHandle
  return { wrapper, scroller, button, isDisabled, handle }
}

function pointer(scroller: HTMLElement, type: string, x: number): void {
  scroller.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, isPrimary: true, pointerId: 1, pointerType: 'touch', clientX: x }))
}

describe('carousel hasSnap with useSnapPaging()', () => {
  it('snaps natively and pages under a finger', async () => {
    const { scroller } = await mountRow()
    expect(scroller.getAttribute('data-snap')).toBe('true')
    swipe(scroller, advance, [250, 200, 100, 0])
    advance(2000)
    expect(scroller.scrollLeft).toBe(300)
  })

  it('attaches once: a new value attaches nothing again, and switching to plain snap detaches', async () => {
    const attached: string[] = []
    const value = (name: string) => makeSnapPaging(() => {
      attached.push(name)
      return { detach: () => attached.push(`${name} detached`), move: () => {}, moveHeld: () => false }
    })
    const { wrapper } = await mountRow(value('first'))
    await wrapper.setProps({ hasSnap: value('second') })
    expect(attached).toEqual(['first'])
    await wrapper.setProps({ hasSnap: true })
    expect(attached).toEqual(['first', 'first detached'])
    await wrapper.setProps({ hasSnap: value('third') })
    wrapper.unmount()
    expect(attached).toEqual(['first', 'first detached', 'third', 'third detached'])
  })

  it('leaves a carousel with plain hasSnap to native scrolling', async () => {
    const { scroller } = await mountRow(true)
    swipe(scroller, advance, [250, 200, 100, 0])
    advance(2000)
    expect(scroller.scrollLeft).toBe(0)
    expect(scroller.style.getPropertyValue('touch-action')).toBe('')
  })
})

describe('a scroll call under snap paging', () => {
  it('moves the row through the paging from rest, onto the stop about one view on', async () => {
    const { scroller, handle } = await mountRow()
    const scrollBy = vi.spyOn(scroller, 'scrollBy')
    handle.scrollNext()
    expect(scroller.style.getPropertyValue('scroll-snap-type')).toBe('none')
    advance(16)
    expect(scroller.scrollLeft).toBeGreaterThan(0)
    expect(scroller.scrollLeft).toBeLessThan(200)
    advance(2000)
    // 一屏 300 减去半项 50，最近的停点是 200。
    expect(scroller.scrollLeft).toBe(200)
    expect(scroller.style.getPropertyValue('scroll-snap-type')).toBe('')
    expect(scrollBy).not.toHaveBeenCalled()
  })

  it('rests on a page when a still touch catches the move', async () => {
    const { scroller, handle } = await mountRow()
    handle.scrollNext()
    advance(48)
    pointer(scroller, 'pointerdown', 150)
    advance(300)
    const caught = scroller.scrollLeft
    expect(caught % 100).not.toBe(0)
    pointer(scroller, 'pointerup', 150)
    advance(2000)
    expect(scroller.scrollLeft % 100).toBe(0)
    expect(scroller.style.getPropertyValue('scroll-snap-type')).toBe('')
  })

  it('takes scrollTo(index) to the item\'s stop, inside the scroll padding', async () => {
    const { scroller, handle } = await mountRow()
    scroller.style.setProperty('scroll-padding-left', '16px')
    handle.scrollTo(3)
    advance(2000)
    expect(scroller.scrollLeft).toBe(284)
  })

  it('moves a held row to the stop nearest a Shift+wheel step', async () => {
    const { scroller } = await mountRow()
    const scrollBy = vi.spyOn(scroller, 'scrollBy')
    swipe(scroller, advance, [250, 200, 100, 0])
    const wheel = new WheelEvent('wheel', { bubbles: true, cancelable: true, deltaY: 400 })
    // happy-dom 的 WheelEvent 不读 shiftKey。
    Object.defineProperty(wheel, 'shiftKey', { value: true })
    scroller.dispatchEvent(wheel)
    expect(wheel.defaultPrevented).toBe(true)
    advance(2000)
    expect(scrollBy).not.toHaveBeenCalled()
    expect(scroller.scrollLeft).toBe(600)
  })
})

describe('the edge buttons under snap paging', () => {
  it('follow the held row in the same frame it leaves or reaches an edge, before the hand-back', async () => {
    const { scroller, isDisabled } = await mountRow()
    expect([isDisabled('start'), isDisabled('end')]).toEqual([true, false])
    pointer(scroller, 'pointerdown', 250)
    pointer(scroller, 'pointermove', 240)
    pointer(scroller, 'pointermove', 200)
    await nextTick()
    expect([isDisabled('start'), isDisabled('end')]).toEqual([false, false])
    pointer(scroller, 'pointermove', -800)
    await nextTick()
    expect([isDisabled('start'), isDisabled('end')]).toEqual([false, true])
    expect(scroller.style.getPropertyValue('scroll-snap-type')).toBe('none')
  })

  it('hands focus to the scroll area once, when the held row reaches the edge of the focused button', async () => {
    const { scroller, button } = await mountRow()
    pointer(scroller, 'pointerdown', 250)
    pointer(scroller, 'pointermove', 240)
    pointer(scroller, 'pointermove', 200)
    await nextTick()
    button('end').focus()
    const focus = vi.spyOn(scroller, 'focus')
    pointer(scroller, 'pointermove', -800)
    await nextTick()
    await nextTick()
    expect(focus).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(scroller)
    pointer(scroller, 'pointermove', -810)
    await nextTick()
    await nextTick()
    expect(focus).toHaveBeenCalledTimes(1)
  })

  it('unmounts while the paging holds the row, giving the row its own styles back', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { wrapper, scroller } = await mountRow()
    swipe(scroller, advance, [250, 200, 150], { lift: false })
    expect(scroller.style.getPropertyValue('scroll-snap-type')).toBe('none')
    wrapper.unmount()
    expect(scroller.style.getPropertyValue('scroll-snap-type')).toBe('')
    expect(scroller.style.getPropertyValue('touch-action')).toBe('')
    expect(warn).not.toHaveBeenCalled()
  })

  it('writes nothing for a report that changes no edge', () => {
    let scroll!: ReturnType<typeof useCarouselScroller>
    mount(defineComponent({
      setup() {
        scroll = useCarouselScroller({ value: null } as never)
        return () => h('div')
      },
    }))
    scroll.followShown({ offset: 100, travel: 600 })
    const shown = scroll.overflow.value
    expect(shown).toEqual({ hasOverflow: true, overflowStart: true, overflowEnd: true })
    scroll.followShown({ offset: 200, travel: 600 })
    expect(scroll.overflow.value).toBe(shown)
    scroll.followShown({ offset: 600, travel: 600 })
    expect(scroll.overflow.value).toEqual({ hasOverflow: true, overflowStart: true, overflowEnd: false })
  })
})
