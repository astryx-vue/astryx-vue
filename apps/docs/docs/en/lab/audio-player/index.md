---
title: AudioPlayer
---

# AudioPlayer

A ready-made audio player for podcasts, recordings, and music. Artwork and title sit on top, the timeline and times in the middle, and a row of speed, skip back, play, skip forward, and volume at the bottom. The whole player sits in a Section card.

<script setup lang="ts">
import { labAudioPlayer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labAudioPlayer" description="Without artwork the player shows an audio file icon. The clip is short, so both skips are 5 seconds." locale="en" title="Audio player" /></ClientOnly>

## Import

```ts
import { AudioPlayer } from '@astryx-vue/lab'
```

```vue
<AudioPlayer
  src="/media/episode-12.mp3"
  title="Designing for every screen"
  subtitle="The Interface Show"
  artwork-src="/media/show-cover.jpg"
  :on-previous-track="playPrevious"
  :on-next-track="playNext"
/>
```

## System media controls

Once it plays, the player hands its title, subtitle, and artwork to the system media controls (a phone's lock screen, headset buttons, the browser's media panel), and the system's play, pause, skip, and seek all work. With `onPreviousTrack` / `onNextTrack`, the system's previous and next track call them too. When another player on the page starts playing, the system controls move to it; a player clears what it handed over when it unmounts.

## Artwork

The `artworkSrc` image sits in front of the title, as tall as the two title lines, with its width from `artworkAspectRatio`. To show something else, such as a video still, use the `artwork` slot: it replaces the image on screen while `artworkSrc` still goes to the system media controls. With neither, the player shows a generic audio file icon.

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | required | The audio URL. |
| `title` | `string` | required | The episode or track title, also the player's name. |
| `subtitle` | `string` | `undefined` | Supporting detail, such as the show or artist. |
| `artworkSrc` | `string` | `undefined` | The artwork image URL. |
| `artworkAspectRatio` | `number` | `1` | The artwork's width divided by its height. |
| `label` | `string` | `title` | The player's accessible name. |
| `skipBackSeconds` | `number` | `15` | How far the back button skips. |
| `skipForwardSeconds` | `number` | `30` | How far the forward button skips. |
| `preload` | `'none' \| 'metadata' \| 'auto'` | `'metadata'` | How much to load before playback. |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | `undefined` | The CORS mode for the audio. |
| `onPreviousTrack` | `() => void` | `undefined` | Go to the previous item in your queue. The Previous track button appears only when set. |
| `onNextTrack` | `() => void` | `undefined` | Go to the next item in your queue. The Next track button appears only when set. |
| `chapters` | `MediaTimelineChapter[]` | `undefined` | Chapters, see [Timeline](/en/lab/media-player#timeline). |
| `markers` | `MediaTimelineMarker[]` | `undefined` | Points of interest, see [Timeline](/en/lab/media-player#timeline). |

| Slot | Description |
| --- | --- |
| `artwork` | Media in front of the title that replaces the `artworkSrc` image. |

Events match [VideoPlayer](/en/lab/video-player#events): `play`, `pause`, `ended`, and `error`.
