import type { ShallowRef } from 'vue'
import type { MediaPlayerActions, MediaPlayerState, MediaTextTrackInfo } from './types.js'
import { shallowRef } from 'vue'
import { enterFullscreen, exitFullscreen, readCanFullscreen, readFullscreen } from './fullscreen.js'

/** 一个播放器的状态仓库：媒体元素是唯一的数据来源，组件按需读 `state` 里的字段。 */
export interface MediaStore {
  state: Readonly<ShallowRef<MediaPlayerState>>
  attachMedia: (media: HTMLMediaElement | null) => void
  attachContainer: (container: HTMLElement | null) => void
  actions: MediaPlayerActions
}

export const INITIAL_MEDIA_STATE: MediaPlayerState = Object.freeze({
  isPaused: true,
  isEnded: false,
  isWaiting: false,
  hasStarted: false,
  currentTime: 0,
  duration: 0,
  bufferedEnd: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  isFullscreen: false,
  canFullscreen: false,
  canSetVolume: true,
  textTracks: [],
  activeTextTrackId: null,
  error: null,
})

const MEDIA_EVENTS = [
  'loadstart',
  'loadedmetadata',
  'durationchange',
  'timeupdate',
  'progress',
  'play',
  'playing',
  'pause',
  'ended',
  'waiting',
  'canplay',
  'seeking',
  'seeked',
  'volumechange',
  'ratechange',
  'error',
  'emptied',
  'webkitbeginfullscreen',
  'webkitendfullscreen',
] as const

