import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { useAnnouncer } from './internal/announce.js'
import { useBusyAnnouncement } from './internal/busyAnnouncement.js'
import { mountComposable } from './testing/mountComposable.js'
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

  it('同一帧里的消息按顺序连在一起念，一模一样的重复只念一次', async () => {
    const announce = useAnnounce()
    announce('3 个结果')
    announce('已保存')
    announce('3 个结果')
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('3 个结果 已保存')

    announce('下一条')
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('下一条')
  })

  it('紧迫度不同的消息各写各的区域，不连在一起', async () => {
    const announce = useAnnounce()
    announce('保存了')
    announce('失败了', 'assertive')
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('保存了')
    expect(document.querySelector('[data-astryx-live-region="assertive"]')?.textContent).toBe('失败了')
  })

  it('hasReplace 的播报者收回自己上一条还没念出去的消息，别的播报者的照样连在一起', async () => {
    const typing = useAnnounce({ hasReplace: true })
    const other = useAnnounce()
    typing('Create "Ur"')
    other('已选 1 项')
    typing('Create "Urg"')
    typing('Create "Urge"')
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('已选 1 项 Create "Urge"')
  })

  it('收据收回自己那份：另一个播报者写了同样的话时，那一份留着', async () => {
    const first = useAnnouncer()
    const second = useAnnouncer()
    const mine = first('Loading')
    const theirs = second('Loading')
    mine?.withdraw()
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')

    const alone = first('Loading')
    alone?.withdraw()
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('')
    theirs?.withdraw()
  })

  it('原生模态对话框打开时，播报写进那个对话框里的区域', async () => {
    const dialog = document.createElement('dialog')
    Object.defineProperty(dialog, 'open', { configurable: true, value: true })
    const matches = dialog.matches.bind(dialog)
    dialog.matches = ((selector: string) => selector === ':modal' || matches(selector)) as typeof dialog.matches
    const inner = document.createElement('button')
    dialog.append(inner)
    document.body.append(dialog)

    const announce = useAnnouncer()
    announce('已复制', 'polite', { within: inner })
    announce('出错了', 'assertive')
    await flushFrame()
    expect(dialog.querySelector(':scope > [data-astryx-live-region="polite"]')?.textContent).toBe('已复制')
    expect(dialog.querySelector(':scope > [data-astryx-live-region="assertive"]')?.textContent).toBe('出错了')
    expect(document.body.querySelector(':scope > [data-astryx-live-region]')).toBeNull()
  })
})

describe('useBusyAnnouncement', () => {
  afterEach(() => {
    resetLiveRegionsForTest()
  })

  async function flushFrame(): Promise<void> {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  it('进入忙碌念一次，重新忙碌再念', async () => {
    const busy = ref(false)
    mountComposable(() => useBusyAnnouncement(busy, 'Loading'))
    busy.value = true
    await nextTick()
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('Loading')
  })

  it('结果先播报时，还没念出去的忙碌开始被收回，不会念在结果后面或和结果连成一句', async () => {
    const busy = ref(false)
    const element = document.createElement('div')
    document.body.append(element)
    const { result: settle } = mountComposable(() => useBusyAnnouncement(busy, 'Loading', element))
    const outcome = useAnnounce()

    busy.value = true
    await nextTick()
    settle()
    outcome('3 个结果')
    await flushFrame()
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('3 个结果')
  })

  it('已经写进通道但还没念出去的忙碌开始，也在结果播报前收回', async () => {
    const busy = ref(false)
    const { result: settle } = mountComposable(() => useBusyAnnouncement(busy, 'Loading'))
    const outcome = useAnnounce()

    busy.value = true
    await nextTick()
    settle()
    outcome('3 个结果')
    await flushFrame()
    expect(document.querySelector('[data-astryx-live-region="polite"]')?.textContent).toBe('3 个结果')
  })
})
