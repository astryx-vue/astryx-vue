---
layout: component-docs
title: Avatar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarSizes, avatarShapes, avatarFallback, avatarStatus } from '../../../../components/demos/avatar'
</script>

## Usage

Import the component from its dedicated entry. Structural styles are loaded automatically.

Import the theme once at your app entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

Component usage:

```vue
<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
</script>

<template>
  <Avatar src="/user.jpg" name="John Doe" />
  <Avatar name="Jane Smith" size="xl" />
  <Avatar src="/user.jpg" name="John Doe">
    <template #status>
      <AvatarStatusDot variant="success" />
    </template>
  </Avatar>
</template>
```

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Always provide `name` for fallback text and accessible labeling. |
| <Badge variant="success">Recommended</Badge> | Use consistent avatar sizes in lists, comments, or chat messages. |
| <Badge variant="success">Recommended</Badge> | Use `AvatarStatusDot` inside the `status` slot to indicate presence or status. |
| <Badge variant="success">Recommended</Badge> | When the avatar acts as a link or button, provide a meaningful accessible name via `alt` or `name`. |
| <Badge variant="error">Don't</Badge> | Use avatars as a replacement for user names. Pair avatars with a name or label. |
| <Badge variant="error">Don't</Badge> | Use low-resolution images. Avatars are often clipped as circles, which magnifies blur. |

## Examples

<DemoExample
  :demo="avatarSizes"
  description="Avatars support xsm, sm, md, lg, xl named sizes as well as numeric pixel values."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="avatarShapes"
  description="Avatars come in circle, rounded, and square shapes. The default is circle."
  locale="en"
  title="Shapes"
/>

<DemoExample
  :demo="avatarFallback"
  description="When an image fails to load, the avatar falls back to initials; without a name, a default person icon is shown."
  locale="en"
  title="Fallback"
/>

<DemoExample
  :demo="avatarStatus"
  description="Place an AvatarStatusDot in the status slot to indicate user status."
  locale="en"
  title="Status"
/>
