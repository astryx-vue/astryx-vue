/**
 * ChatLayout's composer and the on-screen keyboard's focus routes: focus
 * moves into the composer without the browser's reveal, Done parks on the
 * composer group, the taps the composer claims, and a touch tap on a text
 * control composer.
 */

import type { KeyboardTestDouble } from '../keyboard/__tests__/keyboardTestDouble'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Fragment, h } from 'vue'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality'
import { installKeyboardTestDouble } from '../keyboard/__tests__/keyboardTestDouble'
import { __focusTakeoverCallersForTest } from '../keyboard/focusReveal'
import { __resetClickGuardForTest } from '../utils/clickGuard'
import ChatComposer from './ChatComposer.vue'
import { editableToClaim } from './chatKeyboardFocus'
import ChatLayout from './ChatLayout.vue'

enableAutoUnmount(afterEach)

let keyboard: KeyboardTestDouble | null = null

afterEach(() => {
  keyboard?.restore()
  keyboard = null
  __resetClickGuardForTest()
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

function layout(composer: () => unknown, attrs: Record<string, unknown> = {}) {
  return h(ChatLayout, attrs, {
    default: () => h('p', 'Hello'),
    composer,
  })
}

function renderWithSearch(composerText: 'textarea' | 'contenteditable') {
  mount({
    render: () => h(Fragment, [
      h('input', { 'aria-label': 'Search' }),
      layout(() => composerText === 'textarea'
        ? h('textarea', { 'aria-label': 'Message' })
        : h('div', { 'aria-label': 'Message', 'contenteditable': 'true', 'role': 'textbox' })),
    ]),
  }, { attachTo: document.body })
  return {
    search: document.querySelector<HTMLElement>('[aria-label="Search"]')!,
    message: document.querySelector<HTMLElement>('[aria-label="Message"]')!,
  }
}

function renderTwoLayouts(): void {
  mount({
    render: () => h(Fragment, [
      layout(() => h('textarea', { 'aria-label': 'First' })),
      layout(() => h('textarea', { 'aria-label': 'Second' })),
    ]),
  }, { attachTo: document.body })
}

function groups(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>('[role="group"]')]
}

describe('focus moves into the composer', () => {
  it('delivers a move from another field into the composer without the browser’s reveal', () => {
    keyboard = installKeyboardTestDouble()
    const { search, message } = renderWithSearch('textarea')
    search.focus()
    const focus = vi.spyOn(message, 'focus')
    // The keyboard's next button, Tab, or a script moving focus.
    message.focus()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.activeElement).toBe(message)
  })

  it('delivers a move into contenteditable composer text the same way', () => {
    keyboard = installKeyboardTestDouble()
    const { search, message } = renderWithSearch('contenteditable')
    search.focus()
    const focus = vi.spyOn(message, 'focus')
    message.focus()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('leaves focus moves to the browser under a mouse', () => {
    keyboard = installKeyboardTestDouble({ coarse: false })
    const { search, message } = renderWithSearch('textarea')
    search.focus()
    const focus = vi.spyOn(message, 'focus')
    message.focus()
    expect(focus).not.toHaveBeenCalledWith({ preventScroll: true })
  })

  it('moves focus to the composer group when the keyboard’s Done ends entry', () => {
    keyboard = installKeyboardTestDouble()
    const { message } = renderWithSearch('textarea')
    const [region] = groups()
    message.focus()
    const focus = vi.spyOn(region!, 'focus')
    // Done blurs the composer's text, and focus goes to nothing.
    message.blur()
    expect(document.activeElement).toBe(region)
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('shows the parked group’s focus ring only after keyboard input', () => {
    keyboard = installKeyboardTestDouble()
    resetInteractionModalityForTest()
    const { message } = renderWithSearch('textarea')
    const [region] = groups()
    // A tap on the text, then Done with nothing typed: no ring.
    message.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }))
    message.focus()
    message.blur()
    expect(document.activeElement).toBe(region)
    // happy-dom expands the shorthand, so read its first value.
    expect(region!.style.getPropertyValue('outline')).toMatch(/^none\b/)
    // The override leaves with the focus stop.
    message.focus()
    expect(region!.style.getPropertyValue('outline')).toBe('')
    // Typed, then Done: the shared ring applies.
    message.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'a' }))
    message.blur()
    expect(document.activeElement).toBe(region)
    expect(region!.style.getPropertyValue('outline')).toBe('')
    resetInteractionModalityForTest()
  })

  it('gives the composer group no name and no landmark, so two layouts on a page repeat none', () => {
    keyboard = installKeyboardTestDouble()
    renderTwoLayouts()
    expect(document.querySelectorAll('[role="region"]')).toHaveLength(0)
    expect(groups()).toHaveLength(2)
    for (const group of groups()) {
      expect(group.hasAttribute('aria-label')).toBe(false)
      expect(group.hasAttribute('aria-labelledby')).toBe(false)
    }
  })

  it('adds no tab stop for the composer region: it takes focus only for Done’s park, and gives the focus stop up as focus leaves', () => {
    keyboard = installKeyboardTestDouble()
    const { message } = renderWithSearch('textarea')
    const [region] = groups()
    expect(region!.hasAttribute('tabindex')).toBe(false)
    message.focus()
    message.blur()
    expect(document.activeElement).toBe(region)
    expect(region!.tabIndex).toBe(-1)
    message.focus()
    expect(document.activeElement).toBe(message)
    expect(region!.hasAttribute('tabindex')).toBe(false)
  })

  it('leaves the composer region a plain container under a mouse: no group, no name and no focus target', () => {
    keyboard = installKeyboardTestDouble({ coarse: false })
    const { message } = renderWithSearch('textarea')
    expect(groups()).toHaveLength(0)
    const root = document.querySelector('.astryx-chat-layout')
    const containers = (): Element[] => {
      const list: Element[] = []
      for (let element = message.parentElement; element != null && element !== root; element = element.parentElement)
        list.push(element)
      return list
    }
    expect(containers().filter(element =>
      element.hasAttribute('role') || element.hasAttribute('aria-label') || element.hasAttribute('tabindex'),
    )).toEqual([])
    message.focus()
    message.blur()
    expect(containers().filter(element => element.hasAttribute('tabindex'))).toEqual([])
  })

  it('leaves focus where the browser puts it when it moves on to another field', () => {
    keyboard = installKeyboardTestDouble()
    const { search, message } = renderWithSearch('textarea')
    message.focus()
    search.focus()
    expect(document.activeElement).toBe(search)
  })

  it('leaves a blur to nothing to the browser under a mouse', () => {
    keyboard = installKeyboardTestDouble({ coarse: false })
    const { message } = renderWithSearch('textarea')
    message.focus()
    message.blur()
    expect(document.activeElement).toBe(document.body)
  })

  it('registers no touch listener and installs no focus takeover under a mouse', () => {
    keyboard = installKeyboardTestDouble({ coarse: false })
    const touchTargets: EventTarget[] = []
    const addEventListener = EventTarget.prototype.addEventListener
    vi.spyOn(EventTarget.prototype, 'addEventListener').mockImplementation(function (this: EventTarget, type, listener, options) {
      if (type.startsWith('touch'))
        touchTargets.push(this)
      addEventListener.call(this, type, listener, options)
    })
    renderWithSearch('textarea')
    const root = document.querySelector('.astryx-chat-layout')!
    expect(touchTargets.filter(target => target instanceof Node && root.contains(target))).toEqual([])
    expect(__focusTakeoverCallersForTest(document)).toBe(0)
  })

  it('installs the focus takeover for each ChatLayout under a finger, through the keyboard module’s one listener', () => {
    keyboard = installKeyboardTestDouble()
    renderTwoLayouts()
    expect(__focusTakeoverCallersForTest(document)).toBe(2)
  })
})

