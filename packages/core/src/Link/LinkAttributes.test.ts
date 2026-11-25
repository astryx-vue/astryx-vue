import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import LayerContentBoundary from '../layer/LayerContentBoundary.vue'
import Text from '../Text/Text.vue'
import Link from './Link.vue'

describe('link 反射的 data-color', () => {
  it('三种形态都反映 color，调用方传的同名属性不会盖掉它', () => {
    const anchor = mount(Link, { props: { href: '/a', color: 'secondary' }, attrs: { 'data-color': 'danger' }, slots: { default: 'A' } })
    const button = mount(Link, { props: { color: 'secondary' }, attrs: { 'data-color': 'danger' }, slots: { default: 'B' } })
    const disabled = mount(Link, { props: { href: '/a', color: 'secondary', isDisabled: true }, attrs: { 'data-color': 'danger' }, slots: { default: 'C' } })

    expect(anchor.get('a').attributes('data-color')).toBe('secondary')
    expect(button.get('button').attributes('data-color')).toBe('secondary')
    expect(disabled.get('a').attributes('data-color')).toBe('secondary')
  })

  it('其他 data-* 照常落到根元素上', () => {
    const wrapper = mount(Link, { props: { href: '/a' }, attrs: { 'data-testid': 'docs' }, slots: { default: 'Docs' } })
    expect(wrapper.get('a').attributes('data-testid')).toBe('docs')
    expect(wrapper.get('a').attributes('data-color')).toBe('accent')
  })
})

describe('link 的禁用播报', () => {
  it('禁用的锚点保留 aria-disabled 和 link 角色，不被调用方的值替换', () => {
    const wrapper = mount(Link, {
      props: { href: '/billing', isDisabled: true },
      attrs: { 'aria-disabled': 'false', 'role': 'button' },
      slots: { default: 'Billing' },
    })
    const link = wrapper.get('a')
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('role')).toBe('link')
    expect(link.attributes('tabindex')).toBe('0')
  })

  it('禁用的按钮形态保留 aria-disabled，也保留原生按钮角色', () => {
    const wrapper = mount(Link, {
      props: { isDisabled: true },
      attrs: { 'aria-disabled': 'false', 'role': 'link' },
      slots: { default: 'Retry' },
    })
    const button = wrapper.get('button')
    expect(button.attributes('aria-disabled')).toBe('true')
    expect(button.attributes('role')).toBeUndefined()
  })

  it('禁用时沿用调用方的 tabindex，焦点顺序和启用时一样', () => {
    const enabled = mount(Link, { props: { href: '/a' }, attrs: { tabindex: '-1' }, slots: { default: 'A' } })
    const disabled = mount(Link, { props: { href: '/a', isDisabled: true }, attrs: { tabindex: '-1' }, slots: { default: 'A' } })
    expect(enabled.get('a').attributes('tabindex')).toBe('-1')
    expect(disabled.get('a').attributes('tabindex')).toBe('-1')
  })

  it('启用时调用方的 role、aria-disabled 照常落到根元素上', () => {
    const wrapper = mount(Link, {
      props: { href: '/a' },
      attrs: { 'role': 'menuitem', 'aria-disabled': 'true' },
      slots: { default: 'A' },
    })
    expect(wrapper.get('a').attributes('role')).toBe('menuitem')
    expect(wrapper.get('a').attributes('aria-disabled')).toBe('true')
  })

  it('调用方的 aria-label 优先于 label', () => {
    const wrapper = mount(Link, {
      props: { href: '/docs', label: 'Documentation' },
      attrs: { 'aria-label': 'Product docs' },
      slots: { default: 'Docs' },
    })
    expect(wrapper.get('a').attributes('aria-label')).toBe('Product docs')
  })
})

describe('link 在会截断的 Text 里', () => {
  function inClamp(link: () => unknown, maxLines = 2) {
    return mount(defineComponent({
      render: () => h(Text, { maxLines, hasTruncateTooltip: false }, () => ['Lead text ', link(), ' tail text']),
    }))
  }

  it('锚点形态并入文字行内，截断能切开它', () => {
    const wrapper = inClamp(() => h(Link, { href: '/docs' }, () => 'Documentation'))
    expect(wrapper.get('a').classes()).toContain('astryx-link--in-clamp')
  })

  it('不截断的 Text 里、或者 Text 外面，链接保留自己的盒子', () => {
    const plain = mount(defineComponent({ render: () => h(Text, null, () => h(Link, { href: '/docs' }, () => 'Docs')) }))
    const bare = mount(Link, { props: { href: '/docs' }, slots: { default: 'Docs' } })
    expect(plain.get('a').classes()).not.toContain('astryx-link--in-clamp')
    expect(bare.get('a').classes()).not.toContain('astryx-link--in-clamp')
  })

  it('按钮形态、自己设了 maxLines 的链接保留自己的盒子', () => {
    const wrapper = inClamp(() => [
      h(Link, { onClick: () => {} }, () => 'Action'),
      h(Link, { href: '/self', maxLines: 1 }, () => 'Self clamped'),
    ])
    expect(wrapper.get('button').classes()).not.toContain('astryx-link--in-clamp')
    expect(wrapper.get('a').classes()).not.toContain('astryx-link--in-clamp')
  })

  it('浮层边界把截断上下文重置掉', () => {
    const wrapper = inClamp(() => h(LayerContentBoundary, null, () => h(Link, { href: '/docs' }, () => 'In a layer')))
    expect(wrapper.get('a').classes()).not.toContain('astryx-link--in-clamp')
  })

  it('跟着 Text 的 maxLines 变化', async () => {
    const lines = ref(0)
    const wrapper = mount(defineComponent({
      render: () => h(Text, { maxLines: lines.value, hasTruncateTooltip: false }, () => h(Link, { href: '/docs' }, () => 'Docs')),
    }))
    expect(wrapper.get('a').classes()).not.toContain('astryx-link--in-clamp')
    lines.value = 2
    await nextTick()
    expect(wrapper.get('a').classes()).toContain('astryx-link--in-clamp')
  })
})
