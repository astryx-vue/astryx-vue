---
layout: component-docs
title: Avatar Status Dot
outline: false
footer: false
---

<script setup lang="ts">
import { avatarStatusDotIcon, avatarStatusDotVariants } from '../../../../components/demos/avatar-status-dot'
</script>

## Usage

Status indicator dot for `Avatar`. Put one in the avatar's `status` slot and it sits on the bottom-right corner, showing whether someone is online, away, or busy. `variant` picks the status.

Each variant pairs a colour with its own shape, so the state never rests on colour alone: `success` is a filled dot, `neutral` is a hollow ring, and `error` is a dot with a minus bar across it. The dot also reads the avatar's size, so a 128px avatar gets a 32px dot and a 32px avatar gets a small one.

Colour on its own does not reach everyone, so always pass `label` with the status words. Inside an avatar the label is composed into the avatar's own name, so a screen reader announces "Jane Doe, Online" instead of stopping at the name; on a standalone dot it becomes the dot's own image name. Without `label` the dot is hidden from assistive technology, which is the right choice only when the same status is already written out next to the avatar.

```ts
import { AvatarStatusDot } from '@astryx-vue/core/Avatar'
```

## Examples

Common configurations, variations, and states.

<DemoExample :demo="avatarStatusDotVariants" title="Variants" description="Presence dots on Avatars using the success, neutral, and error variants. Pass an AvatarStatusDot to the Avatar status slot; the dot sits on the bottom-right corner of the avatar and sizes itself to match it." locale="en" />

<DemoExample :demo="avatarStatusDotIcon" title="Icons" description="Put an icon in the icon slot to replace the built-in shape when the status has a sharper symbol than filled, hollow, or barred. Icons are dropped on the smallest avatar sizes, where the built-in shapes take over." locale="en" />
