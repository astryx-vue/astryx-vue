import type { VNodeChild } from 'vue'
import { enableAutoUnmount, flushPromises, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import { formatSpokenTime } from './mediaFormat.js'
import MediaPlaybackRate from './MediaPlaybackRate.vue'
import MediaPlayer from './MediaPlayer.vue'
import MediaPlayerElement from './MediaPlayerElement.vue'
import MediaTime from './MediaTime.vue'
import MediaTimeSlider from './MediaTimeSlider.vue'
import { fakePlayback } from './testing/fakeMedia.js'

enableAutoUnmount(afterEach)

function mountPlayer(children: () => VNodeChild, duration = 120) {
  const wrapper = mount(MediaPlayer, {
    attachTo: document.body,
    props: { label: 'Product tour' },
    slots: { default: () => [h(MediaPlayerElement, { kind: 'video', src: '/clip.mp4' }), children()] },
  })
  const playback = fakePlayback(wrapper.get('video').element as HTMLMediaElement, { duration })
  return { wrapper, playback }
}

const spoken = (time: number): string => formatSpokenTime(time, 'en')

describe('mediaTimeSlider', () => {
  it('runs left to right even on a right-to-left page', async () => {
    const { wrapper } = mountPlayer(() => h('div', { dir: 'rtl' }, [h(MediaTimeSlider)]))
    await nextTick()
    expect(wrapper.get('.astryx-media-timeline').attributes('dir')).toBe('ltr')
  })

  it('reads the time with the chapter and a nearby marker', async () => {
    const chapters = [{ start: 0, title: 'Intro' }, { start: 60, title: 'Demo' }]
    const markers = [{ time: 61, label: 'Bug report' }]
    const { wrapper, playback } = mountPlayer(() => h(MediaTimeSlider, { chapters, markers }))
    await nextTick()
    const slider = wrapper.get('[role="slider"]')
    expect(slider.attributes('aria-label') ?? slider.attributes('aria-labelledby')).toBeTruthy()
    expect(slider.attributes('aria-valuetext')).toBe(`${spoken(0)} of ${spoken(120)}, Intro`)
    ;(wrapper.get('video').element as HTMLMediaElement).currentTime = 60
    await nextTick()
    expect(playback.getCurrentTime()).toBe(60)
    expect(slider.attributes('aria-valuetext')).toBe(`${spoken(60)} of ${spoken(120)}, Demo, Bug report`)
  })

  it('skips 5 seconds with the arrows and 10 with Page Up, not the fine slider step', async () => {
    const { wrapper, playback } = mountPlayer(() => h(MediaTimeSlider))
    await nextTick()
    const slider = wrapper.get('[role="slider"]')
    await slider.trigger('keydown', { key: 'ArrowRight' })
    expect(playback.getCurrentTime()).toBe(5)
    await slider.trigger('keydown', { key: 'PageUp' })
    expect(playback.getCurrentTime()).toBe(15)
    await slider.trigger('keydown', { key: 'ArrowLeft' })
    expect(playback.getCurrentTime()).toBe(10)
  })

  it('previews the time while dragging and seeks only on release', async () => {
    const { wrapper, playback } = mountPlayer(() => [h(MediaTimeSlider), h(MediaTime)])
    await nextTick()
    const track = wrapper.get('.astryx-slider-control')
    vi.spyOn(track.element, 'getBoundingClientRect').mockReturnValue({ left: 0, right: 220, top: 0, bottom: 20, width: 220, height: 20 } as DOMRect)
    const pointer = { button: 0, pointerId: 1, pointerType: 'mouse' }
    await track.trigger('pointerdown', { ...pointer, clientX: 110 })
    expect(wrapper.get('.astryx-media-time').text()).toBe('1:00 / 2:00')
    await track.trigger('pointermove', { ...pointer, clientX: 160 })
    expect(wrapper.get('.astryx-media-time').text()).toBe('1:30 / 2:00')
    expect(playback.getCurrentTime()).toBe(0)
    await track.trigger('pointerup', { ...pointer, clientX: 160 })
    expect(playback.getCurrentTime()).toBe(90)
    expect(wrapper.get('.astryx-media-time').text()).toBe('1:30 / 2:00')
  })

  it('draws markers once the duration is known, and a marker with content seeks when pressed', async () => {
    const markers = [{ time: 30, label: 'Note' }, { time: 75, label: 'Comment thread', content: () => 'Looks good' }]
    const { wrapper, playback } = mountPlayer(() => h(MediaTimeSlider, { markers }), 0)
    await nextTick()
    expect(wrapper.findAll('[data-media-marker]')).toHaveLength(0)

    const ready = mountPlayer(() => h(MediaTimeSlider, { markers }))
    await nextTick()
    expect(ready.wrapper.findAll('.astryx-media-timeline__marker')).toHaveLength(1)
    const button = ready.wrapper.get('button[aria-label="Comment thread"]')
    await button.trigger('click')
    expect(ready.playback.getCurrentTime()).toBe(75)
    expect(playback.getCurrentTime()).toBe(0)
  })
})

describe('mediaPlaybackRate menu', () => {
  it('checks the current speed and sets the chosen one', async () => {
    const { wrapper, playback } = mountPlayer(() => h(MediaPlaybackRate, { variant: 'menu' }))
    await nextTick()
    await wrapper.get('button').trigger('click')
    await flushPromises()
    const checked = document.querySelector('[role="menuitemradio"][aria-checked="true"]')
    expect(checked?.textContent).toContain('1×')
    const faster = [...document.querySelectorAll<HTMLElement>('[role="menuitemradio"]')].find(item => item.textContent?.includes('1.5×'))
    faster!.click()
    await nextTick()
    expect(playback.getPlaybackRate()).toBe(1.5)
  })
})
