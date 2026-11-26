import type { VNodeChild } from 'vue'
import type { FakeTrack } from './testing/fakeMedia.js'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { useMediaPlaybackTime, useMediaPlayer } from './context.js'
import MediaCaptionsButton from './MediaCaptionsButton.vue'
import { formatSpokenTime } from './mediaFormat.js'
import MediaPlaybackRate from './MediaPlaybackRate.vue'
import MediaPlayButton from './MediaPlayButton.vue'
import MediaPlayer from './MediaPlayer.vue'
import MediaPlayerElement from './MediaPlayerElement.vue'
import MediaSeekButton from './MediaSeekButton.vue'
import MediaTime from './MediaTime.vue'
import MediaVolume from './MediaVolume.vue'
import { clearAnnouncements, fakePlayback, readAnnouncement } from './testing/fakeMedia.js'

enableAutoUnmount(afterEach)

beforeEach(() => {
  clearAnnouncements()
})

afterEach(() => {
  vi.useRealTimers()
})

interface MountOptions {
  duration?: number
  tracks?: FakeTrack[]
  listeners?: Record<string, (...args: unknown[]) => void>
}

function mountPlayer(children: () => VNodeChild, { duration = 120, tracks = [], listeners = {} }: MountOptions = {}) {
  const kind = 'video'
  const wrapper = mount(MediaPlayer, {
    attachTo: document.body,
    props: { label: 'Product tour', ...listeners },
    slots: {
      default: () => [h(MediaPlayerElement, { kind, src: '/clip.mp4' }), children()],
    },
  })
  const media = wrapper.find(kind).element as HTMLMediaElement
  const playback = fakePlayback(media, { duration, tracks })
  return { wrapper, media, playback, root: wrapper.get('[role="group"]') }
}

async function press(target: Element, key: string, init: KeyboardEventInit = {}): Promise<KeyboardEvent> {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init })
  target.dispatchEvent(event)
  await nextTick()
  return event
}

