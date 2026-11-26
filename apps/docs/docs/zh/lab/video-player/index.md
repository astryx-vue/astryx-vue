---
title: VideoPlayer
---

# VideoPlayer

现成的视频播放器。控件放在浮在画面底部的毛玻璃条里：鼠标移动、悬停或键盘操作时出现，播放时空闲 2 秒后往下沉并淡出。需要自己排控件时，改用 [MediaPlayer](/lab/media-player) 拼。

<script setup lang="ts">
import { labVideoPlayer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labVideoPlayer" description="点画面播放或暂停，双击全屏。时间轴上的点是一个关注点。" locale="zh" title="视频播放器" /></ClientOnly>

## 导入

```ts
import { VideoPlayer } from '@astryx-vue/lab'
```

```vue
<VideoPlayer
  src="/media/product-tour.mp4"
  poster="/media/product-tour.jpg"
  label="产品导览"
  :captions="[{ src: '/media/product-tour.zh.vtt', label: '中文', language: 'zh', isDefault: true }]"
/>
```

## 交互

- 开始播放前，画面中间是大播放键，控件条先藏着；键盘 Tab 进来时控件条会出现。大播放键不进 Tab 序，控件条上的播放键做同样的事。
- 鼠标点画面播放或暂停，双击进入或退出全屏。触摸屏上点一下画面显示或藏起控件，不会暂停。
- 缓冲时画面中间转圈；出错时显示提示和「重试」按钮，重试会重新加载视频。
- 播完后大播放键变成重播，控件条留在旁边，时间轴还够得着。
- 字幕摆在控件条上方，控件条出现或藏起时字幕不跳。字幕文件自己指定了位置的不动。
- 键盘快捷键和 [MediaPlayer](/lab/media-player#键盘) 一样。

## 窄播放器

播放器宽度不超过 480px 时，控件条上不放音量（静音还可以用 `M` 键）。不超过 360px 时控件条变紧凑：离边缘和按钮之间的距离变小，按钮变成小号，也不再显示时间。

## 属性

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | 必填 | 视频地址。 |
| `label` | `string` | 必填 | 播放器的无障碍名称，比如视频标题。 |
| `poster` | `string` | `undefined` | 播放前显示的图片。 |
| `captions` | `VideoPlayerCaptionTrack[]` | `undefined` | 字幕文件。有字幕时控件条上出现字幕开关。 |
| `aspectRatio` | `number` | `16 / 9` | 宽除以高。 |
| `hasAutoPlay` | `boolean` | `false` | 加载后静音自动播放（浏览器不允许有声自动播放）。浏览器仍然拒绝时，播放键照常可用。 |
| `isLooping` | `boolean` | `false` | 播完从头再播。 |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | 播放前加载多少。 |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | `undefined` | 视频和字幕文件的跨域方式，跨域字幕需要它。 |
| `chapters` | `MediaTimelineChapter[]` | `undefined` | 章节，见 [时间轴](/lab/media-player#时间轴)。 |
| `markers` | `MediaTimelineMarker[]` | `undefined` | 关注点，见 [时间轴](/lab/media-player#时间轴)。 |

`VideoPlayerCaptionTrack` 是 `{ src: string, label: string, language: string, kind?: 'captions' | 'subtitles', isDefault?: boolean }`。`isDefault` 的字幕一开始就打开。

## 事件

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `play` | `()` | 开始或继续播放。 |
| `pause` | `()` | 暂停。 |
| `ended` | `()` | 播放到结尾。 |
| `error` | `(error: MediaPlayerError)` | 浏览器加载或播放失败。 |
