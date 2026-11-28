import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue'
import type { MediaStore } from './mediaStore.js'
import type { MediaPlayerActions, MediaPlayerState } from './types.js'
import { useMediaQuery } from '@astryx-vue/core'
import { computed, inject, shallowRef, watch } from 'vue'

/** 让控件在播放时保持显示的原因。 */
export type MediaControlsHold = 'focus' | 'scrub' | 'menu'

export interface MediaPlayerContext {
  store: MediaStore
  isControlsVisible: Readonly<Ref<boolean>>
  /** 显示控件，并重新开始空闲计时。 */
  wakeControls: () => void
  /** 让控件一直显示，直到同一个原因被释放。 */
  holdControls: (hold: MediaControlsHold, isHeld: boolean) => void
  /** 点一下画面：控件藏着就显示，显示着就藏起。点出来的控件留到下一次点。 */
  toggleControls: () => void
  /** 把键盘焦点移到播放器根元素上，给马上要消失、手里还拿着焦点的控件用。 */
  focusPlayer: () => void
  /** 指针拖动时间轴、还没松手提交时的预览时间。 */
  scrubTime: Ref<number | null>
}

/**
 * 标出时间轴标记气泡里的内容。那是页面自己的内容（比如评论串），
 * 里面的按键不触发播放器的快捷键。
 */
export const MARKER_CONTENT_ATTRIBUTE = 'data-media-marker-content'

export const mediaPlayerKey: InjectionKey<MediaPlayerContext> = Symbol('astryx-media-player')

export function useMediaPlayerContext(part: string): MediaPlayerContext {
  const context = inject(mediaPlayerKey, null)
  if (context == null)
    throw new Error(`${part} must be rendered inside a MediaPlayer.`)
  return context
}

/** `useMediaPlayer` 的返回值：播放状态加上驱动它的操作。 */
export interface UseMediaPlayerReturn extends MediaPlayerActions {
  state: Readonly<ShallowRef<MediaPlayerState>>
}

/**
 * 读最近一层 MediaPlayer 的播放状态，并拿到驱动它的操作。用来在 MediaPlayer 里面搭自定义控件。
 *
 * @example
 * ```ts
 * const { state, seek } = useMediaPlayer()
 * const percent = computed(() => state.value.duration > 0 ? state.value.currentTime / state.value.duration : 0)
 * ```
 */
export function useMediaPlayer(): UseMediaPlayerReturn {
  const { store } = useMediaPlayerContext('useMediaPlayer')
  return { ...store.actions, state: store.state }
}

/**
 * 播放位置。播放时每个动画帧往前推，所以进度在浏览器大约每秒四次的时间更新之间也走得平滑。
 * 每次时间更新、跳转、暂停、卡顿都会把它拉回媒体报告的时间。减少动态效果时只跟着时间更新走。
 *
 * @example
 * ```ts
 * const time = useMediaPlaybackTime()
 * ```
 */
export function useMediaPlaybackTime(): ComputedRef<number> {
  const { store } = useMediaPlayerContext('useMediaPlaybackTime')
  const state = store.state
  const currentTime = computed(() => state.value.currentTime)
  const isAdvancing = computed(() => !state.value.isPaused && !state.value.isEnded && !state.value.isWaiting)
  const duration = computed(() => state.value.duration)
  const playbackRate = computed(() => state.value.playbackRate)
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  // 平滑后的时间，以及它从哪个报告时间长出来。新的报告时间（比如跳转后）立刻生效。
  const smooth = shallowRef({ from: currentTime.value, time: currentTime.value })

  watch([currentTime, isAdvancing, isReducedMotion, duration, playbackRate], (_value, _old, onCleanup) => {
    if (!isAdvancing.value || isReducedMotion.value || typeof requestAnimationFrame !== 'function')
      return
    const from = currentTime.value
    const end = Number.isFinite(duration.value) && duration.value > 0 ? duration.value : Infinity
    const rate = playbackRate.value
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number): void => {
      smooth.value = { from, time: Math.min(from + (Math.max(now - startedAt, 0) / 1000) * rate, end) }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    onCleanup(() => cancelAnimationFrame(frame))
  }, { immediate: true })

  return computed(() => isAdvancing.value && !isReducedMotion.value && smooth.value.from === currentTime.value
    ? smooth.value.time
    : currentTime.value)
}
