---
layout: component-docs
title: Thumbnail
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { thumbnailDisabled, thumbnailGallery, thumbnailRemovable, thumbnailStates } from '../../../../components/demos/thumbnail'
</script>

## Usage

`Thumbnail` is a 64px preview. With no `src` it shows a placeholder. `isLoading` without `src` is a skeleton. `isLoading` with `src` covers the image with a spinner. Listen for `click` to make the preview a button, and for `remove` to show the dismiss control.

`showRemoveOn` is `hover` by default. The control also appears on keyboard focus, and it stays visible for a coarse pointer. `always` keeps it visible. `isDisabled` fades the thumbnail and ignores both events.

`label` is the accessible name. It is not drawn on the thumbnail. It is used by the tooltip and by the remove button.

```vue
<script setup lang="ts">
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
</script>

<template>
  <Thumbnail src="/photo.jpg" alt="Snowy mountain peaks" label="snowy-peaks.jpg" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give `alt` what the image shows, and `label` the file name a person would use to remove it. |
| <Badge variant="success">Do</Badge> | Use `showRemoveOn="always"` when the pointer may be coarse, or when removal is the main action. |
| <Badge variant="success">Do</Badge> | Keep a placeholder until a file has a preview, then pass `src`. |
| <Badge variant="error">Don't</Badge> | Put the file name in the visible square. The tooltip already carries `label`. |
| <Badge variant="error">Don't</Badge> | Attach `click` and expect it to fire while `isDisabled` or `isLoading` is set. |

## Examples

<DemoExample
  :demo="thumbnailDisabled"
  description="Thumbnails in the disabled state with reduced opacity. The remove button and click handler are suppressed when disabled."
  locale="en"
  title="Thumbnail — Disabled"
/>

<DemoExample
  :demo="thumbnailGallery"
  description="A row of clickable thumbnails with labels that open a detail view. Use for image attachment lists where users need to preview and manage uploads."
  locale="en"
  title="Thumbnail — Gallery"
/>

<DemoExample
  :demo="thumbnailRemovable"
  description="Thumbnails with a remove button overlay. The close button stays visible on both dark and light images."
  locale="en"
  title="Thumbnail — Removable"
/>

<DemoExample
  :demo="thumbnailStates"
  description="All visual states side by side: image loaded, placeholder, skeleton loading, and upload overlay."
  locale="en"
  title="Thumbnail — States"
/>
