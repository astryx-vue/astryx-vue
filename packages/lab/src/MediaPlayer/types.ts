import type { VNodeChild } from 'vue'

/** 媒体元素提供的一条字幕轨道（captions 或 subtitles）。 */
export interface MediaTextTrackInfo {
  /** 稳定的标识：轨道自己的 `id`，没有时用语言、名称和位置拼出来。 */
  id: string
  label: string
  language: string
  kind: 'captions' | 'subtitles'
}

/** 媒体元素报告的播放失败。 */
export interface MediaPlayerError {
  /** MediaError 的代码：1 中止，2 网络，3 解码，4 不支持的来源。 */
  code: number
  message: string
}

/** 一个播放器的播放状态。每个值都从媒体元素读来。 */
export interface MediaPlayerState {
  isPaused: boolean
  isEnded: boolean
  /** 播放在等数据。 */
  isWaiting: boolean
  /** 这个来源加载后至少播放过一次。 */
  hasStarted: boolean
  /** 秒。 */
  currentTime: number
  /** 秒。元数据加载前是 0，直播流是 Infinity。 */
  duration: number
  /** 包含播放头的那段缓冲区的终点，单位秒。 */
  bufferedEnd: number
  /** 0 到 1。 */
  volume: number
  isMuted: boolean
  playbackRate: number
  isFullscreen: boolean
  /** 播放器或它的视频能进入全屏。 */
  canFullscreen: boolean
  /** 脚本能设置音量。浏览器不理脚本改音量时（iOS），由设备自己的音量键调。 */
  canSetVolume: boolean
  textTracks: readonly MediaTextTrackInfo[]
  activeTextTrackId: string | null
  error: MediaPlayerError | null
}

/** 驱动媒体元素的操作。 */
export interface MediaPlayerActions {
  /** 开始播放。浏览器接受或拒绝后才 resolve。 */
  play: () => Promise<void>
  pause: () => void
  togglePaused: () => void
  /** 把播放头移到某个时间（秒），夹在媒体范围内。 */
  seek: (time: number) => void
  /** 把播放头前后移动若干秒。 */
  seekBy: (offset: number) => void
  /** 音量 0 到 1。大于 0 时同时取消静音。 */
  setVolume: (volume: number) => void
  setMuted: (isMuted: boolean) => void
  toggleMuted: () => void
  setPlaybackRate: (rate: number) => void
  toggleFullscreen: () => void
  /** 显示一条字幕轨道，传 `null` 全部关掉。 */
  setTextTrack: (id: string | null) => void
  toggleCaptions: () => void
  /** 重新加载来源，比如网络出错之后。 */
  reload: () => void
}

/** 控件高度，用共享的元素尺寸档：28、32、36px。 */
export type MediaControlSize = 'sm' | 'md' | 'lg'

/** 展开的滑块出现在按钮的哪一侧（在从左到右的一行里）。 */
export type MediaSliderPlacement = 'start' | 'end'

/** `MediaTime` 显示什么。 */
export type MediaTimeDisplay = 'current' | 'duration' | 'remaining' | 'current-duration'

/** 媒体的一个章节，在时间轴上画成一段。 */
export interface MediaTimelineChapter {
  /** 章节开始的时间，单位秒。 */
  start: number
  /** 章节标题。指针预览会显示它，时间轴读值时也会带上它。 */
  title: string
}

/** 时间轴上的一个关注点，比如带时间戳的评论。 */
export interface MediaTimelineMarker {
  /** 标记的时间，单位秒。 */
  time: number
  /** 标记的名字。指针预览显示它，时间轴的值到达这里时也会读出它。 */
  label: string
  /**
   * 按下标记时在气泡里显示的内容，比如一串评论。有内容的标记是一个按钮，
   * 按下时还会跳到它的时间；没有内容的标记只是一个点。
   */
  content?: () => VNodeChild
}

export interface MediaPlayerProps {
  /** 播放器的无障碍名称，比如媒体的标题。 */
  label: string
}

export interface MediaPlayerEmits {
  /** 开始或继续播放。 */
  play: []
  /** 暂停。 */
  pause: []
  /** 播放到结尾。 */
  ended: []
  /** 媒体元素报错。 */
  error: [error: MediaPlayerError]
}

export interface MediaPlayerSlots {
  /** 媒体元素和各个控件。 */
  default?: () => unknown
}

export interface MediaPlayerElementProps {
  /** 渲染 `<video>` 还是 `<audio>`。 */
  kind: 'video' | 'audio'
  src?: string
  /** 只对视频有效：播放前显示的图片。 */
  poster?: string
  preload?: 'none' | 'metadata' | 'auto'
  crossOrigin?: 'anonymous' | 'use-credentials'
  autoplay?: boolean
  muted?: boolean
  loop?: boolean
  /** 只对视频有效：在 iPhone 上就地播放，不进系统播放器。默认 `true`。 */
  playsInline?: boolean
}

export interface MediaPlayerElementSlots {
  /** 字幕 `<track>` 或备用格式的 `<source>`。 */
  default?: () => unknown
}

export interface MediaButtonPartProps {
  /** 控件高度。不传时跟随外层尺寸，否则是 `'md'`。 */
  size?: MediaControlSize
}

export interface MediaPlayButtonProps extends MediaButtonPartProps {
  /** 按钮的强调程度。默认 `'ghost'`。 */
  variant?: 'primary' | 'secondary' | 'ghost'
}

export interface MediaSeekButtonProps extends MediaButtonPartProps {
  /** 移动的秒数：负数后退，正数前进。 */
  offset: number
}

export interface MediaVolumeProps extends MediaButtonPartProps {
  /**
   * 静音按钮被悬停或获得焦点时在旁边展开音量滑块，触屏上一直展开。默认 `true`。
   * 浏览器不理脚本改音量的地方永远不显示滑块，由设备自己的音量键调。
   */
  hasSlider?: boolean
  /** 滑块出现在静音按钮的哪一侧。默认 `'start'`，放在一行末尾的静音按钮展开时还在指针下面。 */
  sliderPlacement?: MediaSliderPlacement
}

export interface MediaTimeSliderProps {
  /** 章节，画成时间轴上的几段，中间留小缝。 */
  chapters?: readonly MediaTimelineChapter[]
  /** 关注点，比如带时间戳的评论，画成点。 */
  markers?: readonly MediaTimelineMarker[]
}

export interface MediaTimeProps {
  /** 显示当前时间、总时长、剩余时间，还是「当前 / 总时长」。默认 `'current-duration'`。 */
  display?: MediaTimeDisplay
}

export interface MediaPlaybackRateProps extends MediaButtonPartProps {
  /**
   * 怎么改速度。`'slider'`：按钮在正常速度和上一次的其他速度之间切换，悬停或聚焦时旁边展开速度滑块，触屏上一直展开。
   * `'menu'`：按钮打开速度菜单，当前速度打勾。默认 `'slider'`。
   */
  variant?: 'slider' | 'menu'
  /** 可选的速度，按顺序。默认 0.5、0.75、1、1.25、1.5、1.75、2，和 `<`、`>` 快捷键用的是同一组。 */
  rates?: readonly number[]
  /** 滑块变体里，滑块出现在按钮的哪一侧。默认 `'end'`。 */
  sliderPlacement?: MediaSliderPlacement
}
