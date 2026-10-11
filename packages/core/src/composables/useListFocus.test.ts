import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useListFocus } from './useListFocus.js'

function mountList() {
  const Host = defineComponent({
    setup() {
      const { listRef, handleKeyDown } = useListFocus({
        hasRovingTabIndex: true,
        itemSelector: 'button',
        orientation: 'horizontal',
      })
      return () => h('div', {
        ref: listRef,
        role: 'toolbar',
        onKeydown: handleKeyDown,
      }, [
        h('button', { type: 'button' }, 'Bold'),
        h('button', { type: 'button' }, 'Italic'),
        h('button', { type: 'button' }, 'Link'),
      ])
    },
  })
  return mount(Host, { attachTo: document.body })
}

describe('useListFocus', () => {
  it('moves focus with the arrow keys and wraps', async () => {
    const wrapper = mountList()
    const buttons = wrapper.findAll('button')
    await nextTick()
    expect(buttons[0].attributes('tabindex')).toBe('0')
    expect(buttons[1].attributes('tabindex')).toBe('-1')

    buttons[0].element.focus()
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[1].element)

    await buttons[1].trigger('keydown', { key: 'End' })
    expect(document.activeElement).toBe(buttons[2].element)

    await buttons[2].trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(buttons[0].element)
    wrapper.unmount()
  })

  it('skips disabled items', async () => {
    const Host = defineComponent({
      setup() {
        const { listRef, handleKeyDown } = useListFocus({
          itemSelector: '[role="menuitem"]',
          orientation: 'vertical',
        })
        return () => h('div', { ref: listRef, onKeydown: handleKeyDown }, [
          h('button', { role: 'menuitem', type: 'button' }, 'First'),
          h('button', { 'aria-disabled': 'true', 'role': 'menuitem', 'type': 'button' }, 'Skip'),
          h('button', { role: 'menuitem', type: 'button' }, 'Last'),
        ])
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    const items = wrapper.findAll('[role="menuitem"]')
    ;(items[0].element as HTMLElement).focus()
    await items[0].trigger('keydown', { key: 'ArrowDown' })
    expect(document.activeElement).toBe(items[2].element)
    wrapper.unmount()
  })
})
