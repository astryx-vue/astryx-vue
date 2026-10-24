import { afterEach, describe, expect, it, vi } from 'vitest'
import { resetLiveRegionsForTest } from './testing/resetLiveRegions.js'
import { useAnnounce } from './useAnnounce.js'

describe('useAnnounce', () => {
  afterEach(() => {
    vi.useRealTimers()
    resetLiveRegionsForTest()
  })

  async function flushFrame(): Promise<void> {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  it('polite 和 assertive 写到各自的区域', async () => {
    const announce = useAnnounce()
    announce('三条结果')
    announce('保存失败', 'assertive')
    await flushFrame()

    const polite = document.querySelector('[data-astryx-live-region="polite"]')
    const assertive = document.querySelector('[data-astryx-live-region="assertive"]')
    expect(polite?.getAttribute('role')).toBe('status')
    expect(assertive?.getAttribute('role')).toBe('alert')
    expect(polite?.textContent).toBe('三条结果')
    expect(assertive?.textContent).toBe('保存失败')
  })

  it('同样的文字会先清空再写，空字符串直接清掉', async () => {
    const announce = useAnnounce()
    announce('还在')
    await flushFrame()
    announce('还在')
    const polite = document.querySelector('[data-astryx-live-region="polite"]')
    expect(polite?.textContent).toBe('')
    await flushFrame()
    expect(polite?.textContent).toBe('还在')

    announce('', 'polite')
    expect(polite?.textContent).toBe('')
  })

  it('两秒后清掉，期间再次播报会重新计时', async () => {
    vi.useFakeTimers()
    const announce = useAnnounce()
    announce('注意')
    await vi.advanceTimersByTimeAsync(16)
    const polite = document.querySelector('[data-astryx-live-region="polite"]')
    expect(polite?.textContent).toBe('注意')

    await vi.advanceTimersByTimeAsync(1500)
    announce('还在')
    await vi.advanceTimersByTimeAsync(16)
    expect(polite?.textContent).toBe('还在')
    await vi.advanceTimersByTimeAsync(1500)
    expect(polite?.textContent).toBe('还在')
    await vi.advanceTimersByTimeAsync(500)
    expect(polite?.textContent).toBe('')
  })

  it('区域被拆掉之后会重新挂上', async () => {
    const announce = useAnnounce()
    announce('第一次')
    await flushFrame()
    document.querySelector('[data-astryx-live-region="polite"]')?.remove()
    announce('第二次')
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('第二次')
  })

  it('清空时取消还没写进去的那一帧，旧文字不会在清空之后冒出来', async () => {
    const announce = useAnnounce()
    announce('还在加载')
    announce('')
    await flushFrame()
    const polite = document.querySelector('[data-astryx-live-region="polite"]')
    expect(polite?.textContent).toBe('')
  })

  it.each(['polite', 'assertive'] as const)('清空 %s 区域时，排队的多条写入全部取消', async (politeness) => {
    const announce = useAnnounce()
    announce('第一条', politeness)
    announce('第二条', politeness)
    announce('', politeness)
    await flushFrame()
    expect(document.querySelector(`[data-astryx-live-region="${politeness}"]`)?.textContent).toBe('')
  })

  it('拆掉区域时，排队的写入也取消', async () => {
    const announce = useAnnounce()
    announce('保存了')
    announce('失败了', 'assertive')
    const polite = document.querySelector('[data-astryx-live-region="polite"]')
    const assertive = document.querySelector('[data-astryx-live-region="assertive"]')
    resetLiveRegionsForTest()
    await flushFrame()
    expect(polite?.textContent).toBe('')
    expect(assertive?.textContent).toBe('')
  })
})
