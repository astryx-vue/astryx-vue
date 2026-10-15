---
layout: component-docs
title: Lightbox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { lightboxGallery, lightboxVideo, lightboxZoom } from '../../../../components/demos/lightbox'
</script>

## Usage

`Lightbox` opens media in a native `<dialog>`. Bind `isOpen` with `v-model:is-open`. A single `media` object is one image or video. An array is a gallery: previous, next, and a counter stay mounted, and the ends disable instead of disappearing.

`useLightbox({ media })` owns the open state and the index. Bind `bindings` onto `Lightbox`, and call `open(index)` from a thumbnail.

`hasZoom` turns an image into a button. Double-click, Enter, Space, `+`, and `-` toggle between 1× and 2×. While zoomed, drag or the arrow keys pan; each arrow moves 50px. A drag does not also close the dialog. Video items keep the browser controls and do not zoom. `hasAutoPlay` starts a video when that item is shown.

Escape and the close button emit `update:isOpen` with `false`. A backdrop click on the dialog or the frame does the same.

```vue
<script setup lang="ts">
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'

const photo = {
  src: '/template-assets/light-scene-horizontal-1.png',
  alt: 'Coastal shoreline with ocean waves',
  caption: 'A scenic coastline with waves rolling onto a sandy beach beneath a clear sky.',
}
const { bindings, open } = useLightbox({ media: photo })
</script>

<template>
  <Thumbnail :src="photo.src" :alt="photo.alt" :label="photo.alt" @click="open()" />
  <Lightbox v-bind="bindings" />
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Write an `alt` that names the picture, and a `caption` that adds what the picture itself does not say. |
| <Badge variant="success">Do</Badge> | Open a gallery at the thumbnail the reader chose, with `open(index)`. |
| <Badge variant="success">Do</Badge> | Turn on `hasZoom` only for a still image that has detail worth inspecting. |
| <Badge variant="error">Don't</Badge> | Put `hasZoom` on a video. The controls stay native, and zoom is ignored. |
| <Badge variant="error">Don't</Badge> | Leave `alt` empty. The dialog name and the image name both come from it. |

## Examples

<DemoExample
  :demo="lightboxGallery"
  description="A thumbnail grid that opens a fullscreen gallery. Clicking any thumbnail opens the lightbox at that index. Previous and next browse the rest without closing."
  locale="en"
  title="Gallery"
/>

<DemoExample
  :demo="lightboxVideo"
  description="Opens a video with the browser controls. Zoom and pan stay off for video."
  locale="en"
  title="Video"
/>

<DemoExample
  :demo="lightboxZoom"
  description="Double-click the image to zoom in, then drag to pan. Double-click again, or close, to leave zoom."
  locale="en"
  title="Zoom"
/>
