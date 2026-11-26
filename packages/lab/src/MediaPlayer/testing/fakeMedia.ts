import { vi } from 'vitest'

export interface FakeTrack {
  kind: 'captions' | 'subtitles'
  label: string
  language: string
  id?: string
  mode: 'disabled' | 'hidden' | 'showing'
}

export interface FakePlayback {
  play: ReturnType<typeof vi.fn>
  pause: ReturnType<typeof vi.fn>
  load: ReturnType<typeof vi.fn>
  getCurrentTime: () => number
  getPlaybackRate: () => number
  getVolume: () => number
  isMuted: () => boolean
  tracks: FakeTrack[]
  fire: (type: string) => void
  /** 播到结尾：停在最后一秒并触发 `ended`。 */
  end: () => void
  /** 浏览器报告媒体出错。 */
  fail: (code?: number) => void
}

/**
 * 给 happy-dom 的媒体元素装上能用的播放状态：play / pause 会改状态并触发事件，
 * 改 currentTime、volume、muted、playbackRate 时触发对应事件，像真浏览器那样。
 */
export function fakePlayback(
  element: HTMLMediaElement,
  { duration = 120, tracks = [] }: { duration?: number, tracks?: FakeTrack[] } = {},
): FakePlayback {
  let paused = true
  let ended = false
  let currentTime = 0
  let volume = 1
  let muted = false
  let playbackRate = 1
  let error: { code: number, message: string } | null = null
  const fire = (type: string): void => {
    element.dispatchEvent(new Event(type))
  }
  const textTracks = Object.assign(new EventTarget(), { length: tracks.length }, tracks)
  const play = vi.fn(() => {
    paused = false
    ended = false
    fire('play')
    fire('playing')
    return Promise.resolve()
  })
  const pause = vi.fn(() => {
    paused = true
    fire('pause')
  })
  const load = vi.fn()
  Object.defineProperties(element, {
    paused: { configurable: true, get: () => paused },
    ended: { configurable: true, get: () => ended },
    duration: { configurable: true, get: () => duration },
    error: { configurable: true, get: () => error },
    currentTime: {
      configurable: true,
      get: () => currentTime,
      set: (value: number) => {
        currentTime = value
        fire('timeupdate')
      },
    },
    volume: {
      configurable: true,
      get: () => volume,
      set: (value: number) => {
        volume = value
        fire('volumechange')
      },
    },
    muted: {
      configurable: true,
      get: () => muted,
      set: (value: boolean) => {
        muted = value
        fire('volumechange')
      },
    },
    playbackRate: {
      configurable: true,
      get: () => playbackRate,
      set: (value: number) => {
        playbackRate = value
        fire('ratechange')
      },
    },
    textTracks: { configurable: true, get: () => textTracks },
    play: { configurable: true, value: play },
    pause: { configurable: true, value: pause },
    load: { configurable: true, value: load },
  })
  fire('loadedmetadata')
  return {
    play,
    pause,
    load,
    tracks,
    fire,
    getCurrentTime: () => currentTime,
    getPlaybackRate: () => playbackRate,
    getVolume: () => volume,
    isMuted: () => muted,
    end: () => {
      paused = true
      ended = true
      currentTime = duration
      fire('ended')
    },
    fail: (code = 4) => {
      error = { code, message: 'unsupported' }
      fire('error')
    },
  }
}

/** 读屏播报区域里最新的那句话。播报写在下一个动画帧，先等一帧。 */
export async function readAnnouncement(politeness: 'polite' | 'assertive' = 'polite'): Promise<string> {
  await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
  return document.querySelector(`[aria-live="${politeness}"]`)?.textContent ?? ''
}

export function clearAnnouncements(): void {
  for (const region of document.querySelectorAll('[aria-live]'))
    region.textContent = ''
}
