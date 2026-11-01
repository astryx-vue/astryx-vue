---
layout: lab-docs
title: LogStream
---

# LogStream

Displays chronological logs with severity colors, expandable details, and an optional live tail.

<script setup lang="ts">
import { labLogStream } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labLogStream" description="Rows with details expand, and the log scrolls internally when its height is constrained." locale="en" title="Log list" /></ClientOnly>

## Import

```ts
import { LogStream } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `entries` | `LogEntry[]` | Required | Entries ordered oldest first. |
| `variant` | `'default' \| 'terminal'` | `'default'` | Default or terminal appearance. |
| `isFollowing` | `boolean` | Uncontrolled | Follows new entries; supports `v-model:isFollowing`. |
| `maxHeight` | `number \| string` | `undefined` | Maximum scroll-area height. |
| `hasTimestamps` | `boolean` | `true` | Shows the timestamp column. |
| `label` | `string` | `'Log stream'` | Accessible region name. |

Each entry requires a unique `id`, `timestamp`, `level`, and `message`, with optional `source` and `detail`. Levels are `'info' | 'warn' | 'error' | 'debug'`.

## Events and slots

`followChange` fires when the user requests a follow-state change. Use `#detail="{ entry }"` for custom expanded content; only entries with `detail` can expand.