describe('mediaPlayer', () => {
  it('is a named focusable group around a media element without native controls', () => {
    const { root, media } = mountPlayer(() => null)
    expect(root.attributes('aria-label')).toBe('Product tour')
    expect(root.attributes('tabindex')).toBe('0')
    expect(media.hasAttribute('controls')).toBe(false)
    expect(media.hasAttribute('playsinline')).toBe(true)
  })

  it('plays, then offers Pause, and offers Replay after the end', async () => {
    const { wrapper, playback } = mountPlayer(() => h(MediaPlayButton))
    await nextTick()
    const button = wrapper.get('button')
    expect(button.attributes('aria-label')).toBe('Play')
    await button.trigger('click')
    expect(playback.play).toHaveBeenCalledTimes(1)
    expect(button.attributes('aria-label')).toBe('Pause')
    playback.end()
    await nextTick()
    expect(button.attributes('aria-label')).toBe('Replay')
  })

  it('emits play, pause, and ended once per change', async () => {
    const onPlay = vi.fn()
    const onPause = vi.fn()
    const onEnded = vi.fn()
    const { media, playback } = mountPlayer(() => null, { listeners: { onPlay, onPause, onEnded } })
    await media.play()
    playback.fire('timeupdate')
    media.pause()
    playback.fire('timeupdate')
    await media.play()
    playback.end()
    expect(onPlay).toHaveBeenCalledTimes(2)
    expect(onPause).toHaveBeenCalledTimes(1)
    expect(onEnded).toHaveBeenCalledTimes(1)
  })

  it('emits an error and announces it once', async () => {
    const onError = vi.fn()
    const { playback } = mountPlayer(() => null, { listeners: { onError } })
    playback.fail()
    playback.fire('timeupdate')
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith({ code: 4, message: 'unsupported' })
    expect(await readAnnouncement('assertive')).toBe('This media can\'t be played.')
  })

  it('handles shortcuts on the player and announces what they change', async () => {
    const { root, playback } = mountPlayer(() => null)
    const element = root.element

    expect((await press(element, 'k')).defaultPrevented).toBe(true)
    expect(playback.play).toHaveBeenCalledTimes(1)

    await press(element, 'm')
    expect(playback.isMuted()).toBe(true)
    expect(await readAnnouncement()).toBe('Muted')

    await press(element, 'ArrowRight')
    expect(playback.getCurrentTime()).toBe(5)
    expect(await readAnnouncement()).toBe(formatSpokenTime(5, 'en'))

    // 每次播报写在下一帧，先读出来再按下一个键，免得几帧挤在一起。
    await press(element, 'l')
    expect(playback.getCurrentTime()).toBe(15)
    expect(await readAnnouncement()).toBe(formatSpokenTime(15, 'en'))

    await press(element, '5')
    expect(playback.getCurrentTime()).toBe(60)
    expect(await readAnnouncement()).toBe(formatSpokenTime(60, 'en'))

    await press(element, '>')
    expect(playback.getPlaybackRate()).toBe(1.25)
    expect(await readAnnouncement()).toBe('Speed 1.25×')

    await press(element, 'm')
    expect(await readAnnouncement()).toBe('Unmuted')
    await press(element, 'ArrowDown')
    expect(playback.getVolume()).toBe(0.95)
    expect(await readAnnouncement()).toBe('Volume 95%')
  })

  it('ignores shortcuts typed in a field or with a modifier', async () => {
    const { wrapper, playback } = mountPlayer(() => h('input', { 'aria-label': 'Note' }))
    const field = wrapper.get('input').element
    const typed = await press(field, 'k')
    expect(typed.defaultPrevented).toBe(false)
    await press(wrapper.get('[role="group"]').element, 'k', { metaKey: true })
    expect(playback.play).not.toHaveBeenCalled()
  })

  it('leaves Space on a button to the button', async () => {
    const { wrapper, playback } = mountPlayer(() => h(MediaSeekButton, { offset: 10 }))
    await press(wrapper.get('button').element, ' ')
    expect(playback.play).not.toHaveBeenCalled()
  })

  it('hides the controls after 2 idle seconds of playback and shows them on mouse movement', async () => {
    vi.useFakeTimers()
    const { root, media } = mountPlayer(() => null)
    await media.play()
    await nextTick()
    expect(root.attributes('data-controls')).toBe('visible')
    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(root.attributes('data-controls')).toBe('hidden')
    root.element.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'mouse', bubbles: true }))
    await nextTick()
    expect(root.attributes('data-controls')).toBe('visible')
    root.element.dispatchEvent(new PointerEvent('pointerleave', { pointerType: 'mouse' }))
    await nextTick()
    expect(root.attributes('data-controls')).toBe('hidden')
  })

  it('keeps the controls visible while paused', async () => {
    vi.useFakeTimers()
    const { root } = mountPlayer(() => null)
    vi.advanceTimersByTime(5000)
    await nextTick()
    expect(root.attributes('data-controls')).toBe('visible')
  })

  it('holds the controls while keyboard focus is inside the player', async () => {
    vi.useFakeTimers()
    const { wrapper, root, media } = mountPlayer(() => h(MediaPlayButton))
    await media.play()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    // Vue 会跳过时间戳不晚于监听器挂上时刻的事件；假时钟停着，先让它走一点。
    vi.advanceTimersByTime(10)
    ;(wrapper.get('button').element as HTMLButtonElement).focus()
    vi.advanceTimersByTime(3000)
    await nextTick()
    expect(root.attributes('data-controls')).toBe('visible')
  })

  it('shows the captions button only for media with a caption track and toggles it', async () => {
    const tracks = [{ kind: 'captions' as const, label: 'English', language: 'en', mode: 'disabled' as const }]
    const withTracks = mountPlayer(() => h(MediaCaptionsButton), { tracks })
    await nextTick()
    const button = withTracks.wrapper.get('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    await button.trigger('click')
    expect(withTracks.playback.tracks[0]!.mode).toBe('showing')
    expect(button.attributes('aria-pressed')).toBe('true')
    await press(withTracks.root.element, 'c')
    expect(withTracks.playback.tracks[0]!.mode).toBe('disabled')
    expect(await readAnnouncement()).toBe('Captions off')

    const withoutTracks = mountPlayer(() => h(MediaCaptionsButton))
    await nextTick()
    expect(withoutTracks.wrapper.find('button').exists()).toBe(false)
  })
})

