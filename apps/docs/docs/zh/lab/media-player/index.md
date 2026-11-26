---
title: MediaPlayer
---

# MediaPlayer

用一组控件拼出自己的视频或音频播放器。真正播放的是浏览器自带的 `<video>` / `<audio>`，所以浏览器能播的格式都不用额外装库；控件换成了跟随主题的样式。

<script setup lang="ts">
import { labMediaPlayer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labMediaPlayer" description="一个完整的录音播放条，和一个只有播放键和剩余时间的语音便签。百分比由自定义组件用 useMediaPlayer 读出。" locale="zh" title="自定义布局" /></ClientOnly>

## 导入

```ts
import {
  MediaCaptionsButton,
  MediaFullscreenButton,
  MediaPlaybackRate,
  MediaPlayButton,
  MediaPlayer,
  MediaPlayerElement,
  MediaSeekButton,
  MediaTime,
  MediaTimeSlider,
  MediaVolume,
  useMediaPlayer,
} from '@astryx-vue/lab'
```

## 结构

`MediaPlayer` 是外框：它记着播放状态，并把状态交给里面的每个控件。里面放一个 `MediaPlayerElement`，再按需要放控件，控件怎么排由你决定。

```vue
<MediaPlayer label="产品导览">
  <MediaPlayerElement kind="video" src="/media/tour.mp4" poster="/media/tour.jpg">
    <track kind="captions" src="/media/tour.zh.vtt" srclang="zh" label="中文">
  </MediaPlayerElement>
  <HStack :gap="1" align="center">
    <MediaPlayButton />
    <MediaSeekButton :offset="-10" />
    <MediaTimeSlider />
    <MediaTime />
    <MediaCaptionsButton />
    <MediaVolume />
    <MediaFullscreenButton />
  </HStack>
</MediaPlayer>
```

## 键盘

焦点在播放器里面时可以用这些键。每次用快捷键改了什么，读屏软件都会念出来。

| 按键 | 作用 |
| --- | --- |
| `Space` / `K` | 播放或暂停。焦点在按钮上时，`Space` 留给按钮自己。 |
| `M` | 静音或取消静音。 |
| `F` | 进入或退出全屏。 |
| `C` | 打开或关闭字幕。 |
| `←` / `→` | 后退或前进 5 秒。 |
| `J` / `L` | 后退或前进 10 秒。 |
| `↑` / `↓` | 调大或调小音量。 |
| `0` – `9` | 跳到媒体的第几成，比如 `5` 跳到一半。 |
| `<` / `>` | 换到上一档或下一档速度。 |

时间轴和音量是滑块：方向键在时间轴上跳 5 秒，`Page Up` / `Page Down` 跳 10 秒。在输入框里打字、或者按着 `Ctrl` / `⌘` / `Alt` 时不触发快捷键。

## 控件自动隐藏

播放时，鼠标或键盘停下 2 秒后，播放器根元素上的 `data-controls` 变成 `hidden`，鼠标移出播放器也会马上藏起。暂停时一直是 `visible`。键盘焦点在控件上、正在拖时间轴、或者菜单开着时，控件不会藏起。触摸屏上不计时：点一下出来，再点一下藏起。布局可以按 `data-controls` 给控件条加淡出动画。

## MediaPlayer

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | 必填 | 播放器的无障碍名称，比如媒体的标题。 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `play` | `()` | 开始或继续播放。 |
| `pause` | `()` | 暂停。 |
| `ended` | `()` | 播放到结尾。 |
| `error` | `(error: MediaPlayerError)` | 浏览器加载或播放失败。`error.code` 是 MediaError 的代码。 |

## MediaPlayerElement

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `kind` | `'video' \| 'audio'` | 必填 | 渲染 `<video>` 还是 `<audio>`。 |
| `src` | `string` | `undefined` | 媒体地址。也可以在默认插槽里放 `<source>`。 |
| `poster` | `string` | `undefined` | 只对视频有效：播放前显示的图片。 |
| `preload` | `'none' \| 'metadata' \| 'auto'` | 浏览器默认 | 提前加载多少。 |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | `undefined` | 跨域请求方式，跨域字幕需要它。 |
| `autoplay` / `muted` / `loop` | `boolean` | `false` | 和原生属性一样。 |
| `playsInline` | `boolean` | `true` | 只对视频有效：在 iPhone 上就地播放，不进系统播放器。 |

默认插槽放字幕 `<track>` 和备用格式的 `<source>`。原生控件始终关闭。

## 控件

| 组件 | 属性 | 说明 |
| --- | --- | --- |
| `MediaPlayButton` | `variant?: 'primary' \| 'secondary' \| 'ghost'`，默认 `'ghost'` | 播放、暂停；播完后变成「重播」。 |
| `MediaSeekButton` | `offset: number` | 后退（负数）或前进若干秒。时长读到之前不可用。 |
| `MediaTimeSlider` | `chapters?`、`markers?` | 时间轴，见下文。 |
| `MediaTime` | `display?: 'current' \| 'duration' \| 'remaining' \| 'current-duration'`，默认 `'current-duration'` | 播放时间。直播流显示「直播」。 |
| `MediaVolume` | `hasSlider?: boolean`，默认 `true`；`sliderPlacement?: 'start' \| 'end'`，默认 `'start'` | 静音按钮。悬停或聚焦时旁边展开音量滑块，触屏上一直展开。浏览器不让脚本调音量时（iOS）只有静音按钮。 |
| `MediaPlaybackRate` | `variant?: 'slider' \| 'menu'`，默认 `'slider'`；`rates?: number[]`；`sliderPlacement?`，默认 `'end'` | 速度。`slider` 的按钮在正常速度和上一次用的速度之间切换，旁边展开速度滑块；`menu` 的按钮打开速度菜单。 |
| `MediaCaptionsButton` | — | 字幕开关。媒体没有字幕轨道时不渲染。 |
| `MediaFullscreenButton` | — | 全屏开关。浏览器不支持全屏时不渲染。 |

按钮类控件都有 `size?: 'sm' | 'md' | 'lg'`（28、32、36px），不传时跟随外层尺寸。播放器宽度不超过 480px 时，音量和速度旁边的滑块不再展开，只留按钮。

## 时间轴

拖动时只预览时间，松手才真正跳过去。时间轴在任何书写方向下都从左往右，因为它表示的是时间，不是阅读顺序。读屏念出的值类似「1 分 5 秒，共 2 分钟」，后面接上所在章节和附近的标记。

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `chapters` | `{ start: number, title: string }[]` | 章节，画成几段，中间留小缝。指针预览显示章节名，读值时也会带上。 |
| `markers` | `{ time: number, label: string, content?: () => VNodeChild }[]` | 关注点，比如带时间戳的评论，画成点。时间轴的值离标记 2.5 秒以内时会念出它。带 `content` 的标记是一个按钮：按下跳到它的时间，并在气泡里打开内容。 |

## useMediaPlayer

在 `MediaPlayer` 里面的任何组件都能调用 `useMediaPlayer()`。它返回 `state`（一个 ref，包含 `isPaused`、`currentTime`、`duration`、`volume`、`playbackRate`、`textTracks`、`error` 等）和控制方法：`play`、`pause`、`togglePaused`、`seek`、`seekBy`、`setVolume`、`setMuted`、`toggleMuted`、`setPlaybackRate`、`toggleFullscreen`、`setTextTrack`、`toggleCaptions`、`reload`。在播放器外面调用会报错。

需要每帧更新的读数（比如自己画的进度）用 `useMediaPlaybackTime()`：播放时它按动画帧平滑前进，系统开启「减少动态效果」时只跟着媒体的 `timeupdate` 走。

## 文案和图标

按钮名称、读屏播报和错误提示内置英文和简体中文，跟随 `InternationalizationProvider` 的 `locale`。图标先找主题里的 `media:play`、`media:pause` 等语义图标（完整列表见 `MEDIA_ICON_KEYS`），主题没配时用内置的线条图标。
