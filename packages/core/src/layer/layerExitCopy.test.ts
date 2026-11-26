/**
 * @file layerExitCopy.test.ts
 * @input vitest (happy-dom)、手写的布局矩形、一个假的顶层（showPopover 替身）
 * @output 退场副本：惰性、没有 id；落在浮层排版的盒子上（去掉它自己正在画的缩放）；
 *   保留浮层样式表给的内边距、边框和颜色；放进顶层；一个浮层只有一份；在外层
 *   浮层后面。
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { placeLayerExitCopy } from './layerExitCopy.js'
import { settledBox } from './settledBox.js'

const ATTRIBUTE = 'data-test-exit'

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return DOMRect.fromRect({ x: left, y: top, width, height })
}

function layer(): HTMLElement {
  const element = document.createElement('div')
  element.className = 'test-layer'
  element.id = 'layer'
  element.innerHTML = '<button id="apply" name="apply">Apply</button>'
  element.getBoundingClientRect = () => rect(40, 200, 320, 250)
  document.body.append(element)
  return element
}

let shown: HTMLElement[] = []

beforeEach(() => {
  shown = []
  const style = document.createElement('style')
  style.textContent = '.test-layer { padding: 12px; color: rgb(10, 20, 30); background-color: rgb(250, 250, 250); border: 2px solid rgb(1, 2, 3); }'
  document.head.append(style)
})

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'showPopover')
  Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover')
  document.head.innerHTML = ''
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

function fakeTopLayer(): void {
  HTMLElement.prototype.showPopover = function (this: HTMLElement) {
    shown.push(this)
  }
  HTMLElement.prototype.hidePopover = function () {}
}

describe('settledBox', () => {
  it('undoes the scale the layer is drawn with about its origin', () => {
    const element = layer()
    element.style.setProperty('scale', '0.5 0.25')
    element.style.setProperty('transform-origin', '160px 0px')
    element.getBoundingClientRect = () => rect(120, 200, 160, 62.5)
    expect(settledBox(element)).toEqual({ left: 40, top: 200, width: 320, height: 250 })
  })

  it('reads the drawn box of a layer with no transform', () => {
    expect(settledBox(layer())).toEqual({ left: 40, top: 200, width: 320, height: 250 })
  })
})

describe('placeLayerExitCopy', () => {
  it('places an inert copy with no ids on the layer’s box, right after it', () => {
    const element = layer()
    const copy = placeLayerExitCopy(element, ATTRIBUTE)!
    expect(copy.previousElementSibling).toBe(element)
    expect(copy.hasAttribute(ATTRIBUTE)).toBe(true)
    expect(copy.getAttribute('aria-hidden')).toBe('true')
    expect(copy.hasAttribute('inert')).toBe(true)
    expect(copy.querySelectorAll('[id], [name]')).toHaveLength(0)
    expect(copy.style.position).toBe('fixed')
    expect([copy.style.left, copy.style.top, copy.style.width, copy.style.height])
      .toEqual(['40px', '200px', '320px', '250px'])
    expect(copy.style.getPropertyValue('animation-name')).toBe('none')
  })

  it('shows the copy in the top layer with the layer’s own padding, border and colors', () => {
    fakeTopLayer()
    const element = layer()
    const copy = placeLayerExitCopy(element, ATTRIBUTE)!
    expect(copy.getAttribute('popover')).toBe('manual')
    expect(shown).toEqual([copy])
    expect(copy.style.getPropertyValue('padding-top')).toBe('12px')
    expect(copy.style.getPropertyValue('padding-left')).toBe('12px')
    expect(copy.style.getPropertyValue('border-top-width')).toBe('2px')
    expect(copy.style.getPropertyValue('color')).toBe('rgb(10, 20, 30)')
    expect(copy.style.getPropertyValue('background-color')).toBe('rgb(250, 250, 250)')
  })

  it('keeps one copy per layer', () => {
    const element = layer()
    const first = placeLayerExitCopy(element, ATTRIBUTE)!
    const second = placeLayerExitCopy(element, ATTRIBUTE)!
    expect(first.isConnected).toBe(false)
    expect(second.isConnected).toBe(true)
    expect(document.querySelectorAll(`[${ATTRIBUTE}]`)).toHaveLength(1)
  })

  it('goes after the outermost layer around the element, which may close with it', () => {
    const dialog = document.createElement('dialog')
    document.body.append(dialog)
    const element = layer()
    dialog.append(element)
    const copy = placeLayerExitCopy(element, ATTRIBUTE)!
    expect(copy.previousElementSibling).toBe(dialog)
  })

  it('stands where a layer caught mid-growth is laid out', () => {
    const element = layer()
    element.style.setProperty('scale', '0.5')
    element.style.setProperty('transform-origin', '0px 0px')
    element.getBoundingClientRect = () => rect(40, 200, 160, 125)
    const copy = placeLayerExitCopy(element, ATTRIBUTE)!
    expect([copy.style.left, copy.style.top, copy.style.width, copy.style.height])
      .toEqual(['40px', '200px', '320px', '250px'])
  })
})
