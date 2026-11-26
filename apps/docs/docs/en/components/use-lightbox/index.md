---
layout: component-docs
title: useLightbox
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLightboxGallery } from '../../../../components/demos/use-lightbox'
</script>

## Usage

Headless hook that owns the open state and the gallery index for a `Lightbox`. Use it when thumbnails, buttons, or other controls outside the viewer decide what it shows.

```ts
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'
```

Bind `bindings` onto `Lightbox`, and call `open(index)` from a thumbnail:

```vue
<script setup lang="ts">
import { Lightbox, useLightbox } from '@astryx-vue/core/Lightbox'

const photos = [
  { src: '/a.png', alt: 'First photo', caption: 'The first photo.' },
  { src: '/b.png', alt: 'Second photo', caption: 'The second photo.' },
]
const { bindings, open } = useLightbox({ media: photos })
</script>

<template>
  <button v-for="(photo, index) in photos" :key="photo.src" type="button" @click="open(index)">
    {{ photo.alt }}
  </button>
  <Lightbox v-bind="bindings" />
</template>
```

`getTriggerProps(index)` returns `role="button"`, `tabindex="0"`, `aria-haspopup="dialog"`, and Enter or Space activation for a trigger that is not a native button. When the viewer closes, focus returns to the element that opened it.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give every thumbnail a name, such as the photo's `alt`, so people using a screen reader know what each one opens. |
| <Badge variant="success">Do</Badge> | Prefer the `Lightbox` component with `v-model:is-open` when one control opens a single viewer; reach for the hook when many triggers share one gallery. |
| <Badge variant="error">Don't</Badge> | Render one `Lightbox` per thumbnail: the gallery needs one viewer that knows the whole `media` array. |

## Examples

A grid of photo thumbnails that opens a fullscreen gallery at the clicked item.

<DemoExample :demo="useLightboxGallery" title="Gallery grid" description="Each thumbnail calls `open(index)`; the single `Lightbox` bound with `bindings` shows that photo and pages through the rest." locale="en" />