describe('the taps the composer claims', () => {
  it('claims a touch on unfocused contenteditable text', () => {
    document.body.innerHTML = '<div contenteditable="true" id="editor"><p><span id="word">Hello</span></p></div>'
    expect(editableToClaim(document.getElementById('word'))).toBe(document.getElementById('editor'))
  })

  it('leaves a control inside a token its own tap', () => {
    document.body.innerHTML = '<div contenteditable="true"><p>Hi <span contenteditable="false" data-astryx-token=""><button id="remove">×</button><span id="label">@Ada</span></span></p></div>'
    expect(editableToClaim(document.getElementById('remove'))).toBeNull()
    expect(editableToClaim(document.getElementById('label'))).toBeNull()
  })

  it('claims an unfocused text control too, whose own tap focus the browser would reveal', () => {
    document.body.innerHTML = '<textarea id="draft">A long draft</textarea><input id="line" value="One line"><input id="box" type="checkbox"><textarea id="still" inputmode="none"></textarea>'
    const draft = document.getElementById('draft')
    expect(editableToClaim(draft)).toBe(draft)
    const line = document.getElementById('line')
    expect(editableToClaim(line)).toBe(line)
    // Nothing that brings up no keyboard.
    expect(editableToClaim(document.getElementById('box'))).toBeNull()
    expect(editableToClaim(document.getElementById('still'))).toBeNull()
    // A focused one keeps its own taps: the browser moves the caret.
    draft?.focus()
    expect(editableToClaim(draft)).toBeNull()
  })

  it('claims nothing that already has focus', () => {
    document.body.innerHTML = '<div contenteditable="true" id="editor"><p id="text">Hello</p></div>'
    document.getElementById('editor')!.focus()
    expect(editableToClaim(document.getElementById('text'))).toBeNull()
  })
})

