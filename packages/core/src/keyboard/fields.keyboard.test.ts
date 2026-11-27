/**
 * TextInput, TextArea and NumberInput keep their focused field above the
 * on-screen keyboard with no prop: the field's scroller reveals it in the
 * keyboard's report, a fixed bar at the viewport's bottom rides with it, and
 * nothing attaches under a mouse.
 */

import type { Component, VNode } from 'vue'
import type { KeyboardTestDouble } from './__tests__/keyboardTestDouble'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { animatorFor } from '../motion/animator'
import NumberInput from '../NumberInput/NumberInput.vue'
import TextArea from '../TextArea/TextArea.vue'
import TextInput from '../TextInput/TextInput.vue'
import { act, installKeyboardTestDouble } from './__tests__/keyboardTestDouble'
import { FIELD_OFFSET } from './keyboardGeometry'

enableAutoUnmount(afterEach)

let keyboard: KeyboardTestDouble | null = null

afterEach(() => {
  keyboard?.restore()
  keyboard = null
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

// A box at `top`, moved by the bar's ride as a browser draws it.
function boxAt(element: Element, top: number, height: number): void {
  vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => {
    const bar = element.closest<HTMLElement>('[data-bar]')
    const match = /^\S+\s+(-?[\d.]+)px/.exec(bar?.style.translate ?? '')
    const y = match == null ? 0 : Number(match[1])
    return new DOMRect(0, top + y, 300, height)
  })
}

interface FieldCase {
  name: string
  component: Component
  modelValue: string | number | null
  selector: string
}

const FIELDS: FieldCase[] = [
  { name: 'TextInput', component: TextInput, modelValue: '', selector: '.astryx-text-input-control' },
  { name: 'TextArea', component: TextArea, modelValue: '', selector: '.astryx-text-area-control' },
  { name: 'NumberInput', component: NumberInput, modelValue: null, selector: '.astryx-number-input-field' },
]

describe.each(FIELDS)('$name above the keyboard', ({ component, modelValue, selector }) => {
  function render(props: Record<string, unknown> = {}, wrap?: (field: () => VNode) => VNode): HTMLElement {
    const field = () => h(component, { label: 'Notes', modelValue, ...props })
    mount({ render: () => (wrap == null ? field() : wrap(field)) }, { attachTo: document.body })
    return document.querySelector<HTMLElement>(selector)!
  }

  it('scrolls the page in the keyboard report until the focused field sits above it', () => {
    keyboard = installKeyboardTestDouble()
    const scrollBy = vi.fn()
    vi.stubGlobal('scrollBy', scrollBy)
    const field = render()
    boxAt(field, 660, 40)
    act(() => field.focus())
    keyboard.show(300)
    expect(scrollBy).toHaveBeenCalledWith({
      top: 700 + FIELD_OFFSET - (window.innerHeight - 300),
      behavior: 'instant',
    })
  })

  it('keeps a field focused as it mounts (hasAutoFocus) above the keyboard', () => {
    keyboard = installKeyboardTestDouble()
    const scrollBy = vi.fn()
    vi.stubGlobal('scrollBy', scrollBy)
    const field = render({ hasAutoFocus: true })
    expect(document.activeElement).toBe(field)
    boxAt(field, 660, 40)
    keyboard.show(300)
    expect(scrollBy).toHaveBeenCalledWith({
      top: 700 + FIELD_OFFSET - (window.innerHeight - 300),
      behavior: 'instant',
    })
  })

  it('rides an app\'s fixed bar at the viewport\'s bottom with the focused field, and brings it back once the keyboard goes', () => {
    keyboard = installKeyboardTestDouble()
    const bottom = window.innerHeight
    const field = render({}, inner => h('div', { 'data-bar': '', 'style': { position: 'fixed' } }, [inner()]))
    const bar = document.querySelector<HTMLElement>('[data-bar]')!
    boxAt(bar, bottom - 72, 72)
    boxAt(field, bottom - 56, 40)
    act(() => field.focus())
    keyboard.show(300)
    // The bar moves by the part of it the keyboard covers, so its bottom
    // meets the keyboard's top.
    expect(animatorFor(bar).get('y')).toBe(-300)
    act(() => field.blur())
    keyboard.hide()
    expect(animatorFor(bar).get('y')).toBe(0)
  })

  it('attaches nothing under a mouse or a trackpad', () => {
    keyboard = installKeyboardTestDouble({ coarse: false })
    const scrollBy = vi.fn()
    vi.stubGlobal('scrollBy', scrollBy)
    const field = render()
    boxAt(field, 660, 40)
    act(() => field.focus())
    keyboard.show(300)
    expect(scrollBy).not.toHaveBeenCalled()
  })
})
