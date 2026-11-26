---
layout: component-docs
title: Lightbox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { lightboxGallery, lightboxHookGrid, lightboxVideo, lightboxZoom } from '../../../../components/demos/lightbox'
</script>

## Usage

`Lightbox` opens media in a native `<dialog>`. Bind `isOpen` with `v-model:is-open`. A single `media` object is one image or video. An array is a gallery: previous, next, and a counter stay mounted, and the ends disable instead of disappearing. The arrow keys follow the writing direction: in a right-to-left page ArrowLeft goes to the next item, like the Next button on the left. An index past either end shows the nearest item; a fraction rounds to the nearest one and `NaN` shows the first. A viewer opened before its first item arrives opens when that item does.

`useLightbox({ media })` owns the open state and the index. Bind `bindings` onto `Lightbox`, and call `open(index)` from a thumbnail.

A caption sits in a two-line band under the photo, on a backing that keeps it readable over any picture; a longer one ends in "more". A single photo with a caption uses the same band, and a photo with no caption has none.

`hasZoom` turns an image into a button. Double-click, Enter, Space, `+`, and `-` toggle between 1× and 2×, and `0` returns to the fitted size (Ctrl or Cmd with `0` stays the browser's page zoom). While zoomed, drag or the arrow keys pan; each arrow moves 50px. A drag does not also close the dialog. Video items keep the browser controls and do not zoom. `hasAutoPlay` starts a video when that item is shown in an open viewer; closing the viewer stops a playing video.

Escape and the close button emit `update:isOpen` with `false`. A click anywhere outside the photo and the caption band does the same, including the space beside a photo narrower than the viewer. Tab stays inside the open viewer, and a screen reader hears the item changes from inside it. When the viewer closes, or is removed while open, focus goes back to the element that opened it.

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

<DemoExample
  :demo="lightboxHookGrid"
  description="A photo grid that calls useLightbox directly: getTriggerProps(index) turns each thumbnail into a button that opens the gallery at that photo, with Enter and Space as well as a click."
  locale="en"
  title="useLightbox — Gallery Grid"
/>
