import { afterEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { resetScrollLockForTest } from './testing/resetScrollLock.js'
import { useScrollLock } from './useScrollLock.js'

describe('useScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = ''
    resetScrollLockForTest()
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
})
