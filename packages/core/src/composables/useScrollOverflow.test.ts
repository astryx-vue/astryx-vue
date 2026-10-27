import { afterEach, describe, expect, it, vi } from 'vitest'
import { mountComposable } from './testing/mountComposable.js'
import { useScrollOverflow } from './useScrollOverflow.js'

interface Geometry {
  scrollWidth: number
  clientWidth: number
  scrollLeft: number
}

/** 一个横向滚动条：几何量从桩里读，`rendered` 决定 `checkVisibility()` 的答案。 */
function strip(geometry: Geometry, rendered: { value: boolean | undefined }): HTMLElement {
  const el = document.createElement('div')
  Object.defineProperty(el, 'scrollWidth', { get: () => geometry.scrollWidth })
  Object.defineProperty(el, 'clientWidth', { get: () => geometry.clientWidth })
  Object.defineProperty(el, 'scrollLeft', { get: () => geometry.scrollLeft })
  Object.defineProperty(el, 'checkVisibility', {
    get: () => (rendered.value === undefined ? undefined : () => rendered.value!),
  })
  return el
}

const observers: Array<() => void> = []
class FakeResizeObserver {
  constructor(private readonly callback: () => void) {
    observers.push(() => this.callback())
  }

  observe(): void {}
  disconnect(): void {}
}

afterEach(() => {
  observers.length = 0
  vi.unstubAllGlobals()
})

describe('useScrollOverflow', () => {
  it('绑上一个正在渲染的容器时就量', () => {
    const { result } = mountComposable(() => useScrollOverflow())
    result.scrollRef(strip({ scrollWidth: 300, clientWidth: 100, scrollLeft: 0 }, { value: true }))
    expect(result.hasOverflow.value).toBe(true)
    expect(result.overflowStart.value).toBe(false)
    expect(result.overflowEnd.value).toBe(true)
  })

  it('容器没在渲染时不读布局', () => {
    const { result } = mountComposable(() => useScrollOverflow())
    result.scrollRef(strip({ scrollWidth: 300, clientWidth: 100, scrollLeft: 0 }, { value: false }))
    expect(result.hasOverflow.value).toBe(false)
  })

  it('藏着时保留上一次的结果，露出来之后的尺寸变化再量', () => {
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)
    const geometry = { scrollWidth: 300, clientWidth: 100, scrollLeft: 0 }
    const rendered = { value: true as boolean | undefined }
    const { result } = mountComposable(() => useScrollOverflow())
    result.scrollRef(strip(geometry, rendered))
    expect(result.hasOverflow.value).toBe(true)

    rendered.value = false
    geometry.clientWidth = 0
    geometry.scrollWidth = 0
    observers.forEach(fire => fire())
    expect(result.hasOverflow.value).toBe(true)

    rendered.value = true
    geometry.clientWidth = 400
    geometry.scrollWidth = 400
    observers.forEach(fire => fire())
    expect(result.hasOverflow.value).toBe(false)
  })

  it('藏着时被脚本滚动照样量，同样大小露出来时已经是对的', () => {
    const geometry = { scrollWidth: 300, clientWidth: 100, scrollLeft: 0 }
    const rendered = { value: true as boolean | undefined }
    const { result } = mountComposable(() => useScrollOverflow())
    const el = strip(geometry, rendered)
    result.scrollRef(el)
    rendered.value = false
    geometry.scrollLeft = 200
    el.dispatchEvent(new Event('scroll'))
    expect(result.overflowStart.value).toBe(true)
    expect(result.overflowEnd.value).toBe(false)
  })

  it('没有 checkVisibility 的浏览器照常量', () => {
    const { result } = mountComposable(() => useScrollOverflow())
    result.scrollRef(strip({ scrollWidth: 300, clientWidth: 100, scrollLeft: 0 }, { value: undefined }))
    expect(result.hasOverflow.value).toBe(true)
  })
})
