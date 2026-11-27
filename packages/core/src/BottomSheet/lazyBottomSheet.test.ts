import { describe, expect, it, vi } from 'vitest'
import { preloadBottomSheet } from './lazyBottomSheet.js'

vi.mock('./BottomSheet.vue', () => {
  throw new Error('chunk failed to load')
})

describe('preloadBottomSheet', () => {
  it('加载失败时返回 false，不抛出、也不留下没人接的拒绝', async () => {
    const unhandled = vi.fn()
    process.on('unhandledRejection', unhandled)
    try {
      await expect(preloadBottomSheet()).resolves.toBe(false)
      // 再调一次照样重新请求，同样不抛。
      await expect(preloadBottomSheet()).resolves.toBe(false)
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(unhandled).not.toHaveBeenCalled()
    }
    finally {
      process.off('unhandledRejection', unhandled)
    }
  })
})
