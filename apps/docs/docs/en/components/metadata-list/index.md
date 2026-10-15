---
layout: component-docs
title: Metadata List
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { metadataListBasic, metadataListCollapsible, metadataListHorizontal, metadataListMultiColumn } from '../../../../components/demos/metadata-list'
</script>

## Usage

`MetadataList` lays out label and value pairs. `MetadataListItem` is one pair. A single column places the label beside the value. Several columns, or a numeric column count, stack the label above the value and repeat the track. `columns="multi"` uses `repeat(auto-fill, minmax(280px, 1fr))`.

`orientation="horizontal"` wraps the pairs in one row and ignores `columns`, `label`, and `maxNumOfItems`. `maxNumOfItems` hides the rest behind a show more control. `label.width` only applies when the label sits beside the value.

```vue
<script setup lang="ts">
import { MetadataList, MetadataListItem } from '@astryx-vue/core/MetadataList'
</script>

<template>
  <MetadataList>
    <MetadataListItem label="Name">
      MetadataList
    </MetadataListItem>
    <MetadataListItem label="Status">
      Active
    </MetadataListItem>
  </MetadataList>
</template>
```


<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep labels short. The value is the thing a person came to read. |
| <Badge variant="success">Do</Badge> | Use one column for a narrow details pane, and `multi` when the pane is wide enough for several pairs. |
| <Badge variant="success">Do</Badge> | Set `maxNumOfItems` when a record has more fields than the page should show at once. |
| <Badge variant="error">Don't</Badge> | Put a long sentence in a label. The label track is sized for a short name. |
| <Badge variant="error">Don't</Badge> | Combine `orientation="horizontal"` with a column count and expect the count to apply. Horizontal layout ignores it. |

## Examples

<DemoExample
  :demo="metadataListBasic"
  description="Single-column key-value metadata list."
  locale="en"
  title="MetadataList — Basic"
/>

<DemoExample
  :demo="metadataListCollapsible"
  description="Metadata list with a show-more toggle after a set number of items."
  locale="en"
  title="MetadataList — Collapsible"
/>

<DemoExample
  :demo="metadataListHorizontal"
  description="Horizontal metadata items for compact inline display."
  locale="en"
  title="MetadataList — Horizontal"
/>

<DemoExample
  :demo="metadataListMultiColumn"
  description="Multi-column metadata grid with token tags."
  locale="en"
  title="MetadataList — Multi-Column"
/>
