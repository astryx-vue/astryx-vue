import type { SelectorOption } from './types.js'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Selector from './Selector.vue'

const options: SelectorOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
]

function mountDisabled(handlers: { onClick?: () => void, onKeydown?: () => void, onAncestorClick?: () => void } = {}) {
  const wrapper = mount({
    render: () => h('div', { onClick: handlers.onAncestorClick }, [
      h(Selector, {
        'aria-label': 'Fruit',
        'disabled': true,
        'options': options,
        'onClick': handlers.onClick,
        'onKeydown': handlers.onKeydown,
      }),
    ]),
  }, { attachTo: document.body })
  return { wrapper, trigger: wrapper.get('.astryx-selector-trigger') }
}

describe('selector disabled trigger (spec:AST-085)', () => {
  it('stays focusable and reports aria-disabled', () => {
    const { wrapper, trigger } = mountDisabled()
    expect(trigger.attributes('disabled')).toBeUndefined()
    expect(trigger.attributes('aria-disabled')).toBe('true')

    ;(trigger.element as HTMLElement).focus()
    expect(document.activeElement).toBe(trigger.element)
    wrapper.unmount()
  })

  it('ignores pointer and key activation without leaking to callers or ancestors', async () => {
    const onClick = vi.fn()
    const onKeydown = vi.fn()
    const onAncestorClick = vi.fn()
    const { wrapper, trigger } = mountDisabled({ onClick, onKeydown, onAncestorClick })

    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(onClick).not.toHaveBeenCalled()
    expect(onAncestorClick).not.toHaveBeenCalled()

    for (const key of ['Enter', ' ', 'ArrowDown']) {
      await trigger.trigger('keydown', { key })
      expect(trigger.attributes('aria-expanded')).toBe('false')
    }
    expect(onKeydown).not.toHaveBeenCalled()

    wrapper.unmount()
  })
})
