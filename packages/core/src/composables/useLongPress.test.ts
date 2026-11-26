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

  describe('按触摸事件自己的时钟计时', () => {
    function stamped(points: Array<{ x: number, y: number }>, timeStamp: number): TouchEvent {
      return { ...touchEvent(points), timeStamp } as unknown as TouchEvent
    }

    it('页面忙的时候，按住的触摸和抬起一起送到，按到期的长按先报出去', () => {
      vi.useFakeTimers()
      const onLongPress = vi.fn()
      const { result } = mountComposable(() => useLongPress({ delayMs: 500, onLongPress }))

      // 同一个任务里先后处理两个事件，中间没有计时器的机会；它们自己的时间说明手指按了 800 毫秒。
      result.handlers.onTouchStart(stamped([{ x: 8, y: 9 }], 1000))
      result.handlers.onTouchEnd(stamped([], 1800))
      expect(onLongPress).toHaveBeenCalledExactlyOnceWith({ x: 8, y: 9 })
    })

    it('没按够的轻点即使晚到也不算长按', () => {
      vi.useFakeTimers()
      const onLongPress = vi.fn()
      const { result } = mountComposable(() => useLongPress({ delayMs: 500, onLongPress }))

      result.handlers.onTouchStart(stamped([{ x: 8, y: 9 }], 1000))
      result.handlers.onTouchEnd(stamped([], 1100))
      vi.advanceTimersByTime(1000)
      expect(onLongPress).not.toHaveBeenCalled()
    })

    it('晚处理的触摸，计时器只等剩下的那一段', () => {
      vi.useFakeTimers({ now: 1_800_000_000_000 })
      const onLongPress = vi.fn()
      const { result } = mountComposable(() => useLongPress({ delayMs: 500, onLongPress }))

      // 时间戳是 epoch 毫秒，事件已经晚到 300 毫秒。
      result.handlers.onTouchStart(stamped([{ x: 1, y: 2 }], 1_800_000_000_000 - 300))
      vi.advanceTimersByTime(199)
      expect(onLongPress).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)
      expect(onLongPress).toHaveBeenCalledExactlyOnceWith({ x: 1, y: 2 })
    })
  })
})
