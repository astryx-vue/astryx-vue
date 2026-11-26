---
title: VideoPlayer
---

# VideoPlayer

A ready-made video player. Its controls sit in a frosted bar floating over the bottom of the picture: the bar appears on pointer movement, hover, or keyboard use, and sinks and fades out after 2 idle seconds of playback. To arrange the controls yourself, build with [MediaPlayer](/en/lab/media-player) instead.

<script setup lang="ts">
import { labVideoPlayer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labVideoPlayer" description="Click the picture to play or pause, double-click for full screen. The dot on the timeline is a marker." locale="en" title="Video player" /></ClientOnly>

## Import

```ts
import { VideoPlayer } from '@astryx-vue/lab'
```

```vue
<VideoPlayer
  src="/media/product-tour.mp4"
  poster="/media/product-tour.jpg"
  label="Product tour"
  :captions="[{ src: '/media/product-tour.en.vtt', label: 'English', language: 'en', isDefault: true }]"
/>
```

## Interaction

- Before playback, a large play button sits in the middle of the picture and the bar stays hidden; the bar appears when keyboard focus tabs into it. The large play button stays out of the tab order, since the bar's play button does the same thing.
- A mouse click on the picture plays or pauses, and a double-click enters or leaves full screen. On touch, a tap on the picture shows or hides the controls and never pauses.
- A spinner shows while the video buffers. On a failure the player shows a message and a Try again button that reloads the video.
- After the end the large button offers Replay, and the bar stays beside it so the timeline is in reach.
- Captions sit above the bar and don't jump when the bar shows or hides. Cues that set their own position stay where they are.
- Keyboard shortcuts match [MediaPlayer](/en/lab/media-player#keyboard).

## Narrow players

In a player 480px wide or narrower, the bar drops the volume control (`M` still mutes). At 360px or narrower the bar compacts: a smaller inset and gap, small buttons, and no time readout.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | required | The video URL. |
| `label` | `string` | required | The player's accessible name, such as the video title. |
| `poster` | `string` | `undefined` | The image shown before playback. |
| `captions` | `VideoPlayerCaptionTrack[]` | `undefined` | Caption files. With captions, the bar offers a captions toggle. |
| `aspectRatio` | `number` | `16 / 9` | Width divided by height. |
| `hasAutoPlay` | `boolean` | `false` | Start muted playback once loaded (browsers block autoplay with sound). If the browser still refuses, the play button works as usual. |
| `isLooping` | `boolean` | `false` | Start over at the end. |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | How much to load before playback. |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | `undefined` | The CORS mode for the video and caption files; cross-origin captions need it. |
| `chapters` | `MediaTimelineChapter[]` | `undefined` | Chapters, see [Timeline](/en/lab/media-player#timeline). |
| `markers` | `MediaTimelineMarker[]` | `undefined` | Points of interest, see [Timeline](/en/lab/media-player#timeline). |

`VideoPlayerCaptionTrack` is `{ src: string, label: string, language: string, kind?: 'captions' | 'subtitles', isDefault?: boolean }`. An `isDefault` track starts turned on.

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `play` | `()` | Playback starts or resumes. |
| `pause` | `()` | Playback pauses. |
| `ended` | `()` | Playback reaches the end. |
| `error` | `(error: MediaPlayerError)` | The browser failed to load or play the media. |
