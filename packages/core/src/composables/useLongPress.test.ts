import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { useLongPress } from './useLongPress.js'

function touchEvent(points: Array<{ x: number, y: number }>): TouchEvent {
  const touches = points.map(point => ({ clientX: point.x, clientY: point.y }))
  return { changedTouches: touches, touches } as unknown as TouchEvent
}

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

  it('disabled 是 isDisabled 的另一个名字，任一为真就停用', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const { result } = mountComposable(() => useLongPress({
      delayMs: 100,
      disabled: () => true,
      onLongPress,
    }))

    result.start({ x: 1, y: 1 })
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('摊到元素上的触摸处理函数按触摸事件走', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const { result } = mountComposable(() => useLongPress({ delayMs: 100, onLongPress }))

    result.handlers.onTouchStart(touchEvent([{ x: 8, y: 9 }]))
    vi.advanceTimersByTime(100)
    expect(onLongPress).toHaveBeenCalledExactlyOnceWith({ x: 8, y: 9 })
  })

  it('触摸移动超出容差、抬起、第二根手指都会取消', () => {
    vi.useFakeTimers()
    const onLongPress = vi.fn()
    const { result } = mountComposable(() => useLongPress({ delayMs: 100, moveCancelPx: 10, onLongPress }))

    result.handlers.onTouchStart(touchEvent([{ x: 0, y: 0 }]))
    result.handlers.onTouchMove(touchEvent([{ x: 0, y: 40 }]))
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()

    result.handlers.onTouchStart(touchEvent([{ x: 0, y: 0 }]))
    result.handlers.onTouchEnd(touchEvent([]))
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()

    result.handlers.onTouchStart(touchEvent([{ x: 0, y: 0 }, { x: 50, y: 50 }]))
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()

    // 按到一半第二根手指落下，也取消。
    result.handlers.onTouchStart(touchEvent([{ x: 0, y: 0 }]))
    result.handlers.onTouchMove(touchEvent([{ x: 0, y: 0 }, { x: 50, y: 50 }]))
    vi.advanceTimersByTime(100)
    expect(onLongPress).not.toHaveBeenCalled()
  })

  it('旧路径仍然导出同一个函数', async () => {
    const moved = await import('../ContextMenu/useLongPress.js')
    expect(moved.useLongPress).toBe(useLongPress)
  })
})
