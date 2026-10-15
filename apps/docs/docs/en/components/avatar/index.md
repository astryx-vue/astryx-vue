---
layout: component-docs
title: Avatar
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarFallbackChain, avatarInitials, avatarInteractive, avatarPhoto, avatarStatus, avatarTooltip, avatarUserCard } from '../../../../components/demos/avatar'
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


<ComponentAnatomy />

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
  :demo="avatarFallbackChain"
  description="Demonstrates the avatar fallback chain: primary image, fallback image, initials, then default icon."
  locale="en"
  title="Fallback chain"
/>

<DemoExample
  :demo="avatarInitials"
  description="Show initials instead of a photo. The avatar extracts the first and last initials from the name automatically. Use when you only have a user name."
  locale="en"
  title="Initials"
/>

<DemoExample
  :demo="avatarInteractive"
  description="Make an avatar interactive by passing href to render it as a link or a click listener to render it as a button. Both forms are focusable and show a focus-visible ring."
  locale="en"
  title="Interactive"
/>

<DemoExample
  :demo="avatarTooltip"
  description="By default an avatar shows its name in a tooltip on hover and keyboard focus. Pass a string to show custom text instead, or false to turn the tooltip off."
  locale="en"
  title="Tooltip"
/>

<DemoExample
  :demo="avatarUserCard"
  description="Place an avatar next to a name and role to create a user card row. Use for comment headers, contact lists, profile sections, or anywhere you need to identify a person."
  locale="en"
  title="User card"
/>

<DemoExample
  :demo="avatarPhoto"
  description="Show a profile photo at different sizes. Use when you have a user photo URL. If the image fails to load, initials are shown instead."
  locale="en"
  title="Photo"
/>

<DemoExample
  :demo="avatarStatus"
  description="Add a status dot to an avatar to show whether someone is online, away, or busy. Use in chat, messaging, or any UI where knowing availability matters."
  locale="en"
  title="Status dot"
/>
