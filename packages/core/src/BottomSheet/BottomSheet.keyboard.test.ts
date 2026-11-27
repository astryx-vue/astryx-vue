/**
 * A Tall sheet keeps its focused field above the on-screen keyboard
 * (useMobileKeyboard). The tests drive the keyboard through the visual
 * viewport's resize reports and read the inset the sheet lays out at the end
 * of its body's content.
 */

import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'
import { h } from 'vue'
import { __focusTakeoverCallersForTest } from '../keyboard/focusReveal'
import { __resetRevealsAtReportForTest } from '../keyboard/sheetKeyboard'
import { resetDismissStackForTests } from '../layer/dismissStack.js'
import BottomSheet from './BottomSheet.vue'
import { resetBottomSheetStackForTests } from './stack/bottomSheetStack.js'

enableAutoUnmount(afterEach)

function ensureDialogModalApi(): void {
  const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
  proto.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.show = function (this: HTMLDialogElement) {
    this.setAttribute('open', '')
  }
  proto.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open')
  }
}

const originalScrollTo = window.scrollTo

beforeEach(() => {
  ensureDialogModalApi()
  mockPrimaryPointer('fine')
  // A frame runs at once, so a reveal scheduled for the next frame lands
  // inside the step that asked for it.
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => {})
  // Not iOS WebKit: happy-dom's CSS.supports answers yes to its touch
  // callout query.
  vi.stubGlobal('CSS', { supports: () => false })
  window.scrollTo = vi.fn() as typeof window.scrollTo
})

afterEach(() => {
  document.body.innerHTML = ''
  resetDismissStackForTests()
  resetBottomSheetStackForTests()
  __resetRevealsAtReportForTest()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  window.scrollTo = originalScrollTo
})

function rect({ top, bottom }: { top: number, bottom: number }): DOMRect {
  return {
    x: 0,
    y: top,
    top,
    right: 400,
    bottom,
    left: 0,
    width: 400,
    height: bottom - top,
    toJSON: () => ({}),
  }
}

function mockVisualViewport(height: number, offsetTop = 0) {
  const viewport = Object.assign(new EventTarget(), { height, offsetTop })
  vi.stubGlobal('visualViewport', viewport)
  return viewport
}

// The layout viewport (`window.innerHeight`), which the keyboard leaves
// alone. The keyboard shrinks the visual viewport above.
function mockWindowHeight(height: number): void {
  vi.stubGlobal('innerHeight', height)
}

// The primary pointer `matchMedia` reports.
function mockPrimaryPointer(pointer: 'coarse' | 'fine'): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query === `(pointer: ${pointer})`,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }))
}

// A touch platform that measures the keyboard: a visual viewport and a
// coarse pointer, with no keyboard geometry API of its own.
function mockTouchPlatform(): void {
  if (window.visualViewport == null)
    mockVisualViewport(window.innerHeight)
  mockPrimaryPointer('coarse')
}

// A browser with its own keyboard geometry API (navigator.virtualKeyboard).
function mockKeyboardGeometryApi(): void {
  const navigatorMock = Object.create(window.navigator) as Navigator
  Object.defineProperty(navigatorMock, 'virtualKeyboard', {
    configurable: true,
    value: { overlaysContent: false },
  })
  vi.stubGlobal('navigator', navigatorMock)
}

// The touch listeners registered at once, at most: the reveal-pan watch
// reads touches.
function trackTouchListeners(): () => number {
  const live = new Set<unknown>()
  let most = 0
  const add = window.addEventListener.bind(window)
  const remove = window.removeEventListener.bind(window)
  const adding = vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'touchstart') {
      live.add(listener)
      most = Math.max(most, live.size)
    }
    add(type, listener, options)
  })
  const removing = vi.spyOn(window, 'removeEventListener').mockImplementation((type, listener, options) => {
    if (type === 'touchstart')
      live.delete(listener)
    remove(type, listener, options)
  })
  onTestFinished(() => {
    adding.mockRestore()
    removing.mockRestore()
  })
  return () => most
}

