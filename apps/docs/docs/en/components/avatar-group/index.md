---
layout: component-docs
title: Avatar Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarGroupBasic, avatarGroupSizes } from '../../../../components/demos/avatar-group'
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
  :demo="avatarGroupBasic"
  description="Avatars overlap each other, with a +N overflow indicator at the end."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="avatarGroupSizes"
  description="AvatarGroup supports sm, md, lg sizes; all child avatars scale together."
  locale="en"
  title="Sizes"
/>
