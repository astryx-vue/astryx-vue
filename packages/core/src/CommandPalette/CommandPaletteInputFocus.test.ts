import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { resetInteractionModalityForTest } from '../composables/internal/interactionModality.js'
import CommandPaletteInput from './CommandPaletteInput.vue'

beforeEach(() => {
  resetInteractionModalityForTest()
})

describe('commandPaletteInput 焦点来源', () => {
  it('指针聚焦不画环，键盘聚焦显示标记，focus/blur 回调仍执行', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(CommandPaletteInput, {
      attachTo: document.body,
      props: { hasAutoFocus: false },
      attrs: { onFocus, onBlur },
    })
    const input = wrapper.get('input')

    await input.trigger('pointerdown')
    await input.trigger('focus')
    expect(input.attributes('data-keyboard-focus')).toBeUndefined()
    expect(onFocus).toHaveBeenCalledTimes(1)

    await input.trigger('blur')
    expect(onBlur).toHaveBeenCalledTimes(1)
    await input.trigger('keydown', { key: 'Tab' })
    await input.trigger('focus')
    expect(input.attributes('data-keyboard-focus')).toBe('')
    expect(onFocus).toHaveBeenCalledTimes(2)
  })
})
