---
layout: component-docs
title: Avatar Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarGroupGroup, avatarGroupInteractive } from '../../../../components/demos/avatar-group'
</script>

## Usage

Import the components from their dedicated entry. Structural styles are loaded automatically.

```vue
<script setup lang="ts">
import { Avatar, AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
</script>

<template>
  <AvatarGroup size="md">
    <Avatar name="Ana Thomas" />
    <Avatar name="Ben Lee" />
    <Avatar name="Carol Davis" />
    <AvatarGroupOverflow :count="5" />
  </AvatarGroup>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Recommended</Badge> | Set `size` and `shape` on `AvatarGroup` so child avatars inherit them. |
| <Badge variant="success">Recommended</Badge> | Pass only the avatars you want to show, and use `AvatarGroupOverflow` for the rest. |
| <Badge variant="success">Recommended</Badge> | When there are many avatars, show the most recently active or important users first. |
| <Badge variant="error">Don't</Badge> | Set different `size` or `shape` on individual avatars inside a group. |
| <Badge variant="error">Don't</Badge> | Show too many avatars. Typically show 3–5 and summarize the rest with the overflow counter. |

## Examples

<DemoExample
  :demo="avatarGroupGroup"
  description="Overlap multiple avatars in a row to represent a group of people. Use for team lists, PR reviewers, or participant counts where you want to show faces without taking up much space."
  locale="en"
  title="Group"
/>

<DemoExample
  :demo="avatarGroupInteractive"
  description="A facepile whose avatars link to profiles, with an overflow indicator that opens the full member list. The whole group is one Tab stop; arrow keys move between the avatars and the overflow button."
  locale="en"
  title="Interactive"
/>
