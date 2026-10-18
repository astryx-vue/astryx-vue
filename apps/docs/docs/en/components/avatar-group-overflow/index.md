---
layout: component-docs
title: Avatar Group Overflow
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { avatarGroupOverflowCustomText, avatarGroupOverflowDefaultCount } from '../../../../components/demos/avatar-group-overflow'
</script>

## Usage

AvatarGroupOverflow appears at the end of an AvatarGroup to summarize people who are not shown individually. Use it when a group is sliced to a small number of visible avatars but the hidden count still matters.

`count` is the number of hidden people, and it also builds the accessible name, so it should match what the indicator shows. The default slot replaces the `+N` text. A `@click` handler turns the indicator into a real button that can take focus; without one it stays a static figure.

```vue
<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
</script>

<template>
  <AvatarGroup size="lg">
    <Avatar name="Alex Daniels" />
    <Avatar name="Ann Smith" />
    <AvatarGroupOverflow :count="12" />
  </AvatarGroup>
</template>
```

<ComponentAnatomy />

## Best practices

| Guidance | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass the real hidden count to `count` so the accessible label matches the visible indicator. |
| <Badge variant="success">Do</Badge> | Use short custom text such as `+12` or `99+`. Keep the indicator short so the number always fits. |
| <Badge variant="success">Do</Badge> | Provide `onClick` when the overflow opens a member list, popover, or detail view. |
| <Badge variant="error">Don't</Badge> | Do not pass custom text that disagrees with `count`; `count` continues to provide the accessible label. |
| <Badge variant="error">Don't</Badge> | Do not use long labels inside the indicator; place longer participant details next to the group instead. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="avatarGroupOverflowCustomText" title="Custom Text" description="Provide short custom children such as 12+ when the overflow count needs compact product-specific formatting." locale="en" />

<DemoExample :demo="avatarGroupOverflowDefaultCount" title="Default Count" description="Use AvatarGroupOverflow without children to render the standard +N overflow count." locale="en" />
