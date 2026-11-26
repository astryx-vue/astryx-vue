import { afterEach, describe, expect, it, vi } from 'vitest'
import { getLayerViewport } from './visibleViewport.js'

function stubVisualViewport(visual: Partial<VisualViewport> | undefined): void {
  vi.stubGlobal('innerWidth', 390)
  vi.stubGlobal('innerHeight', 800)
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: visual })
}

afterEach(() => {
  vi.unstubAllGlobals()
  Object.defineProperty(window, 'visualViewport', { configurable: true, value: undefined })
})

describe('getLayerViewport', () => {
  it('没有可视视口时就是窗口大小', () => {
    stubVisualViewport(undefined)
    expect(getLayerViewport()).toEqual({ width: 390, height: 800 })
  })

  it('屏幕键盘盖住底部时，高度扣到键盘上沿', () => {
    stubVisualViewport({ scale: 1, offsetTop: 0, height: 480 })
    expect(getLayerViewport()).toEqual({ width: 390, height: 480 })
  })

  it('页面被推上去时，可视视口底边按偏移算', () => {
    stubVisualViewport({ scale: 1, offsetTop: 120, height: 480 })
    expect(getLayerViewport().height).toBe(600)
  })

  it('双指放大不是键盘，不缩短视口', () => {
    stubVisualViewport({ scale: 2, offsetTop: 0, height: 400 })
    expect(getLayerViewport().height).toBe(800)
  })
})
