import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import { useKeyboardHint } from './useKeyboardHint.js'

const matches = HTMLElement.prototype.matches

afterEach(() => {
  HTMLElement.prototype.matches = matches
  vi.useRealTimers()
})

describe('useKeyboardHint', () => {
  it('shows a hint on keyboard focus and hides it after an arrow key', async () => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector: string) {
      if (selector === ':focus-visible')
        return true
      return matches.call(this, selector)
    } as HTMLElement['matches'])
    const Host = defineComponent({
      setup() {
        return useKeyboardHint({ dismissAfterMs: 5000 })
      },
      template: `
        <div @focusin="onFocus" @focusout="onBlur" @keydown="onKeyDown">
          <button type="button">One</button>
          <component :is="Hint" />
        </div>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const button = wrapper.get('button').element
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(true)

    await wrapper.get('div').trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(false)
    wrapper.unmount()
  })

  it('焦点离开这一组之后不再为同一个实例重放', async () => {
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector: string) {
      if (selector === ':focus-visible')
        return true
      return matches.call(this, selector)
    } as HTMLElement['matches'])
    const Host = defineComponent({
      setup() {
        return useKeyboardHint({ dismissAfterMs: 5000 })
      },
      template: `
        <div @focusin="onFocus" @focusout="onBlur">
          <button type="button">One</button>
          <component :is="Hint" />
        </div>
      `,
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const button = wrapper.get('button').element
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(true)

    button.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(false)

    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(false)
    wrapper.unmount()
  })

  it('没有时限时提示一直停留，设了时限才自己消失', async () => {
    vi.useFakeTimers()
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector: string) {
      if (selector === ':focus-visible')
        return true
      return matches.call(this, selector)
    } as HTMLElement['matches'])
    const make = (options: { dismissAfterMs?: number }) => mount(defineComponent({
      setup() {
        return useKeyboardHint(options)
      },
      template: `
        <div @focusin="onFocus" @focusout="onBlur">
          <button type="button">One</button>
          <component :is="Hint" />
        </div>
      `,
    }), { attachTo: document.body })

    const untimed = make({})
    untimed.get('button').element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(60_000)
    expect(untimed.get('.astryx-keyboard-hint').isVisible()).toBe(true)
    untimed.unmount()

    const timed = make({ dismissAfterMs: 1000 })
    timed.get('button').element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await vi.advanceTimersByTimeAsync(0)
    expect(timed.get('.astryx-keyboard-hint').isVisible()).toBe(true)
    await vi.advanceTimersByTimeAsync(1000)
    expect(timed.get('.astryx-keyboard-hint').isVisible()).toBe(false)
    timed.unmount()
  })

  it('escape 只关提示，焦点不动，也不会再重放', async () => {
    vi.spyOn(HTMLElement.prototype, 'matches').mockImplementation(function (this: HTMLElement, selector: string) {
      if (selector === ':focus-visible')
        return true
      return matches.call(this, selector)
    } as HTMLElement['matches'])
    const wrapper = mount(defineComponent({
      setup() {
        return useKeyboardHint()
      },
      template: `
        <div @focusin="onFocus" @focusout="onBlur">
          <button type="button">One</button>
          <component :is="Hint" />
        </div>
      `,
    }), { attachTo: document.body })
    const button = wrapper.get('button').element
    button.focus()
    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    await nextTick()
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(true)

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await nextTick()
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(false)
    expect(document.activeElement).toBe(button)

    button.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    await nextTick()
    expect(wrapper.get('.astryx-keyboard-hint').isVisible()).toBe(false)
    wrapper.unmount()
  })
})
