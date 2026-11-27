/**
 * ChatLayout and the on-screen keyboard: the dock's lift, the message area's
 * room, the transcript kept at its newest message, and the dock's ride down
 * at a blur in Chrome on Android.
 */

import type { KeyboardTestDouble } from '../keyboard/__tests__/keyboardTestDouble'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { installKeyboardTestDouble } from '../keyboard/__tests__/keyboardTestDouble'
import { getKeyboardLayoutGuide } from '../keyboard/keyboardLayoutGuide'
import ChatLayout from './ChatLayout.vue'

enableAutoUnmount(afterEach)

let keyboard: KeyboardTestDouble

// The browser dates events on performance.now()'s clock, which the keyboard
// guide reads them against.
beforeEach(() => {
  vi.spyOn(Event.prototype, 'timeStamp', 'get').mockImplementation(() => performance.now())
})

afterEach(() => {
  keyboard?.restore()
  Reflect.deleteProperty(navigator, 'virtualKeyboard')
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

function layoutOf(): HTMLElement {
  return document.querySelector<HTMLElement>('.astryx-chat-layout')!
}

function dockOf(): HTMLElement {
  return document.querySelector<HTMLElement>('.astryx-chat-layout__dock')!
}

function messagesOf(): HTMLElement {
  return document.querySelector<HTMLElement>('.astryx-chat-layout__messages')!
}

// The lift the dock is laid out with, CSS px: its `bottom`.
function layoutLift(): number {
  return Number.parseFloat(dockOf().style.bottom) || 0
}

// The room the message area's end padding makes for the keyboard, CSS px.
function keyboardRoom(): number {
  const match = /\+\s*(-?[\d.]+)px\)/.exec(messagesOf().style.paddingBlockEnd)
  return match == null ? 0 : Number(match[1])
}

async function renderLayout(): Promise<void> {
  mount(ChatLayout, {
    attachTo: document.body,
    slots: {
      default: () => h('p', 'Hello'),
      composer: () => h('textarea', { 'aria-label': 'Message' }),
    },
  })
  // No layout here: the root fills the viewport, as a full-page chat does.
  layoutOf().getBoundingClientRect = () => new DOMRect(0, 0, window.innerWidth, window.innerHeight)
  // The stream scroll attaches once the root's ref is in.
  await nextTick()
}

// Chrome on Android: the guide publishes Gboard's slides where the browser
// has the VirtualKeyboard API.
function stubChromeKeyboard(): void {
  Object.defineProperty(navigator, 'virtualKeyboard', {
    configurable: true,
    value: { overlaysContent: false },
  })
}

const sleep = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

// Lets a ride end and its end reach the layout. The guide publishes a
// report's transition within a few frames, then checks it a while after its
// curve ends.
async function settle(): Promise<void> {
  for (let i = 0; i < 4; i++) {
    keyboard.frame()
    await sleep(20)
  }
  const { start, curve } = getKeyboardLayoutGuide(window).transition
  const checked = start + (curve?.durationMs ?? 0) + 200
  await vi.waitFor(() => {
    keyboard.frame()
    if (performance.now() < checked)
      throw new Error('still riding')
  }, { timeout: 3000, interval: 20 })
  await sleep(20)
  await nextTick()
}

// A transcript of 1,000 px in a 600 px root, plus the keyboard's room, that
// the reader scrolls to `top`. The stream scroll hears each scroll.
function scrolledTranscript(top: number): { readonly scrollTop: number } {
  const root = layoutOf()
  let scrollTop = 1000 - 600
  Object.defineProperties(root, {
    clientHeight: { configurable: true, get: () => 600 },
    offsetHeight: { configurable: true, get: () => 600 },
    scrollHeight: { configurable: true, get: () => 1000 + keyboardRoom() },
    scrollTop: {
      configurable: true,
      get: () => scrollTop,
      set: (value: number) => {
        scrollTop = value
      },
    },
  })
  // Past the mount's own first-frame scroll to the end.
  keyboard.frame()
  root.dispatchEvent(new Event('scroll'))
  scrollTop = top
  root.dispatchEvent(new Event('scroll'))
  root.dispatchEvent(new Event('scrollend'))
  return {
    get scrollTop() {
      return scrollTop
    },
  }
}

describe('chatLayout and the software keyboard', () => {
  it('rides nothing without the VirtualKeyboard API, as in Safari on iOS: the layout follows the height alone', async () => {
    keyboard = installKeyboardTestDouble()
    const subscribe = vi.spyOn(getKeyboardLayoutGuide(window), 'subscribe')
    await renderLayout()
    keyboard.show(300)
    expect(dockOf().style.translate).toBe('')
    await nextTick()
    expect(layoutLift()).toBe(300)
    expect(subscribe).not.toHaveBeenCalled()
  })

  it('attaches nothing of the ride under a fine pointer: the layout follows the height alone', async () => {
    keyboard = installKeyboardTestDouble({ coarse: false })
    stubChromeKeyboard()
    const subscribe = vi.spyOn(getKeyboardLayoutGuide(window), 'subscribe')
    await renderLayout()
    keyboard.show(300)
    await nextTick()
    expect(layoutLift()).toBe(300)
    expect(dockOf().style.translate).toBe('')
    expect(subscribe).not.toHaveBeenCalled()
  })

  it('lays the dock and the room after the messages out from the keyboard height', async () => {
    keyboard = installKeyboardTestDouble()
    await renderLayout()
    keyboard.show(300)
    await nextTick()
    expect(layoutLift()).toBe(300)
    expect(keyboardRoom()).toBe(300)
    expect(dockOf().style.translate).toBe('')
  })

  it('adds no element for the keyboard: the root holds the message area and the dock', async () => {
    keyboard = installKeyboardTestDouble()
    await renderLayout()
    keyboard.show(300)
    await nextTick()
    expect(layoutOf().children).toHaveLength(2)
  })

  it('keeps a transcript at its newest message there', async () => {
    keyboard = installKeyboardTestDouble()
    await renderLayout()
    const transcript = scrolledTranscript(1000 - 600)
    keyboard.show(300)
    await nextTick()
    expect(transcript.scrollTop).toBe(1300 - 600)
  })

  it('leaves a transcript the reader scrolled up where it is', async () => {
    keyboard = installKeyboardTestDouble()
    await renderLayout()
    const transcript = scrolledTranscript(100)
    keyboard.show(300)
    await nextTick()
    expect(transcript.scrollTop).toBe(100)
  })

  it('keeps a reader the stream scroll still follows, 5 px above the end, at the newest message', async () => {
    keyboard = installKeyboardTestDouble()
    await renderLayout()
    const transcript = scrolledTranscript(1000 - 600 - 5)
    keyboard.show(300)
    await nextTick()
    expect(transcript.scrollTop).toBe(1300 - 600)
  })

  it('rides the dock down from the blur, ahead of the layout, which follows the keyboard', async () => {
    keyboard = installKeyboardTestDouble()
    stubChromeKeyboard()
    await renderLayout()
    const field = document.querySelector<HTMLTextAreaElement>('textarea')!
    field.focus()
    keyboard.show(300)
    await settle()
    expect(layoutLift()).toBe(300)
    field.blur()
    await settle()
    // The keyboard is still up (no report yet): the layout keeps its lift,
    // and the ride has taken the dock down on top of it.
    expect(layoutLift()).toBe(300)
    expect(dockOf().style.translate).toBe('0px 300px')
    keyboard.hide()
    await settle()
    expect(layoutLift()).toBe(0)
    expect(keyboardRoom()).toBe(0)
    expect(dockOf().style.translate).toBe('')
  })

  it('keeps the lift when the page is pinch-zoomed past 2x with the keyboard up', async () => {
    keyboard = installKeyboardTestDouble()
    // WebKit reports innerWidth and innerHeight in the zoomed visual
    // viewport's px. At 2x, innerHeight alone reads no keyboard, and the dock
    // would drop under it.
    vi.stubGlobal('innerHeight', 714)
    vi.stubGlobal('innerWidth', 402)
    Object.assign(keyboard.viewport, { width: 402 })
    await renderLayout()
    layoutOf().getBoundingClientRect = () => new DOMRect(0, 0, 402, 714)
    keyboard.show(337)
    await nextTick()
    expect(layoutLift()).toBe(337)

    vi.stubGlobal('innerHeight', 357)
    vi.stubGlobal('innerWidth', 201)
    Object.assign(keyboard.viewport, { scale: 2, width: 201, height: (714 - 337) / 2 })
    keyboard.viewport.dispatchEvent(new Event('resize'))
    await nextTick()
    expect(layoutLift()).toBe(337)
    expect(keyboardRoom()).toBe(337)
  })

  it('moves nothing while no keyboard is up', async () => {
    keyboard = installKeyboardTestDouble()
    await renderLayout()
    keyboard.hide()
    await nextTick()
    expect(dockOf().style.translate).toBe('')
    expect(layoutLift()).toBe(0)
    expect(keyboardRoom()).toBe(0)
  })
})
