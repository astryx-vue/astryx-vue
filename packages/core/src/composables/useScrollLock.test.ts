import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { resetScrollLockForTest } from './testing/resetScrollLock.js'
import { useScrollLock } from './useScrollLock.js'

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    resetScrollLockForTest()
  })

  it('锁定时不把 body 钉成 position:fixed，也不改滚动位置', () => {
    document.body.style.position = 'relative'
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const isLocked = ref(true)
    const { wrapper } = mountComposable(() => useScrollLock(isLocked))

    expect(document.body.style.overflow).toBe('hidden')
    expect(document.body.style.position).toBe('relative')
    expect(document.body.style.top).toBe('')
    expect(scrollTo).not.toHaveBeenCalled()

    isLocked.value = false
    expect(document.body.style.position).toBe('relative')
    expect(scrollTo).not.toHaveBeenCalled()
    wrapper.unmount()
    scrollTo.mockRestore()
    document.body.style.position = ''
  })

  it('锁定时隐藏滚动，放开时恢复原来的 overflow', () => {
    document.body.style.overflow = 'auto'
    const isLocked = ref(false)
    const { wrapper } = mountComposable(() => useScrollLock(isLocked))

    isLocked.value = true
    expect(document.body.style.overflow).toBe('hidden')

    isLocked.value = false
    expect(document.body.style.overflow).toBe('auto')
    wrapper.unmount()
  })

  it('里层还开着时，外层关掉不会把页面放开', () => {
    document.body.style.overflow = 'scroll'
    const outer = ref(true)
    const inner = ref(true)
    const first = mountComposable(() => useScrollLock(outer))
    const second = mountComposable(() => useScrollLock(inner))
    expect(document.body.style.overflow).toBe('hidden')

    outer.value = false
    expect(document.body.style.overflow).toBe('hidden')

    second.wrapper.unmount()
    expect(document.body.style.overflow).toBe('scroll')
    first.wrapper.unmount()
  })

  it('卸载时放开自己的锁', () => {
    document.body.style.overflow = ''
    const isLocked = ref(true)
    const { wrapper } = mountComposable(() => useScrollLock(isLocked))
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('一开始没锁时不改 overflow', () => {
    document.body.style.overflow = 'auto'
    const { wrapper } = mountComposable(() => useScrollLock(ref(false)))
    expect(document.body.style.overflow).toBe('auto')
    wrapper.unmount()
  })

  it('锁住时给占地方的滚动条留住位置，放开时还原', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1015)
    const isLocked = ref(true)
    const { wrapper } = mountComposable(() => useScrollLock(isLocked))
    expect(document.documentElement.style.scrollbarGutter).toBe('stable')
    isLocked.value = false
    expect(document.documentElement.style.scrollbarGutter).toBe('')
    wrapper.unmount()
    vi.restoreAllMocks()
  })

  it('两层浮层时只有最外层留位置，全部关掉后只还原一次', () => {
    vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000)
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(1015)
    document.documentElement.style.scrollbarGutter = 'auto'
    const outer = mountComposable(() => useScrollLock(ref(true)))
    const inner = mountComposable(() => useScrollLock(ref(true)))
    expect(document.documentElement.style.scrollbarGutter).toBe('stable')
    outer.wrapper.unmount()
    expect(document.documentElement.style.scrollbarGutter).toBe('stable')
    inner.wrapper.unmount()
    expect(document.documentElement.style.scrollbarGutter).toBe('auto')
    document.documentElement.style.scrollbarGutter = ''
    vi.restoreAllMocks()
  })
})
