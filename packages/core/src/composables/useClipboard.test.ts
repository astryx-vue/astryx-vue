import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from './testing/mountComposable.js'
import { resetLiveRegionsForTest } from './testing/resetLiveRegions.js'
import { useClipboard } from './useClipboard.js'

describe('useClipboard', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    resetLiveRegionsForTest()
  })

  function clipboard(writeText: (text: string) => Promise<void>): void {
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText },
    })
  }

  it('写入成功后 isCopied 为 true，到时恢复', async () => {
    vi.useFakeTimers()
    clipboard(vi.fn().mockResolvedValue(undefined))
    const { result } = mountComposable(() => useClipboard({ resetAfterMs: 2000 }))

    await expect(result.copy('hello')).resolves.toBe(true)
    expect(result.isCopied.value).toBe(true)

    await vi.advanceTimersByTimeAsync(1999)
    expect(result.isCopied.value).toBe(true)
    await vi.advanceTimersByTimeAsync(1)
    expect(result.isCopied.value).toBe(false)
  })

  it('连续复制会把倒计时重新算满', async () => {
    vi.useFakeTimers()
    clipboard(vi.fn().mockResolvedValue(undefined))
    const { result } = mountComposable(() => useClipboard({ resetAfterMs: 1000 }))

    await result.copy('one')
    await vi.advanceTimersByTimeAsync(800)
    await result.copy('two')
    await vi.advanceTimersByTimeAsync(800)
    expect(result.isCopied.value).toBe(true)
    await vi.advanceTimersByTimeAsync(200)
    expect(result.isCopied.value).toBe(false)
  })

  it('写入失败时状态不动', async () => {
    clipboard(vi.fn().mockRejectedValue(new Error('denied')))
    const { result } = mountComposable(() => useClipboard())

    await expect(result.copy('hello')).resolves.toBe(false)
    expect(result.isCopied.value).toBe(false)
  })

  it('写入失败时 isFailed 到时恢复，失败走 assertive 播报，原因交给 onError，不显示', async () => {
    vi.useFakeTimers()
    const denied = new Error('denied')
    clipboard(vi.fn().mockRejectedValue(denied))
    const onError = vi.fn()
    const { result } = mountComposable(() => useClipboard({ announceFailure: '复制失败', onError, resetAfterMs: 2000 }))

    await expect(result.copy('hello')).resolves.toBe(false)
    expect(result.isFailed.value).toBe(true)
    expect(result.isCopied.value).toBe(false)
    expect(onError).toHaveBeenCalledExactlyOnceWith(denied)

    await vi.advanceTimersByTimeAsync(16)
    expect(document.querySelector('[data-astryx-live-region="assertive"]')?.textContent).toBe('复制失败')
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent ?? '').toBe('')

    await vi.advanceTimersByTimeAsync(2000)
    expect(result.isFailed.value).toBe(false)
  })

  it('下一次复制成功时清掉失败状态', async () => {
    const writeText = vi.fn().mockRejectedValueOnce(new Error('denied')).mockResolvedValue(undefined)
    clipboard(writeText)
    const { result } = mountComposable(() => useClipboard())

    await result.copy('hello')
    expect(result.isFailed.value).toBe(true)
    await result.copy('hello')
    expect(result.isFailed.value).toBe(false)
    expect(result.isCopied.value).toBe(true)
  })

  it('配置了播报文案时，成功后写入 polite 区域', async () => {
    clipboard(vi.fn().mockResolvedValue(undefined))
    const { result } = mountComposable(() => useClipboard({ announce: '已复制' }))

    await result.copy('hello')
    await new Promise(resolve => requestAnimationFrame(resolve))
    const region = document.querySelector('[data-astryx-live-region="polite"]')
    expect(region?.textContent).toBe('已复制')
  })

  it('卸载后不再把 isCopied 清掉', async () => {
    vi.useFakeTimers()
    clipboard(vi.fn().mockResolvedValue(undefined))
    const { result, wrapper } = mountComposable(() => useClipboard({ resetAfterMs: 500 }))

    await result.copy('hello')
    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(500)
    expect(result.isCopied.value).toBe(true)
  })

  it('旧名字 useCopyToClipboard 指向同一个函数', async () => {
    const moved = await import('../Code/useCopyToClipboard.js')
    expect(moved.useCopyToClipboard).toBe(useClipboard)
  })
})
