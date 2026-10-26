import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { ChartSwatch, swatchVariantForType } from './index.js'

describe('chartSwatch', () => {
  it('renders a decorative element hidden from the accessibility tree', () => {
    const wrapper = mount(ChartSwatch, { props: { color: '#ff0000' } })
    // 模板开头的注释会留在开发版编译结果里，组件根因而是 Fragment。
    const swatch = (wrapper.element as HTMLElement).firstElementChild as HTMLElement
    expect(swatch).not.toBeNull()
    expect(swatch.getAttribute('aria-hidden')).toBe('true')
  })

  it('applies the given color through a dynamic style', () => {
    const wrapper = mount(ChartSwatch, { props: { color: '#ff0000' } })
    const swatch = (wrapper.element as HTMLElement).firstElementChild as HTMLElement
    expect(swatch.getAttribute('style')).toContain('#ff0000')
  })

  it('styles the square and line variants differently', () => {
    const square = mount(ChartSwatch, { props: { color: '#000' } })
    const line = mount(ChartSwatch, { props: { color: '#000', variant: 'line' } })
    const squareClass = (square.element as HTMLElement).firstElementChild!.className
    const lineClass = (line.element as HTMLElement).firstElementChild!.className
    expect(squareClass).not.toBe(lineClass)
  })
})

describe('swatchVariantForType', () => {
  it('maps bar series to the square chip', () => {
    expect(swatchVariantForType('bar')).toBe('square')
  })

  it('maps every non-bar series (and unknown types) to the line stroke', () => {
    expect(swatchVariantForType('line')).toBe('line')
    expect(swatchVariantForType('dot')).toBe('line')
    expect(swatchVariantForType('area')).toBe('line')
    expect(swatchVariantForType(undefined)).toBe('line')
  })
})
