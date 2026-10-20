---
layout: component-docs
title: Metadata List Item
outline: false
footer: false
---

<script setup lang="ts">
import { metadataListItemBasic } from '../../../../components/demos/metadata-list-item'
</script>

## Usage

A single labeled metadata value within an `MetadataList`.

```ts
import { MetadataListItem } from '@astryx-vue/core/MetadataList'
```

One label and one value inside a [Metadata List](/en/components/metadata-list). The label goes in the `label` prop and the value in the default slot, so the value can be anything: plain text, a badge, a link, or your own markup. The list decides whether the pair sits side by side or stacked, and whether a label track has a fixed width; the item follows.

`label` is required, because it is the only thing that says what the value means.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="metadataListItemBasic" title="Basic" description="Labeled key-value rows inside a MetadataList. Values accept any content, from plain text to components like Badge." locale="en" />