describe('a text control composer tapped with nothing focused', () => {
  // A touch event as the browser raises it, at the given points.
  function touch(type: string, points: Array<{ x: number, y: number }>): Event {
    const event = new Event(type, { bubbles: true, cancelable: true })
    const list = points.map((p, identifier) => ({ identifier, clientX: p.x, clientY: p.y, screenX: p.x, screenY: p.y }))
    Object.assign(event, { touches: type === 'touchend' ? [] : list, changedTouches: list })
    return event
  }

  function renderComposer(onClick?: () => void): HTMLTextAreaElement {
    mount({
      render: () => layout(() => h(ChatComposer, { onSubmit: () => {} }, {
        input: () => h('textarea', { 'aria-label': 'Message', onClick }),
      })),
    }, { attachTo: document.body })
    return document.querySelector<HTMLTextAreaElement>('[aria-label="Message"]')!
  }

  it('is focused without the browser’s reveal, as a contenteditable composer is', () => {
    keyboard = installKeyboardTestDouble()
    const textarea = renderComposer()
    expect(document.activeElement).not.toBe(textarea)
    const focus = vi.spyOn(textarea, 'focus')
    const end = touch('touchend', [{ x: 10, y: 10 }])
    textarea.dispatchEvent(touch('touchstart', [{ x: 10, y: 10 }]))
    textarea.dispatchEvent(end)
    expect(end.defaultPrevented).toBe(true)
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(document.activeElement).toBe(textarea)
  })

  it('raises the claimed tap’s click once, so a caller’s click handler still runs', () => {
    keyboard = installKeyboardTestDouble()
    const onClick = vi.fn()
    const textarea = renderComposer(onClick)
    // The route cancels the tap's touchend, so the browser raises no click.
    const end = touch('touchend', [{ x: 10, y: 10 }])
    textarea.dispatchEvent(touch('touchstart', [{ x: 10, y: 10 }]))
    textarea.dispatchEvent(end)
    expect(end.defaultPrevented).toBe(true)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('the composer’s own click-to-focus', () => {
  function renderComposer(inLayout: boolean): HTMLElement {
    const composer = () => h(ChatComposer, { onSubmit: () => {} }, {
      input: () => h('div', { 'contenteditable': 'true', 'aria-label': 'Message' }),
    })
    mount({ render: () => inLayout ? layout(composer) : composer() }, { attachTo: document.body })
    return document.querySelector<HTMLElement>('[aria-label="Message"]')!
  }

  it('focuses the text without the browser’s reveal inside ChatLayout under a finger', () => {
    keyboard = installKeyboardTestDouble()
    const editable = renderComposer(true)
    const focus = vi.spyOn(editable, 'focus')
    document.querySelector<HTMLElement>('.astryx-chat-composer__body')!.click()
    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
  })

  it('keeps the browser’s own focus outside ChatLayout', () => {
    keyboard = installKeyboardTestDouble()
    const editable = renderComposer(false)
    const focus = vi.spyOn(editable, 'focus')
    document.querySelector<HTMLElement>('.astryx-chat-composer__body')!.click()
    expect(focus).toHaveBeenCalled()
    expect(focus).not.toHaveBeenCalledWith({ preventScroll: true })
  })
})
