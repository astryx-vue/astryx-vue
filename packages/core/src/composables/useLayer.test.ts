import type { UseLayerOptions, UseLayerReturn } from './useLayer.js'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { useLayer } from './useLayer.js'

function domRect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    toJSON: () => ({}),
    top,
    width,
    x: left,
    y: top,
  } as DOMRect
}

function setupLayer(options: UseLayerOptions) {
  let layer: UseLayerReturn | undefined
  const wrapper = mount(defineComponent({
    setup() {
      layer = useLayer(options)
      return () => h('div')
    },
  }))
  return { layer: layer!, wrapper }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useLayer', () => {
  it('生成带前缀的唯一 id 与锚点 id', () => {
    let layers: UseLayerReturn[] = []
    mount(defineComponent({
      setup() {
        layers = [useLayer({ mode: 'context' }), useLayer({ mode: 'fixed' })]
        return () => h('div')
      },
    }))

    expect(layers[0].id).toMatch(/^astryx-layer-/)
    expect(layers[0].anchorId).toMatch(/^astryx-layer-anchor-/)
    expect(layers[0].id).not.toBe(layers[1].id)
  })

  it('show 和 hide 切换状态并各上报一次', () => {
    const onShow = vi.fn()
    const onHide = vi.fn()
    const { layer } = setupLayer({ mode: 'context', onShow, onHide })

    expect(layer.isOpen.value).toBe(false)

    layer.show()
    expect(layer.isOpen.value).toBe(true)
    expect(onShow).toHaveBeenCalledOnce()

    layer.show()
    expect(onShow).toHaveBeenCalledOnce()

    layer.hide()
    expect(layer.isOpen.value).toBe(false)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('isDefaultOpen 让浮层首次渲染就打开', () => {
    const onShow = vi.fn()
    const { layer } = setupLayer({ mode: 'context', isDefaultOpen: true, onShow })

    expect(layer.isOpen.value).toBe(true)
    expect(onShow).not.toHaveBeenCalled()
  })

  it('fixed 模式直接用 x / y 定位', () => {
    const x = ref(12)
    const y = ref(34)
    const { layer } = setupLayer({ mode: 'fixed', x, y })

    expect(layer.isMounted.value).toBe(true)
    expect(layer.contentStyle.value).toEqual({ position: 'fixed', top: '34px', left: '12px' })

    x.value = 100
    expect(layer.contentStyle.value.left).toBe('100px')
  })

  it('context 模式按锚点位置算出坐标', async () => {
    const { layer } = setupLayer({ mode: 'context', placement: 'below', alignment: 'center' })

    const anchor = document.createElement('button')
    anchor.getBoundingClientRect = () => domRect(100, 100, 80, 20)
    const content = document.createElement('div')
    layer.anchorRef.value = anchor
    layer.contentRef.value = content

    layer.show()
    await nextTick()
    await nextTick()

    expect(layer.resolvedPlacement.value).toBe('below')
    expect(layer.contentStyle.value).toEqual({ top: '124px', left: '140px' })
  })

  it('lazyMount 等到第一次 show 才渲染内容', async () => {
    const { layer } = setupLayer({ mode: 'context', lazyMount: true })

    expect(layer.isMounted.value).toBe(false)
    layer.show()
    expect(layer.isMounted.value).toBe(true)
    expect(layer.isOpen.value).toBe(true)
  })

  it('lightDismiss 打开时点击外部关闭，点击内部保持打开', async () => {
    const onHide = vi.fn()
    const { layer } = setupLayer({ mode: 'context', lightDismiss: true, onHide })

    const content = document.createElement('div')
    layer.contentRef.value = content
    const inside = document.createElement('button')
    content.append(inside)
    document.body.append(content)

    layer.show()
    await nextTick()

    inside.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(layer.isOpen.value).toBe(true)

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(layer.isOpen.value).toBe(false)
    expect(onHide).toHaveBeenCalledOnce()
  })

  it('lightDismiss 关闭时点击外部不关闭', async () => {
    const { layer } = setupLayer({ mode: 'context' })

    const content = document.createElement('div')
    layer.contentRef.value = content
    document.body.append(content)
    layer.show()
    await nextTick()

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(layer.isOpen.value).toBe(true)
  })

  it('传了外部锚点就用它，不改内部引用', () => {
    const anchor = document.createElement('button')
    const external = ref<HTMLElement | null>(anchor)
    const { layer } = setupLayer({ mode: 'context', anchor: external })

    expect(layer.anchorRef).toBe(external)
    expect(layer.anchorRef.value).toBe(anchor)
  })
})

describe('show 和 hide 撞在一起', () => {
  /** 关闭时立刻再请求打开，模拟「关闭把焦点还给触发器，触发器上的浮层立刻要显示」。 */
  function setupReentrant() {
    let layer: UseLayerReturn | undefined
    const onShow = vi.fn()
    let showFromHide = true
    mount(defineComponent({
      setup() {
        layer = useLayer({
          mode: 'fixed',
          onShow,
          onHide: () => {
            if (showFromHide)
              layer?.show()
          },
        })
        return () => h('div')
      },
    }))
    return {
      layer: layer!,
      onShow,
      stopReentering: () => {
        showFromHide = false
      },
    }
  }

  it('关闭过程中来的 show 等关闭走完再打开', async () => {
    const { layer, onShow } = setupReentrant()

    layer.show()
    await nextTick()
    expect(layer.isOpen.value).toBe(true)
    onShow.mockClear()

    layer.hide()
    // 关闭已经生效，重新打开排在后面。
    expect(layer.isOpen.value).toBe(false)

    await Promise.resolve()
    await nextTick()
    expect(layer.isOpen.value).toBe(true)
    expect(onShow).toHaveBeenCalledOnce()
  })

  it('排队中的打开会被随后的 hide 取消', async () => {
    const { layer, onShow, stopReentering } = setupReentrant()

    layer.show()
    await nextTick()
    stopReentering()
    onShow.mockClear()

    layer.hide()
    await Promise.resolve()
    await nextTick()

    expect(layer.isOpen.value).toBe(false)
    expect(onShow).not.toHaveBeenCalled()
  })

  it('返回的东西引用稳定', async () => {
    const { layer } = setupLayer({ mode: 'fixed' })
    const before = {
      show: layer.show,
      hide: layer.hide,
      contentStyle: layer.contentStyle,
      resolvedPlacement: layer.resolvedPlacement,
    }

    layer.show()
    await nextTick()
    layer.hide()

    expect(layer.show).toBe(before.show)
    expect(layer.hide).toBe(before.hide)
    expect(layer.contentStyle).toBe(before.contentStyle)
    expect(layer.resolvedPlacement).toBe(before.resolvedPlacement)
  })
})
