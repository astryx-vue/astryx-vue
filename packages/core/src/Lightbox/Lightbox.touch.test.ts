/**
 * @file Lightbox.touch.test.ts
 * @input vitest (happy-dom)，粗指针（手机）下的 Lightbox.vue，手势测试工具发出的 Touch Events
 * @output 灯箱在手指下的样子：横扫翻页、被拒绝的翻页弹回、视频控件那一条不翻页、
 *   往下拖关闭和没拖够弹回、双击放大
 * @position 测试；Lightbox.vue 接 useLightboxStage.ts
 */

import type { VueWrapper } from '@vue/test-utils'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { coarsePrimaryPointer } from '../gestures/__tests__/pointerQuery'
import { exposeTouchEvents, touch } from '../gestures/__tests__/touchEvents'
import { zoomMedia } from '../motion/uikit/zoomMedia'
import { animators, callsOf } from './__tests__/fakeAnimator'
import { stubStageLayout } from './__tests__/stageLayout'
import Lightbox from './Lightbox.vue'

vi.mock('../motion/animator', async (importOriginal) => {
  const { fakeAnimatorModule } = await import('./__tests__/fakeAnimator')
  return fakeAnimatorModule(await importOriginal())
})

const gallery = [
  { alt: 'First', src: '/first.png' },
  { alt: 'Second', src: '/second.png' },
  { alt: 'Third', src: '/third.png' },
]
const photo = gallery[0]!
/** 视口宽 400，页距 40：一页的步长。 */
const STRIDE = 400 + zoomMedia.viewer.pageGap

let restoreTouchEvents: () => void = () => {}
let restorePointer: () => void = () => {}
let restoreLayout: () => void = () => {}
beforeAll(() => {
  restoreTouchEvents = exposeTouchEvents()
  restorePointer = coarsePrimaryPointer()
  restoreLayout = stubStageLayout()
})
afterAll(() => {
  restoreLayout()
  restorePointer()
  restoreTouchEvents()
})

enableAutoUnmount(afterEach)
afterEach(() => {
  animators.length = 0
  document.body.innerHTML = ''
})

let clock = 10_000

/** 一根手指的一下，再等浏览器在下一下之前跑的微任务。 */
async function finger(type: string, target: Element, x: number, y: number, step = 16): Promise<void> {
  clock += step
  touch(type, target, { id: 1, x, y }, clock, type === 'touchend')
  await Promise.resolve()
}

/** 一根手指从 from 拖到 to，分几步走完再抬起。 */
async function drag(target: Element, from: [number, number], to: [number, number], steps = 6): Promise<void> {
  await finger('touchstart', target, from[0], from[1])
  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    await finger('touchmove', target, from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t)
  }
  await finger('touchend', target, to[0], to[1])
  await flushPromises()
  await nextTick()
}

/** 轨道动画器最后一次被要求去的横向位置。 */
function trackX(wrapper: VueWrapper): number | undefined {
  const track = wrapper.get('.astryx-lightbox__track').element
  return animators.find(animator => animator.element === track && animator.pseudoElement == null)?.values.get('x')
}

function mountControlled(index: number, onIndex?: (next: number) => void): VueWrapper {
  return mount(Lightbox, {
    attachTo: document.body,
    props: { isOpen: true, media: gallery, index, ...(onIndex ? { 'onUpdate:index': onIndex } : {}) },
  })
}

