---
layout: lab-docs
title: MobileTokenizer
---

# MobileTokenizer

A multi-select input for narrow and touch screens. Its trigger opens a bottom sheet for searching, selecting, and creating entries.

<script setup lang="ts">
import { labMobileTokenizer } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labMobileTokenizer" description="Search and select in the bottom sheet, or create an entry when no result matches." locale="en" title="Bottom-sheet multi-select" /></ClientOnly>

## Import

```ts
import { MobileTokenizer } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `readonly T[]` | `[]` | Selected entries, bound with `v-model`. |
| `label` | `string` | Required | Field label and accessible sheet name. |
| `searchSource` | `SearchSource<T>` | Required | Sync or async search source with optional `bootstrap`. |
| `placeholder` | `string` | `undefined` | Trigger placeholder. |
| `description` | `string` | `undefined` | Supporting text below the label. |
| `isOptional` / `isDisabled` | `boolean` | `false` | Optional marker or disabled state. |
| `hasCreate` | `boolean` | `false` | Allows creating entries. |
| `maxEntries` | `number` | `undefined` | Maximum selection count. |
| `maxMenuItems` | `number` | `undefined` | Maximum retained search results. |
| `minQueryLength` | `number` | `undefined` | Minimum query length. |
| `debounceMs` | `number` | `undefined` | Search debounce in milliseconds. |
| `emptySearchResultsText` | `string` | Built-in text | No-results text. |

Entries have `{ id, label, disabled?, description? }`. `search` receives the query and an optional `AbortSignal`, making it suitable for remote sources.

## Events

In addition to `update:modelValue`, the component emits `change`, `update:query`, `changeQuery`, and `openChange`. Changes distinguish `add`, `create`, and `remove`.
