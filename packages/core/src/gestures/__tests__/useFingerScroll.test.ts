/**
 * @file useFingerScroll.test.ts
 * @input Vue components using useFingerScroll, and touch-shaped events
 *   through the document's gesture host
 * @output A finger's scroll reads true until the scroller's scrollend; a
 *   scroll with no finger down reads false; the page's own scroll through
 *   the document; the watch follows the target's node and ends with its
 *   scope, and lets go of a node it stops following; onEnd runs once per
 *   finger scroll on each end path, for each watcher, and never on unmount
 * @position Unit tests of packages/core/src/gestures/useFingerScroll.ts
 */

import type { Ref } from 'vue'
import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, shallowRef } from 'vue'
import { isFingerScroll } from '../fingerScroll'
import { getGestureHost } from '../GestureHost'
import { useFingerScroll } from '../useFingerScroll'
import { coarsePrimaryPointer, pointerQuery } from './pointerQuery'
import { exposeTouchEvents } from './touchEvents'

function touch(type: string, target: Element, down: boolean): void {
  const event = new Event(type, { bubbles: true, cancelable: true })
  const entry = { identifier: 1, clientX: 5, clientY: 5, target }
  Object.defineProperty(event, 'changedTouches', { value: [entry] })
  Object.defineProperty(event, 'touches', { value: down ? [entry] : [] })
  target.dispatchEvent(event)
}

let read: (at?: number) => boolean = () => false

/** A list whose scroller is a div, or a section once `other` is set. */
function list(other: Ref<boolean>, onEnd?: () => void) {
  return defineComponent({
    setup() {
      const scroller = ref<HTMLElement | null>(null)
      read = useFingerScroll(scroller, { onEnd })
      return () => h(other.value ? 'section' : 'div', { 'ref': scroller, 'data-testid': 'list' }, [
        h('p', { 'data-testid': 'row' }, 'row'),
      ])
    },
  })
}

function byTestId(id: string): HTMLElement {
  return document.querySelector(`[data-testid="${id}"]`) as HTMLElement
}

/** A scroller the test keeps in the page while the composable moves off it. */
function scroller(): { element: HTMLElement, row: HTMLElement } {
  const element = document.createElement('div')
  const row = document.createElement('p')
  element.append(row)
  document.body.append(element)
  return { element, row }
}

/** A finger scrolling `element` from `row`, left resting. */
function fingerScroll(element: Element, row: Element): void {
  touch('touchstart', row, true)
  element.dispatchEvent(new Event('scroll'))
}

/** The finger lifted and the scroll ended. */
function lift(element: Element, row: Element): void {
  touch('touchend', row, false)
  element.dispatchEvent(new Event('scrollend'))
}

/** A list that counts its finger scrolls' ends, and what it read then. */
const ends: { count: number, readAtEnd: boolean[] } = { count: 0, readAtEnd: [] }

function onEnd(): void {
  ends.count += 1
  ends.readAtEnd.push(read())
}

/** A list with a second watcher on its scroller. */
const TwoWatchers = defineComponent({
  setup() {
    const target = ref<HTMLElement | null>(null)
    read = useFingerScroll(target, { onEnd })
    useFingerScroll(target, { onEnd })
    return () => h('div', { 'ref': target, 'data-testid': 'list' }, [h('p', { 'data-testid': 'row' }, 'row')])
  },
})

function page(target: Document | Ref<Document | null>) {
  return defineComponent({
    setup() {
      read = useFingerScroll(target)
      return () => h('p', { 'data-testid': 'row' }, 'row')
    },
  })
}

let restoreTouchEvents: () => void = () => {}

// A phone: the finger-scroll watch listens only where the primary pointer is
// coarse.
let restorePointer: () => void
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
})
beforeEach(() => {
  restorePointer = coarsePrimaryPointer()
})
afterEach(() => {
  restorePointer()
  read = () => false
  document.body.innerHTML = ''
})
afterAll(() => {
  restoreTouchEvents()
})

