import type { ComponentMessageDefaults } from '@astryx-vue/core'
import type { ComputedRef } from 'vue'
import { useComponentMessages } from '@astryx-vue/core'
import { computed } from 'vue'

/** 媒体播放器各个控件的内置文案，命名空间是 `mediaPlayer`。 */
export interface MediaPlayerMessages {
  play: string
  pause: string
  replay: string
  skipBack: (seconds: number) => string
  skipForward: (seconds: number) => string
  mute: string
  unmute: string
  volume: string
  /** 时间轴滑块的名字。 */
  seek: string
  /** 时间轴的读值，两个时间都是念出来的写法。 */
  timeValue: (current: string, duration: string) => string
  /** 时间轴读值后面接上章节或标记。 */
  timeValueContext: (value: string, context: string) => string
  timeReadout: (current: string, duration: string) => string
  timeRemaining: (remaining: string) => string
  previousTrack: string
  nextTrack: string
  /** 直播流没有总时长，时间位置显示这个。 */
  live: string
  captions: string
  enterFullscreen: string
  exitFullscreen: string
  playbackSpeed: string
  playbackSpeedValue: (rate: string) => string
  playbackRate: (rate: string) => string
  error: string
  retry: string
  announceMuted: string
  announceUnmuted: string
  announceCaptionsOn: string
  announceCaptionsOff: string
  announceVolume: (percent: string) => string
  announceSpeed: (rate: string) => string
}

export const mediaPlayerMessages: Record<'en' | 'zh-CN', MediaPlayerMessages> = {
  'en': {
    play: 'Play',
    pause: 'Pause',
    replay: 'Replay',
    skipBack: seconds => `Back ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`,
    skipForward: seconds => `Forward ${seconds} ${seconds === 1 ? 'second' : 'seconds'}`,
    mute: 'Mute',
    unmute: 'Unmute',
    volume: 'Volume',
    seek: 'Seek',
    timeValue: (current, duration) => `${current} of ${duration}`,
    timeValueContext: (value, context) => `${value}, ${context}`,
    timeReadout: (current, duration) => `${current} / ${duration}`,
    timeRemaining: remaining => `-${remaining}`,
    previousTrack: 'Previous track',
    nextTrack: 'Next track',
    live: 'Live',
    captions: 'Captions',
    enterFullscreen: 'Full screen',
    exitFullscreen: 'Exit full screen',
    playbackSpeed: 'Playback speed',
    playbackSpeedValue: rate => `Playback speed, ${rate}×`,
    playbackRate: rate => `${rate}×`,
    error: 'This media can\'t be played.',
    retry: 'Try again',
    announceMuted: 'Muted',
    announceUnmuted: 'Unmuted',
    announceCaptionsOn: 'Captions on',
    announceCaptionsOff: 'Captions off',
    announceVolume: percent => `Volume ${percent}`,
    announceSpeed: rate => `Speed ${rate}×`,
  },
  'zh-CN': {
    play: '播放',
    pause: '暂停',
    replay: '重播',
    skipBack: seconds => `后退 ${seconds} 秒`,
    skipForward: seconds => `前进 ${seconds} 秒`,
    mute: '静音',
    unmute: '取消静音',
    volume: '音量',
    seek: '播放进度',
    timeValue: (current, duration) => `${current}，共 ${duration}`,
    timeValueContext: (value, context) => `${value}，${context}`,
    timeReadout: (current, duration) => `${current} / ${duration}`,
    timeRemaining: remaining => `-${remaining}`,
    previousTrack: '上一首',
    nextTrack: '下一首',
    live: '直播',
    captions: '字幕',
    enterFullscreen: '全屏',
    exitFullscreen: '退出全屏',
    playbackSpeed: '播放速度',
    playbackSpeedValue: rate => `播放速度，${rate}×`,
    playbackRate: rate => `${rate}×`,
    error: '这个媒体无法播放。',
    retry: '重试',
    announceMuted: '已静音',
    announceUnmuted: '已取消静音',
    announceCaptionsOn: '字幕已打开',
    announceCaptionsOff: '字幕已关闭',
    announceVolume: percent => `音量 ${percent}`,
    announceSpeed: rate => `速度 ${rate}×`,
  },
}

/**
 * 读 `mediaPlayer` 命名空间的文案。外层 provider 的文案树里有这个命名空间时用树里的，
 * 否则按当前语言取内置的一份。
 */
export function useMediaPlayerMessages(): ComputedRef<MediaPlayerMessages> {
  // core 的 AstryxMessages 还没有 mediaPlayer 这一项，这里按同样的读法单独声明它。
  const messages = useComponentMessages({ mediaPlayer: mediaPlayerMessages } as unknown as ComponentMessageDefaults)
  return computed(() => (messages.value as unknown as { mediaPlayer: MediaPlayerMessages }).mediaPlayer)
}
