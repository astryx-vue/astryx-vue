import { describe, expect, it } from 'vitest'
import { clampedHitInsets, inLayout, screenScale } from './hitArea.js'

function box(layout: { width: number, height: number }): HTMLElement {
  const element = document.createElement('div')
  element.style.cssText = `width:${layout.width}px;height:${layout.height}px;box-sizing:border-box;`
  document.body.append(element)
  Object.defineProperty(element, 'offsetWidth', { value: layout.width })
  Object.defineProperty(element, 'offsetHeight', { value: layout.height })
  return element
}

describe('hit area 在缩放的层里', () => {
  it('没缩放（差不到一像素）的盒子不读样式，按 1 算', () => {
    const element = box({ width: 40, height: 20 })
    expect(screenScale(element, { left: 0, top: 0, right: 40.6, bottom: 20 })).toEqual({ x: 1, y: 1 })
    element.remove()
  })

  it('被变换缩小的盒子，按屏幕尺寸除以布局尺寸得到缩放', () => {
    const element = box({ width: 40, height: 20 })
    const scale = screenScale(element, { left: 0, top: 0, right: 20, bottom: 10 })
    expect(scale.x).toBeCloseTo(0.5)
    expect(scale.y).toBeCloseTo(0.5)
    element.remove()
  })

  it('没有布局尺寸的盒子（offset 为 0）按没缩放算', () => {
    const element = document.createElement('div')
    expect(screenScale(element, { left: 0, top: 0, right: 10, bottom: 10 })).toEqual({ x: 1, y: 1 })
  })

  it('把屏幕矩形换算回布局像素，从小比例展开的层停稳后热区不变', () => {
    // 控件在半尺寸的层里，旁边的元素在屏幕上离它 5px，布局里就是 10px。
    const target = { left: 100, top: 0, right: 120, bottom: 10 }
    const neighbour = { left: 125, top: 0, right: 145, bottom: 10 }
    const scale = { x: 0.5, y: 0.5 }
    const scaled = clampedHitInsets(
      inLayout(target, target, scale),
      [inLayout(neighbour, target, scale)],
    )
    const settledTarget = { left: 100, top: 0, right: 140, bottom: 20 }
    const settledNeighbour = { left: 110 + 40, top: 0, right: 190, bottom: 20 }
    const settled = clampedHitInsets(settledTarget, [settledNeighbour])
    expect(scaled).toEqual(settled)
    expect(clampedHitInsets(target, [neighbour])).not.toEqual(scaled)
  })
})