/** iOS Safari 不理脚本写 `volume`，用一个探针元素看平台是否允许。 */
function canScriptSetVolume(): boolean {
  if (typeof document === 'undefined')
    return true
  try {
    const probe = document.createElement('audio')
    probe.volume = 0.5
    return probe.volume === 0.5
  }
  catch {
    return false
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function isCaptionTrack(track: TextTrack | undefined): track is TextTrack {
  return track != null && (track.kind === 'captions' || track.kind === 'subtitles')
}

function readTextTracks(media: HTMLMediaElement): Pick<MediaPlayerState, 'textTracks' | 'activeTextTrackId'> {
  const list = media.textTracks
  const textTracks: MediaTextTrackInfo[] = []
  let activeTextTrackId: string | null = null
  for (let index = 0; index < (list?.length ?? 0); index++) {
    const track = list[index]
    if (!isCaptionTrack(track))
      continue
    const id = track.id || `${track.language}:${track.label}:${index}`
    textTracks.push({ id, label: track.label, language: track.language, kind: track.kind as MediaTextTrackInfo['kind'] })
    if (track.mode === 'showing')
      activeTextTrackId = id
  }
  return { textTracks, activeTextTrackId }
}

function readBufferedEnd(media: HTMLMediaElement): number {
  const ranges = media.buffered
  let end = 0
  for (let index = 0; index < (ranges?.length ?? 0); index++) {
    // 留半秒余量，紧贴播放头开始的那段也算进来。
    if (ranges.start(index) <= media.currentTime + 0.5)
      end = Math.max(end, ranges.end(index))
  }
  return end
}

function sameTracks(a: readonly MediaTextTrackInfo[], b: readonly MediaTextTrackInfo[]): boolean {
  return a.length === b.length
    && a.every((track, index) => track.id === b[index]?.id && track.label === b[index]?.label && track.language === b[index]?.language)
}

export function createMediaStore(): MediaStore {
  const state = shallowRef<MediaPlayerState>(INITIAL_MEDIA_STATE)
  let media: HTMLMediaElement | null = null
  let container: HTMLElement | null = null
  let detachMedia: (() => void) | null = null
  let lastTextTrackId: string | null = null
  // 平台在页面生命周期里不会变，探一次就够所有媒体事件用。
  let canSetVolume: boolean | null = null

  /** 只在有字段真的变了时换掉整个状态对象，读某个字段的 computed 也就只在它变时更新。 */
  function setState(patch: Partial<MediaPlayerState>): void {
    const previous = state.value
    let hasChange = false
    for (const key of Object.keys(patch) as (keyof MediaPlayerState)[]) {
      if (key === 'textTracks') {
        if (sameTracks(previous.textTracks, patch.textTracks!))
          delete patch.textTracks
        else
          hasChange = true
      }
      else if (!Object.is(previous[key], patch[key])) {
        hasChange = true
      }
    }
    if (hasChange)
      state.value = { ...previous, ...patch }
  }

  function readAll(element: HTMLMediaElement): Partial<MediaPlayerState> {
    const duration = element.duration
    return {
      isPaused: element.paused,
      isEnded: element.ended,
      currentTime: element.currentTime,
      duration: Number.isNaN(duration) ? 0 : duration,
      bufferedEnd: readBufferedEnd(element),
      volume: element.volume,
      isMuted: element.muted,
      playbackRate: element.playbackRate,
      isFullscreen: readFullscreen(container, media),
      canFullscreen: readCanFullscreen(container, media),
      canSetVolume: (canSetVolume ??= canScriptSetVolume()),
      ...readTextTracks(element),
    }
  }

  function handleMediaEvent(event: Event): void {
    if (media == null)
      return
    const patch = readAll(media)
    switch (event.type) {
      case 'loadstart':
      case 'emptied':
        Object.assign(patch, { hasStarted: false, isWaiting: false, error: null })
        break
      case 'play':
        patch.hasStarted = true
        break
      case 'waiting':
        patch.isWaiting = true
        break
      case 'playing':
      case 'canplay':
      case 'pause':
      case 'seeked':
      case 'ended':
        patch.isWaiting = false
        break
      case 'error':
        patch.isWaiting = false
        patch.error = { code: media.error?.code ?? 0, message: media.error?.message ?? '' }
        break
    }
    setState(patch)
  }

  function handleTrackChange(): void {
    if (media == null)
      return
    const tracks = readTextTracks(media)
    if (tracks.activeTextTrackId != null)
      lastTextTrackId = tracks.activeTextTrackId
    setState(tracks)
  }

  function handleFullscreenChange(): void {
    setState({ isFullscreen: readFullscreen(container, media) })
  }

  function attachMedia(element: HTMLMediaElement | null): void {
    if (element === media)
      return
    detachMedia?.()
    detachMedia = null
    media = element
    if (element == null) {
      setState({ ...INITIAL_MEDIA_STATE, canFullscreen: readCanFullscreen(container, null) })
      return
    }
    for (const type of MEDIA_EVENTS)
      element.addEventListener(type, handleMediaEvent)
    const list = element.textTracks as TextTrackList | undefined
    // 有些 DOM 实现的轨道列表不是 EventTarget。
    const tracks = typeof list?.addEventListener === 'function' ? list : null
    const trackEvents = ['addtrack', 'removetrack', 'change'] as const
    for (const type of trackEvents)
      tracks?.addEventListener(type, handleTrackChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    detachMedia = () => {
      for (const type of MEDIA_EVENTS)
        element.removeEventListener(type, handleMediaEvent)
      for (const type of trackEvents)
        tracks?.removeEventListener(type, handleTrackChange)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
    setState({ ...readAll(element), hasStarted: !element.paused || element.currentTime > 0, error: null })
  }

  function attachContainer(element: HTMLElement | null): void {
    container = element
    setState({ canFullscreen: readCanFullscreen(container, media), isFullscreen: readFullscreen(container, media) })
  }

  function setTextTrack(id: string | null): void {
    const list = media?.textTracks
    if (media == null || list == null)
      return
    const { textTracks } = readTextTracks(media)
    let position = 0
    for (let index = 0; index < list.length; index++) {
      const track = list[index]
      if (!isCaptionTrack(track))
        continue
      track.mode = textTracks[position]?.id === id ? 'showing' : 'disabled'
      position++
    }
    if (id != null)
      lastTextTrackId = id
    setState({ activeTextTrackId: id })
  }

  const actions: MediaPlayerActions = {
    play: async () => {
      if (media == null)
        return
      try {
        await media.play()
      }
      catch {
        // 浏览器拒绝播放（比如自动播放策略）。状态还是暂停，播放按钮一直可用。
      }
    },
    pause: () => media?.pause(),
    togglePaused: () => {
      if (media == null)
        return
      if (media.paused || media.ended)
        void actions.play()
      else
        media.pause()
    },
    seek: (time) => {
      if (media == null || Number.isNaN(time))
        return
      const duration = media.duration
      const target = clamp(time, 0, Number.isFinite(duration) ? duration : Math.max(time, 0))
      media.currentTime = target
      setState({ currentTime: target, isEnded: media.ended })
    },
    seekBy: (offset) => {
      if (media != null)
        actions.seek(media.currentTime + offset)
    },
    setVolume: (volume) => {
      if (media == null)
        return
      const next = clamp(volume, 0, 1)
      media.volume = next
      if (next > 0 && media.muted)
        media.muted = false
      setState({ volume: media.volume, isMuted: media.muted })
    },
    setMuted: (isMuted) => {
      if (media == null)
        return
      media.muted = isMuted
      if (!isMuted && media.volume === 0)
        media.volume = 1
      setState({ volume: media.volume, isMuted: media.muted })
    },
    toggleMuted: () => {
      if (media != null)
        actions.setMuted(!media.muted)
    },
    setPlaybackRate: (rate) => {
      if (media != null && rate > 0) {
        media.playbackRate = rate
        setState({ playbackRate: media.playbackRate })
      }
    },
    toggleFullscreen: () => {
      if (readFullscreen(container, media))
        exitFullscreen(media)
      else
        enterFullscreen(container, media)
    },
    setTextTrack,
    toggleCaptions: () => {
      if (state.value.activeTextTrackId != null) {
        setTextTrack(null)
        return
      }
      const tracks = state.value.textTracks
      const next = tracks.find(track => track.id === lastTextTrackId) ?? tracks[0]
      if (next != null)
        setTextTrack(next.id)
    },
    reload: () => media?.load(),
  }

  return { state, attachMedia, attachContainer, actions }
}