describe('lightbox gallery under a finger', () => {
  it('pages to the next photo on a swipe left, with Photos\' 40 pt gap', async () => {
    const Host = defineComponent({
      setup: () => ({ index: ref(0) }),
      render() {
        return h(Lightbox, {
          'isOpen': true,
          'media': gallery,
          'index': this.index,
          'onUpdate:index': (next: number) => {
            this.index = next
          },
        })
      },
    })
    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    await drag(wrapper.get('.astryx-lightbox__viewport').element, [300, 300], [60, 300])
    expect(wrapper.findComponent(Lightbox).emitted('update:index')).toEqual([[1]])
    expect(wrapper.get('[data-current] img').attributes('alt')).toBe('Second')
    expect(trackX(wrapper)).toBe(-STRIDE)
  })

  it('springs back to the photo a controlled parent keeps', async () => {
    const wrapper = mountControlled(0)
    await nextTick()
    await drag(wrapper.get('.astryx-lightbox__viewport').element, [300, 300], [60, 300])
    expect(wrapper.emitted('update:index')).toEqual([[1]])
    await flushPromises()
    // 父组件没采纳：轨道滑回第一页，滑回去是一段动画。
    expect(trackX(wrapper)).toBe(0)
    const track = wrapper.get('.astryx-lightbox__track').element
    expect(callsOf(track).filter(call => call.name === 'play').length).toBeGreaterThanOrEqual(2)
  })

  it('leaves a drag that starts on a video\'s controls to the video', async () => {
    const onIndex = vi.fn()
    const wrapper = mount(Lightbox, {
      attachTo: document.body,
      props: { 'isOpen': true, 'media': [{ alt: 'Clip', src: '/clip.mp4', type: 'video' as const }, photo], 'onUpdate:index': onIndex },
    })
    await nextTick()
    const video = wrapper.get('[data-current] video').element
    video.getBoundingClientRect = () => DOMRect.fromRect({ x: 0, y: 100, width: 400, height: 300 })
    // 底边往上 48px 以内是控件那一条。
    await drag(video, [300, 380], [60, 380])
    expect(onIndex).not.toHaveBeenCalled()
    await drag(video, [300, 200], [60, 200])
    expect(onIndex).toHaveBeenCalledWith(1)
  })
})

describe('lightbox drag to dismiss', () => {
  it('closes on a long drag down, fading the backdrop as the photo leaves', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: photo } })
    await nextTick()
    const frame = wrapper.get('[data-current] [data-lightbox-page-media]').element
    await drag(frame, [200, 300], [200, 700], 8)
    const backdrop = callsOf(wrapper.get('dialog').element, '::backdrop')
    const faded = backdrop.find(call => call.name === 'set')?.args[0] as { opacity: number } | undefined
    expect(faded?.opacity).toBeLessThan(1)
    // 照片按照片 App 的位置弹簧往下离场，手指松手交给减少动效时的淡出。
    const img = wrapper.get('[data-current] img').element
    const exit = callsOf(img).find(call => call.name === 'animate' && (call.args[2] as { crossfadeAs?: string } | undefined)?.crossfadeAs === 'exit')
    expect((exit?.args[1] as { spring: unknown }).spring).toBe(zoomMedia.dismiss.dismissPositionSpring)
    expect(exit?.args[2]).toEqual({ crossfadeAs: 'exit', touchRelease: true })
    await flushPromises()
    expect(wrapper.emitted('update:isOpen')).toEqual([[false]])
  })

  it('springs the photo back from a short, slow drag', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: photo } })
    await nextTick()
    const frame = wrapper.get('[data-current] [data-lightbox-page-media]').element
    await finger('touchstart', frame, 200, 300)
    for (const y of [304, 308, 312, 316, 320])
      await finger('touchmove', frame, 200, y, 100)
    await finger('touchend', frame, 200, 320, 300)
    await flushPromises()
    expect(wrapper.emitted('update:isOpen')).toBeUndefined()
    const img = wrapper.get('[data-current] img').element
    expect(callsOf(img).some(call => call.name === 'animate' && JSON.stringify(call.args[0]) === '{"x":0,"y":0}')).toBe(true)
    expect(frame.hasAttribute('data-zoom-dismissing')).toBe(false)
  })
})

describe('lightbox zoom under a finger', () => {
  it('zooms in on a double tap', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: photo, hasZoom: true } })
    await nextTick()
    const frame = wrapper.get('[data-current] [data-lightbox-page-media]').element
    await finger('touchstart', frame, 200, 300)
    await finger('touchend', frame, 200, 300, 60)
    await finger('touchstart', frame, 200, 300, 120)
    await finger('touchend', frame, 200, 300, 60)
    await flushPromises()
    expect(wrapper.get('[aria-label="Zoom"]').attributes('aria-pressed')).toBe('true')
    const img = wrapper.get('[data-current] img').element
    const zoom = callsOf(img).find(call => call.name === 'animate' && 'scale' in (call.args[0] as object))
    expect((zoom?.args[0] as { scale: number }).scale).toBeGreaterThan(1)
  })
})
