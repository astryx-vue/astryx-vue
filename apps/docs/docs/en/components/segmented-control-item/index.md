---
layout: component-docs
title: Segmented Control Item
outline: false
footer: false
---

<script setup lang="ts">
import { segmentedControlItemBasic } from '../../../../components/demos/segmented-control-item'
</script>

## Usage

Individual segment item rendering as a radio button within the segmented control.

```ts
import { SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
```

One segment of a [Segmented Control](/en/components/segmented-control). The item declares its own `value`; the parent control holds the selected value, so the item keeps no state of its own and one segment is always selected. `label` is the visible text and also the accessible name. Put artwork in the `icon` slot to draw it before the label, and set `isLabelHidden` to keep only the icon.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="segmentedControlItemBasic" title="Basic" description="Label-only options inside a SegmentedControl. Each item declares a value; the parent control holds the selected value and change handler." locale="en" />
