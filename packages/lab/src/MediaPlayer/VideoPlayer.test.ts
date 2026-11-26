import type { VideoPlayerProps } from './types.js'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { fakePlayback } from './testing/fakeMedia.js'
import VideoPlayer from './VideoPlayer.vue'

const videoPlayerCss = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../styles/video-player.css'), 'utf8')

enableAutoUnmount(afterEach)

afterEach(() => {
  vi.useRealTimers()
})

function mountVideo(props: Partial<VideoPlayerProps> = {}) {
  const wrapper = mount(VideoPlayer, {
    attachTo: document.body,
    props: { src: '/clip.mp4', label: 'Product tour', ...props },
  })
  const video = wrapper.get('video').element as HTMLVideoElement
  return { wrapper, video, root: wrapper.get('[role="group"]') }
}

function startPlayback(props: Partial<VideoPlayerProps> = {}) {
  const mounted = mountVideo(props)
  return { ...mounted, playback: fakePlayback(mounted.video) }
}

function bigPlay(wrapper: ReturnType<typeof mountVideo>['wrapper']) {
  return wrapper.find('.astryx-video-player__big-play button')
}

function pointer(target: Element, type: string, pointerType: string): void {
  target.dispatchEvent(new PointerEvent(type, { pointerType, bubbles: true }))
}

describe('videoPlayer', () => {
  it('passes the source, captions, and sizing through to the video', () => {
    const { video, root } = mountVideo({
      poster: '/clip.jpg',
      aspectRatio: 4 / 3,
      captions: [
        { src: '/en.vtt', label: 'English', language: 'en', isDefault: true },
        { src: '/zh.vtt', label: '中文', language: 'zh', kind: 'subtitles' },
      ],
    })
    expect(root.classes()).toContain('astryx-video-player')
    expect((root.element as HTMLElement).style.aspectRatio).toContain('1.333')
    expect(video.getAttribute('poster')).toBe('/clip.jpg')
    expect(video.getAttribute('preload')).toBe('metadata')
    const tracks = [...video.querySelectorAll('track')]
    expect(tracks.map(track => [track.getAttribute('kind'), track.getAttribute('srclang'), track.hasAttribute('default')]))
      .toEqual([['captions', 'en', true], ['subtitles', 'zh', false]])
  })

  it('mutes an autoplaying video so the browser lets it start', () => {
    const { video } = mountVideo({ hasAutoPlay: true, isLooping: true })
    expect(video.hasAttribute('autoplay')).toBe(true)
    expect(video.muted).toBe(true)
    expect(video.hasAttribute('loop')).toBe(true)
  })

  it('keeps the large play button out of the tab order and plays from it', async () => {
    const { wrapper, root, playback } = startPlayback()
    await nextTick()
    const button = bigPlay(wrapper)
    expect(button.attributes('tabindex')).toBe('-1')
    expect(button.attributes('aria-hidden')).toBe('true')
    await button.trigger('click')
    expect(playback.play).toHaveBeenCalledTimes(1)
    expect(document.activeElement).toBe(root.element)
    expect(bigPlay(wrapper).exists()).toBe(false)
    playback.end()
    await nextTick()
    expect(bigPlay(wrapper).exists()).toBe(true)
  })

  it('keeps the bar behind the large play button until playback starts, then hides it when idle', async () => {
    vi.useFakeTimers()
    const { wrapper, video } = startPlayback()
    await nextTick()
    const bar = wrapper.get('.astryx-video-player__bar')
    expect(bar.attributes('data-before-playback')).toBe('true')
    expect(bar.attributes('data-visible')).toBe('true')
    await video.play()
    await nextTick()
    expect(bar.attributes('data-before-playback')).toBeUndefined()
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(bar.attributes('data-visible')).toBe('false')
  })

  it('shows a retry action when the media fails and reloads it', async () => {
    const { wrapper, playback } = startPlayback()
    playback.fail()
    await nextTick()
    expect(wrapper.text()).toContain('This media can\'t be played.')
    const retry = wrapper.findAll('button').find(button => button.text() === 'Try again')
    expect(retry).toBeDefined()
    await retry!.trigger('click')
    expect(playback.load).toHaveBeenCalledTimes(1)
    await nextTick()
    expect(wrapper.text()).not.toContain('This media can\'t be played.')
    expect(bigPlay(wrapper).exists()).toBe(true)
  })

  it('shows a spinner hidden from assistive technology while playback waits for data', async () => {
    const { wrapper, video, playback } = startPlayback()
    await video.play()
    expect(wrapper.find('.astryx-video-player__center .astryx-spinner').exists()).toBe(false)
    playback.fire('waiting')
    await nextTick()
    const spinner = wrapper.get('.astryx-video-player__center .astryx-spinner')
    expect(spinner.attributes('aria-hidden')).toBe('true')
  })

  it('plays and pauses on a mouse click on the picture', async () => {
    const { wrapper, playback } = startPlayback()
    const surface = wrapper.get('.astryx-video-player__surface')
    pointer(surface.element, 'pointerdown', 'mouse')
    await surface.trigger('click')
    expect(playback.play).toHaveBeenCalledTimes(1)
    pointer(surface.element, 'pointerdown', 'mouse')
    await surface.trigger('click')
    expect(playback.pause).toHaveBeenCalledTimes(1)
  })

  it('on touch, shows or hides the controls with a tap instead of pausing', async () => {
    const { wrapper, video, playback } = startPlayback()
    await video.play()
    await nextTick()
    const bar = wrapper.get('.astryx-video-player__bar')
    const surface = wrapper.get('.astryx-video-player__surface')
    pointer(surface.element, 'pointerdown', 'touch')
    await surface.trigger('click')
    expect(bar.attributes('data-visible')).toBe('false')
    pointer(surface.element, 'pointerdown', 'touch')
    await surface.trigger('click')
    expect(bar.attributes('data-visible')).toBe('true')
    expect(playback.pause).not.toHaveBeenCalled()
  })

  it('tints the empty timeline track on the bar and compacts the bar at 360px or narrower', () => {
    const css = videoPlayerCss.replace(/\s+/g, ' ')
    expect(css).toMatch(/--_media-timeline-track: color-mix\(in srgb, var\(--astryx-color-accent[^)]*\) 24%, transparent\)/)
    const compact = css.slice(css.indexOf('@container (max-width: 360px)'))
    expect(compact).not.toBe(css)
    expect(compact).toContain('--astryx-size-element-md: var(--astryx-size-element-sm')
    expect(compact).toMatch(/\.astryx-video-player__bar \.astryx-video-player__time \{ display: none/)
  })
})