describe('useFingerScroll', () => {
  it('is internal: the package exports neither the composable nor the watch', async () => {
    const core: Record<string, unknown> = await import('../../index')
    expect(core).not.toHaveProperty('useFingerScroll')
    expect(core).not.toHaveProperty('isFingerScroll')
    expect(core).not.toHaveProperty('watchFingerScrolls')
    // 引入整个包的入口要编译几百个模块，机器忙时会超过默认的 5 秒。
  }, 30_000)

  it('reads a finger\'s scroll until the scroller\'s scrollend, and the program\'s as false', () => {
    const wrapper = mount(list(ref(false)), { attachTo: document.body })
    const scrollerElement = byTestId('list')
    scrollerElement.dispatchEvent(new Event('scroll'))
    expect(read()).toBe(false)
    touch('touchstart', byTestId('row'), true)
    scrollerElement.dispatchEvent(new Event('scroll'))
    expect(read()).toBe(true)
    // The lift starts the momentum: still the finger's.
    touch('touchend', byTestId('row'), false)
    scrollerElement.dispatchEvent(new Event('scroll'))
    expect(read()).toBe(true)
    scrollerElement.dispatchEvent(new Event('scrollend'))
    expect(read()).toBe(false)
    wrapper.unmount()
  })

  it('reads a time inside a finger\'s scroll as the finger\'s after it ends, and a program scroll right after as the program\'s', () => {
    const now = vi.spyOn(window.performance, 'now').mockReturnValue(100)
    try {
      const wrapper = mount(list(ref(false)), { attachTo: document.body })
      const scrollerElement = byTestId('list')
      const row = byTestId('row')
      touch('touchstart', row, true)
      now.mockReturnValue(120)
      scrollerElement.dispatchEvent(new Event('scroll'))
      now.mockReturnValue(150)
      touch('touchend', row, false)
      now.mockReturnValue(200)
      scrollerElement.dispatchEvent(new Event('scrollend'))
      expect(read()).toBe(false)
      expect(read(99)).toBe(false)
      expect(read(130)).toBe(true)
      expect(read(200)).toBe(true)
      // The program scrolls right after: the observer records it later.
      now.mockReturnValue(210)
      scrollerElement.dispatchEvent(new Event('scroll'))
      expect(read()).toBe(false)
      expect(read(216)).toBe(false)
      wrapper.unmount()
    }
    finally {
      now.mockRestore()
    }
  })

  it('keeps a scroll that ended under the resting finger the finger\'s at any time up to the lift', () => {
    const now = vi.spyOn(window.performance, 'now').mockReturnValue(100)
    try {
      const wrapper = mount(list(ref(false)), { attachTo: document.body })
      const scrollerElement = byTestId('list')
      const row = byTestId('row')
      touch('touchstart', row, true)
      now.mockReturnValue(110)
      scrollerElement.dispatchEvent(new Event('scroll'))
      now.mockReturnValue(120)
      scrollerElement.dispatchEvent(new Event('scrollend'))
      expect(read(115)).toBe(true)
      now.mockReturnValue(300)
      touch('touchend', row, false)
      expect(read()).toBe(false)
      expect(read(250)).toBe(true)
      expect(read(301)).toBe(false)
      wrapper.unmount()
    }
    finally {
      now.mockRestore()
    }
  })

  it('reads a recognizer\'s own scroll as the program\'s, even with a finger resting inside', () => {
    const wrapper = mount(list(ref(false)), { attachTo: document.body })
    const scrollerElement = byTestId('list')
    touch('touchstart', byTestId('row'), true)
    // A menu's edge autoscroll under the resting finger.
    getGestureHost(document).ownScroll(scrollerElement)
    scrollerElement.dispatchEvent(new Event('scroll'))
    expect(read()).toBe(false)
    touch('touchend', byTestId('row'), false)
    wrapper.unmount()
  })

  it('reads the page’s own scroll through the document, and through a ref that names it', () => {
    for (const target of [document, shallowRef<Document | null>(document)]) {
      const wrapper = mount(page(target), { attachTo: document.body })
      touch('touchstart', byTestId('row'), true)
      document.dispatchEvent(new Event('scroll'))
      expect(read()).toBe(true)
      touch('touchend', byTestId('row'), false)
      document.dispatchEvent(new Event('scrollend'))
      expect(read()).toBe(false)
      wrapper.unmount()
    }
  })

  it('follows the target\'s node, and stops watching on unmount', async () => {
    const other = ref(false)
    const wrapper = mount(list(other), { attachTo: document.body })
    other.value = true
    await nextTick()
    const scrollerElement = byTestId('list')
    expect(scrollerElement.tagName).toBe('SECTION')
    touch('touchstart', byTestId('row'), true)
    scrollerElement.dispatchEvent(new Event('scroll'))
    expect(read()).toBe(true)
    touch('touchend', byTestId('row'), false)
    scrollerElement.dispatchEvent(new Event('scrollend'))
    const reader = read
    wrapper.unmount()
    expect(reader()).toBe(false)
  })

  it('lets go of the node it stops following, and of its last one at unmount', async () => {
    const first = scroller()
    const second = scroller()
    const host = getGestureHost(document)
    const followed = shallowRef<Element | null>(first.element)
    const Follower = defineComponent({
      setup() {
        read = useFingerScroll(followed)
        return () => null
      },
    })
    const wrapper = mount(Follower)
    fingerScroll(first.element, first.row)
    expect(read()).toBe(true)
    lift(first.element, first.row)

    followed.value = second.element
    await nextTick()
    // The first scroller is no longer watched: its finger scroll counts for
    // nothing.
    fingerScroll(first.element, first.row)
    expect(isFingerScroll(host, first.element)).toBe(false)
    lift(first.element, first.row)
    fingerScroll(second.element, second.row)
    expect(read()).toBe(true)
    lift(second.element, second.row)

    const reader = read
    wrapper.unmount()
    fingerScroll(second.element, second.row)
    expect(isFingerScroll(host, second.element)).toBe(false)
    expect(reader()).toBe(false)
    lift(second.element, second.row)
  })

  describe('onEnd', () => {
    beforeEach(() => {
      ends.count = 0
      ends.readAtEnd = []
    })

    it('runs once at the scroller\'s scrollend after the lift, with the reader already false', () => {
      const wrapper = mount(list(ref(false), onEnd), { attachTo: document.body })
      const scrollerElement = byTestId('list')
      fingerScroll(scrollerElement, byTestId('row'))
      touch('touchend', byTestId('row'), false)
      scrollerElement.dispatchEvent(new Event('scroll'))
      expect(ends.count).toBe(0)
      scrollerElement.dispatchEvent(new Event('scrollend'))
      expect(ends.count).toBe(1)
      expect(ends.readAtEnd).toEqual([false])
      scrollerElement.dispatchEvent(new Event('scrollend'))
      expect(ends.count).toBe(1)
      wrapper.unmount()
    })

    it('runs at the lift when the scroll ended under a resting finger', () => {
      const wrapper = mount(list(ref(false), onEnd), { attachTo: document.body })
      const scrollerElement = byTestId('list')
      fingerScroll(scrollerElement, byTestId('row'))
      scrollerElement.dispatchEvent(new Event('scrollend'))
      expect(ends.count).toBe(0)
      touch('touchend', byTestId('row'), false)
      expect(ends.count).toBe(1)
      wrapper.unmount()
    })

    it('runs after the quiet fallback where the browser fires no scrollend', () => {
      // A browser with no scrollend (mobile Safari before 26): take the
      // window's handler slot away for this test.
      let owner: object | null = window
      while (owner != null && !Object.hasOwn(owner, 'onscrollend')) {
        owner = Object.getPrototypeOf(owner) as object | null
      }
      const slot = owner == null ? undefined : Object.getOwnPropertyDescriptor(owner, 'onscrollend')
      if (owner != null) {
        Reflect.deleteProperty(owner, 'onscrollend')
      }
      vi.useFakeTimers()
      try {
        expect('onscrollend' in window).toBe(false)
        const wrapper = mount(list(ref(false), onEnd), { attachTo: document.body })
        fingerScroll(byTestId('list'), byTestId('row'))
        touch('touchend', byTestId('row'), false)
        vi.advanceTimersByTime(149)
        expect(ends.count).toBe(0)
        vi.advanceTimersByTime(1)
        expect(ends.count).toBe(1)
        expect(ends.readAtEnd).toEqual([false])
        wrapper.unmount()
      }
      finally {
        vi.useRealTimers()
        if (owner != null && slot != null) {
          Object.defineProperty(owner, 'onscrollend', slot)
        }
      }
    })

    it('runs when the primary pointer stops being coarse mid-scroll', () => {
      restorePointer()
      const pointer = pointerQuery(true)
      restorePointer = pointer.restore
      const wrapper = mount(list(ref(false), onEnd), { attachTo: document.body })
      fingerScroll(byTestId('list'), byTestId('row'))
      pointer.set(false)
      expect(ends.count).toBe(1)
      expect(ends.readAtEnd).toEqual([false])
      touch('touchend', byTestId('row'), false)
      wrapper.unmount()
    })

    it('gives two watchers of one scroller one call each per finger scroll', () => {
      const wrapper = mount(TwoWatchers, { attachTo: document.body })
      const scrollerElement = byTestId('list')
      fingerScroll(scrollerElement, byTestId('row'))
      lift(scrollerElement, byTestId('row'))
      expect(ends.count).toBe(2)
      fingerScroll(scrollerElement, byTestId('row'))
      lift(scrollerElement, byTestId('row'))
      expect(ends.count).toBe(4)
      wrapper.unmount()
    })

    it('does not run on unmount, even mid-scroll', () => {
      const wrapper = mount(list(ref(false), onEnd), { attachTo: document.body })
      const row = byTestId('row')
      fingerScroll(byTestId('list'), row)
      wrapper.unmount()
      expect(ends.count).toBe(0)
      touch('touchend', row, false)
      expect(ends.count).toBe(0)
    })
  })
})
