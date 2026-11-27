import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { touch } from '../gestures/__tests__/touchEvents'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import BottomSheet from './BottomSheet.vue'
import { resetBottomSheetStackForTests } from './stack/bottomSheetStack.js'

enableAutoUnmount(afterEach)

const originalMatchMedia = window.matchMedia
const originalAnimate = Element.prototype.animate

afterEach(() => {
  window.matchMedia = originalMatchMedia
  Element.prototype.animate = originalAnimate
  document.body.innerHTML = ''
  document.body.style.overflow = ''
  resetDismissStackForTests()
  resetBottomSheetStackForTests()
  vi.restoreAllMocks()
})

/** Media queries in `matching` match; every other query does not. */
function stubMediaQueries(...matching: string[]): void {
  window.matchMedia = (query: string) => ({
    matches: matching.some(entry => query.includes(entry)),
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList
}

function renderSheet(props: Record<string, unknown> = {}, content: () => unknown = () => h('p', { class: 'plain' }, 'Sheet body')) {
  return mount(BottomSheet, {
    attachTo: document.body,
    props: { isOpen: false, label: 'Filters', height: 'tall', ...props },
    slots: { default: content },
  })
}

function panelEl(): HTMLElement {
  return document.querySelector('.astryx-bottom-sheet') as HTMLElement
}

function dialogEl(): HTMLDialogElement {
  return document.querySelector('dialog') as HTMLDialogElement
}

function stubPanelHeight(height: number): void {
  const box = { x: 0, y: 0, width: 640, height, top: 0, left: 0, right: 640, bottom: height, toJSON: () => ({}) } as DOMRect
  Object.defineProperty(panelEl(), 'getBoundingClientRect', { configurable: true, value: () => box })
}

async function openSheet(props: Record<string, unknown> = {}, content?: () => unknown) {
  const wrapper = renderSheet(props, content)
  await wrapper.setProps({ isOpen: true })
  await flushPromises()
  stubPanelHeight(600)
  return wrapper
}

/** Gives the panel a running exit, which a stylesheet-free test has none of. */
function holdExitTransition(): void {
  panelEl().style.transitionProperty = 'transform, opacity'
  panelEl().style.transitionDuration = '300ms'
}

/** One finger's path over `target`: [clientY, timeStamp] per event, lifted at the last. */
function swipe(target: Element, path: ReadonlyArray<readonly [number, number]>): void {
  const [first, ...rest] = path
  touch('touchstart', target, { id: 1, x: 10, y: first[0] }, first[1])
  for (const [y, time] of rest)
    touch('touchmove', target, { id: 1, x: 10, y }, time)
  const last = path[path.length - 1]
  touch('touchend', target, { id: 1, x: 10, y: last[0] }, last[1], true)
}

/** A short, fast finger flick down the sheet's content. */
function flickDown(target: Element): void {
  swipe(target, [[100, 100], [106, 106], [112, 112], [124, 120]])
}

describe('bottom sheet finger drag', () => {
  it('closes on a short finger flick down', async () => {
    const wrapper = await openSheet()

    flickDown(panelEl().querySelector('.plain') as Element)
    await flushPromises()

    expect(wrapper.emitted('openChange')).toEqual([[false]])
  })

  it('returns to the starting stop when the release turns back', async () => {
    const wrapper = await openSheet()

    swipe(panelEl().querySelector('.plain') as Element, [
      [100, 100],
      [110, 110],
      [300, 200],
      [500, 300],
      [480, 340],
      [460, 380],
      [440, 420],
    ])
    await flushPromises()

    expect(wrapper.emitted('openChange')).toBeUndefined()
    expect(panelEl().style.transform).toBe('')
  })

  it('cancels the native pan once a pull against the edge passes a tap\'s wobble', async () => {
    await openSheet()
    const target = panelEl().querySelector('.plain') as Element
    let defaultPrevented = false
    target.addEventListener('touchmove', (event) => {
      defaultPrevented = event.defaultPrevented
    })
    panelEl().querySelector('.astryx-bottom-sheet__body')!.addEventListener('touchmove', (event) => {
      defaultPrevented = event.defaultPrevented
    })

    touch('touchstart', target, { id: 1, x: 10, y: 100 }, 100)
    touch('touchmove', target, { id: 1, x: 10, y: 106 }, 110)

    expect(defaultPrevented).toBe(true)
    expect(panelEl().hasAttribute('data-dragging')).toBe(false)
  })

  it('takes the pull past where a scroll ran out of content, and hands it back', async () => {
    await openSheet({}, () => h('div', { class: 'list', style: 'overflow-y: auto' }, [h('div', { class: 'row' }, 'Row')]))
    const list = panelEl().querySelector('.list') as HTMLElement
    Object.defineProperty(list, 'scrollHeight', { configurable: true, value: 400 })
    Object.defineProperty(list, 'clientHeight', { configurable: true, value: 200 })
    let scrollTop = 150
    Object.defineProperty(list, 'scrollTop', { configurable: true, get: () => scrollTop })
    const row = list.querySelector('.row') as Element

    touch('touchstart', row, { id: 1, x: 10, y: 300 }, 100)
    touch('touchmove', row, { id: 1, x: 10, y: 260 }, 120)
    expect(panelEl().hasAttribute('data-dragging')).toBe(false)

    scrollTop = 200
    touch('touchmove', row, { id: 1, x: 10, y: 240 }, 140)
    expect(list.style.overscrollBehaviorY).toBe('none')
    touch('touchmove', row, { id: 1, x: 10, y: 230 }, 160)
    await flushPromises()
    expect(panelEl().hasAttribute('data-dragging')).toBe(true)

    touch('touchmove', row, { id: 1, x: 10, y: 245 }, 180)
    await flushPromises()
    expect(panelEl().hasAttribute('data-dragging')).toBe(false)
    expect(list.style.overscrollBehaviorY).toBe('')
  })

  it('sends the sheet and its scrim back when the host keeps it open', async () => {
    const wrapper = await openSheet({ 'snapPoints': [0.5], 'onUpdate:isOpen': () => {} })
    swipe(panelEl().querySelector('.plain') as Element, [[100, 100], [110, 110], [200, 300], [268, 500], [268, 600]])
    await flushPromises()
    expect(wrapper.emitted('snap')?.at(-1)?.[0]).toBe(384)
    const restingScrim = dialogEl().style.getPropertyValue('--_sheet-scrim-opacity')

    flickDown(panelEl().querySelector('.plain') as Element)
    await flushPromises()

    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(dialogEl().style.getPropertyValue('--_sheet-scrim-opacity')).toBe(restingScrim)
    expect(panelEl().getAttribute('data-state')).toBe('open')
  })

  it('reaches 40% of the viewport below the screen on a touch device', async () => {
    stubMediaQueries('(any-pointer: coarse)')
    await openSheet()

    expect(panelEl().style.getPropertyValue('--_sheet-reserve')).toBe(`${Math.ceil(window.innerHeight * 0.4)}px`)
  })

  it('keeps the minimum reserve for a sheet the caller sizes', async () => {
    stubMediaQueries('(any-pointer: coarse)')
    await openSheet({ class: 'custom-size' })

    expect(panelEl().style.getPropertyValue('--_sheet-reserve')).toBe('48px')
  })
})

describe('bottom sheet close', () => {
  it('fades the scrim out on any close', async () => {
    const wrapper = await openSheet()
    expect(dialogEl().style.getPropertyValue('--_sheet-scrim-opacity')).toBe('1')

    holdExitTransition()
    await wrapper.setProps({ isOpen: false })

    expect(dialogEl().style.getPropertyValue('--_sheet-scrim-opacity')).toBe('0')
  })

  it('fades a finger\'s close in place under reduced motion', async () => {
    stubMediaQueries('prefers-reduced-motion: reduce')
    const wrapper = await openSheet()
    holdExitTransition()

    flickDown(panelEl().querySelector('.plain') as Element)
    await flushPromises()

    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(panelEl().getAttribute('data-exit')).toBe('fade')
    expect(panelEl().style.transform).toMatch(/^translateY\(/)
  })

  it('plays a finger\'s close on the dismiss spring and paces the scrim on it', async () => {
    stubMediaQueries()
    const played: Element[] = []
    Element.prototype.animate = function (this: Element) {
      played.push(this)
      return {
        cancel() {},
        finish() {},
        addEventListener() {},
        removeEventListener() {},
        currentTime: 0,
        startTime: 0,
        finished: new Promise(() => {}),
        ready: Promise.resolve(),
        playState: 'running',
        effect: null,
      } as unknown as Animation
    }
    const wrapper = await openSheet()

    flickDown(panelEl().querySelector('.plain') as Element)
    await flushPromises()

    expect(wrapper.emitted('openChange')).toEqual([[false]])
    expect(dialogEl().style.getPropertyValue('--_sheet-scrim-duration')).toMatch(/^\d+(\.\d+)?ms$/)
    expect(dialogEl().style.getPropertyValue('--_sheet-scrim-easing')).not.toBe('')
    expect(played).toContain(panelEl())
  })
})
