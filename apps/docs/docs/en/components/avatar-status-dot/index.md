---
layout: component-docs
title: Avatar Status Dot
outline: false
footer: false
---

<script setup lang="ts">
import { avatarStatusDotVariants } from '../../../../components/demos/avatar-status-dot'
</script>

## Usage

Status indicator dot for `Avatar`. Put one in the avatar's `status` slot and it sits on the bottom-right corner, showing whether someone is online, away, or busy. `variant` picks the colour.

Colour on its own does not reach everyone, so always pass `label` with the status words: a screen reader then announces the dot as an image with that name. Without `label` the dot is hidden from assistive technology, which is the right choice only when the same status is already written out next to the avatar.

```ts
import { AvatarStatusDot } from '@astryx-vue/core/Avatar'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="avatarStatusDotVariants" title="Variants" description="Presence dots on Avatars using the success, neutral, and error variants. Pass an AvatarStatusDot to the Avatar status slot; the dot sits on the bottom-right corner of the avatar." locale="en" />
