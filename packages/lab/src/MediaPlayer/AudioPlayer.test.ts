import type { AudioPlayerProps } from './types.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import AudioPlayer from './AudioPlayer.vue'
import { fakePlayback } from './testing/fakeMedia.js'

enableAutoUnmount(afterEach)

function mountAudio(props: Partial<AudioPlayerProps> = {}, slots: Record<string, () => unknown> = {}) {
  const wrapper = mount(AudioPlayer, {
    attachTo: document.body,
    props: { src: '/episode.mp3', title: 'Designing for every screen', ...props },
    slots,
  })
  const audio = wrapper.get('audio').element as HTMLAudioElement
  return { wrapper, audio, root: wrapper.get('[role="group"]') }
}

function button(wrapper: ReturnType<typeof mountAudio>['wrapper'], label: string) {
  return wrapper.find(`button[aria-label="${label}"]`)
}

describe('audioPlayer', () => {
  it('sits in a section, is named by its title, and shows the subtitle', () => {
    const { wrapper, root } = mountAudio({ subtitle: 'The Interface Show' })
    expect(wrapper.get('.astryx-section').element.contains(root.element)).toBe(true)
    expect(root.attributes('aria-label')).toBe('Designing for every screen')
    expect(root.text()).toContain('The Interface Show')
    expect(wrapper.find('.astryx-audio-player__volume').exists()).toBe(true)
  })

  it('prefers an explicit label for the player name', () => {
    const { root } = mountAudio({ label: 'Episode 12' })
    expect(root.attributes('aria-label')).toBe('Episode 12')
  })

  it('shows an audio file icon without artwork, the image with one, and a custom artwork slot', () => {
    const placeholder = mountAudio()
    const artwork = placeholder.wrapper.get('.astryx-audio-player__artwork')
    expect(artwork.find('img').exists()).toBe(false)
    expect(artwork.find('.astryx-audio-player__artwork-placeholder svg').exists()).toBe(true)

    const image = mountAudio({ artworkSrc: '/cover.jpg' })
    expect(image.wrapper.get('.astryx-audio-player__artwork img').attributes('src')).toBe('/cover.jpg')

    const custom = mountAudio({}, { artwork: () => h('span', { class: 'custom-art' }) })
    expect(custom.wrapper.find('.astryx-audio-player__artwork .custom-art').exists()).toBe(true)
  })

  it('sizes the artwork to the height of the title lines at its aspect ratio', () => {
    const { wrapper } = mountAudio({ artworkAspectRatio: 1.5 })
    expect((wrapper.get('.astryx-audio-player__artwork').element as HTMLElement).style.width).toBe('72px')
  })

  it('skips back 15 seconds and forward 30 seconds by default', async () => {
    const { wrapper, audio } = mountAudio()
    const playback = fakePlayback(audio, { duration: 600 })
    await nextTick()
    await button(wrapper, 'Forward 30 seconds').trigger('click')
    expect(playback.getCurrentTime()).toBe(30)
    await button(wrapper, 'Back 15 seconds').trigger('click')
    expect(playback.getCurrentTime()).toBe(15)
  })

  it('offers previous and next track buttons only when their handlers are set', async () => {
    const plain = mountAudio()
    expect(button(plain.wrapper, 'Previous track').exists()).toBe(false)
    expect(button(plain.wrapper, 'Next track').exists()).toBe(false)

    const onPreviousTrack = vi.fn()
    const onNextTrack = vi.fn()
    const { wrapper } = mountAudio({ onPreviousTrack, onNextTrack })
    await button(wrapper, 'Previous track').trigger('click')
    await button(wrapper, 'Next track').trigger('click')
    expect(onPreviousTrack).toHaveBeenCalledTimes(1)
    expect(onNextTrack).toHaveBeenCalledTimes(1)
  })

  it('hands its metadata and actions to the system media controls once it plays', async () => {
    const handlers = new Map<string, ((details: Record<string, unknown>) => void) | null>()
    const session: Record<string, unknown> = {
      metadata: null,
      playbackState: 'none',
      setActionHandler: vi.fn((action: string, handler: ((details: Record<string, unknown>) => void) | null) => {
        handlers.set(action, handler)
      }),
    }
    Object.defineProperty(navigator, 'mediaSession', { configurable: true, value: session })
    vi.stubGlobal('MediaMetadata', class {
      constructor(public init: Record<string, unknown>) {}
    })
    try {
      const onNextTrack = vi.fn()
      const { wrapper, audio } = mountAudio({ subtitle: 'The Interface Show', artworkSrc: '/cover.jpg', onNextTrack })
      const playback = fakePlayback(audio, { duration: 600 })
      expect(session.metadata).toBeNull()
      await audio.play()
      await nextTick()
      expect((session.metadata as { init: Record<string, unknown> }).init).toMatchObject({
        title: 'Designing for every screen',
        artist: 'The Interface Show',
        artwork: [{ src: '/cover.jpg' }],
      })
      expect(session.playbackState).toBe('playing')
      expect(handlers.get('previoustrack')).toBeNull()
      handlers.get('nexttrack')?.({})
      expect(onNextTrack).toHaveBeenCalledTimes(1)
      handlers.get('seekforward')?.({})
      expect(playback.getCurrentTime()).toBe(30)
      handlers.get('seekbackward')?.({})
      expect(playback.getCurrentTime()).toBe(15)
      handlers.get('seekto')?.({ seekTime: 100 })
      expect(playback.getCurrentTime()).toBe(100)
      handlers.get('pause')?.({})
      expect(playback.pause).toHaveBeenCalledTimes(1)
      await nextTick()
      expect(session.playbackState).toBe('paused')

      wrapper.unmount()
      expect(session.metadata).toBeNull()
      expect(handlers.get('seekforward')).toBeNull()
    }
    finally {
      vi.unstubAllGlobals()
      Reflect.deleteProperty(navigator, 'mediaSession')
    }
  })
})
