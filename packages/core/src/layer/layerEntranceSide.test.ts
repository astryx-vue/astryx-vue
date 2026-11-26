import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import {
  LAYER_ENTER_GAP_PROPERTY,
  LAYER_ENTER_ORIGIN_PROPERTY,
  LAYER_ENTER_X_PROPERTY,
  LAYER_ENTER_Y_PROPERTY,
  layerEntranceSide,
  writeLayerEntranceSide,
} from './layerEntranceSide.js'
import { usePositionedLayer } from './usePositionedLayer.js'

const box = (left: number, top: number, width: number, height: number) => ({ left, top, width, height })

// 100 x 32 的触发器，左上角在 (300, 400)。
const trigger = box(300, 400, 100, 32)

describe('layerEntranceSide', () => {
  it.each([
    { name: 'below its trigger', layer: box(250, 436, 200, 150), x: 0, y: -1, originX: 100, originY: 0, gap: 4 },
    { name: 'above its trigger, as after a flip', layer: box(300, 246, 200, 150), x: 0, y: 1, originX: 50, originY: 150, gap: 4 },
    { name: 'to the right, a few pixels over its trigger', layer: box(396, 400, 160, 200), x: -1, y: 0, originX: 0, originY: 16, gap: 0 },
    { name: 'to the left of its trigger', layer: box(136, 300, 160, 200), x: 1, y: 0, originX: 160, originY: 116, gap: 4 },
    { name: 'below, with the trigger center past its left edge', layer: box(380, 436, 200, 150), x: 0, y: -1, originX: 0, originY: 0, gap: 4 },
    { name: 'below, with the trigger center past its right edge', layer: box(100, 436, 200, 150), x: 0, y: -1, originX: 200, originY: 0, gap: 4 },
    { name: 'over its trigger center', layer: box(275, 386, 250, 168), x: 0, y: 0, originX: 75, originY: 30, gap: 0 },
    { name: 'a list over its selected option', layer: box(300, 300, 160, 240), x: 0, y: 0, originX: 50, originY: 116, gap: 0 },
  ])('a layer $name steps and scales from where it meets the trigger', ({ layer, x, y, originX, originY, gap }) => {
    expect(layerEntranceSide(layer, trigger)).toEqual({ x, y, originX, originY, gap })
  })

  it('caps the step at the room between the layer and its trigger', () => {
    expect(layerEntranceSide(box(404, 200, 240, 400), trigger)).toMatchObject({ x: -1, gap: 4 })
    expect(layerEntranceSide(box(420, 400, 160, 200), trigger)).toMatchObject({ x: -1, gap: 20 })
  })

  it('gives a flush layer no room, and a point anchor no gap', () => {
    expect(layerEntranceSide(box(250, 432, 200, 150), trigger)).toMatchObject({ y: -1, gap: 0 })
    expect(layerEntranceSide(box(316, 416, 160, 200), box(316, 416, 0, 0))).toMatchObject({ gap: null })
    expect(layerEntranceSide(box(316, 417, 160, 200), box(316, 416, 1, 1))).toMatchObject({ gap: null })
  })

  it('gives nothing for a layer without size', () => {
    expect(layerEntranceSide(box(250, 436, 0, 150), trigger)).toBeNull()
  })
})

describe('writeLayerEntranceSide', () => {
  it('writes the side, floors the gap, and writes initial without one', () => {
    const layer = document.createElement('div')
    const side = layerEntranceSide(box(300, 246, 200, 150), trigger)
    writeLayerEntranceSide(layer, side)
    expect(layer.style.getPropertyValue(LAYER_ENTER_X_PROPERTY)).toBe('0')
    expect(layer.style.getPropertyValue(LAYER_ENTER_Y_PROPERTY)).toBe('1')
    expect(layer.style.getPropertyValue(LAYER_ENTER_ORIGIN_PROPERTY)).toBe('50px 150px')
    expect(layer.style.getPropertyValue(LAYER_ENTER_GAP_PROPERTY)).toBe('4px')

    writeLayerEntranceSide(layer, { ...side!, gap: 0.0004 })
    expect(layer.style.getPropertyValue(LAYER_ENTER_GAP_PROPERTY)).toBe('0px')
    writeLayerEntranceSide(layer, { ...side!, gap: null })
    expect(layer.style.getPropertyValue(LAYER_ENTER_GAP_PROPERTY)).toBe('initial')

    writeLayerEntranceSide(layer, null)
    for (const property of [LAYER_ENTER_X_PROPERTY, LAYER_ENTER_Y_PROPERTY, LAYER_ENTER_ORIGIN_PROPERTY, LAYER_ENTER_GAP_PROPERTY])
      expect(layer.style.getPropertyValue(property)).toBe('initial')
  })
})

describe('the positioned layer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('gives its entrance the side it landed on after a flip, before the first frame', async () => {
    const anchor = document.createElement('button')
    const layer = document.createElement('div')
    document.body.append(anchor, layer)
    // 触发器贴着视口底边，往下放不下，翻到上面。
    const bottom = window.innerHeight - 10
    anchor.getBoundingClientRect = () => ({ left: 300, top: bottom - 32, width: 100, height: 32, right: 400, bottom, x: 300, y: bottom - 32, toJSON: () => ({}) })
    Object.defineProperty(layer, 'offsetWidth', { configurable: true, value: 200 })
    Object.defineProperty(layer, 'offsetHeight', { configurable: true, value: 150 })

    let placed!: ReturnType<typeof usePositionedLayer>
    mount(defineComponent({
      setup() {
        placed = usePositionedLayer({ anchor: ref(anchor), layer: ref(layer), isOpen: ref(true), placement: ref('below'), alignment: ref('start'), gap: 4 })
        return () => h('div')
      },
    }))
    await nextTick()
    await nextTick()

    expect(placed.position.value.placement).toBe('above')
    expect(layer.style.getPropertyValue(LAYER_ENTER_X_PROPERTY)).toBe('0')
    expect(layer.style.getPropertyValue(LAYER_ENTER_Y_PROPERTY)).toBe('1')
    expect(layer.style.getPropertyValue(LAYER_ENTER_ORIGIN_PROPERTY)).toBe('50px 150px')
    expect(layer.style.getPropertyValue(LAYER_ENTER_GAP_PROPERTY)).toBe('4px')
    placed.detach()
  })
})
