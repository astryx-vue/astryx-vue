---
layout: component-docs
title: useImageMode
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useImageModePhotoCaption } from '../../../../components/demos/use-image-mode'
</script>

## Usage

Detects whether an image is predominantly dark or light by sampling pixels through `OffscreenCanvas`. Uses APCA perceptual lightness (sRGB linearization plus a power curve) for accurate detection, especially on saturated colors. Runs entirely off the paint path: no visible canvas, no layout thrash. Supports regional sampling for detecting luminance where text overlays will appear. Returns `null` while loading and falls back gracefully on CORS or network errors.

The image is fetched, drawn into a 10×10 offscreen canvas, and averaged, so a new `src` cancels the answer that is still in flight. `src` and `options` may be refs or getters.

```ts
import { useImageMode } from '@astryx-vue/core'
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pair with `MediaTheme` to automatically adapt text color over dynamic background images. |
| <Badge variant="success">Do</Badge> | Use the `region` option to sample only the area where text overlays will appear for more accurate results. |
| <Badge variant="error">Don't</Badge> | Use for images that change rapidly (e.g. video frames); each `src` change triggers a new fetch and analysis. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useImageModePhotoCaption"
  description="A photo banner with a caption over the sky. useImageMode samples only the strip under the caption and MediaTheme switches the caption between light and dark text from the result. A Beach photo switch swaps a night photo for a bright beach photo, and while the new photo loads the caption keeps the dark fallback."
  locale="en"
  title="useImageMode — Photo Caption"
/>
