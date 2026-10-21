import { describe, expect, it, vi } from 'vitest'
import { addModalOutlet, removeModalOutlet, resetModalOutletsForTests, useActiveModalOutlet, whenModalSettled } from './modalOutlet.js'

describe('modalOutlet 清单', () => {
  it('给出最新打开的那个对话框', () => {
    resetModalOutletsForTests()
    const active = useActiveModalOutlet()
    const first = document.createElement('dialog')
    const second = document.createElement('dialog')

    addModalOutlet(first)
    expect(active.value).toBe(first)
    addModalOutlet(second)
    expect(active.value).toBe(second)

    removeModalOutlet(second)
    expect(active.value).toBe(first)
    resetModalOutletsForTests()
    expect(active.value).toBeNull()
  })
})

describe('whenModalSettled', () => {
  it('没有正在跑的动画时立刻返回', async () => {
    const element = document.createElement('dialog')
    element.getAnimations = () => []
    await expect(whenModalSettled(element)).resolves.toBeUndefined()
  })

  it('等动画跑完再返回', async () => {
    const element = document.createElement('dialog')
    let finish: (() => void) | undefined
    element.getAnimations = () => [
      {
        playState: 'running',
        finished: new Promise<void>((resolve) => {
          finish = resolve
        }),
      } as unknown as Animation,
    ]

    let settled = false
    const waiting = whenModalSettled(element, 2000).then(() => {
      settled = true
    })

    await vi.waitFor(() => expect(finish).toBeTypeOf('function'))
    expect(settled).toBe(false)
    finish?.()
    await waiting
    expect(settled).toBe(true)
  })

  it('动画一直不结束时按兜底时间返回', async () => {
    const element = document.createElement('dialog')
    element.getAnimations = () => [
      {
        playState: 'running',
        finished: new Promise<void>(() => {}),
      } as unknown as Animation,
    ]

    const started = Date.now()
    await whenModalSettled(element, 30)
    expect(Date.now() - started).toBeGreaterThanOrEqual(25)
  })
})
