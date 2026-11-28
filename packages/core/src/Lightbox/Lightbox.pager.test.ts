/**
 * @file Lightbox.pager.test.ts
 * @input vitest (happy-dom)，精细指针（桌面）下的 Lightbox.vue
 * @output 精细指针下按钮和方向键换页时轨道直接到位，触屏下才滑过去；鼠标双击在点上放大
 * @position 测试；Lightbox.vue 接 lightboxPager.ts 和 zoomCore.ts
 */

import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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
]

let restoreLayout: () => void = () => {}
beforeAll(() => {
  restoreLayout = stubStageLayout()
})
afterAll(() => {
  restoreLayout()
})

enableAutoUnmount(afterEach)
afterEach(() => {
  animators.length = 0
  document.body.innerHTML = ''
})

describe('lightbox paging with a fine pointer', () => {
  it('moves the track to the next page at once, with no slide', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: gallery } })
    await nextTick()
    await wrapper.get('[aria-label="Next"]').trigger('click')
    await flushPromises()
    const track = wrapper.get('.astryx-lightbox__track').element
    const calls = callsOf(track)
    expect(calls.some(call => call.name === 'play')).toBe(false)
    expect(calls.at(-1)?.args[0]).toEqual({ x: -(400 + zoomMedia.viewer.pageGap) })
  })
})

describe('lightbox zoom with a mouse', () => {
  it('zooms in at the double-clicked point and back out on the next', async () => {
    const wrapper = mount(Lightbox, { attachTo: document.body, props: { isOpen: true, media: gallery[0]!, hasZoom: true } })
    await nextTick()
    const viewport = wrapper.get('.astryx-lightbox__viewport')
    const zoom = wrapper.get('[aria-label="Zoom"]')
    await viewport.trigger('dblclick', { clientX: 300, clientY: 300 })
    expect(zoom.attributes('aria-pressed')).toBe('true')
    const img = wrapper.get('[data-current] img').element
    const zoomIn = callsOf(img).find(call => call.name === 'animate' && 'scale' in (call.args[0] as object))
    expect((zoomIn?.args[0] as { scale: number }).scale).toBe(2)
    await viewport.trigger('dblclick', { clientX: 300, clientY: 300 })
    expect(zoom.attributes('aria-pressed')).toBe('false')
  })
})
