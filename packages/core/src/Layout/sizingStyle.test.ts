import type { Component } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Center from '../Center/Center.vue'
import ScrollableArea from '../ScrollableArea/ScrollableArea.vue'
import Section from '../Section/Section.vue'
import VStack from '../Stack/VStack.vue'

const COMPONENTS: [string, Component][] = [
  ['VStack', VStack],
  ['Center', Center],
  ['Section', Section],
  ['ScrollableArea', ScrollableArea],
]

describe('布局组件的尺寸样式', () => {
  it.each(COMPONENTS)('%s 没传尺寸属性时保留使用方 style 里的 width / maxWidth', (_, component) => {
    const wrapper = mount(component, { attrs: { style: { maxWidth: '375px', width: '100%', marginInline: 'auto' } } })
    const style = (wrapper.element as HTMLElement).style
    expect(style.maxWidth).toBe('375px')
    expect(style.width).toBe('100%')
    expect(style.marginInline).toBe('auto')
  })

  it.each(COMPONENTS)('%s 传了尺寸属性时以属性为准', (_, component) => {
    const wrapper = mount(component, { props: { maxWidth: 480 }, attrs: { style: { maxWidth: '375px' } } })
    expect((wrapper.element as HTMLElement).style.maxWidth).toBe('480px')
  })
})