async function renderSheet(
  fields: readonly string[] = ['Comment'],
  props: Record<string, unknown> = {},
) {
  const wrapper = mount(BottomSheet, {
    attachTo: document.body,
    props: { isOpen: true, label: 'Add a comment', height: 'tall', ...props },
    slots: {
      default: () => fields.map(name => h('input', { 'aria-label': name, 'class': `field-${name}` })),
    },
  })
  await flushPromises()
  // happy-dom's element scrollBy moves nothing. Without one, the sheet sets
  // scrollTop itself, as a test's own scrollBy can still do.
  Object.defineProperty(getBody(), 'scrollBy', { configurable: true, value: undefined })
  return wrapper
}

function getSheet(): HTMLElement {
  return document.querySelector('.astryx-bottom-sheet') as HTMLElement
}

function getBody(): HTMLElement {
  return document.querySelector('.astryx-bottom-sheet__body') as HTMLElement
}

function field(name: string): HTMLInputElement {
  return document.querySelector(`.field-${name}`) as HTMLInputElement
}

// The inset the keyboard takes at the end of a Tall sheet's body, CSS px, or 0
// when the sheet lays out none: the content box's `::after` height.
function keyboardInsetOf(body: HTMLElement): number {
  const content = body.firstElementChild
  const match = /--[\w-]+:\s*(-?[\d.]+)px/.exec(content?.getAttribute('style') ?? '')
  return match == null ? 0 : Number(match[1])
}

function blur(target: Element, relatedTarget: Element | null): void {
  target.dispatchEvent(new FocusEvent('blur', { relatedTarget }))
  target.dispatchEvent(new FocusEvent('focusout', { relatedTarget, bubbles: true }))
}

function resize(viewport: EventTarget): void {
  viewport.dispatchEvent(new Event('resize'))
}

/** Lays out the sheet's body from 100 to `bottom`, with `name`'s field at `top` in its content. */
function layOut(name: string, top: number, { bottom = 800, bodyTop = 100 } = {}): { body: HTMLElement, input: HTMLInputElement } {
  const body = getBody()
  const input = field(name)
  vi.spyOn(body, 'getBoundingClientRect').mockReturnValue(rect({ top: bodyTop, bottom }))
  vi.spyOn(input, 'getBoundingClientRect').mockImplementation(() =>
    rect({ top: top - body.scrollTop, bottom: top + 40 - body.scrollTop }),
  )
  return { body, input }
}

/** Makes the body's scrollBy land at once. */
function instantScrollBy(body: HTMLElement): void {
  Object.defineProperty(body, 'scrollBy', {
    configurable: true,
    value: ({ top = 0 }: ScrollToOptions) => {
      body.scrollTop += top
    },
  })
}

