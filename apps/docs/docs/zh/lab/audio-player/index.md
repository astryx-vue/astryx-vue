---
title: AudioPlayer
---

# AudioPlayer

现成的音频播放器，适合播客、录音和音乐。上面是封面和标题，中间是时间轴和时间，下面一排是速度、快退、播放、快进和音量。整个播放器放在一个 Section 卡片里。

<script setup lang="ts">
import { labAudioPlayer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labAudioPlayer" description="没有封面时显示音频文件图标。这段音频很短，快退快进改成了 5 秒。" locale="zh" title="音频播放器" /></ClientOnly>

## 导入

```ts
import { AudioPlayer } from '@astryx-vue/lab'
```

```vue
<AudioPlayer
  src="/media/episode-12.mp3"
  title="为每一块屏幕设计"
  subtitle="界面漫谈"
  artwork-src="/media/show-cover.jpg"
  :on-previous-track="playPrevious"
  :on-next-track="playNext"
/>
```

## 系统媒体控制

开始播放后，播放器把标题、副标题和封面交给系统的媒体控制（比如手机锁屏、耳机按键、浏览器的媒体面板），系统上的播放、暂停、快退、快进和拖动进度都能用。传了 `onPreviousTrack` / `onNextTrack` 时，系统的上一首、下一首也会调用它们。页面上另一个播放器开始播放时，系统媒体控制交给那个播放器；播放器卸载时把它交出去的东西清掉。

## 封面

`artworkSrc` 的图片显示在标题前面，和标题两行一样高，宽度按 `artworkAspectRatio` 算。想放别的东西（比如视频截图）时用 `artwork` 插槽，它在屏幕上取代图片，`artworkSrc` 仍然交给系统媒体控制。都没有时显示通用的音频文件图标。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | 必填 | 音频地址。 |
| `title` | `string` | 必填 | 节目或曲目的标题，也是播放器的名字。 |
| `subtitle` | `string` | `undefined` | 节目名、艺人等补充信息。 |
| `artworkSrc` | `string` | `undefined` | 封面图地址。 |
| `artworkAspectRatio` | `number` | `1` | 封面的宽除以高。 |
| `label` | `string` | `title` | 播放器的无障碍名称。 |
| `skipBackSeconds` | `number` | `15` | 后退键跳多少秒。 |
| `skipForwardSeconds` | `number` | `30` | 前进键跳多少秒。 |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | 播放前加载多少。 |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | `undefined` | 音频的跨域方式。 |
| `onPreviousTrack` | `() => void` | `undefined` | 去播放队列里的上一首。传了才出现「上一首」按钮。 |
| `onNextTrack` | `() => void` | `undefined` | 去播放队列里的下一首。传了才出现「下一首」按钮。 |
| `chapters` | `MediaTimelineChapter[]` | `undefined` | 章节，见 [时间轴](/lab/media-player#时间轴)。 |
| `markers` | `MediaTimelineMarker[]` | `undefined` | 关注点，见 [时间轴](/lab/media-player#时间轴)。 |

| 插槽 | 说明 |
| --- | --- |
| `artwork` | 标题前面的媒体，取代 `artworkSrc` 的图片。 |

事件和 [VideoPlayer](/lab/video-player#事件) 一样：`play`、`pause`、`ended`、`error`。
