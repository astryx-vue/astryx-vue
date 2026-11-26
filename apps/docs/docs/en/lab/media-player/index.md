---
title: MediaPlayer
---

# MediaPlayer

Build your own video or audio player from a set of parts. The browser's native `<video>` / `<audio>` element plays the media, so formats the browser plays need no extra library; the controls follow the theme.

<script setup lang="ts">
import { labMediaPlayer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labMediaPlayer" description="A full recording bar, and a voice note with only Play and the remaining time. A custom part reads the percentage with useMediaPlayer." locale="en" title="Custom layout" /></ClientOnly>

## Import

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

## Anatomy

`MediaPlayer` is the frame: it holds the playback state and shares it with every part inside. Put one `MediaPlayerElement` in it, then the parts you need, laid out however you like.

```vue
<MediaPlayer label="Product tour">
  <MediaPlayerElement kind="video" src="/media/tour.mp4" poster="/media/tour.jpg">
    <track kind="captions" src="/media/tour.en.vtt" srclang="en" label="English">
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

## Keyboard

These keys work while focus is inside the player. Screen readers announce what each shortcut changed.

| Key | Action |
| --- | --- |
| `Space` / `K` | Play or pause. On a button, `Space` stays with the button. |
| `M` | Mute or unmute. |
| `F` | Enter or exit fullscreen. |
| `C` | Turn captions on or off. |
| `←` / `→` | Back or forward 5 seconds. |
| `J` / `L` | Back or forward 10 seconds. |
| `↑` / `↓` | Volume up or down. |
| `0` – `9` | Jump to that tenth of the media; `5` jumps to the middle. |
| `<` / `>` | Previous or next speed. |

The timeline and volume are sliders: on the timeline the arrow keys skip 5 seconds and `Page Up` / `Page Down` skip 10. Shortcuts don't fire while typing in a field or with `Ctrl`, `⌘`, or `Alt` held.

## Hiding the controls

During playback, after 2 seconds without mouse or keyboard activity, `data-controls` on the player root turns `hidden`, and it turns `hidden` right away when the mouse leaves the player. While paused it stays `visible`. Keyboard focus on a control, dragging the timeline, or an open menu keeps the controls up. On touch there's no timer: a tap shows them and another tap hides them. Layouts can fade a control bar on `data-controls`.

## MediaPlayer

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | required | Accessible name of the player, such as the media title. |

| Event | Payload | Description |
| --- | --- | --- |
| `play` | `()` | Playback starts or resumes. |
| `pause` | `()` | Playback pauses. |
| `ended` | `()` | Playback reaches the end. |
| `error` | `(error: MediaPlayerError)` | The browser can't load or play the media. `error.code` is the MediaError code. |

## MediaPlayerElement

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `kind` | `'video' \| 'audio'` | required | Renders `<video>` or `<audio>`. |
| `src` | `string` | `undefined` | Media URL. You can also put `<source>` elements in the default slot. |
| `poster` | `string` | `undefined` | Video only: image shown before playback. |
| `preload` | `'none' \| 'metadata' \| 'auto'` | browser default | How much to load ahead. |
| `crossOrigin` | `'anonymous' \| 'use-credentials'` | `undefined` | CORS mode; cross-origin captions need it. |
| `autoplay` / `muted` / `loop` | `boolean` | `false` | Same as the native attributes. |
| `playsInline` | `boolean` | `true` | Video only: plays in place on iPhone instead of the system player. |

The default slot takes caption `<track>` and fallback `<source>` elements. Native controls are always off.

## Parts

| Part | Props | Description |
| --- | --- | --- |
| `MediaPlayButton` | `variant?: 'primary' \| 'secondary' \| 'ghost'`, default `'ghost'` | Play and Pause; Replay after the end. |
| `MediaSeekButton` | `offset: number` | Skips back (negative) or forward by that many seconds. Disabled until the duration is known. |
| `MediaTimeSlider` | `chapters?`, `markers?` | The timeline; see below. |
| `MediaTime` | `display?: 'current' \| 'duration' \| 'remaining' \| 'current-duration'`, default `'current-duration'` | Playback time. Shows Live for a stream. |
| `MediaVolume` | `hasSlider?: boolean`, default `true`; `sliderPlacement?: 'start' \| 'end'`, default `'start'` | Mute button that opens a volume slider beside it on hover or focus, always open on touch. Where the browser ignores script volume (iOS) it's Mute alone. |
| `MediaPlaybackRate` | `variant?: 'slider' \| 'menu'`, default `'slider'`; `rates?: number[]`; `sliderPlacement?`, default `'end'` | Speed. The `slider` button switches between normal and the last other speed and opens a speed slider beside it; the `menu` button opens a speed menu. |
| `MediaCaptionsButton` | — | Captions toggle. Not rendered for media without a caption track. |
| `MediaFullscreenButton` | — | Fullscreen toggle. Not rendered where fullscreen isn't available. |

Button parts take `size?: 'sm' | 'md' | 'lg'` (28, 32, 36px) and follow the surrounding size without it. In a player 480px wide or narrower, the volume and speed sliders stay closed and only the buttons show.

## Timeline

Dragging previews the time; the player seeks on release. The timeline runs left to right in every writing direction, because it shows time, not reading order. Screen readers hear a value like "1 minute, 5 seconds of 2 minutes", followed by the chapter and nearby markers.

| Name | Type | Description |
| --- | --- | --- |
| `chapters` | `{ start: number, title: string }[]` | Chapters, drawn as segments with a small gap. The pointer preview shows the title, and the value includes it. |
| `markers` | `{ time: number, label: string, content?: () => VNodeChild }[]` | Points of interest, such as timestamped comments, drawn as dots. The timeline speaks a marker when its value comes within 2.5 seconds of it. A marker with `content` is a button that jumps to its time and opens the content in a popover. |

## useMediaPlayer

Any component inside a `MediaPlayer` can call `useMediaPlayer()`. It returns `state` (a ref with `isPaused`, `currentTime`, `duration`, `volume`, `playbackRate`, `textTracks`, `error`, and more) and the actions `play`, `pause`, `togglePaused`, `seek`, `seekBy`, `setVolume`, `setMuted`, `toggleMuted`, `setPlaybackRate`, `toggleFullscreen`, `setTextTrack`, `toggleCaptions`, and `reload`. Calling it outside a player throws.

For readouts that update every frame, such as a custom progress bar, use `useMediaPlaybackTime()`: it advances smoothly on animation frames during playback, and follows the media's `timeupdate` alone when reduced motion is on.

## Messages and icons

Button names, announcements, and the error message ship in English and Simplified Chinese and follow the `InternationalizationProvider` `locale`. Icons use the theme's `media:play`, `media:pause`, and other semantic icons (see `MEDIA_ICON_KEYS`) and fall back to built-in line icons.
