---
layout: lab-docs
title: Stat
---

# Stat

Displays a key metric with an optional trend and supporting description.

<script setup lang="ts">
import { labStat } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labStat" description="A metric with a label, value, upward trend, and comparison period." locale="en" title="Basic usage" /></ClientOnly>

## Import

```ts
import { Stat } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | Required | Metric name. |
| `value` | `string` | `undefined` | Preformatted primary value; the default slot takes precedence. |
| `delta` | `StatDelta` | `undefined` | Trend with `value`, `direction`, and optional `sentiment`. |
| `description` | `string` | `undefined` | Supporting text below the value. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Primary value size. |

`direction` accepts `'up' | 'down' | 'flat'`. Override the default color mapping with `sentiment: 'positive' | 'negative' | 'neutral'` when a downward trend is desirable.

## Slots

| Name | Description |
| --- | --- |
| Default | Custom primary value content. |
| `media` | A chart or other media below the metric. |
