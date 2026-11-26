import type { AnnounceFn } from '@astryx-vue/core'
import type { ComputedRef } from 'vue'
import type { MediaStore } from './mediaStore.js'
import type { MediaPlayerMessages } from './messages.js'
import { MARKER_CONTENT_ATTRIBUTE } from './context.js'
import { DEFAULT_PLAYBACK_RATES, formatRate, formatSpokenTime } from './mediaFormat.js'

/** 上下方向键一次改的音量（0 到 1）。 */
const VOLUME_STEP = 0.05

const NON_TEXT_INPUT_TYPES = ['button', 'checkbox', 'radio', 'range', 'reset', 'submit']

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  if (target.isContentEditable || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)
    return true
  return target instanceof HTMLInputElement && !NON_TEXT_INPUT_TYPES.includes(target.type)
}

/** 目标在时间轴标记的气泡里。那里的按键（比如回复评论）属于页面。 */
function isInMarkerContent(target: EventTarget | null): boolean {
  return target instanceof Element && target.closest(`[${MARKER_CONTENT_ATTRIBUTE}]`) != null
}

export interface MediaShortcutsOptions {
  store: MediaStore
  announce: AnnounceFn
  messages: ComputedRef<MediaPlayerMessages>
  locale: ComputedRef<string>
}

/**
 * 播放器根元素上的键盘快捷键，只在播放器里面生效。
 * 处理过的键都会 `preventDefault`；输入框和标记气泡里的键、带 Alt/Ctrl/Meta 的键不管。
 */
export function useMediaShortcuts({ store, announce, messages, locale }: MediaShortcutsOptions): (event: KeyboardEvent) => void {
  const { actions } = store

  return (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey)
      return
    const target = event.target
    if (isEditableTarget(target) || isInMarkerContent(target))
      return
    const element = target instanceof Element ? target : null
    const isOnControl = element?.closest('button, a[href], [role="menuitem"]') != null
    const isOnSlider = element?.getAttribute('role') === 'slider'
    const state = store.state.value
    const text = messages.value
    const hasDuration = Number.isFinite(state.duration) && state.duration > 0

    const announceTime = (): void => announce(formatSpokenTime(store.state.value.currentTime, locale.value))
    const seekBy = (offset: number): void => {
      if (!hasDuration)
        return
      actions.seekBy(offset)
      announceTime()
    }
    const changeVolume = (offset: number): void => {
      if (!state.canSetVolume)
        return
      const next = Math.round((state.isMuted ? 0 : state.volume) * 100 + offset * 100) / 100
      actions.setVolume(next)
      const percent = new Intl.NumberFormat(locale.value, { style: 'percent' }).format(Math.min(Math.max(next, 0), 1))
      announce(text.announceVolume(percent))
    }
    const stepRate = (direction: 1 | -1): void => {
      const rates = DEFAULT_PLAYBACK_RATES
      const index = rates.findIndex(rate => rate >= state.playbackRate)
      const current = index === -1 ? rates.length - 1 : index
      const next = rates[Math.min(Math.max(current + direction, 0), rates.length - 1)]
      if (next == null)
        return
      actions.setPlaybackRate(next)
      announce(text.announceSpeed(formatRate(next, locale.value)))
    }

    switch (event.key) {
      case ' ':
        if (isOnControl || isOnSlider)
          return
        actions.togglePaused()
        break
      case 'k':
      case 'K':
        actions.togglePaused()
        break
      case 'm':
      case 'M':
        actions.toggleMuted()
        announce(store.state.value.isMuted ? text.announceMuted : text.announceUnmuted)
        break
      case 'f':
      case 'F':
        if (!state.canFullscreen)
          return
        actions.toggleFullscreen()
        break
      case 'c':
      case 'C':
        if (state.textTracks.length === 0)
          return
        actions.toggleCaptions()
        announce(store.state.value.activeTextTrackId == null ? text.announceCaptionsOff : text.announceCaptionsOn)
        break
      case 'ArrowLeft':
      case 'ArrowRight':
        if (isOnSlider)
          return
        seekBy(event.key === 'ArrowLeft' ? -5 : 5)
        break
      case 'j':
      case 'J':
        seekBy(-10)
        break
      case 'l':
      case 'L':
        seekBy(10)
        break
      case 'ArrowUp':
      case 'ArrowDown':
        if (isOnSlider)
          return
        changeVolume(event.key === 'ArrowUp' ? VOLUME_STEP : -VOLUME_STEP)
        break
      case '<':
        stepRate(-1)
        break
      case '>':
        stepRate(1)
        break
      default: {
        const digit = /^\d$/.test(event.key) ? Number(event.key) : null
        if (digit == null || !hasDuration || isOnSlider)
          return
        actions.seek((state.duration * digit) / 10)
        announceTime()
      }
    }
    event.preventDefault()
  }
}
