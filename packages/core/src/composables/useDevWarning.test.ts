import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { mountComposable } from './testing/mountComposable.js'
import { devWarn, useDevWarning } from './useDevWarning.js'

describe('useDevWarning', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('条件一开始就成立时挂载即警告一次，带组件名前缀', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountComposable(() => useDevWarning('Widget', '只能二选一', true))

    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('Widget: 只能二选一')
  })

  it('条件默认成立', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    mountComposable(() => useDevWarning('Widget', '总是警告'))

    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('条件后来才成立时，成立的那一刻警告一次', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const holds = ref(false)
    mountComposable(() => useDevWarning('Widget', '出问题了', holds))
    expect(warn).not.toHaveBeenCalled()

    holds.value = true
    await nextTick()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledWith('Widget: 出问题了')
  })

  it('同一次挂载里条件反复成立也只警告一次', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const holds = ref(true)
    mountComposable(() => useDevWarning('Widget', '出问题了', holds))

    holds.value = false
    await nextTick()
    holds.value = true
    await nextTick()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('条件一直不成立就不警告', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const holds = ref(false)
    mountComposable(() => useDevWarning('Widget', '出问题了', holds))

    await nextTick()
    expect(warn).not.toHaveBeenCalled()
  })

  it('条件可以是 getter', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const count = ref(0)
    mountComposable(() => useDevWarning('Widget', '太多了', () => count.value > 3))

    count.value = 4
    await nextTick()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('devWarn 输出带前缀的消息', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    devWarn('Widget', '出问题了')

    expect(warn).toHaveBeenCalledWith('Widget: 出问题了')
  })
})
