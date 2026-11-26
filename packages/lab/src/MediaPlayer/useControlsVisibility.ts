import type { ComputedRef, ShallowRef } from 'vue'
import type { MediaControlsHold } from './context.js'
import type { MediaPlayerState } from './types.js'
import { computed, onScopeDispose, ref, watch } from 'vue'

/** 播放时鼠标或键盘停下多久后藏起控件。 */
export const IDLE_DELAY_MS = 2000

export interface ControlsVisibility {
  isControlsVisible: ComputedRef<boolean>
  wakeControls: () => void
  /** 刚刚是触摸输入：之后不再计时，点一下显示、再点一下藏起。 */
  markTouch: () => void
  holdControls: (hold: MediaControlsHold, isHeld: boolean) => void
  /** 鼠标离开播放器，没有原因留着控件时立刻藏起。 */
  hideControls: () => void
  toggleControls: () => void
}

/**
 * 决定控件什么时候显示。鼠标或键盘让控件出现，播放时空闲计时到点就藏起。
 * 触摸之后不计时：点一下出来，再点一下藏起。暂停时控件一直显示。
 */
export function useControlsVisibility(state: Readonly<ShallowRef<MediaPlayerState>>): ControlsVisibility {
  const isPlaying = computed(() => !state.value.isPaused && !state.value.isEnded)
  const isIdle = ref(false)
  const holds = new Set<MediaControlsHold>()
  let timer: ReturnType<typeof setTimeout> | null = null
  let isTouch = false

  function clearTimer(): void {
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
  }

  function scheduleIdle(): void {
    clearTimer()
    if (isTouch)
      return
    timer = setTimeout(() => {
      timer = null
      if (holds.size === 0)
        isIdle.value = true
    }, IDLE_DELAY_MS)
  }

  function wakeControls(): void {
    isTouch = false
    isIdle.value = false
    scheduleIdle()
  }

  function markTouch(): void {
    isTouch = true
    clearTimer()
  }

  function holdControls(hold: MediaControlsHold, isHeld: boolean): void {
    if (isHeld) {
      holds.add(hold)
      clearTimer()
      isIdle.value = false
    }
    else if (holds.delete(hold)) {
      scheduleIdle()
    }
  }

  function hideControls(): void {
    if (holds.size === 0) {
      clearTimer()
      isIdle.value = true
    }
  }

  function toggleControls(): void {
    if (!isPlaying.value) {
      // 暂停时控件留着，点一下不会把它们藏起。
      isIdle.value = false
      return
    }
    clearTimer()
    isIdle.value = isIdle.value ? false : holds.size === 0
  }

  // 空闲计时只在播放时跑。
  watch(isPlaying, (playing) => {
    if (playing)
      scheduleIdle()
    else
      clearTimer()
  }, { immediate: true })
  onScopeDispose(clearTimer)

  return {
    isControlsVisible: computed(() => !isPlaying.value || !isIdle.value),
    wakeControls,
    markTouch,
    holdControls,
    hideControls,
    toggleControls,
  }
}
