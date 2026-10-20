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
})
