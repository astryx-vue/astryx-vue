import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './mountComposable.js'
import { useLongPress } from './useLongPress.js'

describe('useLongPress', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('按住超过延时后，用按下时的坐标触发', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const { result } = mountComposable(() => useLongPress({
      isDisabled: () => false,
      onLongPress,
      delayMs: 500,
    }))

    result.start({ x: 12, y: 20 })
    vi.advanceTimersByTime(499)
    expect(onLongPress).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(onLongPress).toHaveBeenCalledExactlyOnceWith({ x: 12, y: 20 })
  })

  it('手指移动超出容差就取消，容差内仍然算按住', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const { result } = mountComposable(() => useLongPress({
      isDisabled: () => false,
      moveCancelPx: 10,
      onLongPress,
    }))

    result.start({ x: 0, y: 0 })
    expect(result.moveTo({ x: 10, y: 0 })).toBe(true)
    expect(result.moveTo({ x: 11, y: 0 })).toBe(false)
    vi.advanceTimersByTime(500)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('提前取消、禁用、卸载都不会触发', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const disabled = ref(false)
    const { result, wrapper } = mountComposable(() => useLongPress({
      delayMs: 100,
      isDisabled: () => disabled.value,
      onLongPress,
    }))

    result.start({ x: 1, y: 1 })
    result.cancel()
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()

    disabled.value = true
    result.start({ x: 1, y: 1 })
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()

    disabled.value = false
    result.start({ x: 4, y: 5 })
    wrapper.unmount()
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('旧路径仍然导出同一个函数', async () => {
    const moved = await import('../ContextMenu/useLongPress.js')
    expect(moved.useLongPress).toBe(useLongPress)
  })
})
