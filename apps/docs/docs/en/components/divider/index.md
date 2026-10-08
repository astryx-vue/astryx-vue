---
layout: component-docs
title: Divider
outline: false
footer: false
---

<script setup lang="ts">
import { dividerBasic, dividerLabel, dividerVariants, dividerVertical } from '../../../../components/demos/divider'
</script>

## Usage

`Divider` separates groups of content with a thin rule. It can carry a centered label.

```vue
<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
</script>

<template>
  <Divider label="or" />
</template>
```

## Examples

<DemoExample :demo="dividerBasic" title="Basic" description="A horizontal rule spans the available width." locale="en" />

<DemoExample :demo="dividerLabel" title="Label" description="A label sits in the middle of the rule. The label uses supporting text styling." locale="en" />

<DemoExample :demo="dividerVariants" title="Variants" description="subtle is the default weight. strong uses the emphasized border color." locale="en" />

<DemoExample :demo="dividerVertical" title="Vertical" description="Set orientation to vertical inside a row with a fixed height." locale="en" />

## Accessibility

- The root element has `role="separator"` and `aria-orientation`.
- With a `label`, the label becomes the accessible name through `aria-labelledby`.
- Set `aria-label` to name the separator with other text.
