import type { PositionedLayer } from './usePositionedLayer.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { usePositionedLayer } from './usePositionedLayer.js'

function domRect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect
}

describe('usePositionedLayer', () => {
  const restorers: Array<() => void> = []

  afterEach(() => {
    while (restorers.length > 0)
      restorers.pop()?.()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('打开后卸载就停掉轮询，没有 window 时也不会再进 update', async () => {
    vi.useFakeTimers()
    const isOpen = ref(false)
    const anchor = ref<HTMLElement | null>(document.createElement('button'))
    const layer = ref<HTMLElement | null>(document.createElement('div'))
    Object.defineProperty(layer.value, 'offsetWidth', { configurable: true, value: 120 })
    Object.defineProperty(layer.value, 'offsetHeight', { configurable: true, value: 40 })

    let top = 10
    let rectReads = 0
    let viewportReads = 0
    anchor.value!.getBoundingClientRect = () => {
      rectReads += 1
      return domRect(top, 20, 80, 24)
    }
    const innerWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth')
    const innerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight')
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get() {
        viewportReads += 1
        return 1024
      },
    })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      get() {
        return 768
      },
    })
    restorers.push(() => {
      if (innerWidth)
        Object.defineProperty(window, 'innerWidth', innerWidth)
      if (innerHeight)
        Object.defineProperty(window, 'innerHeight', innerHeight)
    })

    let positioned: PositionedLayer | undefined
    const wrapper = mount(defineComponent({
      setup() {
        positioned = usePositionedLayer({
          alignment: ref('start'),
          anchor,
          gap: 4,
          isOpen,
          layer,
          placement: ref('below'),
        })
        return () => h('div')
      },
    }))

    isOpen.value = true
    await nextTick()
    await nextTick()
    const afterOpen = viewportReads
    expect(afterOpen).toBeGreaterThan(0)

    // 轮询间隔是 100ms。打开期间几何没变过，第一次 tick 仍会算一次位置。
    await vi.advanceTimersByTimeAsync(100)
    expect(viewportReads).toBeGreaterThan(afterOpen)

    wrapper.unmount()
    // 几何变了。定时器要是还在，下一拍会重新量锚点并再进 update。
    top = 80
    const afterUnmount = rectReads
    const viewportAfterUnmount = viewportReads
    await vi.advanceTimersByTimeAsync(500)
    expect(rectReads).toBe(afterUnmount)
    expect(viewportReads).toBe(viewportAfterUnmount)

    const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window')
    Reflect.deleteProperty(globalThis, 'window')
    restorers.push(() => {
      if (windowDescriptor)
        Object.defineProperty(globalThis, 'window', windowDescriptor)
    })
    expect(() => positioned!.update()).not.toThrow()
    await vi.advanceTimersByTimeAsync(500)
    expect(rectReads).toBe(afterUnmount)
    expect(viewportReads).toBe(viewportAfterUnmount)
  })
})
