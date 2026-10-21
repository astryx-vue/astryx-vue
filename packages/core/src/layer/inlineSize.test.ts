import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import LayerProvider from '../LayerProvider/LayerProvider.vue'
import { resolveLayerGutter } from './gutter.js'
import {
  clampInlineSize,
  isIntrinsicInlineSize,
  LAYER_MAX_INLINE_SIZE,
  LAYER_MAX_INLINE_SIZE_VAR,
  layerMaxInlineSize,
  resetLayerMaxInlineSizeForTests,
} from './inlineSize.js'

enableAutoUnmount(afterEach)

afterEach(() => {
  resetLayerMaxInlineSizeForTests()
  document.body.innerHTML = ''
})

describe('layerMaxInlineSize', () => {
  it('把左右两条空隙都减掉', () => {
    expect(layerMaxInlineSize(resolveLayerGutter())).toBe('calc(100vw - 16px - 16px)')
  })

  it('带上嵌套 provider 的偏移', () => {
    const gutter = resolveLayerGutter({ inlineStart: 8, inlineEnd: 24 })
    expect(layerMaxInlineSize(gutter)).toBe('calc(100vw - 24px - 40px)')
  })
})

describe('clampInlineSize', () => {
  it('把宽度压进共享的视口上限', () => {
    expect(clampInlineSize('400px')).toBe(`min(400px, ${LAYER_MAX_INLINE_SIZE})`)
    expect(LAYER_MAX_INLINE_SIZE).toBe(`var(${LAYER_MAX_INLINE_SIZE_VAR}, calc(100vw - 32px))`)
  })

  it('默认上限只减两边各一条基础空隙', () => {
    expect(LAYER_MAX_INLINE_SIZE).toContain('calc(100vw - 32px)')
  })
})

describe('isIntrinsicInlineSize', () => {
  it('认出不能放进 min() 的关键字', () => {
    expect(isIntrinsicInlineSize('auto')).toBe(true)
    expect(isIntrinsicInlineSize(' fit-content(20em) ')).toBe(true)
    expect(isIntrinsicInlineSize('max-content')).toBe(true)
  })

  it('长度值不算关键字', () => {
    expect(isIntrinsicInlineSize('400px')).toBe(false)
    expect(isIntrinsicInlineSize('min(50%, 20rem)')).toBe(false)
  })
})

describe('layerProvider 写出的宽度上限', () => {
  const Probe = defineComponent({
    name: 'Probe',
    setup() {
      return () => h('div')
    },
  })

  it('把视口减去两边空隙的宽度写到根元素上', async () => {
    mount(LayerProvider, {
      attachTo: document.body,
      props: { inset: { inlineStart: 8, inlineEnd: 24 } },
      slots: { default: () => h(Probe) },
    })
    await nextTick()

    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR))
      .toBe('calc(100vw - 24px - 40px)')
  })

  it('卸载时把变量摘掉，交回默认上限', async () => {
    const wrapper = mount(LayerProvider, {
      attachTo: document.body,
      slots: { default: () => h(Probe) },
    })
    await nextTick()
    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR)).not.toBe('')

    wrapper.unmount()
    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR)).toBe('')
  })

  it('后挂上的根 provider 写变量，卸掉以后回到先挂的那份', async () => {
    const first = mount(LayerProvider, {
      attachTo: document.body,
      props: { inset: { inlineStart: 8 } },
      slots: { default: () => h(Probe) },
    })
    await nextTick()
    const firstValue = 'calc(100vw - 24px - 16px)'
    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR)).toBe(firstValue)

    const second = mount(LayerProvider, {
      attachTo: document.body,
      props: { inset: { inlineEnd: 24 } },
      slots: { default: () => h(Probe) },
    })
    await nextTick()
    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR))
      .toBe('calc(100vw - 16px - 40px)')

    second.unmount()
    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR)).toBe(firstValue)

    first.unmount()
    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR)).toBe('')
  })

  it('嵌套 provider 只收紧子树定位，不改根上的宽度上限', async () => {
    mount(LayerProvider, {
      attachTo: document.body,
      props: { inset: { inlineStart: 8 } },
      slots: {
        default: () => h(LayerProvider, { inset: { inlineEnd: 24 } }, { default: () => h(Probe) }),
      },
    })
    await nextTick()

    expect(document.documentElement.style.getPropertyValue(LAYER_MAX_INLINE_SIZE_VAR))
      .toBe('calc(100vw - 24px - 16px)')
  })
})
