---
layout: component-docs
title: Badge
outline: false
footer: false
---

<script setup lang="ts">
import { badgeColors, badgeCounts } from '../../../../components/demos/badge'
</script>


## Usage

Import the component from its dedicated entry. The component loads its structural styles.

Import the theme in your application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

Component usage:

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <Badge variant="success">
    Completed
  </Badge>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Every status badge steals attention. Only badge states where the user needs to notice or act: errors, warnings, items requiring follow-up. If no action is needed, plain text is fine. |
| <Badge variant="success">Do</Badge> | Use success, warning, and error variants only for system status that demands attention: "Failed", "Degraded", "Action Required". These have bold solid backgrounds designed to stand out. |
| <Badge variant="success">Do</Badge> | Use color variants (blue, purple, teal, etc.) for category tags that group or classify items: team names, content types, priority levels. |
| <Badge variant="success">Do</Badge> | Keep labels to one or two words. If you need more detail, put it in surrounding text instead of the badge. |
| <Badge variant="success">Do</Badge> | Add an icon when it helps identify the badge type quickly, but always include a text label alongside it. |
| <Badge variant="error">Don't</Badge> | Apply a "success" badge to every healthy/active/normal item. If all rows show green "Active" badges, none stand out; the badge adds noise, not information. Show only the states that need user attention (errors, warnings, pending actions). |
| <Badge variant="error">Don't</Badge> | Use badges for metadata. Durations ("6h window"), counts ("12 trigger types"), dates, and descriptions are not statuses or categories; use description text (Text with type="supporting") instead. |
| <Badge variant="error">Don't</Badge> | Use semantic status variants (success, warning, error, info) for categories or informational content. These are visually loud and should only indicate system state. |
| <Badge variant="error">Don't</Badge> | Repeat the same badge in every row of a table or list. If the same value appears in most rows, it's not adding information; use plain text for common states and reserve badges for the exceptional ones. |
| <Badge variant="error">Don't</Badge> | Make badges clickable; they are read-only indicators. Use a button or link if the user needs to take action. |

## Examples

Common Badge configurations and use cases.

<DemoExample
  :demo="badgeColors"
  description="Use non-semantic colors to distinguish categories such as teams, topics, or priorities. Color establishes visual grouping rather than communicating system status."
  locale="en"
  title="Colors"
/>

<DemoExample
  :demo="badgeCounts"
  description="Show concise counts beside notifications, lists, or navigation items. Use compact forms such as 99+ for larger values."
  locale="en"
  title="Counts"
/>

