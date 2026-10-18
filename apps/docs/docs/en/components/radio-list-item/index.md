---
layout: component-docs
title: Radio List Item
outline: false
footer: false
---

<script setup lang="ts">
import { radioListItemBasic } from '../../../../components/demos/radio-list-item'
</script>

## Usage

Individual radio item with label, description, and content slots.

```ts
import { RadioListItem } from '@astryx-vue/core/RadioList'
```

One row of a [Radio List](/en/components/radio-list). The row carries a `value` and nothing else: the parent list holds the single selected value, and one row is always selected once the list has one. Choosing a row replaces the previous choice instead of adding to it.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="radioListItemBasic" title="Basic" description="Radio items with labels and descriptions inside a controlled RadioList. Use for single-choice option groups like shipping methods." locale="en" />
