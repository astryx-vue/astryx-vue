// @vitest-environment node
/**
 * @file createSwipe.server.test.ts
 * @input 没有 window 和 document 的 Node 环境
 * @output 导入和调用 createSwipe 不碰 DOM，所以模块顶层调用和服务端渲染都安全
 * @position packages/core/src/Swipe/createSwipe.ts 及其依赖的服务端测试
 */

import { describe, expect, it } from 'vitest'

describe('createSwipe on the server', () => {
  it('imports and runs with no window or document', async () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
    const mod = await import('./index')
    const swipe = mod.createSwipe({ trailing: [{ id: 'archive', label: 'Archive', onActivate() {} }], swipeBehavior: 'commit' })
    expect(Object.keys(mod)).toEqual(['createSwipe'])
    expect(Object.isFrozen(swipe)).toBe(true)
    expect(Object.keys(swipe)).toEqual([])
  })
})
