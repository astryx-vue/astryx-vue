---
layout: component-docs
title: Timestamp
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { timestampAuto, timestampColors, timestampFormats, timestampRelative, timestampTimezone, timestampTooltip } from '../../../../components/demos/timestamp'
</script>

## Usage

`Timestamp` renders one instant in a `<time>` element. `value` is an ISO string or a unix timestamp in seconds. The default format is `auto`: a relative phrase while the instant is inside `autoThreshold` (seven days), then `date_time`.

`hasTooltip` is on by default and opens a hover card that can be copied. Pass `tooltipEntries` to list the same instant in several zones or formats. `isTimezoneShown` appends a short zone name to `date_time` and `time`. `isLive` refreshes a relative reading on a short interval.

Relative text keeps a long zone name in `aria-label`, so the accessible name does not depend on the tooltip.

```vue
<script setup lang="ts">
import { Timestamp } from '@astryx-vue/core/Timestamp'
</script>

<template>
  <Timestamp value="2026-03-25T12:00:00Z" color="primary" />
</template>
```

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `auto` in feeds and comments. Recent events stay relative, older ones become a full date. |
| <Badge variant="success">Do</Badge> | Use `system_date`, `system_date_time`, and `system_time` in logs, with `type="code"`. |
| <Badge variant="success">Do</Badge> | Pass `tooltipEntries` when a reader must compare the local zone with the zone where an event happened. |
| <Badge variant="error">Don't</Badge> | Turn the tooltip off for a relative format unless something else nearby states the absolute time. |
| <Badge variant="error">Don't</Badge> | Append a zone to a system format. Those strings stay machine-readable. |

## Examples

<DemoExample
  :demo="timestampAuto"
  description="Auto format that shows relative time for recent dates and switches to the full date for older ones. The default choice for most use cases."
  locale="en"
  title="Timestamp — Auto"
/>

<DemoExample
  :demo="timestampColors"
  description="Timestamp rendered in each available color variant: primary, secondary, disabled, and accent."
  locale="en"
  title="Timestamp — Colors"
/>

<DemoExample
  :demo="timestampFormats"
  description="All display formats side by side: date, date_time, time, and their system equivalents. Use date and date_time for user-facing UI, system variants for logs and dev tools."
  locale="en"
  title="Timestamp — Formats"
/>

<DemoExample
  :demo="timestampRelative"
  description="Relative time labels from seconds to months ago, with hover tooltips showing the full date. Use in feeds, comment threads, and activity logs."
  locale="en"
  title="Timestamp — Relative"
/>

<DemoExample
  :demo="timestampTimezone"
  description="Timestamps with the timezone abbreviation appended. Enable isTimezoneShown for audiences across time zones, like audit logs or team calendars."
  locale="en"
  title="Timestamp — Timezone"
/>

<DemoExample
  :demo="timestampTooltip"
  description="Hover tooltips that show one instant across several time zones or formats. Use tooltipEntries when readers must compare zones."
  locale="en"
  title="Timestamp — Tooltip time zones"
/>
