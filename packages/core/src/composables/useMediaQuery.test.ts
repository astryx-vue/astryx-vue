import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from './testing/mountComposable.js'
import { useMediaQuery } from './useMediaQuery.js'

describe('useMediaQuery', () => {
  const original = window.matchMedia

  afterEach(() => {
    window.matchMedia = original
  })

  it('setup 时就读到当前是否匹配', () => {
    window.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = mountComposable(() => useMediaQuery('(max-width: 640px)'))
    expect(result.value).toBe(true)
  })

  it('媒体查询变化时跟着变，卸载后不再听', () => {
    const heard: { listener: ((event: MediaQueryListEvent) => void) | null } = { listener: null }
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        heard.listener = callback
      },
      removeEventListener: () => {
        heard.listener = null
      },
    })) as unknown as typeof window.matchMedia

    const { result, wrapper } = mountComposable(() => useMediaQuery('(max-width: 640px)'))
    expect(result.value).toBe(false)

    heard.listener?.({ matches: true } as MediaQueryListEvent)
    expect(result.value).toBe(true)

    wrapper.unmount()
    heard.listener?.({ matches: false } as MediaQueryListEvent)
    expect(result.value).toBe(true)
    expect(heard.listener).toBeNull()
  })

  it('同一条查询的所有调用方共用一个监听，最后一个卸载才摘掉', () => {
    const added = vi.fn()
    const removed = vi.fn()
    const heard: { listener: ((event: MediaQueryListEvent) => void) | null } = { listener: null }
    window.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: (_type: string, callback: (event: MediaQueryListEvent) => void) => {
        added()
        heard.listener = callback
      },
      removeEventListener: removed,
    })) as unknown as typeof window.matchMedia

    const first = mountComposable(() => useMediaQuery('(pointer: coarse)'))
    const second = mountComposable(() => useMediaQuery('(pointer: coarse)'))
    expect(added).toHaveBeenCalledTimes(1)

    heard.listener?.({ matches: true } as MediaQueryListEvent)
    expect(first.result.value).toBe(true)
    expect(second.result.value).toBe(true)

    first.wrapper.unmount()
    expect(removed).not.toHaveBeenCalled()
    second.wrapper.unmount()
    expect(removed).toHaveBeenCalledTimes(1)
  })

  it('没有 matchMedia 时当作不匹配', () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia
    const { result } = mountComposable(() => useMediaQuery('(max-width: 640px)'))
    expect(result.value).toBe(false)
  })
})
