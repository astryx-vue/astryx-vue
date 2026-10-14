---
layout: component-docs
title: Aspect Ratio
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { aspectRatioCircle, aspectRatioGallery, aspectRatioSkeleton, aspectRatioSquare, aspectRatioWidescreen } from '../../../../components/demos/aspect-ratio'
</script>

## Usage

`AspectRatio` keeps a fixed width-to-height ratio as its container changes size. Use it for images, video, thumbnails, and other media that should stay in proportion. The width comes from the parent, and the height is derived from `ratio`, so an ancestor needs a definite width.

```vue
<script setup lang="ts">
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
</script>

<template>
  <AspectRatio :ratio="16 / 9" fit="cover">
    <img alt="Landscape" src="/photo.jpg">
  </AspectRatio>
</template>
```

`ratio` is width divided by height. Write `16 / 9` rather than a rounded decimal. `shape` is `rectangle` or `ellipse`; an ellipse with `ratio` `1` is a circle. `fit` sizes the child: `cover` fills and crops, `contain` letterboxes, and `center` keeps the natural size. Leave `fit` unset when the child sizes itself.

The ratio is written to the CSS variable `--astryx-aspect-ratio`, not as an inline `aspect-ratio` declaration, so a stylesheet can override it.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass one child when `fit` is set. Every direct child is stretched, so put an overlay inside that child. |
| <Badge variant="success">Do</Badge> | Give images an `alt`, or `alt=""` when the image is decorative. The ratio box adds no accessible name of its own. |
| <Badge variant="error">Don't</Badge> | Use it as a general layout container. Use `Section`, `Card`, or `Layout` for page regions. |
| <Badge variant="error">Don't</Badge> | Set only a height. The width comes from the container, so a lone height clamps the box off ratio. |

## Examples

<DemoExample :demo="aspectRatioCircle" description="shape ellipse with ratio 1 clips the image to a circle." locale="en" title="Circle" />

<DemoExample :demo="aspectRatioGallery" description="A grid of images that share a 4:3 frame." locale="en" title="Image gallery" />

<DemoExample :demo="aspectRatioSquare" description="A 1:1 frame for an avatar or a square image." locale="en" title="Square" />

<DemoExample :demo="aspectRatioWidescreen" description="A 16:9 frame around an image." locale="en" title="Widescreen" />

<DemoExample :demo="aspectRatioSkeleton" description="The frame holds a skeleton while the image is still loading." locale="en" title="Loading skeleton" />