describe('bottomSheet mobile keyboard', () => {
  it('registers no touch listener and no focus takeover for a Tall sheet under a fine pointer', async () => {
    mockWindowHeight(800)
    mockVisualViewport(800)
    const mostTouchListeners = trackTouchListeners()
    await renderSheet()
    expect(field('Comment')).not.toBeNull()
    expect(mostTouchListeners()).toBe(0)
    expect(__focusTakeoverCallersForTest(document)).toBe(0)
  })

  it('installs the focus takeover for each Tall sheet under a coarse pointer, with one touch listener', async () => {
    mockPrimaryPointer('coarse')
    mockWindowHeight(800)
    mockVisualViewport(800)
    const mostTouchListeners = trackTouchListeners()
    await renderSheet(['Comment'])
    await renderSheet(['Note'], { label: 'Add a note' })
    expect(__focusTakeoverCallersForTest(document)).toBe(2)
    expect(mostTouchListeners()).toBe(1)
  })

  it('claims a transition between fields and delivers it with preventScroll', async () => {
    mockTouchPlatform()
    await renderSheet(['Title', 'Comment'])
    const title = field('Title')
    const comment = field('Comment')
    title.focus()
    const focus = vi.spyOn(comment, 'focus')

    // The keyboard's Next, Tab, and a programmatic focus() all arrive as this
    // one transition, named by relatedTarget on the outgoing blur.
    blur(title, comment)

    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('parks focus on the sheet when the keyboard Done button takes it', async () => {
    mockTouchPlatform()
    await renderSheet()
    const input = field('Comment')
    input.focus()
    const sheetFocus = vi.spyOn(getSheet(), 'focus')

    // Left on the body, the field is still document.activeElement on the
    // next tap, so no transition fires. Parked on the sheet, the next tap is
    // one the sheet claims.
    blur(input, null)

    expect(sheetFocus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('does not park focus on a sheet that is closing', async () => {
    mockTouchPlatform()
    const wrapper = await renderSheet()
    const input = field('Comment')
    input.focus()
    const sheetFocus = vi.spyOn(getSheet(), 'focus')

    await wrapper.setProps({ isOpen: false })

    expect(sheetFocus).not.toHaveBeenCalled()
  })

  it('leaves focus to desktop Safari and Firefox, which measure but have a fine pointer', async () => {
    mockVisualViewport(800)
    mockWindowHeight(800)
    await renderSheet(['Title', 'Comment'])
    const title = field('Title')
    const comment = field('Comment')
    title.focus()
    const commentFocus = vi.spyOn(comment, 'focus')
    const sheetFocus = vi.spyOn(getSheet(), 'focus')

    blur(title, comment)
    expect(commentFocus).not.toHaveBeenCalled()
    blur(title, null)
    expect(sheetFocus).not.toHaveBeenCalled()
  })

  it('does not add clearance or scroll when the viewport is unobstructed', async () => {
    mockVisualViewport(800)
    mockWindowHeight(800)
    await renderSheet()
    const { body, input } = layOut('Comment', 760)

    input.focus()

    expect(keyboardInsetOf(body)).toBe(0)
    expect(body.scrollTop).toBe(0)
  })

  it('lays out no keyboard room when the body overhangs the viewport by a fraction of a pixel', async () => {
    // Chrome for Android's visual viewport can be 0.3 px taller than the
    // layout viewport. A sheet sized to it ends that far below it.
    mockTouchPlatform()
    mockWindowHeight(800)
    mockVisualViewport(800.3)
    await renderSheet()
    const { body, input } = layOut('Comment', 700, { bottom: 800.3 })
    const scrollBy = vi.fn()
    Object.defineProperty(body, 'scrollBy', { configurable: true, value: scrollBy })

    input.focus()

    expect(keyboardInsetOf(body)).toBe(0)
    expect(scrollBy).not.toHaveBeenCalled()
  })

  it('keeps Tall geometry fixed while extending and cleaning up its internal scroll range', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    await renderSheet()
    const sheet = getSheet()
    const { body, input } = layOut('Comment', 660)

    input.focus()

    expect(sheet.style.height).toBe('')
    expect(sheet.style.getPropertyValue('--_sheet-budget')).toBe('92dvh')
    // 300px keyboard overlap + 48px room for Android suggestion UI.
    expect(keyboardInsetOf(body)).toBe(348)
    // Visible bottom is 500px; preserve the same 48px focus gap.
    expect(body.scrollTop).toBe(248)

    viewport.height = 800
    resize(viewport)
    expect(keyboardInsetOf(body)).toBe(0)
    expect(body.scrollTop).toBe(0)
    expect(sheet.style.height).toBe('')
  })

  it('restores a top field when interactive keyboard dismissal leaves only the accessory bar', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    await renderSheet(['Search'])
    const { body, input } = layOut('Search', 150)

    input.focus()
    expect(keyboardInsetOf(body)).toBe(348)
    expect(body.scrollTop).toBe(0)

    // The main keyboard has gone, but its accessory bar still shortens the
    // visual viewport.
    body.scrollTop = 300
    viewport.height = 720
    resize(viewport)

    expect(body.scrollTop).toBe(0)
    expect(keyboardInsetOf(body)).toBe(128)

    // Later layout work at the same height keeps the person's scrolling, only
    // clamped to keep the focused top field visible.
    body.scrollTop = 80
    window.dispatchEvent(new Event('resize'))
    expect(body.scrollTop).toBe(50)
  })

  it('re-reveals a later focused field after full keyboard recovery restores the opening scroll position', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    await renderSheet(['First', 'Later'])
    const body = getBody()
    instantScrollBy(body)
    const { input: first } = layOut('First', 150)
    const { input: later } = layOut('Later', 860)

    first.focus()
    expect(body.scrollTop).toBe(0)
    later.focus()
    expect(body.scrollTop).toBe(448)

    viewport.height = 800
    resize(viewport)

    expect(keyboardInsetOf(body)).toBe(0)
    // Cleanup restores 0, then the unobstructed pass reveals the still
    // focused later field at the bottom of the 100 to 800 body.
    expect(body.scrollTop).toBe(100)
  })

  it('retains the accommodated body scroll through partial viewport recovery while focus is leaving', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    await renderSheet()
    const body = getBody()
    instantScrollBy(body)
    const { input } = layOut('Comment', 660)

    input.focus()
    expect(body.scrollTop).toBe(248)
    input.blur()
    viewport.height = 720
    resize(viewport)

    expect(body.scrollTop).toBe(248)
    expect(keyboardInsetOf(body)).toBe(128)

    viewport.height = 800
    resize(viewport)
    expect(body.scrollTop).toBe(0)
    expect(keyboardInsetOf(body)).toBe(0)
  })

  it('lays out the keyboard room in Chrome on Android, which has its own keyboard geometry API', async () => {
    mockKeyboardGeometryApi()
    mockPrimaryPointer('coarse')
    mockWindowHeight(800)
    mockVisualViewport(500)
    await renderSheet()
    const { body, input } = layOut('Comment', 300)

    input.focus()

    expect(keyboardInsetOf(body)).toBe(348)
  })

  it('makes no keyboard room for a sheet that is not Tall', async () => {
    mockWindowHeight(800)
    mockVisualViewport(500)
    await renderSheet(['Comment'], { height: 'capped' })
    const { body, input } = layOut('Comment', 660)

    input.focus()

    expect(keyboardInsetOf(body)).toBe(0)
    expect(body.scrollTop).toBe(0)
  })

  it('re-reveals a focused Tall control when content layout changes', async () => {
    mockWindowHeight(800)
    mockVisualViewport(500)
    const wrapper = await renderSheet()
    const body = getBody()
    const input = field('Comment')
    let layoutShift = 0
    vi.spyOn(body, 'getBoundingClientRect').mockReturnValue(rect({ top: 100, bottom: 800 }))
    vi.spyOn(input, 'getBoundingClientRect').mockImplementation(() =>
      rect({ top: 660 + layoutShift - body.scrollTop, bottom: 700 + layoutShift - body.scrollTop }),
    )

    input.focus()
    expect(body.scrollTop).toBe(248)

    // Content added above the field pushes it down.
    layoutShift = 200
    await wrapper.setProps({ label: 'Add a longer comment' })
    input.before(document.createElement('p'))
    await flushPromises()

    expect(body.scrollTop).toBe(448)
  })

  it('retains Tall keyboard scroll space after blur until the viewport recovers', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    await renderSheet()
    const { body, input } = layOut('Comment', 660)
    input.focus()
    expect(keyboardInsetOf(body)).toBe(348)

    input.blur()
    expect(keyboardInsetOf(body)).toBe(348)

    viewport.height = 800
    resize(viewport)
    expect(keyboardInsetOf(body)).toBe(0)
  })

  it('blurs the focused Tall field on close and retains its inset until the viewport recovers', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    const wrapper = await renderSheet()
    const { body, input } = layOut('Comment', 660)
    input.focus()
    expect(keyboardInsetOf(body)).toBe(348)
    // The exit's slide runs, which a stylesheet-free test has none of.
    getSheet().style.transitionProperty = 'transform, opacity'
    getSheet().style.transitionDuration = '300ms'

    await wrapper.setProps({ isOpen: false })

    expect(document.activeElement).not.toBe(input)
    expect(keyboardInsetOf(body)).toBe(348)

    viewport.height = 800
    resize(viewport)
    expect(keyboardInsetOf(body)).toBe(0)
  })

  it('dismisses the keyboard as a drag starts to move the sheet, retaining the inset until the viewport recovers', async () => {
    mockWindowHeight(800)
    const viewport = mockVisualViewport(500)
    await renderSheet()
    const sheet = getSheet()
    vi.spyOn(sheet, 'getBoundingClientRect').mockReturnValue(rect({ top: 0, bottom: 800 }))
    const { body, input } = layOut('Comment', 660)
    input.focus()
    expect(body.scrollTop).toBe(248)
    expect(keyboardInsetOf(body)).toBe(348)

    const handle = sheet.querySelector('.astryx-bottom-sheet__handle') as Element
    handle.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientY: 0, pointerId: 1, button: 0, isPrimary: true, pointerType: 'mouse' }))
    expect(document.activeElement).toBe(input)

    window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientY: 40, pointerId: 1, pointerType: 'mouse' }))

    expect(document.activeElement).toBe(sheet)
    expect(keyboardInsetOf(body)).toBe(348)
    expect(body.scrollTop).toBe(248)

    viewport.height = 800
    resize(viewport)
    expect(keyboardInsetOf(body)).toBe(0)
  })

  it('puts back a document scroll the browser makes to reveal a field', async () => {
    mockWindowHeight(800)
    mockVisualViewport(377)
    await renderSheet()
    const body = getBody()
    const input = field('Comment')
    vi.spyOn(body, 'getBoundingClientRect').mockReturnValue(rect({ top: 57, bottom: 714 }))
    vi.spyOn(input, 'getBoundingClientRect').mockImplementation(() =>
      rect({ top: 600 - body.scrollTop, bottom: 640 - body.scrollTop }),
    )
    input.focus()
    const scrollTo = vi.mocked(window.scrollTo)
    scrollTo.mockClear()
    const scrolledBy = body.scrollTop

    // The browser reveals a focused field in a scroll-locked, fixed sheet by
    // scrolling the document, and the fixed sheet travels with it.
    vi.stubGlobal('scrollY', 337)
    body.dispatchEvent(new Event('scroll'))
    expect(scrollTo).not.toHaveBeenCalled()
    window.dispatchEvent(new Event('scroll'))

    expect(scrollTo).toHaveBeenCalledWith(0, 0)
    expect(input.getBoundingClientRect().bottom).toBeLessThanOrEqual(377 - 48)
    expect(body.scrollTop).toBe(scrolledBy)
  })

  it('leaves the document alone when no keyboard is measured', async () => {
    mockWindowHeight(800)
    mockVisualViewport(800)
    await renderSheet()
    const { input } = layOut('Comment', 600, { bodyTop: 57, bottom: 700 })
    input.focus()
    const scrollTo = vi.mocked(window.scrollTo)
    scrollTo.mockClear()

    vi.stubGlobal('scrollY', 120)
    window.dispatchEvent(new Event('scroll'))

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('leaves the page alone behind a non-modal sheet', async () => {
    mockWindowHeight(800)
    mockVisualViewport(500)
    await renderSheet(['Comment'], { hasScrim: false })
    const { input } = layOut('Comment', 600)
    input.focus()
    const scrollTo = vi.mocked(window.scrollTo)
    scrollTo.mockClear()

    // Without a scrim the page behind stays scrollable, so a document scroll
    // is the user's.
    vi.stubGlobal('scrollY', 200)
    window.dispatchEvent(new Event('scroll'))

    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('clears the inset when the sheet unmounts', async () => {
    mockWindowHeight(800)
    mockVisualViewport(500)
    const wrapper = await renderSheet()
    const { body, input } = layOut('Comment', 660)
    input.focus()
    expect(keyboardInsetOf(body)).toBe(348)

    wrapper.unmount()

    expect(keyboardInsetOf(body)).toBe(0)
  })
})
