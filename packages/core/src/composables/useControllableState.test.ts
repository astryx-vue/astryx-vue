import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { useControllableState } from './useControllableState.js'

describe('useControllableState', () => {
  it('没人管时用默认值，setValue 只改自己的那份', () => {
    const modelValue = ref<string | undefined>(undefined)
    const onChange = vi.fn()
    const state = useControllableState({ defaultValue: '草稿', modelValue, onChange })

    expect(state.isControlled.value).toBe(false)
    expect(state.value.value).toBe('草稿')

    state.setValue('草稿')
    expect(onChange).not.toHaveBeenCalled()

    state.setValue('定稿')
    expect(state.value.value).toBe('定稿')
    expect(modelValue.value).toBeUndefined()
    expect(onChange).toHaveBeenCalledExactlyOnceWith('定稿')
  })

  it('外面传了值就跟着外面，setValue 写回 model', () => {
    const modelValue = ref<string | undefined>('开')
    const onChange = vi.fn()
    const state = useControllableState({ defaultValue: '关', modelValue, onChange })

    expect(state.isControlled.value).toBe(true)
    expect(state.value.value).toBe('开')

    modelValue.value = '又开'
    expect(state.value.value).toBe('又开')

    state.setValue('关')
    expect(modelValue.value).toBe('关')
    expect(state.value.value).toBe('关')
    expect(onChange).toHaveBeenCalledExactlyOnceWith('关')
  })

  it('setup 时没传值，之后外面补上也不改口', () => {
    const modelValue = ref<number | undefined>(undefined)
    const state = useControllableState({ defaultValue: 1, modelValue })

    state.setValue(2)
    modelValue.value = 9
    expect(state.isControlled.value).toBe(false)
    expect(state.value.value).toBe(2)
  })
})