describe('media control parts', () => {
  it('skips by the seek button offset once the duration is known', async () => {
    const { wrapper, playback } = mountPlayer(() => [h(MediaSeekButton, { offset: -15 }), h(MediaSeekButton, { offset: 30 })])
    await nextTick()
    const [back, forward] = wrapper.findAll('button')
    expect(back!.attributes('aria-label')).toBe('Back 15 seconds')
    expect(forward!.attributes('aria-label')).toBe('Forward 30 seconds')
    await forward!.trigger('click')
    await back!.trigger('click')
    expect(playback.getCurrentTime()).toBe(15)
  })

  it('places the volume slider before Mute by default, or renders Mute alone', async () => {
    const withSlider = mountPlayer(() => h(MediaVolume))
    await nextTick()
    const slider = withSlider.wrapper.get('[role="slider"]').element
    const mute = withSlider.wrapper.get('button[aria-label="Mute"]').element
    expect(slider.compareDocumentPosition(mute) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    await withSlider.wrapper.get('button').trigger('click')
    expect(withSlider.playback.isMuted()).toBe(true)
    expect(withSlider.wrapper.get('button').attributes('aria-label')).toBe('Unmute')

    const alone = mountPlayer(() => h(MediaVolume, { hasSlider: false }))
    await nextTick()
    expect(alone.wrapper.find('[role="slider"]').exists()).toBe(false)
  })

  it('switches the speed between normal and the last other speed', async () => {
    const { wrapper, playback, root } = mountPlayer(() => h(MediaPlaybackRate))
    await nextTick()
    const button = wrapper.get('.astryx-media-playback-rate-button')
    expect(button.attributes('aria-label')).toBe('Playback speed, 1×')
    await button.trigger('click')
    expect(playback.getPlaybackRate()).toBe(1.25)
    await press(root.element, '>')
    await button.trigger('click')
    expect(playback.getPlaybackRate()).toBe(1)
    await button.trigger('click')
    expect(playback.getPlaybackRate()).toBe(1.5)
    expect(button.attributes('aria-label')).toBe('Playback speed, 1.5×')
  })

  it('reads the playback time in left-to-right order, and Live for a stream', async () => {
    const recorded = mountPlayer(() => h(MediaTime), { duration: 3725 })
    recorded.media.currentTime = 65
    await nextTick()
    const time = recorded.wrapper.get('.astryx-media-time')
    expect(time.attributes('dir')).toBe('ltr')
    expect(time.text()).toBe('0:01:05 / 1:02:05')

    const live = mountPlayer(() => h(MediaTime), { duration: Infinity })
    await nextTick()
    expect(live.wrapper.get('.astryx-media-time').text()).toBe('Live')
  })
})

describe('useMediaPlayer', () => {
  it('reads the state and drives the player', async () => {
    const Probe = defineComponent({
      setup() {
        const player = useMediaPlayer()
        const time = useMediaPlaybackTime()
        return () => h('button', { onClick: () => player.seek(30) }, `${player.state.value.isPaused ? 'paused' : 'playing'} ${time.value}`)
      },
    })
    const { wrapper } = mountPlayer(() => h(Probe))
    await nextTick()
    const button = wrapper.get('button')
    expect(button.text()).toBe('paused 0')
    await button.trigger('click')
    expect(button.text()).toBe('paused 30')
  })

  it('throws outside a MediaPlayer', () => {
    const Probe = defineComponent({
      setup() {
        useMediaPlayer()
        return () => null
      },
    })
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => mount(Probe)).toThrow('useMediaPlayer must be rendered inside a MediaPlayer.')
  })
})
