import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useHotkeys } from './useHotkeys.js'

describe('useHotkeys', () => {
  it('fires mod as Ctrl outside an input and ignores the same key inside one', async () => {
    const onPress = vi.fn()
    const Host = defineComponent({
      setup() {
        useHotkeys([{ keys: 'mod+b', onPress }])
        return () => h('input', { type: 'text' })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()

    window.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'b' }))
    expect(onPress).toHaveBeenCalledOnce()

    const input = wrapper.get('input').element
    input.focus()
    input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, key: 'b' }))
    expect(onPress).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
