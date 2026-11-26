import type { MediaStore } from './mediaStore.js'
import { onScopeDispose, watch } from 'vue'

export interface MediaSessionOptions {
  title: string
  subtitle?: string
  artworkSrc?: string
  skipBackSeconds: number
  skipForwardSeconds: number
  onPreviousTrack?: () => void
  onNextTrack?: () => void
}

const SESSION_ACTIONS = ['play', 'pause', 'seekbackward', 'seekforward', 'seekto'] as const
const TRACK_ACTIONS = ['previoustrack', 'nexttrack'] as const

function setHandler(session: MediaSession, action: MediaSessionAction, handler: MediaSessionActionHandler | null): void {
  try {
    session.setActionHandler(action, handler)
  }
  catch {
    // 不支持某个操作的浏览器会抛错，其他操作照常可用。
  }
}

/**
 * 这个播放器开始播放后，把标题、封面和播放操作交给系统的媒体控制（比如锁屏）。
 * 之后别的播放器接手时，它就不再管系统媒体控制。
 */
export function useMediaSession(store: MediaStore, read: () => MediaSessionOptions): void {
  if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || typeof MediaMetadata === 'undefined')
    return
  const session = navigator.mediaSession
  const { actions } = store
  let metadata: MediaMetadata | null = null
  const isOwner = (): boolean => metadata != null && session.metadata === metadata

  function claim(): void {
    const options = read()
    metadata = new MediaMetadata({
      title: options.title,
      artist: options.subtitle ?? '',
      artwork: options.artworkSrc != null ? [{ src: options.artworkSrc }] : [],
    })
    session.metadata = metadata
    const handlers: Record<(typeof SESSION_ACTIONS)[number], MediaSessionActionHandler> = {
      play: () => void actions.play(),
      pause: () => actions.pause(),
      seekbackward: details => actions.seekBy(-(details.seekOffset ?? read().skipBackSeconds)),
      seekforward: details => actions.seekBy(details.seekOffset ?? read().skipForwardSeconds),
      seekto: (details) => {
        if (details.seekTime != null)
          actions.seek(details.seekTime)
      },
    }
    for (const action of SESSION_ACTIONS)
      setHandler(session, action, handlers[action])
    // 系统的上一首、下一首调用的是当时最新的回调。
    setHandler(session, 'previoustrack', options.onPreviousTrack != null ? () => read().onPreviousTrack?.() : null)
    setHandler(session, 'nexttrack', options.onNextTrack != null ? () => read().onNextTrack?.() : null)
  }

  watch(store.state, (state) => {
    if (!state.isPaused && !isOwner())
      claim()
    if (isOwner())
      session.playbackState = state.isPaused ? 'paused' : 'playing'
  }, { flush: 'sync' })

  // 标题、封面、跳转秒数或有没有上一首、下一首变了，正在管系统媒体控制时马上换上新的。
  watch(() => {
    const options = read()
    return [options.title, options.subtitle, options.artworkSrc, options.skipBackSeconds, options.skipForwardSeconds, options.onPreviousTrack != null, options.onNextTrack != null]
  }, () => {
    if (isOwner())
      claim()
  })

  onScopeDispose(() => {
    if (!isOwner())
      return
    session.metadata = null
    for (const action of [...SESSION_ACTIONS, ...TRACK_ACTIONS])
      setHandler(session, action, null)
  })
}
